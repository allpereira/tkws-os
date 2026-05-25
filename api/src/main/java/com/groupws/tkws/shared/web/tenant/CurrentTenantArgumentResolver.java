package com.groupws.tkws.shared.web.tenant;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.MethodParameter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.util.Map;
import java.util.Objects;
import java.util.Optional;

/**
 * Resolve o parâmetro anotado com {@link CurrentTenant} em controllers.
 *
 * Estratégia de resolução (em ordem):
 *
 * 1. **Header X-Tenant-Id override**: se a request traz esse header E o
 *    usuário tem role SYSTEM_ADMIN, usa o header. Permite system admin
 *    atuar em qualquer tenant sem precisar trocar de organização.
 *    O header é um BIGINT (id local do tenant).
 *
 * 2. **JWT claim**: lê `urn:zitadel:iam:user:resourceowner:id` direto do JWT
 *    (situação ideal · requer "User Info inside Access Token" habilitado no
 *    app Zitadel · ver docs/04-AUTH.md).
 *
 * 3. **UserInfo fallback** (GET /oidc/v1/userinfo): se o JWT não trouxer o claim,
 *    consulta o UserInfo endpoint do Zitadel com o próprio access token
 *    do usuário. Resultado é cacheado por subject. Permite que a API
 *    funcione mesmo sem habilitar a opção no Zitadel.
 *
 * 4. **Erro**: se nada resolver, lança {@link MissingTenantContextException}
 *    (HTTP 422).
 *
 * 5. **Acesso negado**: se o header foi passado mas o usuário NÃO é
 *    SYSTEM_ADMIN, lança {@link TenantAccessDeniedException} (HTTP 403).
 *
 * **Nunca aceita `tenantId` em query/body** · evita escalonamento via
 * parâmetro adulterado.
 */
@Component
public class CurrentTenantArgumentResolver implements HandlerMethodArgumentResolver {

    private static final Logger log = LoggerFactory.getLogger(CurrentTenantArgumentResolver.class);

    /**
     * Claim padrão do Zitadel que identifica o resource owner (organização) do JWT.
     * Ver Zitadel docs · `urn:zitadel:iam:user:resourceowner:id`.
     */
    public static final String ZITADEL_ORG_CLAIM = "urn:zitadel:iam:user:resourceowner:id";

    /** Header opcional que SYSTEM_ADMIN pode usar para atuar em outro tenant. */
    public static final String HEADER_TENANT_ID = "X-Tenant-Id";

    private final TenantIdResolver tenantIdResolver;
    private final ZitadelOrgIdFromUserInfoClient userInfoFallback;

    public CurrentTenantArgumentResolver(TenantIdResolver tenantIdResolver,
                                         ZitadelOrgIdFromUserInfoClient userInfoFallback) {
        this.tenantIdResolver = tenantIdResolver;
        this.userInfoFallback = userInfoFallback;
    }

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(CurrentTenant.class)
            && parameter.getParameterType().equals(TenantContext.class);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter,
                                  ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest,
                                  WebDataBinderFactory binderFactory) {
        HttpServletRequest request = Objects.requireNonNull(
            webRequest.getNativeRequest(HttpServletRequest.class), "HttpServletRequest");

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = extractJwt(auth);

        String headerTenantId = request.getHeader(HEADER_TENANT_ID);

        // Caso 1 · header presente
        if (headerTenantId != null && !headerTenantId.isBlank()) {
            if (!isSystemAdmin(auth)) {
                throw new TenantAccessDeniedException(
                    "Header " + HEADER_TENANT_ID + " só pode ser usado por SYSTEM_ADMIN");
            }
            long parsed = parseLongOrThrow(headerTenantId);
            String jwtOrgId = jwt != null ? jwt.getClaimAsString(ZITADEL_ORG_CLAIM) : null;
            return new TenantContext(parsed, "system-admin-override:" + jwtOrgId);
        }

        // Caso 2 · claim direto no JWT (config ideal · "User Info inside Access Token" ON)
        String orgId = jwt != null ? jwt.getClaimAsString(ZITADEL_ORG_CLAIM) : null;

        // Caso 3 · fallback via /oidc/v1/userinfo (quando claim não vem no JWT)
        if (orgId == null && jwt != null) {
            orgId = userInfoFallback
                .resolve(jwt.getSubject(), jwt.getTokenValue())
                .orElse(null);
        }

        if (orgId == null) {
            if (jwt != null) {
                Map<String, Object> claims = jwt.getClaims();
                log.warn("Tenant não resolvido · sub={} · claims do JWT recebidos: {}",
                    jwt.getSubject(), claims.keySet());
                log.warn("Procurando claim '{}' · não encontrado. " +
                    "Conferir se 'User Info inside Access Token' está habilitado no app Zitadel " +
                    "E se o usuário fez logout/login após a mudança.", ZITADEL_ORG_CLAIM);
            }
            throw new MissingTenantContextException(
                "JWT não traz claim '" + ZITADEL_ORG_CLAIM + "' e /userinfo também não devolveu. "
              + "Habilite 'User Info inside Access Token' no app Zitadel (ver docs/04-AUTH.md) "
              + "OU passe header " + HEADER_TENANT_ID + " com role SYSTEM_ADMIN.");
        }

        final String resolvedOrgId = orgId;
        long tenantId = tenantIdResolver.resolveByZitadelOrgId(resolvedOrgId)
            .orElseThrow(() -> new MissingTenantContextException(
                "Tenant local não encontrado para zitadel_org_id=" + resolvedOrgId));

        return new TenantContext(tenantId, resolvedOrgId);
    }

    // ============ Helpers ============

    private static Jwt extractJwt(Authentication auth) {
        if (auth == null) return null;
        Object principal = auth.getPrincipal();
        return principal instanceof Jwt jwt ? jwt : null;
    }

    private static boolean isSystemAdmin(Authentication auth) {
        if (auth == null) return false;
        return auth.getAuthorities().stream()
            .anyMatch(a -> "ROLE_SYSTEM_ADMIN".equals(a.getAuthority()));
    }

    private static long parseLongOrThrow(String raw) {
        try {
            long v = Long.parseLong(raw.trim());
            if (v <= 0) {
                throw new TenantAccessDeniedException(
                    "Header " + HEADER_TENANT_ID + " deve ser positivo: " + raw);
            }
            return v;
        } catch (NumberFormatException e) {
            throw new TenantAccessDeniedException(
                "Header " + HEADER_TENANT_ID + " com valor inválido (esperado BIGINT): " + raw);
        }
    }

    /** Optional-friendly wrapper (uso futuro em testes). */
    @SuppressWarnings("unused")
    static Optional<String> orgIdClaim(Jwt jwt) {
        return Optional.ofNullable(jwt.getClaimAsString(ZITADEL_ORG_CLAIM));
    }
}

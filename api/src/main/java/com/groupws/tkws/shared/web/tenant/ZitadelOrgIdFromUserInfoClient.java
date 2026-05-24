package com.groupws.tkws.shared.web.tenant;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Fallback · busca o claim `urn:zitadel:iam:user:resourceowner:id` via
 * endpoint `/oidc/v1/userinfo` do Zitadel quando ele NÃO veio no JWT.
 *
 * Quando o claim aparece no JWT (situação ideal, com "User Info inside
 * Access Token" habilitado no app Zitadel · ver docs/04-AUTH.md), este
 * cliente não é chamado — o resolver lê direto do JWT.
 *
 * Quando o claim NÃO vem no JWT (config padrão do Zitadel), este cliente
 * é o backup: consulta `/userinfo` com o próprio access token do usuário
 * e devolve o `org_id`. Resultado é cacheado por subject (UUID do user no
 * Zitadel) durante o ciclo de vida do processo, evitando uma round-trip
 * por request.
 *
 * Esse padrão de fallback espelha o que já existe em
 * {@code features.users.web.ZitadelUserInfoClient} para o claim `email`.
 */
@Component
public class ZitadelOrgIdFromUserInfoClient {

    private static final Logger log = LoggerFactory.getLogger(ZitadelOrgIdFromUserInfoClient.class);
    private static final String ORG_CLAIM = CurrentTenantArgumentResolver.ZITADEL_ORG_CLAIM;

    private final RestClient restClient;
    private final ConcurrentHashMap<String, String> cacheBySubject = new ConcurrentHashMap<>();

    public ZitadelOrgIdFromUserInfoClient(
            RestClient.Builder builder,
            @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}") String issuerUri) {
        this.restClient = builder.baseUrl(issuerUri).build();
    }

    /**
     * Busca o `org_id` via `/oidc/v1/userinfo`. Retorna {@link Optional#empty()}
     * se o claim não estiver presente OU a chamada falhar.
     *
     * @param subject `sub` do JWT (usado como chave de cache)
     * @param accessToken o próprio JWT do usuário, repassado como Bearer
     */
    @SuppressWarnings("unchecked")
    public Optional<String> resolve(String subject, String accessToken) {
        Objects.requireNonNull(subject, "subject");
        Objects.requireNonNull(accessToken, "accessToken");

        String cached = cacheBySubject.get(subject);
        if (cached != null) return Optional.of(cached);

        try {
            Map<String, Object> claims = restClient.get()
                .uri("/oidc/v1/userinfo")
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .body(Map.class);

            if (claims == null) return Optional.empty();

            Object value = claims.get(ORG_CLAIM);
            if (value instanceof String s && !s.isBlank()) {
                cacheBySubject.put(subject, s);
                return Optional.of(s);
            }
            return Optional.empty();
        } catch (Exception ex) {
            log.warn("Falha ao buscar org_id via UserInfo para sub={}: {}", subject, ex.getMessage());
            return Optional.empty();
        }
    }
}

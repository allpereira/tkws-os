package com.groupws.tkws.shared;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Substitui o JwtDecoder real (que iria bater no Zitadel) por um mock controlável.
 * Habilitar via @Import(MockJwtConfig.class) nos testes de integração de Controller.
 */
@TestConfiguration
public class MockJwtConfig {

    public static final String TEST_SUBJECT = "zitadel-test-user";
    public static final String TEST_EMAIL = "test@tkws.local";

    @Bean
    @Primary
    JwtDecoder mockJwtDecoder() {
        return new MockJwtDecoder();
    }

    public static String tokenForSystemAdmin() {
        return buildToken(List.of("system_admin"));
    }

    public static String tokenForOrgAdmin() {
        return buildToken(List.of("org_admin"));
    }

    public static String tokenForComercialAtendimento() {
        return buildToken(List.of("comercial_atendimento"));
    }

    public static String tokenForComercialProposta() {
        return buildToken(List.of("comercial_proposta"));
    }

    /** Role base · usuário convidado sem permissões específicas além de ver os próprios dados. */
    public static String tokenForDefault() {
        return buildToken(List.of("default"));
    }

    public static String tokenWithNoRoles() {
        return buildToken(List.of());
    }

    /**
     * Token org-scoped · embute o `zitadel_org_id` (resource owner) no claim
     * `urn:zitadel:iam:user:resourceowner:id`, que o
     * {@code CurrentTenantArgumentResolver} usa para resolver o tenant local.
     *
     * Use em ITs de controllers org-scoped (Pessoas, Contatos, …): insira um
     * tenant com esse `zitadel_org_id` e passe este token para que
     * {@code @CurrentTenant} resolva o tenant correto.
     */
    public static String tokenForOrg(String zitadelOrgId, String... roles) {
        return buildToken(List.of(roles)) + ORG_SEP + zitadelOrgId;
    }

    // Delimitador só com chars válidos de token68 (RFC 6750): o filtro de bearer
    // token do Spring rejeita o header se o token tiver caracteres fora do set
    // (`#`, `:` etc) — daí usar `~`, que é permitido. Roles/orgId dos testes não
    // contêm `~`.
    private static final String ORG_SEP = "~org~";

    private static String buildToken(List<String> roles) {
        // Formato simbólico que o MockJwtDecoder reconhece.
        // Em testes reais não precisamos assinar de verdade.
        return "mock-jwt-" + String.join(",", roles);
    }

    public static class MockJwtDecoder implements JwtDecoder {
        @Override
        public Jwt decode(String token) throws JwtException {
            if (!token.startsWith("mock-jwt-")) {
                throw new JwtException("Token mock inválido");
            }

            // Sufixo opcional `#org:<id>` · embute o resource owner (org) do JWT.
            String orgId = null;
            String body = token.substring("mock-jwt-".length());
            int sep = body.indexOf(ORG_SEP);
            if (sep >= 0) {
                orgId = body.substring(sep + ORG_SEP.length());
                body = body.substring(0, sep);
            }

            String rolesPart = body;
            List<String> roles = rolesPart.isBlank()
                ? List.of()
                : List.of(rolesPart.split(","));

            Map<String, Object> headers = Map.of("alg", "none", "typ", "JWT");
            Map<String, Object> claims = new HashMap<>();
            claims.put("sub", TEST_SUBJECT);
            claims.put("email", TEST_EMAIL);
            claims.put("name", "Test User");
            claims.put("picture", "https://example.com/avatar.png");

            // Claim de roles no formato Zitadel
            Map<String, Object> rolesClaim = new HashMap<>();
            roles.forEach(r -> rolesClaim.put(r, Map.of("org-id", "TKWS")));
            claims.put("urn:zitadel:iam:org:project:roles", rolesClaim);

            // Claim de resource owner (org) · só quando o token foi criado com org.
            if (orgId != null && !orgId.isBlank()) {
                claims.put("urn:zitadel:iam:user:resourceowner:id", orgId);
            }

            return new Jwt(
                token,
                Instant.now(),
                Instant.now().plusSeconds(3600),
                headers,
                claims
            );
        }
    }
}

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

    public static String tokenForArchitect() {
        return buildToken(List.of("architect"));
    }

    public static String tokenWithNoRoles() {
        return buildToken(List.of());
    }

    private static String buildToken(List<String> roles) {
        // Formato simbólico que o MockJwtDecoder reconhece.
        // Em testes reais não precisamos assinar de verdade.
        return "mock-jwt:" + String.join(",", roles);
    }

    public static class MockJwtDecoder implements JwtDecoder {
        @Override
        public Jwt decode(String token) throws JwtException {
            if (!token.startsWith("mock-jwt:")) {
                throw new JwtException("Token mock inválido");
            }
            String rolesPart = token.substring("mock-jwt:".length());
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

package com.groupws.tkws.features.users.web;

import com.groupws.tkws.features.users.application.dto.ZitadelUserData;
import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jwt.Jwt;

import java.time.Instant;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class ZitadelJwtClaimsMapperTest {

    @Test
    void shouldUseEmailClaimWhenPresent() {
        Jwt jwt = jwt(Map.of(
            "sub", "zitadel-1",
            "email", "Admin@tkws.local",
            "name", "Admin TKWS"
        ));

        ZitadelUserData data = ZitadelJwtClaimsMapper.toUserData(jwt);

        assertThat(data.email()).isEqualTo("admin@tkws.local");
        assertThat(data.fullName()).isEqualTo("Admin TKWS");
    }

    @Test
    void shouldFallbackToPreferredUsernameWhenEmailClaimMissing() {
        Jwt jwt = jwt(Map.of(
            "sub", "zitadel-2",
            "preferred_username", "admin@tkws.local"
        ));

        ZitadelUserData data = ZitadelJwtClaimsMapper.toUserData(jwt);

        assertThat(data.email()).isEqualTo("admin@tkws.local");
    }

    @Test
    void shouldReturnNullEmailWhenNoEmailLikeClaimExists() {
        // Quando nenhum claim do JWT tem formato de email, o mapper retorna null
        // sem lançar exceção — o controller deve enriquecer via /oidc/v1/userinfo.
        Jwt jwt = jwt(Map.of("sub", "zitadel-3"));

        ZitadelUserData data = ZitadelJwtClaimsMapper.toUserData(jwt);

        assertThat(data.email()).isNull();
        assertThat(data.zitadelId()).isEqualTo("zitadel-3");
    }

    private static Jwt jwt(Map<String, Object> claims) {
        return Jwt.withTokenValue("token")
            .header("alg", "none")
            .claims(c -> c.putAll(claims))
            .issuedAt(Instant.now())
            .expiresAt(Instant.now().plusSeconds(3600))
            .build();
    }
}

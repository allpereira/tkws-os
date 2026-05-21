package com.groupws.tkws.features.users.web;

import com.groupws.tkws.features.users.application.dto.ZitadelUserData;
import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jwt.Jwt;

import java.time.Instant;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

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
    void shouldFailWhenNoEmailLikeClaimExists() {
        Jwt jwt = jwt(Map.of("sub", "zitadel-3"));

        assertThatThrownBy(() -> ZitadelJwtClaimsMapper.toUserData(jwt))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("JWT sem email");
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

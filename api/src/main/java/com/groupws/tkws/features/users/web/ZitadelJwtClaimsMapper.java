package com.groupws.tkws.features.users.web;

import com.groupws.tkws.features.users.application.dto.ZitadelUserData;
import org.springframework.security.oauth2.jwt.Jwt;

/**
 * Maps Zitadel JWT claims to {@link ZitadelUserData}.
 * Access tokens often omit {@code email}; {@code preferred_username} is used as fallback (login name).
 */
final class ZitadelJwtClaimsMapper {

    private ZitadelJwtClaimsMapper() {
    }

    static ZitadelUserData toUserData(Jwt jwt) {
        return new ZitadelUserData(
            jwt.getSubject(),
            resolveEmail(jwt),
            resolveFullName(jwt),
            blankToNull(jwt.getClaimAsString("picture"))
        );
    }

    private static String resolveEmail(Jwt jwt) {
        for (String candidate : new String[] {
            jwt.getClaimAsString("email"),
            jwt.getClaimAsString("preferred_username"),
            jwt.getClaimAsString("username"),
        }) {
            if (looksLikeEmail(candidate)) {
                return candidate.trim().toLowerCase();
            }
        }
        throw new IllegalArgumentException(
            "JWT sem email. Confirme o scope 'email' no app Zitadel e faça login novamente."
        );
    }

    private static String resolveFullName(Jwt jwt) {
        String name = blankToNull(jwt.getClaimAsString("name"));
        if (name != null) {
            return name;
        }

        String givenName = blankToNull(jwt.getClaimAsString("given_name"));
        String familyName = blankToNull(jwt.getClaimAsString("family_name"));
        if (givenName != null && familyName != null) {
            return givenName + " " + familyName;
        }
        if (givenName != null) {
            return givenName;
        }
        if (familyName != null) {
            return familyName;
        }

        return null;
    }

    private static boolean looksLikeEmail(String value) {
        return value != null && !value.isBlank() && value.contains("@");
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}

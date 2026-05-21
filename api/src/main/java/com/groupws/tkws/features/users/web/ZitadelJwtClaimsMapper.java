package com.groupws.tkws.features.users.web;

import com.groupws.tkws.features.users.application.dto.ZitadelUserData;
import org.springframework.security.oauth2.jwt.Jwt;

/**
 * Maps Zitadel JWT claims to {@link ZitadelUserData}.
 *
 * <p>Zitadel access tokens frequentemente omitem o claim {@code email};
 * {@code preferred_username} é usado como fallback (login name com domínio).
 * Quando nenhum claim do JWT resolve o email, {@link #toUserData} retorna um
 * registro com email {@code null} — o chamador deve enriquecer via UserInfo endpoint.
 */
final class ZitadelJwtClaimsMapper {

    private ZitadelJwtClaimsMapper() {
    }

    /**
     * Converte claims do JWT em {@link ZitadelUserData}.
     * O campo {@code email} pode ser {@code null} quando nenhum claim tem formato de e-mail;
     * nesse caso o controller deve chamar o UserInfo endpoint como fallback.
     */
    static ZitadelUserData toUserData(Jwt jwt) {
        return new ZitadelUserData(
            jwt.getSubject(),
            resolveEmailOrNull(jwt),
            resolveFullName(jwt),
            blankToNull(jwt.getClaimAsString("picture"))
        );
    }

    /**
     * Tenta extrair email dos claims do JWT. Retorna {@code null} se nenhum claim
     * disponível tiver formato de email — não lança exceção.
     */
    static String resolveEmailOrNull(Jwt jwt) {
        for (String candidate : new String[] {
            jwt.getClaimAsString("email"),
            jwt.getClaimAsString("preferred_username"),
            jwt.getClaimAsString("username"),
        }) {
            if (looksLikeEmail(candidate)) {
                return candidate.trim().toLowerCase();
            }
        }
        return null;
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

    static boolean looksLikeEmail(String value) {
        return value != null && !value.isBlank() && value.contains("@");
    }

    static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}

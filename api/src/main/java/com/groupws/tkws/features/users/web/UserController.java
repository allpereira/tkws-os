package com.groupws.tkws.features.users.web;

import com.groupws.tkws.features.users.application.dto.UserView;
import com.groupws.tkws.features.users.application.dto.ZitadelUserData;
import com.groupws.tkws.features.users.application.usecase.SyncUserFromZitadelUseCase;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
class UserController {

    private final SyncUserFromZitadelUseCase syncUseCase;
    private final ZitadelUserInfoClient userInfoClient;

    UserController(SyncUserFromZitadelUseCase syncUseCase, ZitadelUserInfoClient userInfoClient) {
        this.syncUseCase = syncUseCase;
        this.userInfoClient = userInfoClient;
    }

    @GetMapping("/me")
    public ResponseEntity<UserView> me(
            @AuthenticationPrincipal Jwt jwt,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {

        ZitadelUserData data = ZitadelJwtClaimsMapper.toUserData(jwt);

        // Fallback: se o JWT não carregou o email, busca no UserInfo endpoint do Zitadel.
        // Isso ocorre quando o Zitadel não inclui 'email' no access token (ex.: usuário
        // sem email configurado, ou access token sem scopes de perfil completos).
        if (data.email() == null) {
            String accessToken = authorizationHeader.replaceFirst("(?i)^Bearer\\s+", "");
            Map<String, Object> userInfo = userInfoClient.fetchUserInfo(accessToken);
            data = enrichWithUserInfo(data, userInfo);
        }

        if (data.email() == null) {
            throw new IllegalArgumentException(
                "Não foi possível determinar o email do usuário. " +
                "Certifique-se de que o usuário tem um email cadastrado no Zitadel " +
                "e que o app Web foi configurado com scope 'email'."
            );
        }

        return ResponseEntity.ok(syncUseCase.execute(data));
    }

    private static ZitadelUserData enrichWithUserInfo(ZitadelUserData base, Map<String, Object> userInfo) {
        String email = base.email();
        String fullName = base.fullName();
        String avatarUrl = base.avatarUrl();

        if (email == null) {
            Object emailClaim = userInfo.get("email");
            if (emailClaim instanceof String s && ZitadelJwtClaimsMapper.looksLikeEmail(s)) {
                email = s.trim().toLowerCase();
            }
        }

        if (fullName == null) {
            Object nameClaim = userInfo.get("name");
            if (nameClaim instanceof String s && !s.isBlank()) {
                fullName = s.trim();
            }
        }

        if (avatarUrl == null) {
            Object pictureClaim = userInfo.get("picture");
            if (pictureClaim instanceof String s && !s.isBlank()) {
                avatarUrl = s.trim();
            }
        }

        return new ZitadelUserData(base.zitadelId(), email, fullName, avatarUrl);
    }
}

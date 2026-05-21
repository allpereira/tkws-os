package com.groupws.tkws.features.users.web;

import com.groupws.tkws.features.users.application.dto.UserView;
import com.groupws.tkws.features.users.application.dto.ZitadelUserData;
import com.groupws.tkws.features.users.application.usecase.SyncUserFromZitadelUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
class UserController {

    private final SyncUserFromZitadelUseCase syncUseCase;

    UserController(SyncUserFromZitadelUseCase syncUseCase) {
        this.syncUseCase = syncUseCase;
    }

    @GetMapping("/me")
    public ResponseEntity<UserView> me(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(syncUseCase.execute(ZitadelJwtClaimsMapper.toUserData(jwt)));
    }
}

package com.groupws.tkws.features.users.application.dto;

import com.groupws.tkws.features.users.domain.model.User;

import java.time.Instant;
import java.util.UUID;

public record UserView(
    UUID id,
    String email,
    String fullName,
    String avatarUrl,
    UUID tenantId,
    boolean active,
    Instant lastLoginAt
) {
    public static UserView from(User user) {
        return new UserView(
            user.id().value(),
            user.email().value(),
            user.fullName(),
            user.avatarUrl(),
            user.tenantId().orElse(null),
            user.active(),
            user.lastLoginAt().orElse(null)
        );
    }
}

package com.groupws.tkws.features.users.application.dto;

import com.groupws.tkws.features.users.domain.model.User;

import java.time.Instant;
import java.util.UUID;

public record UserView(
    UUID id,
    String email,
    String fullName,
    String avatarUrl,
    Long tenantId,
    boolean active,
    Instant lastLoginAt
) {
    public static UserView from(User user) {
        return new UserView(
            user.id().value(),
            user.email().value(),
            user.fullName(),
            user.avatarUrl(),
            user.tenantIdOrNull(),
            user.active(),
            user.lastLoginAt().orElse(null)
        );
    }
}

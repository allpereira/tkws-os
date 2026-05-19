package com.groupws.tkws.features.users.infrastructure.persistence;

import com.groupws.tkws.features.users.domain.model.User;
import com.groupws.tkws.features.users.domain.model.UserId;
import com.groupws.tkws.features.users.domain.port.UserRepository;
import com.groupws.tkws.shared.domain.Email;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
class UserJpaRepositoryAdapter implements UserRepository {

    private final UserJpaRepository jpa;

    UserJpaRepositoryAdapter(UserJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public User save(User user) {
        return toDomain(jpa.save(toEntity(user)));
    }

    @Override
    public Optional<User> findById(UserId id) {
        return jpa.findById(id.value()).map(this::toDomain);
    }

    @Override
    public Optional<User> findByZitadelId(String zitadelId) {
        return jpa.findByZitadelId(zitadelId).map(this::toDomain);
    }

    @Override
    public Optional<User> findByEmail(Email email) {
        return jpa.findByEmail(email.value()).map(this::toDomain);
    }

    private UserJpaEntity toEntity(User u) {
        return new UserJpaEntity(
            u.id().value(),
            u.zitadelId(),
            u.email().value(),
            u.fullName(),
            u.avatarUrl(),
            u.tenantId().orElse(null),
            u.active(),
            u.createdAt(),
            u.updatedAt(),
            u.lastLoginAt().orElse(null)
        );
    }

    private User toDomain(UserJpaEntity e) {
        return User.reconstitute(
            UserId.of(e.id),
            e.zitadelId,
            new Email(e.email),
            e.fullName,
            e.avatarUrl,
            e.tenantId,
            e.active,
            e.createdAt,
            e.updatedAt,
            e.lastLoginAt
        );
    }
}

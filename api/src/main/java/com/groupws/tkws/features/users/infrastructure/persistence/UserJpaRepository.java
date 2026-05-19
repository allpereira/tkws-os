package com.groupws.tkws.features.users.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

interface UserJpaRepository extends JpaRepository<UserJpaEntity, UUID> {
    Optional<UserJpaEntity> findByZitadelId(String zitadelId);
    Optional<UserJpaEntity> findByEmail(String email);
}

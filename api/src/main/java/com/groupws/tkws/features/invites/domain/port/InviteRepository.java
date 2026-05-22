package com.groupws.tkws.features.invites.domain.port;

import com.groupws.tkws.features.invites.domain.model.Invite;
import com.groupws.tkws.features.invites.domain.model.InviteId;
import com.groupws.tkws.features.tenants.domain.model.TenantId;

import java.util.Optional;

/**
 * Port (interface do domínio) para persistência de invites.
 * Implementação concreta vive em infrastructure/persistence.
 */
public interface InviteRepository {

    Invite save(Invite invite);

    Optional<Invite> findById(InviteId id);

    Optional<Invite> findByTokenHash(String tokenHash);

    /** Verifica se já existe um invite PENDING para o par (tenant, email). */
    boolean existsPending(TenantId tenantId, String email);
}

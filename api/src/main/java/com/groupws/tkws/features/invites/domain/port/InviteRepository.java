package com.groupws.tkws.features.invites.domain.port;

import com.groupws.tkws.features.invites.domain.model.Invite;
import com.groupws.tkws.features.invites.domain.model.InviteId;
import com.groupws.tkws.features.invites.domain.model.InviteStatus;
import com.groupws.tkws.features.tenants.domain.model.TenantId;

import java.util.List;
import java.util.Optional;

/**
 * Port (interface do domínio) para persistência de invites.
 * Implementação concreta vive em infrastructure/persistence.
 */
public interface InviteRepository {

    Invite save(Invite invite);

    Optional<Invite> findById(InviteId id);

    /**
     * Busca por id <strong>escopada ao tenant</strong>. Use sempre que a
     * operação vier de um endpoint tenant-scoped (revoke, resend) — evita que
     * um admin de um tenant manipule convite de outro.
     */
    Optional<Invite> findByIdAndTenant(InviteId id, TenantId tenantId);

    Optional<Invite> findByTokenHash(String tokenHash);

    /** Verifica se já existe um invite PENDING para o par (tenant, email). */
    boolean existsPending(TenantId tenantId, String email);

    /**
     * Lista paginada de convites do tenant, mais recentes primeiro.
     * {@code statusFilter} nulo traz todos os status.
     */
    List<Invite> findByTenant(TenantId tenantId, InviteStatus statusFilter, int limit, int offset);

    /** Total de convites do tenant para o filtro (para o envelope paginado). */
    long countByTenant(TenantId tenantId, InviteStatus statusFilter);
}

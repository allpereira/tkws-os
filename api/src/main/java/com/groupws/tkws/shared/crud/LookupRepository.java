package com.groupws.tkws.shared.crud;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository base para lookup tables. Cada feature herda em uma interface
 * vazia trocando apenas o tipo da entidade — Spring Data implementa os
 * métodos automaticamente.
 *
 * Exemplo:
 * {@snippet :
 *   interface OfertaJpaRepository extends LookupRepository<OfertaJpaEntity> {}
 * }
 */
@NoRepositoryBean
public interface LookupRepository<E extends LookupJpaEntity> extends JpaRepository<E, UUID> {

    Optional<E> findByIdAndTenantId(UUID id, Long tenantId);

    List<E> findByTenantIdOrderByNomeAsc(Long tenantId);

    Optional<E> findByTenantIdAndCodigo(Long tenantId, String codigo);

    boolean existsByTenantIdAndCodigo(Long tenantId, String codigo);
}

package com.groupws.tkws.shared.crud;

import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.function.Supplier;

/**
 * Service genérico para as lookup tables · encapsula as 5 operações CRUD.
 *
 * Cada feature mantém uma instância (com seu {@link LookupRepository} e
 * a factory da entidade concreta · ver `OfertaController` como template).
 *
 * Decisões:
 *   - Sem use cases separados (1 por operação). A "lógica de negócio" das
 *     lookup tables é apenas: validar unicidade + persistir. Use cases
 *     dedicados não agregam valor.
 *   - `tabela` é um identificador textual (ex: "ofertas") usado nas
 *     mensagens de erro e nos códigos de exceção.
 *
 * Veja ADR-020 para a justificativa de não ter domain layer aqui.
 */
public final class LookupService<E extends LookupJpaEntity> {

    private final String tabela;
    private final LookupRepository<E> repository;
    private final Supplier<E> factory;

    public LookupService(String tabela, LookupRepository<E> repository, Supplier<E> factory) {
        this.tabela = tabela;
        this.repository = repository;
        this.factory = factory;
    }

    @Transactional(readOnly = true)
    public List<LookupView> list(UUID tenantId) {
        return repository.findByTenantIdOrderByNomeAsc(tenantId).stream()
            .map(LookupView::from)
            .toList();
    }

    @Transactional(readOnly = true)
    public LookupView findById(UUID tenantId, UUID id) {
        E entity = repository.findByIdAndTenantId(id, tenantId)
            .orElseThrow(() -> new LookupNotFoundException(tabela, id));
        return LookupView.from(entity);
    }

    @Transactional
    public LookupView create(UUID tenantId, LookupRequest request) {
        if (repository.existsByTenantIdAndCodigo(tenantId, request.codigo())) {
            throw new LookupCodigoDuplicadoException(tabela, request.codigo());
        }
        E entity = factory.get();
        entity.applyRequest(tenantId, request, Instant.now(), true);
        return LookupView.from(repository.save(entity));
    }

    @Transactional
    public LookupView update(UUID tenantId, UUID id, LookupRequest request) {
        E entity = repository.findByIdAndTenantId(id, tenantId)
            .orElseThrow(() -> new LookupNotFoundException(tabela, id));

        // Se o código mudou, valida unicidade (excluindo o próprio registro).
        if (!entity.getCodigo().equals(request.codigo())
            && repository.existsByTenantIdAndCodigo(tenantId, request.codigo())) {
            throw new LookupCodigoDuplicadoException(tabela, request.codigo());
        }

        entity.applyRequest(tenantId, request, Instant.now(), false);
        return LookupView.from(repository.save(entity));
    }

    @Transactional
    public void remove(UUID tenantId, UUID id) {
        E entity = repository.findByIdAndTenantId(id, tenantId)
            .orElseThrow(() -> new LookupNotFoundException(tabela, id));
        repository.delete(entity);
    }
}

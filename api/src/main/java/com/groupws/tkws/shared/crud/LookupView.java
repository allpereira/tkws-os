package com.groupws.tkws.shared.crud;

import java.time.Instant;
import java.util.UUID;

/**
 * Representação pública (view DTO) de uma entrada de lookup table.
 *
 * Idêntica para todas as 8 tabelas — única diferença entre elas é o
 * `@Table(name = ...)` na entidade JPA.
 */
public record LookupView(
    UUID id,
    UUID tenantId,
    String codigo,
    String nome,
    boolean ativo,
    Instant createdAt,
    Instant updatedAt
) {
    public static LookupView from(LookupJpaEntity e) {
        return new LookupView(
            e.getId(),
            e.getTenantId(),
            e.getCodigo(),
            e.getNome(),
            e.isAtivo(),
            e.getCreatedAt(),
            e.getUpdatedAt()
        );
    }
}

package com.groupws.tkws.features.crm.configuracoes.pipelines.application;

import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.Pipeline;

import java.time.Instant;
import java.util.UUID;

public record PipelineView(
    UUID id,
    long tenantId,
    String codigo,
    String nome,
    String descricao,
    String modulo,
    int ordem,
    boolean ativo,
    Instant createdAt,
    Instant updatedAt
) {
    public static PipelineView from(Pipeline p) {
        return new PipelineView(
            p.id().value(), p.tenantId(), p.codigo(), p.nome(), p.descricao(),
            p.modulo().dbValue(), p.ordem(), p.ativo(), p.createdAt(), p.updatedAt()
        );
    }
}

package com.groupws.tkws.features.crm.configuracoes.etapas.application;

import com.groupws.tkws.features.crm.configuracoes.etapas.domain.model.Etapa;

import java.time.Instant;
import java.util.UUID;

public record EtapaView(
    UUID id,
    UUID tenantId,
    UUID pipelineId,
    String codigo,
    String nome,
    String descricao,
    String cor,
    int probabilidade,
    String tipo,
    int ordem,
    boolean converteLeadEmCliente,
    boolean ativo,
    Instant createdAt,
    Instant updatedAt
) {
    public static EtapaView from(Etapa e) {
        return new EtapaView(
            e.id().value(), e.tenantId(), e.pipelineId().value(),
            e.codigo(), e.nome(), e.descricao(), e.cor(), e.probabilidade(),
            e.tipo().dbValue(), e.ordem(), e.converteLeadEmCliente(), e.ativo(),
            e.createdAt(), e.updatedAt()
        );
    }
}

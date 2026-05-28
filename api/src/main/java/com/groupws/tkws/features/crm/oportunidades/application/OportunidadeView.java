package com.groupws.tkws.features.crm.oportunidades.application;

import com.groupws.tkws.features.crm.oportunidades.domain.model.Oportunidade;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record OportunidadeView(
    UUID id,
    long tenantId,
    UUID pipelineId,
    UUID etapaId,
    UUID pessoaId,
    UUID ofertaId,
    UUID tipoPagamentoId,
    UUID empreendimentoId,
    UUID tipoProjetoId,
    UUID responsavelId,
    UUID parceiroId,
    String descricao,
    BigDecimal valor,
    BigDecimal metragemM2,
    LocalDate previsaoFechamento,
    UUID origemId,
    String origemOutros,
    String notas,
    Instant createdAt,
    Instant updatedAt
) {
    public static OportunidadeView from(Oportunidade o) {
        return new OportunidadeView(
            o.id().value(), o.tenantId(), o.pipelineId().value(), o.etapaId().value(),
            o.pessoaId().map(p -> p.value()).orElse(null),
            o.ofertaId().orElse(null), o.tipoPagamentoId().orElse(null),
            o.empreendimentoId().orElse(null), o.tipoProjetoId().orElse(null),
            o.responsavelId().orElse(null), o.parceiroId().orElse(null),
            o.descricao(), o.valor(), o.metragemM2().orElse(null),
            o.previsaoFechamento().orElse(null), o.origemId(), o.origemOutros().orElse(null),
            o.notas().orElse(null), o.createdAt(), o.updatedAt()
        );
    }
}

package com.groupws.tkws.features.crm.oportunidades.web;

import com.groupws.tkws.features.crm.oportunidades.application.OportunidadeCommand;
import com.groupws.tkws.features.crm.oportunidades.domain.model.OrigemNegocio;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record OportunidadeRequest(
    @NotNull UUID pipelineId,
    @NotNull UUID etapaId,
    UUID pessoaId,
    UUID ofertaId,
    UUID tipoPagamentoId,
    UUID empreendimentoId,
    UUID tipoProjetoId,
    UUID responsavelId,
    UUID parceiroId,
    @NotBlank @Size(max = 200) String descricao,
    @PositiveOrZero BigDecimal valor,
    @PositiveOrZero BigDecimal metragemM2,
    LocalDate previsaoFechamento,
    @NotNull OrigemNegocio origem,
    @Size(max = 160) String origemOutros,
    String notas
) {
    public OportunidadeCommand toCommand() {
        return new OportunidadeCommand(
            pipelineId, etapaId, pessoaId, ofertaId, tipoPagamentoId,
            empreendimentoId, tipoProjetoId, responsavelId, parceiroId,
            descricao,
            valor == null ? BigDecimal.ZERO : valor,
            metragemM2, previsaoFechamento, origem, origemOutros, notas
        );
    }
}

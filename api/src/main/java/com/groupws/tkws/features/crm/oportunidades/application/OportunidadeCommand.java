package com.groupws.tkws.features.crm.oportunidades.application;

import com.groupws.tkws.features.crm.oportunidades.domain.model.OrigemNegocio;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Comando interno para create/update de Oportunidade · evita métodos de
 * service com muitos parâmetros. Os DTOs web ({@code OportunidadeRequest})
 * convertem para este record.
 */
public record OportunidadeCommand(
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
    OrigemNegocio origem,
    String origemOutros,
    String notas
) {}

package com.groupws.tkws.features.crm.oportunidades.application;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Comando interno para create/update de Oportunidade · evita métodos de
 * service com muitos parâmetros. Os DTOs web ({@code OportunidadeRequest})
 * convertem para este record.
 *
 * {@code origemId} referencia a configuração Origens de Negócio (ADR-025).
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
    UUID origemId,
    String origemOutros,
    String notas
) {}

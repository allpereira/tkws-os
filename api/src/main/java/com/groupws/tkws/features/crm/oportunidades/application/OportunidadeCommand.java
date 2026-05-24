package com.groupws.tkws.features.crm.oportunidades.application;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Comando interno para create/update de Oportunidade · evita métodos de
 * service com 14 parâmetros. Os DTOs web (`OportunidadeRequest`) convertem
 * para este record.
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
    String titulo,
    String descricao,
    BigDecimal valor,
    BigDecimal metragemM2,
    LocalDate prazoFechamento,
    String notas
) {}

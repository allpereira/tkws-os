package com.groupws.tkws.features.crm.configuracoes.etapas.application;

import com.groupws.tkws.features.crm.configuracoes.etapas.domain.model.TipoEtapa;
import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.PipelineId;

/**
 * Entrada de criação/atualização de Etapa · já com defaults aplicados (a web
 * monta via {@code EtapaRequest.toCommand()}). Evita assinaturas de 10 parâmetros
 * soltos no service.
 */
public record EtapaCommand(
    PipelineId pipelineId,
    String codigo,
    String nome,
    String descricao,
    String cor,
    int probabilidade,
    TipoEtapa tipo,
    int ordem,
    boolean converteLeadEmCliente,
    boolean ativo
) {}

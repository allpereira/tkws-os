package com.groupws.tkws.features.crm.configuracoes.pipelines.application;

import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.ModuloPipeline;

/**
 * Entrada de criação/atualização de Pipeline · já com defaults aplicados (a web
 * monta via {@code PipelineRequest.toCommand()}).
 */
public record PipelineCommand(
    String codigo,
    String nome,
    String descricao,
    ModuloPipeline modulo,
    int ordem,
    boolean ativo
) {}

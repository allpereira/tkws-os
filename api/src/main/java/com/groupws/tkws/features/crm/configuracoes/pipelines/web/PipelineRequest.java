package com.groupws.tkws.features.crm.configuracoes.pipelines.web;

import com.groupws.tkws.features.crm.configuracoes.pipelines.application.PipelineCommand;
import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.ModuloPipeline;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PipelineRequest(
    @NotBlank @Size(max = 40) String codigo,
    @NotBlank @Size(max = 80) String nome,
    @Size(max = 280) String descricao,
    @NotNull ModuloPipeline modulo,
    Integer ordem,
    Boolean ativo
) {
    /** Converte para o command da application, aplicando defaults dos campos opcionais. */
    public PipelineCommand toCommand() {
        return new PipelineCommand(
            codigo, nome, descricao, modulo,
            ordem == null ? 0 : ordem,
            ativo == null || ativo
        );
    }
}

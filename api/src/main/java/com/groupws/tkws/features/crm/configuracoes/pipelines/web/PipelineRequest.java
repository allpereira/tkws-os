package com.groupws.tkws.features.crm.configuracoes.pipelines.web;

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
    public int ordemOrZero() { return ordem == null ? 0 : ordem; }
    public boolean ativoOrTrue() { return ativo == null || ativo; }
}

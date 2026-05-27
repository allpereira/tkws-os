package com.groupws.tkws.features.crm.configuracoes.etapas.web;

import com.groupws.tkws.features.crm.configuracoes.etapas.application.EtapaCommand;
import com.groupws.tkws.features.crm.configuracoes.etapas.domain.model.TipoEtapa;
import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.PipelineId;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record EtapaRequest(
    @NotNull UUID pipelineId,
    @NotBlank @Size(max = 40) String codigo,
    @NotBlank @Size(max = 80) String nome,
    @Size(max = 280) String descricao,
    @Size(max = 7) String cor,
    @Min(0) @Max(100) Integer probabilidade,
    @NotNull TipoEtapa tipo,
    Integer ordem,
    Boolean converteLeadEmCliente,
    Boolean ativo
) {
    /** Converte para o command da application, aplicando defaults dos campos opcionais. */
    public EtapaCommand toCommand() {
        return new EtapaCommand(
            PipelineId.of(pipelineId), codigo, nome, descricao, cor,
            probabilidade == null ? 50 : probabilidade, tipo,
            ordem == null ? 0 : ordem,
            converteLeadEmCliente != null && converteLeadEmCliente,
            ativo == null || ativo
        );
    }
}

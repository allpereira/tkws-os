package com.groupws.tkws.features.crm.configuracoes.origensnegocio.web;

import com.groupws.tkws.features.crm.configuracoes.origensnegocio.application.OrigemNegocioCommand;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record OrigemNegocioRequest(
    @NotBlank @Size(max = 40) String codigo,
    @NotBlank @Size(max = 80) String nome,
    Boolean exigeParceiro,
    Boolean exigeDetalhe,
    Boolean ativo
) {
    /** Converte para o command da application, aplicando defaults dos campos opcionais. */
    public OrigemNegocioCommand toCommand() {
        return new OrigemNegocioCommand(
            codigo, nome,
            exigeParceiro != null && exigeParceiro,
            exigeDetalhe != null && exigeDetalhe,
            ativo == null || ativo
        );
    }
}

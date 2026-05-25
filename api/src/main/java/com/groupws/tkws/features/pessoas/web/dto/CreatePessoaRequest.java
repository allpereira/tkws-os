package com.groupws.tkws.features.pessoas.web.dto;

import com.groupws.tkws.features.pessoas.application.dto.CreatePessoaCommand;
import com.groupws.tkws.features.pessoas.domain.model.TipoPessoa;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Body de `POST /api/v1/pessoas` · não contém `tenantId`, pois ele é
 * resolvido pelo contexto da request (JWT/X-Tenant-Id) e injetado no
 * `CreatePessoaCommand` pelo controller. Ver ADR-019.
 */
public record CreatePessoaRequest(
    @NotNull TipoPessoa tipoPessoa,
    @Size(max = 20) String documento,
    @NotBlank @Size(max = 160) String nomeContato,
    @Email @Size(max = 160) String emailContato,
    @Size(max = 20) String celularContato,
    @Size(max = 160) String nomeEmpresa,
    boolean forceCreate
) {
    public CreatePessoaCommand toCommand(long tenantId) {
        return new CreatePessoaCommand(
            tenantId,
            tipoPessoa,
            documento,
            nomeContato,
            emailContato,
            celularContato,
            nomeEmpresa,
            forceCreate
        );
    }
}

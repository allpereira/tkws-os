package com.groupws.tkws.features.pessoas.web.dto;

import com.groupws.tkws.features.pessoas.application.dto.UpdatePessoaCommand;
import com.groupws.tkws.features.pessoas.domain.model.TipoPessoa;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Body de `PATCH /api/v1/pessoas/{id}` · não contém `tenantId`, que é
 * resolvido pelo contexto da request (JWT/X-Tenant-Id) e injetado no
 * `UpdatePessoaCommand` pelo controller. Ver ADR-019.
 *
 * Mesma forma do {@link CreatePessoaRequest} sem o `forceCreate` (na edição
 * não há fluxo de "criar duplicado mesmo assim"): o body carrega o estado
 * cadastral inteiro do formulário.
 */
public record UpdatePessoaRequest(
    @NotNull TipoPessoa tipoPessoa,
    @Size(max = 20) String documento,
    @NotBlank @Size(max = 160) String nomeContato,
    @Email @Size(max = 160) String emailContato,
    @Size(max = 20) String celularContato,
    @Size(max = 160) String nomeEmpresa
) {
    public UpdatePessoaCommand toCommand(long tenantId) {
        return new UpdatePessoaCommand(
            tenantId,
            tipoPessoa,
            documento,
            nomeContato,
            emailContato,
            celularContato,
            nomeEmpresa
        );
    }
}

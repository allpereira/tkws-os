package com.groupws.tkws.features.pessoas.web.dto;

import com.groupws.tkws.features.pessoas.application.dto.ContatoCommand;
import com.groupws.tkws.features.pessoas.domain.model.TipoRelacionamento;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Body de `POST`/`PATCH` em `/api/v1/pessoas/{pessoaId}/contatos`.
 *
 * `pessoaId` e `tenantId` não vêm no body — são resolvidos pelo path e pelo
 * contexto da request (ADR-019). Ver ADR-023.
 */
public record ContatoRequest(
    @NotBlank @Size(max = 160) String nome,
    @Email @Size(max = 160) String email,
    @Size(max = 20) String telefone,
    @NotNull TipoRelacionamento tipoRelacionamento
) {
    public ContatoCommand toCommand() {
        return new ContatoCommand(nome, email, telefone, tipoRelacionamento);
    }
}

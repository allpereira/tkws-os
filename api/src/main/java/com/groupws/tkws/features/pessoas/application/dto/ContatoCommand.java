package com.groupws.tkws.features.pessoas.application.dto;

import com.groupws.tkws.features.pessoas.domain.model.TipoRelacionamento;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Comando para criar/atualizar um {@link com.groupws.tkws.features.pessoas.domain.model.Contato}.
 *
 * A compatibilidade de {@code tipoRelacionamento} com o tipo da Pessoa dona é
 * validada no use case (que carrega a Pessoa). Ver ADR-023.
 */
public record ContatoCommand(
    @NotBlank @Size(max = 160) String nome,
    @Email @Size(max = 160) String email,
    @Size(max = 20) String telefone,
    @NotNull TipoRelacionamento tipoRelacionamento
) {}

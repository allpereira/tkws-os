package com.groupws.tkws.features.pessoas.application.dto;

import com.groupws.tkws.features.pessoas.domain.model.TipoPessoa;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

/**
 * Comando para criar uma Pessoa nova (sempre como LEAD).
 *
 * Mínimo aceito pela UI de Atendimento (ver ADR-018):
 *   - tipoPessoa
 *   - nomeContato
 *
 * Demais campos são opcionais no cadastro inicial e completados depois.
 *
 * `tenantId` é o BIGINT local · resolvido pelo {@link
 * com.groupws.tkws.shared.web.tenant.CurrentTenant} no controller (nunca vem
 * do body diretamente do cliente).
 *
 * Se `documento` for informado, o use case valida que casa com `tipoPessoa`
 * (CPF=11 dígitos para PF, CNPJ=14 dígitos para PJ) e que ainda não existe
 * outra Pessoa com o mesmo documento no tenant (UNIQUE constraint).
 *
 * Se `forceCreate` for `true`, o vendedor está optando por criar duplicado
 * mesmo que o backend tenha encontrado match por email/celular (mas NÃO
 * por documento — duplicidade de CPF/CNPJ continua bloqueada).
 */
public record CreatePessoaCommand(
    @Positive long tenantId,
    @NotNull TipoPessoa tipoPessoa,
    @Size(max = 20) String documento,
    @NotBlank @Size(max = 160) String nomeContato,
    @Email @Size(max = 160) String emailContato,
    @Size(max = 20) String celularContato,
    @Size(max = 160) String nomeEmpresa,
    boolean forceCreate
) {}

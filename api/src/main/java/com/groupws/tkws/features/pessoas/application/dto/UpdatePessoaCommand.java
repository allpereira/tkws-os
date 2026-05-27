package com.groupws.tkws.features.pessoas.application.dto;

import com.groupws.tkws.features.pessoas.domain.model.TipoPessoa;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

/**
 * Comando para atualizar os dados cadastrais de uma Pessoa existente.
 *
 * Semântica de substituição completa (PATCH no verbo HTTP, mas o body sempre
 * carrega o estado cadastral inteiro vindo do formulário). Não altera `status`
 * nem `convertidoEm` — esses só mudam via {@code convertToCliente()}.
 *
 * Se `documento` for informado, vale a mesma regra do create: precisa casar
 * com `tipoPessoa` (CPF=11 dígitos / CNPJ=14 dígitos) e não pode colidir com
 * o documento de OUTRA pessoa do mesmo tenant (a própria pessoa é ignorada
 * na checagem de duplicidade).
 *
 * `tenantId` é o BIGINT local · resolvido pelo {@link
 * com.groupws.tkws.shared.web.tenant.CurrentTenant} no controller.
 */
public record UpdatePessoaCommand(
    @Positive long tenantId,
    @NotNull TipoPessoa tipoPessoa,
    @Size(max = 20) String documento,
    @NotBlank @Size(max = 160) String nomeContato,
    @Email @Size(max = 160) String emailContato,
    @Size(max = 20) String celularContato,
    @Size(max = 160) String nomeEmpresa
) {}

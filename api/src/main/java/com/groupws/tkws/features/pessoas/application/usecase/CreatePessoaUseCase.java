package com.groupws.tkws.features.pessoas.application.usecase;

import com.groupws.tkws.features.pessoas.application.dto.CreatePessoaCommand;
import com.groupws.tkws.features.pessoas.application.dto.PessoaView;
import com.groupws.tkws.features.pessoas.domain.exception.DocumentoDuplicadoException;
import com.groupws.tkws.features.pessoas.domain.model.Documento;
import com.groupws.tkws.features.pessoas.domain.model.Pessoa;
import com.groupws.tkws.features.pessoas.domain.port.PessoaRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Use case · cria uma Pessoa nova (LEAD por padrão, ou CLIENTE direto · ADR-023).
 *
 * Orquestração:
 *   1. Se documento informado → validar formato (via VO `Documento`) e
 *      verificar unicidade (não importa `forceCreate`).
 *   2. Criar agregado com o status inicial do comando (LEAD default).
 *   3. Persistir.
 *   4. Publicar eventos.
 *
 * O caller é responsável por chamar `CheckDuplicidadePessoaUseCase` ANTES
 * deste para detectar matches soft por email/celular e exibir confirmação
 * ao usuário. Quando o vendedor confirma criação mesmo assim, chama este
 * use case com `forceCreate=true` (apenas semântico — o backend bloqueia
 * SEMPRE duplicidade de documento).
 */
@Service
public class CreatePessoaUseCase {

    private final PessoaRepository repository;
    private final ApplicationEventPublisher eventPublisher;

    public CreatePessoaUseCase(PessoaRepository repository,
                               ApplicationEventPublisher eventPublisher) {
        this.repository = repository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public PessoaView execute(CreatePessoaCommand cmd) {
        Documento documento = null;
        if (cmd.documento() != null && !cmd.documento().isBlank()) {
            documento = Documento.of(cmd.tipoPessoa(), cmd.documento());
            if (repository.existsByDocumento(cmd.tenantId(), documento.value())) {
                throw new DocumentoDuplicadoException(documento.value());
            }
        }

        Pessoa pessoa = Pessoa.create(
            cmd.tenantId(),
            cmd.tipoPessoa(),
            documento,
            cmd.nomeContato(),
            cmd.emailContato(),
            cmd.celularContato(),
            cmd.nomeEmpresa(),
            cmd.statusOrDefault()
        );

        Pessoa saved = repository.save(pessoa);
        saved.pullDomainEvents().forEach(eventPublisher::publishEvent);

        return PessoaView.from(saved);
    }
}

package com.groupws.tkws.features.pessoas.application.usecase;

import com.groupws.tkws.features.pessoas.application.dto.PessoaView;
import com.groupws.tkws.features.pessoas.application.dto.UpdatePessoaCommand;
import com.groupws.tkws.features.pessoas.domain.exception.DocumentoDuplicadoException;
import com.groupws.tkws.features.pessoas.domain.exception.PessoaNotFoundException;
import com.groupws.tkws.features.pessoas.domain.model.Documento;
import com.groupws.tkws.features.pessoas.domain.model.Pessoa;
import com.groupws.tkws.features.pessoas.domain.model.PessoaId;
import com.groupws.tkws.features.pessoas.domain.port.PessoaRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Use case · atualiza os dados cadastrais de uma Pessoa existente.
 *
 * Orquestração:
 *   1. Carregar a Pessoa do tenant (404 lógico se não existir).
 *   2. Se documento informado → validar formato (via VO `Documento`) e
 *      verificar unicidade, IGNORANDO a própria pessoa (editar sem trocar o
 *      documento não pode disparar falso positivo de duplicidade).
 *   3. Aplicar a mutação no agregado.
 *   4. Persistir e publicar eventuais eventos.
 *
 * Não altera `status` nem `convertidoEm` — a conversão LEAD → CLIENTE tem seu
 * próprio use case ({@link ConvertPessoaToClienteUseCase}).
 */
@Service
public class UpdatePessoaUseCase {

    private final PessoaRepository repository;
    private final ApplicationEventPublisher eventPublisher;

    public UpdatePessoaUseCase(PessoaRepository repository,
                               ApplicationEventPublisher eventPublisher) {
        this.repository = repository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public PessoaView execute(long tenantId, PessoaId id, UpdatePessoaCommand cmd) {
        Pessoa pessoa = repository.findById(tenantId, id)
            .orElseThrow(() -> new PessoaNotFoundException(id));

        Documento documento = null;
        if (cmd.documento() != null && !cmd.documento().isBlank()) {
            documento = Documento.of(cmd.tipoPessoa(), cmd.documento());
            String normalizado = documento.value();
            boolean pertenceAOutra = repository.findByDocumento(tenantId, normalizado)
                .filter(outra -> !outra.id().equals(id))
                .isPresent();
            if (pertenceAOutra) {
                throw new DocumentoDuplicadoException(normalizado);
            }
        }

        pessoa.updateCadastro(
            cmd.tipoPessoa(),
            documento,
            cmd.nomeContato(),
            cmd.emailContato(),
            cmd.celularContato(),
            cmd.nomeEmpresa()
        );

        Pessoa saved = repository.save(pessoa);
        saved.pullDomainEvents().forEach(eventPublisher::publishEvent);

        return PessoaView.from(saved);
    }
}

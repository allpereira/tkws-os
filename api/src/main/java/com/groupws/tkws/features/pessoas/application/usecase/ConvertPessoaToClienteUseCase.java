package com.groupws.tkws.features.pessoas.application.usecase;

import com.groupws.tkws.features.pessoas.application.dto.PessoaView;
import com.groupws.tkws.features.pessoas.domain.exception.PessoaNotFoundException;
import com.groupws.tkws.features.pessoas.domain.model.Pessoa;
import com.groupws.tkws.features.pessoas.domain.model.PessoaId;
import com.groupws.tkws.features.pessoas.domain.port.PessoaRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Use case · promove LEAD para CLIENTE.
 *
 * Disparadores:
 *   - Automático: quando uma Oportunidade entra numa etapa com
 *     `converte_lead_em_cliente=true` (módulo Atendimento publica evento
 *     ou chama este use case diretamente).
 *   - Manual: vendedor força conversão na UI · endpoint
 *     `POST /api/v1/pessoas/{id}/converter`.
 *
 * Idempotente · chamar duas vezes não dispara dois eventos (o agregado
 * decide internamente).
 */
@Service
public class ConvertPessoaToClienteUseCase {

    private final PessoaRepository repository;
    private final ApplicationEventPublisher eventPublisher;

    public ConvertPessoaToClienteUseCase(PessoaRepository repository,
                                         ApplicationEventPublisher eventPublisher) {
        this.repository = repository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public PessoaView execute(UUID tenantId, PessoaId pessoaId) {
        Pessoa pessoa = repository.findById(tenantId, pessoaId)
            .orElseThrow(() -> new PessoaNotFoundException(pessoaId));

        pessoa.convertToCliente();

        Pessoa saved = repository.save(pessoa);
        saved.pullDomainEvents().forEach(eventPublisher::publishEvent);

        return PessoaView.from(saved);
    }
}

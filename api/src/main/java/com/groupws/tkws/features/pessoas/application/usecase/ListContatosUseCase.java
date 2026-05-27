package com.groupws.tkws.features.pessoas.application.usecase;

import com.groupws.tkws.features.pessoas.application.dto.ContatoView;
import com.groupws.tkws.features.pessoas.domain.exception.PessoaNotFoundException;
import com.groupws.tkws.features.pessoas.domain.model.PessoaId;
import com.groupws.tkws.features.pessoas.domain.port.ContatoRepository;
import com.groupws.tkws.features.pessoas.domain.port.PessoaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Use case · lista os {@link com.groupws.tkws.features.pessoas.domain.model.Contato}
 * de uma Pessoa. Ver ADR-023.
 */
@Service
public class ListContatosUseCase {

    private final PessoaRepository pessoaRepository;
    private final ContatoRepository contatoRepository;

    public ListContatosUseCase(PessoaRepository pessoaRepository,
                               ContatoRepository contatoRepository) {
        this.pessoaRepository = pessoaRepository;
        this.contatoRepository = contatoRepository;
    }

    @Transactional(readOnly = true)
    public List<ContatoView> byPessoa(long tenantId, PessoaId pessoaId) {
        if (pessoaRepository.findById(tenantId, pessoaId).isEmpty()) {
            throw new PessoaNotFoundException(pessoaId);
        }
        return contatoRepository.listByPessoa(tenantId, pessoaId).stream()
            .map(ContatoView::from)
            .toList();
    }
}

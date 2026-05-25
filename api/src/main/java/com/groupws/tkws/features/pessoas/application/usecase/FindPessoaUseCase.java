package com.groupws.tkws.features.pessoas.application.usecase;

import com.groupws.tkws.features.pessoas.application.dto.PessoaView;
import com.groupws.tkws.features.pessoas.domain.exception.PessoaNotFoundException;
import com.groupws.tkws.features.pessoas.domain.model.PessoaId;
import com.groupws.tkws.features.pessoas.domain.model.StatusPessoa;
import com.groupws.tkws.features.pessoas.domain.port.PessoaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Use case · buscar Pessoas (por ID ou listagem filtrada).
 *
 * O frontend usa esta listagem para construir as telas "Leads" e "Clientes",
 * passando `?status=LEAD` ou `?status=CLIENTE`. Sem filtro = todas.
 */
@Service
public class FindPessoaUseCase {

    private final PessoaRepository repository;

    public FindPessoaUseCase(PessoaRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public PessoaView byId(long tenantId, PessoaId id) {
        return repository.findById(tenantId, id)
            .map(PessoaView::from)
            .orElseThrow(() -> new PessoaNotFoundException(id));
    }

    @Transactional(readOnly = true)
    public List<PessoaView> list(long tenantId, StatusPessoa statusOuNull, int limit, int offset) {
        return repository.list(tenantId, statusOuNull, limit, offset).stream()
            .map(PessoaView::from)
            .toList();
    }
}

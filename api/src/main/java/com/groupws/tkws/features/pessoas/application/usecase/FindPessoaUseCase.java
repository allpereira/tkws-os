package com.groupws.tkws.features.pessoas.application.usecase;

import com.groupws.tkws.features.pessoas.application.dto.PessoaSearchView;
import com.groupws.tkws.features.pessoas.application.dto.PessoaView;
import com.groupws.tkws.features.pessoas.domain.exception.PessoaNotFoundException;
import com.groupws.tkws.features.pessoas.domain.model.PessoaId;
import com.groupws.tkws.features.pessoas.domain.port.PessoaListCriteria;
import com.groupws.tkws.features.pessoas.domain.port.PessoaRepository;
import com.groupws.tkws.shared.page.PageResponse;
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

    /**
     * Listagem paginada (offset/limit) das telas Leads/Clientes · aplica os
     * filtros/ordenação de {@link PessoaListCriteria} e devolve o envelope
     * padrão {@link PageResponse} com o total para paginação inteligente na UI
     * (ver ADR-022).
     */
    @Transactional(readOnly = true)
    public PageResponse<PessoaView> list(long tenantId, PessoaListCriteria criteria, int limit, int offset) {
        List<PessoaView> content = repository.list(tenantId, criteria, limit, offset).stream()
            .map(PessoaView::from)
            .toList();
        long total = repository.count(tenantId, criteria);
        return PageResponse.of(content, limit, offset, total);
    }

    /**
     * Autocomplete · usado pelo Combobox async no frontend. Retorna view
     * "leve" (PessoaSearchView) com só os campos necessários para escolha.
     * Query vazia/em-branco retorna lista vazia · sem hit no banco.
     */
    @Transactional(readOnly = true)
    public List<PessoaSearchView> search(long tenantId, String query, int limit) {
        return repository.search(tenantId, query, limit).stream()
            .map(PessoaSearchView::from)
            .toList();
    }
}

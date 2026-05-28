package com.groupws.tkws.features.crm.configuracoes.origensnegocio.application;

import com.groupws.tkws.features.crm.configuracoes.origensnegocio.domain.exception.OrigemNegocioCodigoDuplicadoException;
import com.groupws.tkws.features.crm.configuracoes.origensnegocio.domain.exception.OrigemNegocioNotFoundException;
import com.groupws.tkws.features.crm.configuracoes.origensnegocio.domain.model.OrigemNegocio;
import com.groupws.tkws.features.crm.configuracoes.origensnegocio.domain.model.OrigemNegocioId;
import com.groupws.tkws.features.crm.configuracoes.origensnegocio.domain.port.OrigemNegocioRepository;
import com.groupws.tkws.shared.page.PageResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrigemNegocioService {

    private final OrigemNegocioRepository repository;

    public OrigemNegocioService(OrigemNegocioRepository repository) {
        this.repository = repository;
    }

    /**
     * Lista as origens de negócio do tenant, ordenadas. Devolve no envelope
     * {@link PageResponse} por consistência da API (ADR-022); como é uma lista
     * de configuração pequena e finita, retorna tudo numa única página.
     */
    @Transactional(readOnly = true)
    public PageResponse<OrigemNegocioView> list(long tenantId) {
        List<OrigemNegocioView> content = repository.listAll(tenantId)
            .stream().map(OrigemNegocioView::from).toList();
        return PageResponse.of(content, content.size(), 0, content.size());
    }

    @Transactional(readOnly = true)
    public OrigemNegocioView findById(long tenantId, OrigemNegocioId id) {
        return repository.findById(tenantId, id)
            .map(OrigemNegocioView::from)
            .orElseThrow(() -> new OrigemNegocioNotFoundException(id));
    }

    @Transactional
    public OrigemNegocioView create(long tenantId, OrigemNegocioCommand cmd) {
        if (repository.existsByCodigo(tenantId, cmd.codigo())) {
            throw new OrigemNegocioCodigoDuplicadoException(cmd.codigo());
        }
        OrigemNegocio origem = OrigemNegocio.create(tenantId, cmd.codigo(), cmd.nome(),
            cmd.exigeParceiro(), cmd.exigeDetalhe(), cmd.ativo());
        return OrigemNegocioView.from(repository.save(origem));
    }

    @Transactional
    public OrigemNegocioView update(long tenantId, OrigemNegocioId id, OrigemNegocioCommand cmd) {
        OrigemNegocio origem = repository.findById(tenantId, id)
            .orElseThrow(() -> new OrigemNegocioNotFoundException(id));
        if (!origem.codigo().equals(cmd.codigo()) && repository.existsByCodigo(tenantId, cmd.codigo())) {
            throw new OrigemNegocioCodigoDuplicadoException(cmd.codigo());
        }
        origem.update(cmd.codigo(), cmd.nome(), cmd.exigeParceiro(), cmd.exigeDetalhe(), cmd.ativo());
        return OrigemNegocioView.from(repository.save(origem));
    }

    @Transactional
    public void remove(long tenantId, OrigemNegocioId id) {
        repository.delete(tenantId, id);
    }
}

package com.groupws.tkws.features.crm.configuracoes.etapas.application;

import com.groupws.tkws.features.crm.configuracoes.etapas.domain.exception.EtapaCodigoDuplicadoException;
import com.groupws.tkws.features.crm.configuracoes.etapas.domain.exception.EtapaNotFoundException;
import com.groupws.tkws.features.crm.configuracoes.etapas.domain.model.Etapa;
import com.groupws.tkws.features.crm.configuracoes.etapas.domain.model.EtapaId;
import com.groupws.tkws.features.crm.configuracoes.etapas.domain.port.EtapaRepository;
import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.PipelineId;
import com.groupws.tkws.shared.page.PageResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EtapaService {

    private final EtapaRepository repository;

    public EtapaService(EtapaRepository repository) {
        this.repository = repository;
    }

    /**
     * Lista as etapas (opcionalmente de um pipeline), já ordenadas. Devolve no
     * envelope {@link PageResponse} por consistência da API (ADR-022); como é uma
     * lista de configuração pequena e finita, retorna tudo numa única página —
     * sem count nem offset (ver ADR-022 · modo "página única").
     */
    @Transactional(readOnly = true)
    public PageResponse<EtapaView> list(long tenantId, PipelineId pipelineId) {
        List<EtapaView> etapas = (pipelineId != null
            ? repository.listByPipeline(tenantId, pipelineId)
            : repository.listAll(tenantId))
            .stream().map(EtapaView::from).toList();
        return PageResponse.of(etapas, etapas.size(), 0, etapas.size());
    }

    @Transactional(readOnly = true)
    public EtapaView findById(long tenantId, EtapaId id) {
        return repository.findById(tenantId, id)
            .map(EtapaView::from)
            .orElseThrow(() -> new EtapaNotFoundException(id));
    }

    @Transactional
    public EtapaView create(long tenantId, EtapaCommand cmd) {
        if (repository.existsByCodigo(tenantId, cmd.codigo())) {
            throw new EtapaCodigoDuplicadoException(cmd.codigo());
        }
        Etapa etapa = Etapa.create(tenantId, cmd.pipelineId(), cmd.codigo(), cmd.nome(),
            cmd.descricao(), cmd.cor(), cmd.probabilidade(), cmd.tipo(), cmd.ordem(),
            cmd.converteLeadEmCliente(), cmd.ativo());
        return EtapaView.from(repository.save(etapa));
    }

    @Transactional
    public EtapaView update(long tenantId, EtapaId id, EtapaCommand cmd) {
        Etapa etapa = repository.findById(tenantId, id)
            .orElseThrow(() -> new EtapaNotFoundException(id));
        if (!etapa.codigo().equals(cmd.codigo()) && repository.existsByCodigo(tenantId, cmd.codigo())) {
            throw new EtapaCodigoDuplicadoException(cmd.codigo());
        }
        etapa.update(cmd.codigo(), cmd.nome(), cmd.descricao(), cmd.cor(), cmd.probabilidade(),
            cmd.tipo(), cmd.ordem(), cmd.converteLeadEmCliente(), cmd.ativo());
        return EtapaView.from(repository.save(etapa));
    }

    @Transactional
    public void remove(long tenantId, EtapaId id) {
        repository.delete(tenantId, id);
    }
}

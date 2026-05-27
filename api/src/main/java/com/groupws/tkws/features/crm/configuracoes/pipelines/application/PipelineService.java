package com.groupws.tkws.features.crm.configuracoes.pipelines.application;

import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.exception.PipelineCodigoDuplicadoException;
import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.exception.PipelineNotFoundException;
import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.ModuloPipeline;
import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.Pipeline;
import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.PipelineId;
import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.port.PipelineRepository;
import com.groupws.tkws.shared.page.PageResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PipelineService {

    private final PipelineRepository repository;

    public PipelineService(PipelineRepository repository) {
        this.repository = repository;
    }

    /**
     * Lista os pipelines (opcionalmente de um módulo), já ordenados. Envelope
     * {@link PageResponse} por consistência (ADR-022); lista de configuração
     * pequena e finita → uma única página, sem count nem offset (ver ADR-022 · modo "página única").
     */
    @Transactional(readOnly = true)
    public PageResponse<PipelineView> list(long tenantId, ModuloPipeline filtro) {
        List<PipelineView> pipelines = repository.list(tenantId, filtro)
            .stream().map(PipelineView::from).toList();
        return PageResponse.of(pipelines, pipelines.size(), 0, pipelines.size());
    }

    @Transactional(readOnly = true)
    public PipelineView findById(long tenantId, PipelineId id) {
        return repository.findById(tenantId, id)
            .map(PipelineView::from)
            .orElseThrow(() -> new PipelineNotFoundException(id));
    }

    @Transactional
    public PipelineView create(long tenantId, PipelineCommand cmd) {
        if (repository.existsByCodigo(tenantId, cmd.codigo())) {
            throw new PipelineCodigoDuplicadoException(cmd.codigo());
        }
        Pipeline pipeline = Pipeline.create(tenantId, cmd.codigo(), cmd.nome(), cmd.descricao(),
            cmd.modulo(), cmd.ordem(), cmd.ativo());
        return PipelineView.from(repository.save(pipeline));
    }

    @Transactional
    public PipelineView update(long tenantId, PipelineId id, PipelineCommand cmd) {
        Pipeline pipeline = repository.findById(tenantId, id)
            .orElseThrow(() -> new PipelineNotFoundException(id));
        if (!pipeline.codigo().equals(cmd.codigo()) && repository.existsByCodigo(tenantId, cmd.codigo())) {
            throw new PipelineCodigoDuplicadoException(cmd.codigo());
        }
        pipeline.update(cmd.codigo(), cmd.nome(), cmd.descricao(), cmd.modulo(), cmd.ordem(), cmd.ativo());
        return PipelineView.from(repository.save(pipeline));
    }

    @Transactional
    public void remove(long tenantId, PipelineId id) {
        repository.delete(tenantId, id);
    }
}

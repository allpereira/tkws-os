package com.groupws.tkws.features.crm.configuracoes.pipelines.application;

import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.exception.PipelineCodigoDuplicadoException;
import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.exception.PipelineNotFoundException;
import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.ModuloPipeline;
import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.Pipeline;
import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.PipelineId;
import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.port.PipelineRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class PipelineService {

    private final PipelineRepository repository;

    public PipelineService(PipelineRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<PipelineView> list(UUID tenantId, ModuloPipeline filtro) {
        return repository.list(tenantId, filtro).stream().map(PipelineView::from).toList();
    }

    @Transactional(readOnly = true)
    public PipelineView findById(UUID tenantId, PipelineId id) {
        return repository.findById(tenantId, id)
            .map(PipelineView::from)
            .orElseThrow(() -> new PipelineNotFoundException(id));
    }

    @Transactional
    public PipelineView create(UUID tenantId, String codigo, String nome, String descricao,
                               ModuloPipeline modulo, int ordem, boolean ativo) {
        if (repository.existsByCodigo(tenantId, codigo)) {
            throw new PipelineCodigoDuplicadoException(codigo);
        }
        Pipeline pipeline = Pipeline.create(tenantId, codigo, nome, descricao, modulo, ordem, ativo);
        return PipelineView.from(repository.save(pipeline));
    }

    @Transactional
    public PipelineView update(UUID tenantId, PipelineId id, String codigo, String nome,
                               String descricao, ModuloPipeline modulo, int ordem, boolean ativo) {
        Pipeline pipeline = repository.findById(tenantId, id)
            .orElseThrow(() -> new PipelineNotFoundException(id));
        if (!pipeline.codigo().equals(codigo) && repository.existsByCodigo(tenantId, codigo)) {
            throw new PipelineCodigoDuplicadoException(codigo);
        }
        pipeline.update(codigo, nome, descricao, modulo, ordem, ativo);
        return PipelineView.from(repository.save(pipeline));
    }

    @Transactional
    public void remove(UUID tenantId, PipelineId id) {
        repository.delete(tenantId, id);
    }
}

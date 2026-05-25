package com.groupws.tkws.features.crm.configuracoes.etapas.application;

import com.groupws.tkws.features.crm.configuracoes.etapas.domain.exception.EtapaCodigoDuplicadoException;
import com.groupws.tkws.features.crm.configuracoes.etapas.domain.exception.EtapaNotFoundException;
import com.groupws.tkws.features.crm.configuracoes.etapas.domain.model.Etapa;
import com.groupws.tkws.features.crm.configuracoes.etapas.domain.model.EtapaId;
import com.groupws.tkws.features.crm.configuracoes.etapas.domain.model.TipoEtapa;
import com.groupws.tkws.features.crm.configuracoes.etapas.domain.port.EtapaRepository;
import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.PipelineId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EtapaService {

    private final EtapaRepository repository;

    public EtapaService(EtapaRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<EtapaView> list(long tenantId, PipelineId pipelineId) {
        List<Etapa> etapas = pipelineId != null
            ? repository.listByPipeline(tenantId, pipelineId)
            : repository.listAll(tenantId);
        return etapas.stream().map(EtapaView::from).toList();
    }

    @Transactional(readOnly = true)
    public EtapaView findById(long tenantId, EtapaId id) {
        return repository.findById(tenantId, id)
            .map(EtapaView::from)
            .orElseThrow(() -> new EtapaNotFoundException(id));
    }

    @Transactional
    public EtapaView create(long tenantId, PipelineId pipelineId, String codigo, String nome,
                            String descricao, String cor, int probabilidade, TipoEtapa tipo,
                            int ordem, boolean converteLeadEmCliente, boolean ativo) {
        if (repository.existsByCodigo(tenantId, codigo)) {
            throw new EtapaCodigoDuplicadoException(codigo);
        }
        Etapa etapa = Etapa.create(tenantId, pipelineId, codigo, nome, descricao, cor,
            probabilidade, tipo, ordem, converteLeadEmCliente, ativo);
        return EtapaView.from(repository.save(etapa));
    }

    @Transactional
    public EtapaView update(long tenantId, EtapaId id, String codigo, String nome,
                            String descricao, String cor, int probabilidade, TipoEtapa tipo,
                            int ordem, boolean converteLeadEmCliente, boolean ativo) {
        Etapa etapa = repository.findById(tenantId, id)
            .orElseThrow(() -> new EtapaNotFoundException(id));
        if (!etapa.codigo().equals(codigo) && repository.existsByCodigo(tenantId, codigo)) {
            throw new EtapaCodigoDuplicadoException(codigo);
        }
        etapa.update(codigo, nome, descricao, cor, probabilidade, tipo, ordem,
            converteLeadEmCliente, ativo);
        return EtapaView.from(repository.save(etapa));
    }

    @Transactional
    public void remove(long tenantId, EtapaId id) {
        repository.delete(tenantId, id);
    }
}

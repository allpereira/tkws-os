package com.groupws.tkws.features.crm.configuracoes.etapas.domain.port;

import com.groupws.tkws.features.crm.configuracoes.etapas.domain.model.Etapa;
import com.groupws.tkws.features.crm.configuracoes.etapas.domain.model.EtapaId;
import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.PipelineId;

import java.util.List;
import java.util.Optional;

public interface EtapaRepository {
    Etapa save(Etapa etapa);
    Optional<Etapa> findById(long tenantId, EtapaId id);
    List<Etapa> listByPipeline(long tenantId, PipelineId pipelineId);
    List<Etapa> listAll(long tenantId);
    boolean existsByCodigo(long tenantId, String codigo);
    void delete(long tenantId, EtapaId id);
}

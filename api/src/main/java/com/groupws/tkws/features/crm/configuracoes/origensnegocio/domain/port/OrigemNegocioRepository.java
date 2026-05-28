package com.groupws.tkws.features.crm.configuracoes.origensnegocio.domain.port;

import com.groupws.tkws.features.crm.configuracoes.origensnegocio.domain.model.OrigemNegocio;
import com.groupws.tkws.features.crm.configuracoes.origensnegocio.domain.model.OrigemNegocioId;

import java.util.List;
import java.util.Optional;

public interface OrigemNegocioRepository {
    OrigemNegocio save(OrigemNegocio origem);
    Optional<OrigemNegocio> findById(long tenantId, OrigemNegocioId id);
    List<OrigemNegocio> listAll(long tenantId);
    boolean existsByCodigo(long tenantId, String codigo);
    void delete(long tenantId, OrigemNegocioId id);
}

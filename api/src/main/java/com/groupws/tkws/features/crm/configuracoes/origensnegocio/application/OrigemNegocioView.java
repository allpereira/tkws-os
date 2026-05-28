package com.groupws.tkws.features.crm.configuracoes.origensnegocio.application;

import com.groupws.tkws.features.crm.configuracoes.origensnegocio.domain.model.OrigemNegocio;

import java.time.Instant;
import java.util.UUID;

public record OrigemNegocioView(
    UUID id,
    long tenantId,
    String codigo,
    String nome,
    boolean exigeParceiro,
    boolean exigeDetalhe,
    boolean ativo,
    Instant createdAt,
    Instant updatedAt
) {
    public static OrigemNegocioView from(OrigemNegocio o) {
        return new OrigemNegocioView(
            o.id().value(), o.tenantId(), o.codigo(), o.nome(),
            o.exigeParceiro(), o.exigeDetalhe(), o.ativo(),
            o.createdAt(), o.updatedAt()
        );
    }
}

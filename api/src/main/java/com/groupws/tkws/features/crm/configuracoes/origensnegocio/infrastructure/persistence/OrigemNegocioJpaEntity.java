package com.groupws.tkws.features.crm.configuracoes.origensnegocio.infrastructure.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "origens_negocio")
class OrigemNegocioJpaEntity {
    @Id @Column(name = "id", nullable = false, updatable = false) UUID id;
    @Column(name = "tenant_id", nullable = false) Long tenantId;
    @Column(name = "codigo", nullable = false, length = 40) String codigo;
    @Column(name = "nome", nullable = false, length = 80) String nome;
    @Column(name = "exige_parceiro", nullable = false) boolean exigeParceiro;
    @Column(name = "exige_detalhe", nullable = false) boolean exigeDetalhe;
    @Column(name = "ativo", nullable = false) boolean ativo;
    @Column(name = "created_at", nullable = false, updatable = false) Instant createdAt;
    @Column(name = "updated_at", nullable = false) Instant updatedAt;

    protected OrigemNegocioJpaEntity() {}
}

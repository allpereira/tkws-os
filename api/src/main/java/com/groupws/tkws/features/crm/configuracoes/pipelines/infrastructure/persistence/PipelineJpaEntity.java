package com.groupws.tkws.features.crm.configuracoes.pipelines.infrastructure.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "pipelines")
class PipelineJpaEntity {

    @Id @Column(name = "id", nullable = false, updatable = false)
    UUID id;

    @Column(name = "tenant_id", nullable = false)
    UUID tenantId;

    @Column(name = "codigo", nullable = false, length = 40)
    String codigo;

    @Column(name = "nome", nullable = false, length = 80)
    String nome;

    @Column(name = "descricao", length = 280)
    String descricao;

    @Column(name = "modulo", nullable = false, length = 20)
    String modulo;

    @Column(name = "ordem", nullable = false)
    int ordem;

    @Column(name = "ativo", nullable = false)
    boolean ativo;

    @Column(name = "created_at", nullable = false, updatable = false)
    Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    Instant updatedAt;

    protected PipelineJpaEntity() {}
}

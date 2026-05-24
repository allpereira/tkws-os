package com.groupws.tkws.features.crm.configuracoes.etapas.infrastructure.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "etapas")
class EtapaJpaEntity {
    @Id @Column(name = "id", nullable = false, updatable = false) UUID id;
    @Column(name = "tenant_id", nullable = false) UUID tenantId;
    @Column(name = "pipeline_id", nullable = false) UUID pipelineId;
    @Column(name = "codigo", nullable = false, length = 40) String codigo;
    @Column(name = "nome", nullable = false, length = 80) String nome;
    @Column(name = "descricao", length = 280) String descricao;
    @Column(name = "cor", nullable = false, length = 7) String cor;
    @Column(name = "probabilidade", nullable = false) short probabilidade;
    @Column(name = "tipo", nullable = false, length = 10) String tipo;
    @Column(name = "ordem", nullable = false) int ordem;
    @Column(name = "converte_lead_em_cliente", nullable = false) boolean converteLeadEmCliente;
    @Column(name = "ativo", nullable = false) boolean ativo;
    @Column(name = "created_at", nullable = false, updatable = false) Instant createdAt;
    @Column(name = "updated_at", nullable = false) Instant updatedAt;

    protected EtapaJpaEntity() {}
}

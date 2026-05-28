package com.groupws.tkws.features.crm.oportunidades.infrastructure.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "oportunidades")
class OportunidadeJpaEntity {
    @Id @Column(name = "id", nullable = false, updatable = false) UUID id;
    @Column(name = "tenant_id", nullable = false) Long tenantId;
    @Column(name = "pipeline_id", nullable = false) UUID pipelineId;
    @Column(name = "etapa_id", nullable = false) UUID etapaId;
    @Column(name = "pessoa_id") UUID pessoaId;
    @Column(name = "oferta_id") UUID ofertaId;
    @Column(name = "tipo_pagamento_id") UUID tipoPagamentoId;
    @Column(name = "empreendimento_id") UUID empreendimentoId;
    @Column(name = "tipo_projeto_id") UUID tipoProjetoId;
    @Column(name = "responsavel_id") UUID responsavelId;
    @Column(name = "parceiro_id") UUID parceiroId;
    @Column(name = "descricao", nullable = false, length = 200) String descricao;
    @Column(name = "valor", nullable = false, precision = 14, scale = 2) BigDecimal valor;
    @Column(name = "metragem_m2", precision = 10, scale = 2) BigDecimal metragemM2;
    @Column(name = "previsao_fechamento") LocalDate previsaoFechamento;
    @Column(name = "origem_id", nullable = false) UUID origemId;
    @Column(name = "origem_outros", length = 160) String origemOutros;
    @Column(name = "notas", columnDefinition = "TEXT") String notas;
    @Column(name = "created_at", nullable = false, updatable = false) Instant createdAt;
    @Column(name = "updated_at", nullable = false) Instant updatedAt;

    protected OportunidadeJpaEntity() {}
}

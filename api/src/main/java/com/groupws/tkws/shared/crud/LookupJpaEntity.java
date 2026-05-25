package com.groupws.tkws.shared.crud;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;

import java.time.Instant;
import java.util.UUID;

/**
 * Superclass JPA para "lookup tables" do TKWS OS — tabelas de configuração
 * com a estrutura padrão:
 *
 *   id · tenant_id · codigo · nome · ativo · created_at · updated_at
 *
 * Cobre: ofertas · tipos_empresa · unidades · setores · tipos_projeto
 *      · funcoes_pessoas · empreendimentos · tipos_pagamento.
 *
 * `tenant_id` é o BIGINT local (PK em tenants.id).
 *
 * Por que não temos um Aggregate Root próprio para cada uma? Ver
 * `docs/adr/ADR-020-lookup-tables-sem-domain-layer.md`.
 *
 * **Não é classe abstrata Java**, é `@MappedSuperclass` JPA — entidades
 * concretas declaram seu próprio `@Table(name = "...")`.
 */
@MappedSuperclass
public abstract class LookupJpaEntity {

    @jakarta.persistence.Id
    @Column(name = "id", nullable = false, updatable = false)
    protected UUID id;

    @Column(name = "tenant_id", nullable = false)
    protected Long tenantId;

    @Column(name = "codigo", nullable = false, length = 40)
    protected String codigo;

    @Column(name = "nome", nullable = false, length = 160)
    protected String nome;

    @Column(name = "ativo", nullable = false)
    protected boolean ativo = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    protected Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    protected Instant updatedAt;

    protected LookupJpaEntity() {}

    public UUID getId() { return id; }
    public Long getTenantId() { return tenantId; }
    public String getCodigo() { return codigo; }
    public String getNome() { return nome; }
    public boolean isAtivo() { return ativo; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    /**
     * Aplica dados de uma request (create/update). Usado tanto pelo create
     * quanto pelo update do controller genérico — controllers não precisam
     * conhecer a forma interna da entidade.
     */
    public final void applyRequest(long tenantId, LookupRequest request, Instant now, boolean isCreate) {
        if (isCreate) {
            this.id = UUID.randomUUID();
            this.tenantId = tenantId;
            this.createdAt = now;
        }
        this.codigo = request.codigo();
        this.nome = request.nome();
        this.ativo = request.ativo() == null || request.ativo();
        this.updatedAt = now;
    }
}

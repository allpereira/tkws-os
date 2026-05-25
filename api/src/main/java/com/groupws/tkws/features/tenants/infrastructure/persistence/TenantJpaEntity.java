package com.groupws.tkws.features.tenants.infrastructure.persistence;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

/**
 * JPA Entity — vive APENAS na camada de infrastructure.
 * Não é a mesma classe do Aggregate Root do domínio.
 * Conversão acontece em TenantJpaRepositoryAdapter.
 *
 * `id` é BIGINT gerado pelo banco (IDENTITY column · V1__initial_schema.sql).
 * Em INSERTs o id vem null e o Postgres atribui via sequência; em UPDATEs já
 * vem populado pela leitura prévia.
 *
 * Campos `status` e relacionados ao workflow de aprovação (V3__tenant_approval_workflow.sql)
 * estão mapeados aqui mas ainda não exposto no Aggregate Root.
 * Será refatorado na feature `onboarding-v1`.
 */
@Entity
@Table(name = "tenants")
class TenantJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    Long id;

    @Column(name = "zitadel_org_id", nullable = false, unique = true)
    String zitadelOrgId;

    @Column(name = "name", nullable = false)
    String name;

    @Column(name = "slug", nullable = false, unique = true, length = 100)
    String slug;

    @Column(name = "active", nullable = false)
    boolean active;

    @Column(name = "status", nullable = false, length = 20)
    String status = "ACTIVE";

    @Column(name = "requested_at")
    Instant requestedAt;

    @Column(name = "approved_at")
    Instant approvedAt;

    @Column(name = "rejected_at")
    Instant rejectedAt;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    String rejectionReason;

    @Column(name = "requester_email")
    String requesterEmail;

    @Column(name = "requester_full_name")
    String requesterFullName;

    @Column(name = "requester_phone", length = 50)
    String requesterPhone;

    @Column(name = "requester_company_role")
    String requesterCompanyRole;

    @Column(name = "approved_by_user_id")
    UUID approvedByUserId;

    @Column(name = "created_at", nullable = false, updatable = false)
    Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    Instant updatedAt;

    protected TenantJpaEntity() {}

    /**
     * Construtor de INSERT · id null deixa o Postgres atribuir via IDENTITY.
     * Após {@link jakarta.persistence.EntityManager#persist} o JPA preenche
     * o campo {@link #id} com o valor gerado.
     */
    TenantJpaEntity(String zitadelOrgId, String name, String slug,
                    boolean active, Instant createdAt, Instant updatedAt) {
        this.id = null;
        this.zitadelOrgId = zitadelOrgId;
        this.name = name;
        this.slug = slug;
        this.active = active;
        this.status = "ACTIVE";
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

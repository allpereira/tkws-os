package com.groupws.tkws.features.pessoas.infrastructure.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

/**
 * JPA Entity dos contatos de uma Pessoa · vive APENAS em infrastructure.
 * Conversão Domain ↔ Entity acontece em `ContatoJpaRepositoryAdapter`.
 */
@Entity
@Table(name = "pessoa_contatos")
class ContatoJpaEntity {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    UUID id;

    @Column(name = "pessoa_id", nullable = false)
    UUID pessoaId;

    @Column(name = "tenant_id", nullable = false)
    Long tenantId;

    @Column(name = "nome", nullable = false, length = 160)
    String nome;

    @Column(name = "email", length = 160)
    String email;

    @Column(name = "telefone", length = 20)
    String telefone;

    @Column(name = "tipo_relacionamento", nullable = false, length = 30)
    String tipoRelacionamento;

    @Column(name = "created_at", nullable = false, updatable = false)
    Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    Instant updatedAt;

    protected ContatoJpaEntity() {}
}

package com.groupws.tkws.features.pessoas.infrastructure.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

/**
 * JPA Entity · vive APENAS em infrastructure.
 * Conversão Domain ↔ Entity acontece em `PessoaJpaRepositoryAdapter`.
 */
@Entity
@Table(name = "pessoas")
class PessoaJpaEntity {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    UUID id;

    @Column(name = "tenant_id", nullable = false)
    UUID tenantId;

    @Column(name = "tipo_pessoa", nullable = false, length = 2)
    String tipoPessoa;

    @Column(name = "documento", length = 20)
    String documento;

    @Column(name = "nome_contato", nullable = false, length = 160)
    String nomeContato;

    @Column(name = "email_contato", length = 160)
    String emailContato;

    @Column(name = "celular_contato", length = 20)
    String celularContato;

    @Column(name = "nome_empresa", length = 160)
    String nomeEmpresa;

    @Column(name = "status", nullable = false, length = 10)
    String status;

    @Column(name = "convertido_em")
    Instant convertidoEm;

    @Column(name = "endereco", length = 200)
    String endereco;

    @Column(name = "cidade", length = 80)
    String cidade;

    @Column(name = "uf", length = 2)
    String uf;

    @Column(name = "cep", length = 10)
    String cep;

    @Column(name = "notas", columnDefinition = "TEXT")
    String notas;

    @Column(name = "created_at", nullable = false, updatable = false)
    Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    Instant updatedAt;

    protected PessoaJpaEntity() {}
}

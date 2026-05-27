package com.groupws.tkws.features.pessoas.domain.model;

import com.groupws.tkws.shared.domain.AggregateRoot;

import java.time.Instant;
import java.util.Objects;
import java.util.Optional;

/**
 * Aggregate Root · contato associado a uma {@link Pessoa} (sócio, representante,
 * parente, cônjuge, …). Ver ADR-023.
 *
 * Modelado como agregado pequeno que referencia o dono por {@link PessoaId}
 * (não como entidade dentro do agregado Pessoa). Sempre tenant-scoped.
 *
 * A compatibilidade entre {@code tipoRelacionamento} e o {@link TipoPessoa} da
 * Pessoa dona é validada no use case, que conhece o dono. O agregado garante
 * apenas as invariantes locais (nome obrigatório, normalização de opcionais).
 */
public final class Contato extends AggregateRoot<ContatoId> {

    private final ContatoId id;
    private final PessoaId pessoaId;
    private final long tenantId;

    private String nome;
    private String email;            // opcional
    private String telefone;         // opcional
    private TipoRelacionamento tipoRelacionamento;

    private final Instant createdAt;
    private Instant updatedAt;

    private Contato(ContatoId id, PessoaId pessoaId, long tenantId, String nome,
                    String email, String telefone, TipoRelacionamento tipoRelacionamento,
                    Instant createdAt, Instant updatedAt) {
        this.id = Objects.requireNonNull(id, "id");
        this.pessoaId = Objects.requireNonNull(pessoaId, "pessoaId");
        if (tenantId <= 0) {
            throw new IllegalArgumentException("tenantId deve ser positivo · recebeu: " + tenantId);
        }
        this.tenantId = tenantId;
        this.nome = validateNome(nome);
        this.email = blankToNull(email);
        this.telefone = blankToNull(telefone);
        this.tipoRelacionamento = Objects.requireNonNull(tipoRelacionamento, "tipoRelacionamento");
        this.createdAt = Objects.requireNonNull(createdAt, "createdAt");
        this.updatedAt = Objects.requireNonNull(updatedAt, "updatedAt");
    }

    /** Factory · cria um contato novo. */
    public static Contato create(PessoaId pessoaId, long tenantId, String nome, String email,
                                 String telefone, TipoRelacionamento tipoRelacionamento) {
        Instant now = Instant.now();
        return new Contato(ContatoId.generate(), pessoaId, tenantId, nome, email, telefone,
            tipoRelacionamento, now, now);
    }

    /** Factory de reconstrução · usado pelo adapter de persistência. */
    public static Contato reconstitute(ContatoId id, PessoaId pessoaId, long tenantId, String nome,
                                       String email, String telefone, TipoRelacionamento tipoRelacionamento,
                                       Instant createdAt, Instant updatedAt) {
        return new Contato(id, pessoaId, tenantId, nome, email, telefone, tipoRelacionamento,
            createdAt, updatedAt);
    }

    /** Atualiza os dados editáveis do contato. */
    public void update(String nome, String email, String telefone, TipoRelacionamento tipoRelacionamento) {
        this.nome = validateNome(nome);
        this.email = blankToNull(email);
        this.telefone = blankToNull(telefone);
        this.tipoRelacionamento = Objects.requireNonNull(tipoRelacionamento, "tipoRelacionamento");
        this.updatedAt = Instant.now();
    }

    // ============ Validações ============

    private static String validateNome(String nome) {
        Objects.requireNonNull(nome, "nome");
        String t = nome.trim();
        if (t.isEmpty()) throw new IllegalArgumentException("Nome do contato não pode ser vazio");
        if (t.length() > 160) throw new IllegalArgumentException("Nome muito longo (máximo 160)");
        return t;
    }

    private static String blankToNull(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }

    // ============ Getters ============

    @Override public ContatoId id() { return id; }
    public PessoaId pessoaId() { return pessoaId; }
    public long tenantId() { return tenantId; }
    public String nome() { return nome; }
    public Optional<String> email() { return Optional.ofNullable(email); }
    public Optional<String> telefone() { return Optional.ofNullable(telefone); }
    public TipoRelacionamento tipoRelacionamento() { return tipoRelacionamento; }
    public Instant createdAt() { return createdAt; }
    public Instant updatedAt() { return updatedAt; }
}

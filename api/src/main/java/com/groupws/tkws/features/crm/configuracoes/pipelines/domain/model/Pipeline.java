package com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model;

import com.groupws.tkws.shared.domain.AggregateRoot;

import java.time.Instant;
import java.util.Objects;

/**
 * Aggregate Root · Pipeline (funil) de Atendimento ou Proposta.
 *
 * `tenantId` é o BIGINT local (PK em tenants.id) · resolvido pelo
 * {@link com.groupws.tkws.shared.web.tenant.CurrentTenant}.
 *
 * Tem `modulo` (define onde aparece na UI) + ordem + descricao + ativo.
 * Diferente das lookup tables (ADR-020) porque carrega comportamento e
 * relaciona-se com Etapas. Ver ADR-018 para a regra de "etapa de conversão"
 * que promove Pessoa para Cliente.
 */
public final class Pipeline extends AggregateRoot<PipelineId> {

    private final PipelineId id;
    private final long tenantId;
    private String codigo;
    private String nome;
    private String descricao;
    private ModuloPipeline modulo;
    private int ordem;
    private boolean ativo;
    private final Instant createdAt;
    private Instant updatedAt;

    private Pipeline(PipelineId id, long tenantId, String codigo, String nome, String descricao,
                     ModuloPipeline modulo, int ordem, boolean ativo,
                     Instant createdAt, Instant updatedAt) {
        this.id = Objects.requireNonNull(id);
        if (tenantId <= 0) {
            throw new IllegalArgumentException("tenantId deve ser positivo · recebeu: " + tenantId);
        }
        this.tenantId = tenantId;
        this.codigo = required(codigo, "codigo");
        this.nome = required(nome, "nome");
        this.descricao = blankToNull(descricao);
        this.modulo = Objects.requireNonNull(modulo, "modulo");
        this.ordem = ordem;
        this.ativo = ativo;
        this.createdAt = Objects.requireNonNull(createdAt);
        this.updatedAt = Objects.requireNonNull(updatedAt);
    }

    public static Pipeline create(long tenantId, String codigo, String nome, String descricao,
                                  ModuloPipeline modulo, int ordem, boolean ativo) {
        Instant now = Instant.now();
        return new Pipeline(PipelineId.generate(), tenantId, codigo, nome, descricao,
            modulo, ordem, ativo, now, now);
    }

    public static Pipeline reconstitute(PipelineId id, long tenantId, String codigo, String nome,
                                        String descricao, ModuloPipeline modulo, int ordem,
                                        boolean ativo, Instant createdAt, Instant updatedAt) {
        return new Pipeline(id, tenantId, codigo, nome, descricao, modulo, ordem, ativo,
            createdAt, updatedAt);
    }

    public void update(String codigo, String nome, String descricao,
                       ModuloPipeline modulo, int ordem, boolean ativo) {
        this.codigo = required(codigo, "codigo");
        this.nome = required(nome, "nome");
        this.descricao = blankToNull(descricao);
        this.modulo = Objects.requireNonNull(modulo, "modulo");
        this.ordem = ordem;
        this.ativo = ativo;
        this.updatedAt = Instant.now();
    }

    private static String required(String s, String field) {
        Objects.requireNonNull(s, field);
        String t = s.trim();
        if (t.isEmpty()) throw new IllegalArgumentException(field + " não pode ser vazio");
        return t;
    }

    private static String blankToNull(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }

    @Override public PipelineId id() { return id; }
    public long tenantId() { return tenantId; }
    public String codigo() { return codigo; }
    public String nome() { return nome; }
    public String descricao() { return descricao; }
    public ModuloPipeline modulo() { return modulo; }
    public int ordem() { return ordem; }
    public boolean ativo() { return ativo; }
    public Instant createdAt() { return createdAt; }
    public Instant updatedAt() { return updatedAt; }
}

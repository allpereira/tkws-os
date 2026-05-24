package com.groupws.tkws.features.crm.configuracoes.etapas.domain.model;

import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.PipelineId;
import com.groupws.tkws.shared.domain.AggregateRoot;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

/**
 * Aggregate Root · Etapa de um Pipeline.
 *
 * Carrega a regra crítica do funil: a flag {@code converteLeadEmCliente}.
 * Quando uma Oportunidade entra numa Etapa com essa flag, o domínio de
 * Pessoas promove a Pessoa associada para CLIENTE (ver ADR-018).
 *
 * Por que não é uma lookup table (ADR-020)? Tem `cor`, `probabilidade`,
 * `tipo` (ABERTA/GANHA/PERDIDA), FK a pipeline e a flag de conversão.
 * São campos com semântica forte que justificam Aggregate Root próprio.
 */
public final class Etapa extends AggregateRoot<EtapaId> {

    private final EtapaId id;
    private final UUID tenantId;
    private final PipelineId pipelineId;
    private String codigo;
    private String nome;
    private String descricao;
    private String cor;
    private int probabilidade;
    private TipoEtapa tipo;
    private int ordem;
    private boolean converteLeadEmCliente;
    private boolean ativo;
    private final Instant createdAt;
    private Instant updatedAt;

    private Etapa(EtapaId id, UUID tenantId, PipelineId pipelineId, String codigo, String nome,
                  String descricao, String cor, int probabilidade, TipoEtapa tipo, int ordem,
                  boolean converteLeadEmCliente, boolean ativo,
                  Instant createdAt, Instant updatedAt) {
        this.id = Objects.requireNonNull(id);
        this.tenantId = Objects.requireNonNull(tenantId);
        this.pipelineId = Objects.requireNonNull(pipelineId);
        this.codigo = required(codigo, "codigo");
        this.nome = required(nome, "nome");
        this.descricao = blankToNull(descricao);
        this.cor = cor == null || cor.isBlank() ? "#74C7E4" : cor.trim();
        this.probabilidade = clamp(probabilidade);
        this.tipo = Objects.requireNonNull(tipo, "tipo");
        this.ordem = ordem;
        this.converteLeadEmCliente = converteLeadEmCliente;
        this.ativo = ativo;
        this.createdAt = Objects.requireNonNull(createdAt);
        this.updatedAt = Objects.requireNonNull(updatedAt);
    }

    public static Etapa create(UUID tenantId, PipelineId pipelineId, String codigo, String nome,
                               String descricao, String cor, int probabilidade, TipoEtapa tipo,
                               int ordem, boolean converteLeadEmCliente, boolean ativo) {
        Instant now = Instant.now();
        return new Etapa(EtapaId.generate(), tenantId, pipelineId, codigo, nome, descricao,
            cor, probabilidade, tipo, ordem, converteLeadEmCliente, ativo, now, now);
    }

    public static Etapa reconstitute(EtapaId id, UUID tenantId, PipelineId pipelineId, String codigo,
                                     String nome, String descricao, String cor, int probabilidade,
                                     TipoEtapa tipo, int ordem, boolean converteLeadEmCliente,
                                     boolean ativo, Instant createdAt, Instant updatedAt) {
        return new Etapa(id, tenantId, pipelineId, codigo, nome, descricao, cor, probabilidade,
            tipo, ordem, converteLeadEmCliente, ativo, createdAt, updatedAt);
    }

    public void update(String codigo, String nome, String descricao, String cor,
                       int probabilidade, TipoEtapa tipo, int ordem,
                       boolean converteLeadEmCliente, boolean ativo) {
        this.codigo = required(codigo, "codigo");
        this.nome = required(nome, "nome");
        this.descricao = blankToNull(descricao);
        if (cor != null && !cor.isBlank()) this.cor = cor.trim();
        this.probabilidade = clamp(probabilidade);
        this.tipo = Objects.requireNonNull(tipo, "tipo");
        this.ordem = ordem;
        this.converteLeadEmCliente = converteLeadEmCliente;
        this.ativo = ativo;
        this.updatedAt = Instant.now();
    }

    private static int clamp(int p) { return Math.max(0, Math.min(100, p)); }
    private static String required(String s, String f) {
        Objects.requireNonNull(s, f);
        String t = s.trim();
        if (t.isEmpty()) throw new IllegalArgumentException(f + " não pode ser vazio");
        return t;
    }
    private static String blankToNull(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }

    @Override public EtapaId id() { return id; }
    public UUID tenantId() { return tenantId; }
    public PipelineId pipelineId() { return pipelineId; }
    public String codigo() { return codigo; }
    public String nome() { return nome; }
    public String descricao() { return descricao; }
    public String cor() { return cor; }
    public int probabilidade() { return probabilidade; }
    public TipoEtapa tipo() { return tipo; }
    public int ordem() { return ordem; }
    public boolean converteLeadEmCliente() { return converteLeadEmCliente; }
    public boolean ativo() { return ativo; }
    public Instant createdAt() { return createdAt; }
    public Instant updatedAt() { return updatedAt; }
}

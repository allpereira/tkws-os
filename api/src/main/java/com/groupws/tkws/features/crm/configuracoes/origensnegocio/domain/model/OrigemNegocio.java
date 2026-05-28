package com.groupws.tkws.features.crm.configuracoes.origensnegocio.domain.model;

import com.groupws.tkws.shared.domain.AggregateRoot;

import java.time.Instant;
import java.util.Objects;

/**
 * Aggregate Root · Origem de Negócio (canal de origem de uma Oportunidade).
 *
 * `tenantId` é o BIGINT local (PK em tenants.id).
 *
 * Antes era um enum fixo no código ({@code OrigemNegocio} dentro de
 * `oportunidades`). Virou configuração de banco editável por tenant para que
 * cada escritório modele seus próprios canais (ver ADR-025).
 *
 * Por que não é uma lookup table (ADR-020)? Carrega duas flags com semântica
 * de regra de negócio:
 *  - {@code exigeParceiro}: a Oportunidade precisa de um parceiro indicador
 *    (ex.: "Indicação de Parceiro").
 *  - {@code exigeDetalhe}: a Oportunidade precisa de um texto livre detalhando
 *    a origem (ex.: "Outros").
 * Essas flags são consultadas pelo agregado Oportunidade na validação, então
 * a origem é um Aggregate Root próprio e não uma lookup de 3 campos.
 */
public final class OrigemNegocio extends AggregateRoot<OrigemNegocioId> {

    private final OrigemNegocioId id;
    private final long tenantId;
    private String codigo;
    private String nome;
    private boolean exigeParceiro;
    private boolean exigeDetalhe;
    private boolean ativo;
    private final Instant createdAt;
    private Instant updatedAt;

    private OrigemNegocio(OrigemNegocioId id, long tenantId, String codigo, String nome,
                          boolean exigeParceiro, boolean exigeDetalhe, boolean ativo,
                          Instant createdAt, Instant updatedAt) {
        this.id = Objects.requireNonNull(id);
        if (tenantId <= 0) {
            throw new IllegalArgumentException("tenantId deve ser positivo · recebeu: " + tenantId);
        }
        this.tenantId = tenantId;
        this.codigo = required(codigo, "codigo");
        this.nome = required(nome, "nome");
        this.exigeParceiro = exigeParceiro;
        this.exigeDetalhe = exigeDetalhe;
        this.ativo = ativo;
        this.createdAt = Objects.requireNonNull(createdAt);
        this.updatedAt = Objects.requireNonNull(updatedAt);
    }

    public static OrigemNegocio create(long tenantId, String codigo, String nome,
                                       boolean exigeParceiro, boolean exigeDetalhe, boolean ativo) {
        Instant now = Instant.now();
        return new OrigemNegocio(OrigemNegocioId.generate(), tenantId, codigo, nome,
            exigeParceiro, exigeDetalhe, ativo, now, now);
    }

    public static OrigemNegocio reconstitute(OrigemNegocioId id, long tenantId, String codigo,
                                             String nome, boolean exigeParceiro, boolean exigeDetalhe,
                                             boolean ativo, Instant createdAt, Instant updatedAt) {
        return new OrigemNegocio(id, tenantId, codigo, nome, exigeParceiro, exigeDetalhe, ativo,
            createdAt, updatedAt);
    }

    public void update(String codigo, String nome, boolean exigeParceiro, boolean exigeDetalhe,
                       boolean ativo) {
        this.codigo = required(codigo, "codigo");
        this.nome = required(nome, "nome");
        this.exigeParceiro = exigeParceiro;
        this.exigeDetalhe = exigeDetalhe;
        this.ativo = ativo;
        this.updatedAt = Instant.now();
    }

    private static String required(String s, String f) {
        Objects.requireNonNull(s, f);
        String t = s.trim();
        if (t.isEmpty()) throw new IllegalArgumentException(f + " não pode ser vazio");
        return t;
    }

    @Override public OrigemNegocioId id() { return id; }
    public long tenantId() { return tenantId; }
    public String codigo() { return codigo; }
    public String nome() { return nome; }
    public boolean exigeParceiro() { return exigeParceiro; }
    public boolean exigeDetalhe() { return exigeDetalhe; }
    public boolean ativo() { return ativo; }
    public Instant createdAt() { return createdAt; }
    public Instant updatedAt() { return updatedAt; }
}

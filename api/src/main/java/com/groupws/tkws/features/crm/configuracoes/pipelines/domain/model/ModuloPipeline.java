package com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model;

/**
 * Módulo em que o Pipeline opera no produto.
 *
 *   ATENDIMENTO · funil comercial · Lead → Cliente
 *   PROPOSTA    · desenvolvimento e fechamento de proposta
 *
 * Valor de banco usa snake_case minúsculo (`atendimento` | `proposta`).
 */
public enum ModuloPipeline {
    ATENDIMENTO("atendimento"),
    PROPOSTA("proposta");

    private final String dbValue;

    ModuloPipeline(String dbValue) { this.dbValue = dbValue; }

    public String dbValue() { return dbValue; }

    public static ModuloPipeline fromDb(String raw) {
        for (var m : values()) if (m.dbValue.equalsIgnoreCase(raw)) return m;
        throw new IllegalArgumentException("ModuloPipeline desconhecido: " + raw);
    }
}

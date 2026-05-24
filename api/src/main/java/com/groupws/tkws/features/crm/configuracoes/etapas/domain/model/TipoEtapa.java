package com.groupws.tkws.features.crm.configuracoes.etapas.domain.model;

/**
 * Categoria da Etapa no funil:
 *
 *   ABERTA   · etapa intermediária · oportunidade em andamento
 *   GANHA    · etapa terminal positiva · sinaliza fechamento bem-sucedido
 *   PERDIDA  · etapa terminal negativa · sinaliza perda da oportunidade
 *
 * Valores em DB: `aberta` | `ganha` | `perdida`.
 */
public enum TipoEtapa {
    ABERTA("aberta"),
    GANHA("ganha"),
    PERDIDA("perdida");

    private final String dbValue;
    TipoEtapa(String v) { this.dbValue = v; }
    public String dbValue() { return dbValue; }

    public static TipoEtapa fromDb(String raw) {
        for (var t : values()) if (t.dbValue.equalsIgnoreCase(raw)) return t;
        throw new IllegalArgumentException("TipoEtapa desconhecido: " + raw);
    }
}

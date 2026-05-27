package com.groupws.tkws.features.pessoas.domain.port;

/**
 * Critérios de ordenação suportados pela listagem de Pessoas.
 *
 * Enum fechado (em vez de aceitar uma string `sort` arbitrária do cliente)
 * para não expor campos da entidade nem permitir ordenação por coluna não
 * indexada. O adapter traduz cada valor para um {@code Sort} do Spring Data.
 */
public enum PessoaSort {
    /** Mais recentes primeiro · `createdAt` desc. Default. */
    RECENTE,
    /** Nome do contato em ordem alfabética · `nomeContato` asc. */
    NOME,
    /** Convertido mais recente primeiro · `convertidoEm` desc (útil em Clientes). */
    CONVERSAO;

    /** Resolve a partir da string do query param · valor inválido/ausente cai em {@link #RECENTE}. */
    public static PessoaSort fromOrDefault(String raw) {
        if (raw == null || raw.isBlank()) return RECENTE;
        try {
            return valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return RECENTE;
        }
    }
}

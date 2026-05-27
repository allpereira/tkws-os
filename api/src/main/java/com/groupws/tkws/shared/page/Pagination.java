package com.groupws.tkws.shared.page;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

/**
 * Helpers de paginação compartilhados (ver ADR-022).
 *
 * Centraliza o que antes estava repetido em cada controller/adapter:
 *   - clamp de {@code limit} (1..MAX) e {@code offset} (>= 0)
 *   - conversão do par {@code limit/offset} para o {@code Pageable} do Spring Data
 *
 * O contrato HTTP do projeto é offset-based (envelope {@link PageResponse}),
 * mas o Spring Data é page-based: convertemos via {@code page = offset / limit}.
 * O frontend sempre navega em offsets múltiplos de limit, então a conversão é exata.
 */
public final class Pagination {

    /** Teto duro de itens por página · protege o banco de scans gigantes. */
    public static final int MAX_LIMIT = 100;

    /** Tamanho de página padrão quando o cliente não informa {@code limit}. */
    public static final int DEFAULT_LIMIT = 50;

    private Pagination() {}

    public static int clampLimit(int limit) {
        return clampLimit(limit, MAX_LIMIT);
    }

    public static int clampLimit(int limit, int max) {
        return Math.max(1, Math.min(limit, max));
    }

    public static int clampOffset(int offset) {
        return Math.max(0, offset);
    }

    /** Monta um {@link PageRequest} a partir de {@code limit/offset} já saneados, com ordenação. */
    public static PageRequest pageRequest(int limit, int offset, Sort sort) {
        int safeLimit = clampLimit(limit);
        int safeOffset = clampOffset(offset);
        return PageRequest.of(safeOffset / safeLimit, safeLimit, sort);
    }
}

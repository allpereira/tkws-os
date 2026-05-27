package com.groupws.tkws.shared.page;

import java.util.List;

/**
 * Envelope genérico de listagem paginada (ver ADR-022).
 *
 * Contrato HTTP padrão do projeto para qualquer endpoint de listagem:
 * <pre>
 * { "content": [...], "limit": 50, "offset": 0, "total": 137, "hasNext": true }
 * </pre>
 *
 * Tipo puro (sem Spring/JPA): pode ser usado por application e web sem violar
 * fronteiras. A conversão offset/limit ↔ {@code Pageable} fica no adapter JPA.
 */
public record PageResponse<T>(
    List<T> content,
    int limit,
    int offset,
    long total,
    boolean hasNext
) {
    public PageResponse {
        content = content == null ? List.of() : List.copyOf(content);
    }

    /** Monta o envelope calculando {@code hasNext} a partir de offset + tamanho da página. */
    public static <T> PageResponse<T> of(List<T> content, int limit, int offset, long total) {
        int size = content == null ? 0 : content.size();
        boolean hasNext = (long) offset + size < total;
        return new PageResponse<>(content, limit, offset, total, hasNext);
    }
}

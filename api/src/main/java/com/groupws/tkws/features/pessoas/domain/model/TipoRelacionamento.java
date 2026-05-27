package com.groupws.tkws.features.pessoas.domain.model;

import java.util.Arrays;
import java.util.List;

/**
 * Natureza do vínculo entre um {@link Contato} e a {@link Pessoa} dona.
 *
 * O conjunto de valores válidos depende do {@link TipoPessoa} do dono (ADR-023):
 *
 *   PJ (empresa) · SOCIO, REPRESENTANTE_LEGAL
 *   PF (pessoa)  · PARENTE, PAI, MAE, FILHO, FILHA, CONJUGE, OUTROS
 *
 * Cada valor declara a qual {@link TipoPessoa} se aplica. A compatibilidade
 * "relacionamento × tipo da pessoa" é validada no use case (que conhece o dono).
 */
public enum TipoRelacionamento {

    // ---- PJ ----
    SOCIO(TipoPessoa.PJ),
    REPRESENTANTE_LEGAL(TipoPessoa.PJ),

    // ---- PF ----
    PARENTE(TipoPessoa.PF),
    PAI(TipoPessoa.PF),
    MAE(TipoPessoa.PF),
    FILHO(TipoPessoa.PF),
    FILHA(TipoPessoa.PF),
    CONJUGE(TipoPessoa.PF),
    OUTROS(TipoPessoa.PF);

    private final TipoPessoa aplicaA;

    TipoRelacionamento(TipoPessoa aplicaA) {
        this.aplicaA = aplicaA;
    }

    public TipoPessoa aplicaA() {
        return aplicaA;
    }

    /** {@code true} se este relacionamento pode ser usado para uma Pessoa do tipo informado. */
    public boolean validoPara(TipoPessoa tipoPessoa) {
        return this.aplicaA == tipoPessoa;
    }

    /** Relacionamentos aplicáveis a um dado tipo de pessoa (PF ou PJ). */
    public static List<TipoRelacionamento> paraTipoPessoa(TipoPessoa tipoPessoa) {
        return Arrays.stream(values()).filter(r -> r.aplicaA == tipoPessoa).toList();
    }
}

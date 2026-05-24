package com.groupws.tkws.features.pessoas.domain.model;

/**
 * Estado da Pessoa no funil comercial.
 *
 *   LEAD     · ainda não fechou nenhuma proposta · estado inicial
 *   CLIENTE  · fechou ao menos uma proposta · promovido automaticamente
 *              quando uma Oportunidade entra numa etapa com
 *              `converte_lead_em_cliente = true`
 *
 * Ver ADR-018.
 */
public enum StatusPessoa {
    LEAD,
    CLIENTE,
    FORNECEDOR,
    PARCEIRO;

    public boolean isLead() { return this == LEAD; }
    public boolean isCliente() { return this == CLIENTE; }
}

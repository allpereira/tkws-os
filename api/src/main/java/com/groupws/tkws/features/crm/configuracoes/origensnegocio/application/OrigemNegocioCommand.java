package com.groupws.tkws.features.crm.configuracoes.origensnegocio.application;

/**
 * Entrada de criação/atualização de Origem de Negócio · já com defaults
 * aplicados (a web monta via {@code OrigemNegocioRequest.toCommand()}).
 */
public record OrigemNegocioCommand(
    String codigo,
    String nome,
    boolean exigeParceiro,
    boolean exigeDetalhe,
    boolean ativo
) {}

package com.groupws.tkws.features.invites.domain.port;

import com.groupws.tkws.features.invites.domain.model.InviteRole;

/**
 * Port do domínio para o IdP externo (hoje: Zitadel).
 * Mantém o domínio livre de qualquer detalhe HTTP/SDK do provider.
 */
public interface IdentityProvider {

    /**
     * Cria um "user shell" no IdP — sem senha, com email pré-verificado.
     * Retorna o ID do user no provider (zitadel_id).
     */
    String createShellUser(String zitadelOrgId, String email, String fullName);

    /**
     * Define a senha de um user existente no IdP. Operação idempotente
     * do ponto de vista do invite: chamar várias vezes é ok.
     */
    void setPassword(String userId, String password);

    /**
     * Atribui um role do projeto TKWS OS ao user dentro da org do tenant.
     */
    void grantProjectRole(String userId, String zitadelOrgId, InviteRole role);
}

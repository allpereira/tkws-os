package com.groupws.tkws.features.invites.domain.model;

import java.util.Locale;

/**
 * Roles disponíveis para convidar dentro de um tenant.
 *
 * Espelha o conjunto definido em docs/04-AUTH.md seção "Roles do projeto".
 * SYSTEM_ADMIN é excluído porque só Group WS atribui esse role.
 *
 * `default` é a role base atribuída a qualquer convidado · o usuário entra
 * podendo ver os próprios dados (ex.: /users/me) mas sem permissão em rotas
 * com `@PreAuthorize`. Funciona como gate de UI · o frontend usa pra ligar
 * menus/funcionalidades conforme as outras roles que o usuário tiver.
 */
public enum InviteRole {
    ORG_ADMIN("org_admin"),
    COMERCIAL_ATENDIMENTO("comercial_atendimento"),
    COMERCIAL_PROPOSTA("comercial_proposta"),
    DEFAULT("default");

    private final String key;

    InviteRole(String key) {
        this.key = key;
    }

    /** Chave em snake_case usada no Zitadel e na coluna `role` da tabela. */
    public String key() {
        return key;
    }

    public static InviteRole fromKey(String raw) {
        if (raw == null) {
            throw new IllegalArgumentException("role não pode ser nula");
        }
        String normalized = raw.trim().toLowerCase(Locale.ROOT);
        for (InviteRole r : values()) {
            if (r.key.equals(normalized)) {
                return r;
            }
        }
        throw new IllegalArgumentException("Role inválido: " + raw);
    }
}

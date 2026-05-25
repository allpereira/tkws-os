package com.groupws.tkws.features.invites.application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

/**
 * Comando para criar um convite.
 * O admin precisa estar autenticado e ter permissão sobre o tenantId informado.
 *
 * `tenantId` é o BIGINT local (não o zitadel_org_id).
 */
public record CreateInviteCommand(
    @Positive long tenantId,
    @NotBlank @Email @Size(max = 255) String email,
    @Size(max = 255) String fullName,
    @NotBlank String role
) {}

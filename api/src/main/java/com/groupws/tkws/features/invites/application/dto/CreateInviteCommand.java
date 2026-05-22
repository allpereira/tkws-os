package com.groupws.tkws.features.invites.application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

/**
 * Comando para criar um convite.
 * O admin precisa estar autenticado e ter permissão sobre o tenantId informado.
 */
public record CreateInviteCommand(
    @NotNull UUID tenantId,
    @NotBlank @Email @Size(max = 255) String email,
    @Size(max = 255) String fullName,
    @NotBlank String role
) {}

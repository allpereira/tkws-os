package com.groupws.tkws.features.invites.application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Comando para criar um convite.
 *
 * <p>O tenant <strong>não</strong> vem no body — é resolvido pelo controller via
 * {@code @CurrentTenant} (JWT do Zitadel ou header {@code X-Tenant-Id} para
 * SYSTEM_ADMIN) e injetado no use case. Aceitar tenantId do cliente abriria
 * escalonamento cross-tenant (ver ADR-019 e docs/15-API-BEST-PRACTICES.md).
 */
public record CreateInviteCommand(
    @NotBlank @Email @Size(max = 255) String email,
    @Size(max = 255) String fullName,
    @NotBlank String role
) {}

package com.groupws.tkws.features.invites.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Comando público enviado pela tela /accept-invite — o convidado completa o cadastro.
 *
 * O token é validado server-side (hash bate, status PENDING, não expirado).
 * A senha mínima de 12 caracteres está alinhada com a Login Policy do Zitadel
 * (ver docs/04-AUTH.md).
 */
public record AcceptInviteCommand(
    @NotBlank String token,
    @NotBlank @Size(max = 255) String fullName,
    @NotBlank @Size(min = 12, max = 256) String password
) {}

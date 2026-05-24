package com.groupws.tkws.shared.crud;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Body de create/update das lookup tables.
 *
 * `ativo` é opcional na request — `null` significa `true` no create
 * (default ativo).
 */
public record LookupRequest(
    @NotBlank @Size(max = 40) String codigo,
    @NotBlank @Size(max = 160) String nome,
    Boolean ativo
) {}

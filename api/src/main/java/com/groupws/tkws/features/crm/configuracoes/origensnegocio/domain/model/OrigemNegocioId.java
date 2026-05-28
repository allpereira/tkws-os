package com.groupws.tkws.features.crm.configuracoes.origensnegocio.domain.model;

import java.util.Objects;
import java.util.UUID;

public record OrigemNegocioId(UUID value) {
    public OrigemNegocioId { Objects.requireNonNull(value, "OrigemNegocioId"); }
    public static OrigemNegocioId generate() { return new OrigemNegocioId(UUID.randomUUID()); }
    public static OrigemNegocioId of(UUID v) { return new OrigemNegocioId(v); }
}

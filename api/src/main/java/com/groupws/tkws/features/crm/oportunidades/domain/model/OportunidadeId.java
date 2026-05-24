package com.groupws.tkws.features.crm.oportunidades.domain.model;

import java.util.Objects;
import java.util.UUID;

public record OportunidadeId(UUID value) {
    public OportunidadeId { Objects.requireNonNull(value, "OportunidadeId"); }
    public static OportunidadeId generate() { return new OportunidadeId(UUID.randomUUID()); }
    public static OportunidadeId of(UUID v) { return new OportunidadeId(v); }
}

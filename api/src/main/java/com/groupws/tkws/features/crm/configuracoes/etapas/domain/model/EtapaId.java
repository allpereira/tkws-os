package com.groupws.tkws.features.crm.configuracoes.etapas.domain.model;

import java.util.Objects;
import java.util.UUID;

public record EtapaId(UUID value) {
    public EtapaId { Objects.requireNonNull(value, "EtapaId"); }
    public static EtapaId generate() { return new EtapaId(UUID.randomUUID()); }
    public static EtapaId of(UUID v) { return new EtapaId(v); }
}

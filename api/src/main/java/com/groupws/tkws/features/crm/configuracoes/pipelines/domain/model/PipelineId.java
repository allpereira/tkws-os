package com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model;

import java.util.Objects;
import java.util.UUID;

public record PipelineId(UUID value) {
    public PipelineId { Objects.requireNonNull(value, "PipelineId"); }
    public static PipelineId generate() { return new PipelineId(UUID.randomUUID()); }
    public static PipelineId of(UUID v) { return new PipelineId(v); }
}

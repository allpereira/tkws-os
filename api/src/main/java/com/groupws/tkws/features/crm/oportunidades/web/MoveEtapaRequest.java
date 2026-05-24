package com.groupws.tkws.features.crm.oportunidades.web;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

/** Body do endpoint dedicado de movimentação de etapa (POST /{id}/mover). */
public record MoveEtapaRequest(@NotNull UUID etapaId) {}

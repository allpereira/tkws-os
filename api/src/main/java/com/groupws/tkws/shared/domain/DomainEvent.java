package com.groupws.tkws.shared.domain;

import java.time.Instant;
import java.util.UUID;

/**
 * Marker interface para eventos de domínio.
 * Eventos são publicados pelos agregados e processados na camada de application.
 */
public interface DomainEvent {
    UUID eventId();
    Instant occurredOn();
}

package com.groupws.tkws.features.crm.oportunidades.domain.port;

import java.util.Optional;
import java.util.UUID;

/**
 * Port que o módulo de Oportunidades usa para consultar as flags de uma
 * Origem de Negócio (`exige_parceiro` / `exige_detalhe`) na hora de validar
 * uma Oportunidade. Implementação concreta vive em
 * `oportunidades/infrastructure/` e delega ao módulo Origens de Negócio via
 * seu service público (não acopla JPA diretamente).
 *
 * Mesmo padrão de {@link EtapaLookup}: mantém o limite entre features ·
 * Oportunidades não importa a entity JPA de Origens, só pergunta o que precisa.
 */
public interface OrigemLookup {
    Optional<OrigemInfo> findOrigem(long tenantId, UUID origemId);

    record OrigemInfo(UUID id, boolean exigeParceiro, boolean exigeDetalhe) {}
}

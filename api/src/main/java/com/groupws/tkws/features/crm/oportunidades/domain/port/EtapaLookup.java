package com.groupws.tkws.features.crm.oportunidades.domain.port;

import com.groupws.tkws.features.crm.configuracoes.etapas.domain.model.EtapaId;

import java.util.Optional;

/**
 * Port que o módulo de Oportunidades usa para consultar a flag
 * `converte_lead_em_cliente` de uma Etapa quando uma Oportunidade é
 * movida. Implementação concreta vive em
 * `oportunidades/infrastructure/` e delega ao módulo Etapas via
 * `EtapaService` (pelo seu domain · não acopla JPA diretamente).
 *
 * Mantém o limite: Oportunidades não importa entity JPA de Etapas, nem
 * conhece sua estrutura interna · só pergunta uma coisa específica.
 */
public interface EtapaLookup {
    Optional<EtapaInfo> findEtapa(long tenantId, EtapaId etapaId);

    record EtapaInfo(EtapaId id, boolean converteLeadEmCliente) {}
}

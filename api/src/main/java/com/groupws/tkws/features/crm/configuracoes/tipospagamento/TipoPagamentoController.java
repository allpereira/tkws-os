package com.groupws.tkws.features.crm.configuracoes.tipospagamento;

import com.groupws.tkws.shared.crud.LookupController;
import com.groupws.tkws.shared.crud.LookupService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Tipos de Pagamento · `/api/v1/crm/tipos-pagamento`.
 * Lookup table simples · CRUD via {@link LookupController}. Ver ADR-020.
 */
@RestController
@RequestMapping("/api/v1/crm/tipos-pagamento")
@PreAuthorize("hasRole('ORG_ADMIN')")
class TipoPagamentoController extends LookupController<TipoPagamentoJpaEntity> {
    TipoPagamentoController(TipoPagamentoJpaRepository repository) {
        super(new LookupService<>("tipos_pagamento", repository, TipoPagamentoJpaEntity::new), "/api/v1/crm/tipos-pagamento");
    }
}

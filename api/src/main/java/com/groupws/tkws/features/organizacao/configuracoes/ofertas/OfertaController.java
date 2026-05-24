package com.groupws.tkws.features.organizacao.configuracoes.ofertas;

import com.groupws.tkws.shared.crud.LookupController;
import com.groupws.tkws.shared.crud.LookupService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Catálogo de Ofertas · `/api/v1/organizacao/ofertas`.
 *
 * Lookup table simples · CRUD via {@link LookupController}.
 * Ver ADR-020.
 */
@RestController
@RequestMapping("/api/v1/organizacao/ofertas")
@PreAuthorize("hasAnyRole('ORG_ADMIN', 'PROJECT_MANAGER', 'ARCHITECT')")
class OfertaController extends LookupController<OfertaJpaEntity> {

    OfertaController(OfertaJpaRepository repository) {
        super(new LookupService<>("ofertas", repository, OfertaJpaEntity::new), "/api/v1/organizacao/ofertas");
    }
}

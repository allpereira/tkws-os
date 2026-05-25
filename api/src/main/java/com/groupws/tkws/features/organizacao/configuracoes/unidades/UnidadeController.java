package com.groupws.tkws.features.organizacao.configuracoes.unidades;

import com.groupws.tkws.shared.crud.LookupController;
import com.groupws.tkws.shared.crud.LookupService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Unidades · `/api/v1/organizacao/unidades`.
 * Lookup table simples · CRUD via {@link LookupController}. Ver ADR-020.
 */
@RestController
@RequestMapping("/api/v1/organizacao/unidades")
@PreAuthorize("hasRole('ORG_ADMIN')")
class UnidadeController extends LookupController<UnidadeJpaEntity> {
    UnidadeController(UnidadeJpaRepository repository) {
        super(new LookupService<>("unidades", repository, UnidadeJpaEntity::new), "/api/v1/organizacao/unidades");
    }
}

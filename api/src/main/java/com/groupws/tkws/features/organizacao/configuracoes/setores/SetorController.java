package com.groupws.tkws.features.organizacao.configuracoes.setores;

import com.groupws.tkws.shared.crud.LookupController;
import com.groupws.tkws.shared.crud.LookupService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Setores · `/api/v1/organizacao/setores`.
 * Lookup table simples · CRUD via {@link LookupController}. Ver ADR-020.
 */
@RestController
@RequestMapping("/api/v1/organizacao/setores")
@PreAuthorize("hasRole('ORG_ADMIN')")
class SetorController extends LookupController<SetorJpaEntity> {
    SetorController(SetorJpaRepository repository) {
        super(new LookupService<>("setores", repository, SetorJpaEntity::new), "/api/v1/organizacao/setores");
    }
}

package com.groupws.tkws.features.organizacao.configuracoes.empreendimentos;

import com.groupws.tkws.shared.crud.LookupController;
import com.groupws.tkws.shared.crud.LookupService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Empreendimentos · `/api/v1/organizacao/empreendimentos`.
 * Lookup table simples · CRUD via {@link LookupController}. Ver ADR-020.
 */
@RestController
@RequestMapping("/api/v1/organizacao/empreendimentos")
@PreAuthorize("hasAnyRole('ORG_ADMIN', 'PROJECT_MANAGER', 'ARCHITECT')")
class EmpreendimentoController extends LookupController<EmpreendimentoJpaEntity> {
    EmpreendimentoController(EmpreendimentoJpaRepository repository) {
        super(new LookupService<>("empreendimentos", repository, EmpreendimentoJpaEntity::new), "/api/v1/organizacao/empreendimentos");
    }
}

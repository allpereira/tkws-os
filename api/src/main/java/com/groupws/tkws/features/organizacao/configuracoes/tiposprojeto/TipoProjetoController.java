package com.groupws.tkws.features.organizacao.configuracoes.tiposprojeto;

import com.groupws.tkws.shared.crud.LookupController;
import com.groupws.tkws.shared.crud.LookupService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Tipos de Projeto · `/api/v1/organizacao/tipos-projeto`.
 * Lookup table simples · CRUD via {@link LookupController}. Ver ADR-020.
 */
@RestController
@RequestMapping("/api/v1/organizacao/tipos-projeto")
@PreAuthorize("hasAnyRole('ORG_ADMIN', 'PROJECT_MANAGER', 'ARCHITECT')")
class TipoProjetoController extends LookupController<TipoProjetoJpaEntity> {
    TipoProjetoController(TipoProjetoJpaRepository repository) {
        super(new LookupService<>("tipos_projeto", repository, TipoProjetoJpaEntity::new), "/api/v1/organizacao/tipos-projeto");
    }
}

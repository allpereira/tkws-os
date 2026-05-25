package com.groupws.tkws.features.organizacao.configuracoes.tiposempresa;

import com.groupws.tkws.shared.crud.LookupController;
import com.groupws.tkws.shared.crud.LookupService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Tipos de Empresa · `/api/v1/organizacao/tipos-empresa`.
 * Lookup table simples · CRUD via {@link LookupController}. Ver ADR-020.
 */
@RestController
@RequestMapping("/api/v1/organizacao/tipos-empresa")
@PreAuthorize("hasRole('ORG_ADMIN')")
class TipoEmpresaController extends LookupController<TipoEmpresaJpaEntity> {
    TipoEmpresaController(TipoEmpresaJpaRepository repository) {
        super(new LookupService<>("tipos_empresa", repository, TipoEmpresaJpaEntity::new), "/api/v1/organizacao/tipos-empresa");
    }
}

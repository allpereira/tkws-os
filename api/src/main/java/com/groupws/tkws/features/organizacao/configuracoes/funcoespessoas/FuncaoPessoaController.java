package com.groupws.tkws.features.organizacao.configuracoes.funcoespessoas;

import com.groupws.tkws.shared.crud.LookupController;
import com.groupws.tkws.shared.crud.LookupService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Funções de Pessoas · `/api/v1/organizacao/funcoes-pessoas`.
 * Lookup table simples · CRUD via {@link LookupController}. Ver ADR-020.
 */
@RestController
@RequestMapping("/api/v1/organizacao/funcoes-pessoas")
@PreAuthorize("hasAnyRole('ORG_ADMIN', 'PROJECT_MANAGER', 'ARCHITECT')")
class FuncaoPessoaController extends LookupController<FuncaoPessoaJpaEntity> {
    FuncaoPessoaController(FuncaoPessoaJpaRepository repository) {
        super(new LookupService<>("funcoes_pessoas", repository, FuncaoPessoaJpaEntity::new), "/api/v1/organizacao/funcoes-pessoas");
    }
}

package com.groupws.tkws.features.pessoas.web;

import java.net.URI;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.groupws.tkws.features.pessoas.application.dto.ContatoView;
import com.groupws.tkws.features.pessoas.application.usecase.ListContatosUseCase;
import com.groupws.tkws.features.pessoas.application.usecase.ManageContatosUseCase;
import com.groupws.tkws.features.pessoas.domain.model.ContatoId;
import com.groupws.tkws.features.pessoas.domain.model.PessoaId;
import com.groupws.tkws.features.pessoas.web.dto.ContatoRequest;
import com.groupws.tkws.shared.web.tenant.CurrentTenant;
import com.groupws.tkws.shared.web.tenant.TenantContext;

import jakarta.validation.Valid;

/**
 * REST API · contatos de uma Pessoa (sócios/representante para PJ; parentes/
 * cônjuge para PF). Aninhado sob a Pessoa dona. Ver ADR-023.
 *
 * Multi-tenancy via `@CurrentTenant` (ADR-019). Mesmas roles do
 * {@link PessoaController}.
 *
 *   GET    /api/v1/pessoas/{pessoaId}/contatos        · lista
 *   POST   /api/v1/pessoas/{pessoaId}/contatos        · adiciona
 *   PATCH  /api/v1/pessoas/{pessoaId}/contatos/{id}   · edita
 *   DELETE /api/v1/pessoas/{pessoaId}/contatos/{id}   · remove
 */
@RestController
@RequestMapping("/api/v1/pessoas/{pessoaId}/contatos")
@PreAuthorize("hasAnyRole('ORG_ADMIN', 'COMERCIAL_ATENDIMENTO', 'COMERCIAL_PROPOSTA')")
class ContatoController {

    private final ManageContatosUseCase manageContatos;
    private final ListContatosUseCase listContatos;

    ContatoController(ManageContatosUseCase manageContatos, ListContatosUseCase listContatos) {
        this.manageContatos = manageContatos;
        this.listContatos = listContatos;
    }

    @GetMapping
    public ResponseEntity<List<ContatoView>> list(
        @PathVariable UUID pessoaId,
        @CurrentTenant TenantContext tenant
    ) {
        return ResponseEntity.ok(listContatos.byPessoa(tenant.tenantId(), PessoaId.of(pessoaId)));
    }

    @PostMapping
    public ResponseEntity<ContatoView> add(
        @PathVariable UUID pessoaId,
        @CurrentTenant TenantContext tenant,
        @Valid @RequestBody ContatoRequest request
    ) {
        ContatoView created = manageContatos.add(
            tenant.tenantId(), PessoaId.of(pessoaId), request.toCommand());
        return ResponseEntity
            .created(URI.create("/api/v1/pessoas/" + pessoaId + "/contatos/" + created.id()))
            .body(created);
    }

    @PatchMapping("/{contatoId}")
    public ResponseEntity<ContatoView> update(
        @PathVariable UUID pessoaId,
        @PathVariable UUID contatoId,
        @CurrentTenant TenantContext tenant,
        @Valid @RequestBody ContatoRequest request
    ) {
        ContatoView updated = manageContatos.update(
            tenant.tenantId(), PessoaId.of(pessoaId), ContatoId.of(contatoId), request.toCommand());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{contatoId}")
    public ResponseEntity<Void> remove(
        @PathVariable UUID pessoaId,
        @PathVariable UUID contatoId,
        @CurrentTenant TenantContext tenant
    ) {
        manageContatos.remove(tenant.tenantId(), PessoaId.of(pessoaId), ContatoId.of(contatoId));
        return ResponseEntity.noContent().build();
    }
}

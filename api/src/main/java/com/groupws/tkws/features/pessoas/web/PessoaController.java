package com.groupws.tkws.features.pessoas.web;

import java.net.URI;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.groupws.tkws.features.pessoas.application.dto.DedupResult;
import com.groupws.tkws.features.pessoas.application.dto.PessoaView;
import com.groupws.tkws.features.pessoas.application.usecase.CheckDuplicidadePessoaUseCase;
import com.groupws.tkws.features.pessoas.application.usecase.ConvertPessoaToClienteUseCase;
import com.groupws.tkws.features.pessoas.application.usecase.CreatePessoaUseCase;
import com.groupws.tkws.features.pessoas.application.usecase.FindPessoaUseCase;
import com.groupws.tkws.features.pessoas.domain.model.PessoaId;
import com.groupws.tkws.features.pessoas.domain.model.StatusPessoa;
import com.groupws.tkws.features.pessoas.domain.model.TipoPessoa;
import com.groupws.tkws.features.pessoas.web.dto.CreatePessoaRequest;
import com.groupws.tkws.shared.web.tenant.CurrentTenant;
import com.groupws.tkws.shared.web.tenant.TenantContext;

import jakarta.validation.Valid;

/**
 * REST API · cadastro único de Pessoas (Lead/Cliente).
 *
 * Multi-tenancy: o tenant é resolvido automaticamente via `@CurrentTenant`
 * (lê do JWT do Zitadel ou header `X-Tenant-Id` para SYSTEM_ADMIN). **Nunca
 * é aceito como query param ou body** — evita escalonamento via parâmetro
 * adulterado. Ver ADR-019.
 *
 * Endpoints públicos:
 *   GET    /api/v1/pessoas                  · lista (filtra por status)
 *   GET    /api/v1/pessoas/{id}             · busca por ID
 *   GET    /api/v1/pessoas/buscar           · dedup (documento exato + soft)
 *   POST   /api/v1/pessoas                  · cria como LEAD
 *   POST   /api/v1/pessoas/{id}/converter   · promove LEAD → CLIENTE
 */
@RestController
@RequestMapping("/api/v1/pessoas")
@PreAuthorize("hasAnyRole('ORG_ADMIN', 'COMERCIAL_ATENDIMENTO', 'COMERCIAL_PROPOSTA')")
class PessoaController {

    private final CreatePessoaUseCase createPessoa;
    private final FindPessoaUseCase findPessoa;
    private final CheckDuplicidadePessoaUseCase checkDuplicidade;
    private final ConvertPessoaToClienteUseCase convertToCliente;

    PessoaController(CreatePessoaUseCase createPessoa,
                     FindPessoaUseCase findPessoa,
                     CheckDuplicidadePessoaUseCase checkDuplicidade,
                     ConvertPessoaToClienteUseCase convertToCliente) {
        this.createPessoa = createPessoa;
        this.findPessoa = findPessoa;
        this.checkDuplicidade = checkDuplicidade;
        this.convertToCliente = convertToCliente;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ORG_ADMIN', 'COMERCIAL_ATENDIMENTO', 'COMERCIAL_PROPOSTA')")
    public ResponseEntity<List<PessoaView>> list(
        @CurrentTenant TenantContext tenant,
        @RequestParam(required = false) StatusPessoa status,
        @RequestParam(defaultValue = "50") int limit,
        @RequestParam(defaultValue = "0") int offset
    ) {
        return ResponseEntity.ok(findPessoa.list(tenant.tenantId(), status, limit, offset));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ORG_ADMIN', 'COMERCIAL_ATENDIMENTO', 'COMERCIAL_PROPOSTA')")
    public ResponseEntity<PessoaView> findById(
        @PathVariable UUID id,
        @CurrentTenant TenantContext tenant
    ) {
        return ResponseEntity.ok(findPessoa.byId(tenant.tenantId(), PessoaId.of(id)));
    }

    /**
     * Detecção de duplicidade · chamado pelo frontend ANTES de criar Lead.
     * Comportamento detalhado em ADR-018.
     */
    @GetMapping("/buscar")
    @PreAuthorize("hasAnyRole('ORG_ADMIN', 'COMERCIAL_ATENDIMENTO', 'COMERCIAL_PROPOSTA')")
    public ResponseEntity<DedupResult> buscar(
        @CurrentTenant TenantContext tenant,
        @RequestParam(required = false) TipoPessoa tipoPessoa,
        @RequestParam(required = false) String documento,
        @RequestParam(required = false) String email,
        @RequestParam(required = false) String celular
    ) {
        DedupResult result = checkDuplicidade.execute(
            tenant.tenantId(), tipoPessoa, documento, email, celular);
        return ResponseEntity.ok(result);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ORG_ADMIN', 'COMERCIAL_ATENDIMENTO', 'COMERCIAL_PROPOSTA')")
    public ResponseEntity<PessoaView> create(
        @CurrentTenant TenantContext tenant,
        @Valid @RequestBody CreatePessoaRequest request
    ) {
        PessoaView created = createPessoa.execute(request.toCommand(tenant.tenantId()));
        return ResponseEntity
            .created(URI.create("/api/v1/pessoas/" + created.id()))
            .body(created);
    }

    /**
     * Promove Pessoa de LEAD para CLIENTE. Idempotente.
     */
    @PostMapping("/{id}/converter")
    @PreAuthorize("hasAnyRole('ORG_ADMIN', 'COMERCIAL_ATENDIMENTO', 'COMERCIAL_PROPOSTA')")
    public ResponseEntity<PessoaView> converter(
        @PathVariable UUID id,
        @CurrentTenant TenantContext tenant
    ) {
        PessoaView updated = convertToCliente.execute(tenant.tenantId(), PessoaId.of(id));
        return ResponseEntity.ok(updated);
    }
}

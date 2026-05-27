package com.groupws.tkws.features.pessoas.web;

import java.net.URI;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.groupws.tkws.features.pessoas.application.dto.DedupResult;
import com.groupws.tkws.features.pessoas.application.dto.PessoaSearchView;
import com.groupws.tkws.features.pessoas.application.dto.PessoaView;
import com.groupws.tkws.features.pessoas.application.usecase.CheckDuplicidadePessoaUseCase;
import com.groupws.tkws.features.pessoas.application.usecase.ConvertPessoaToClienteUseCase;
import com.groupws.tkws.features.pessoas.application.usecase.CreatePessoaUseCase;
import com.groupws.tkws.features.pessoas.application.usecase.FindPessoaUseCase;
import com.groupws.tkws.features.pessoas.application.usecase.UpdatePessoaUseCase;
import com.groupws.tkws.features.pessoas.domain.model.PessoaId;
import com.groupws.tkws.features.pessoas.domain.model.StatusPessoa;
import com.groupws.tkws.features.pessoas.domain.model.TipoPessoa;
import com.groupws.tkws.features.pessoas.domain.port.PessoaListCriteria;
import com.groupws.tkws.features.pessoas.domain.port.PessoaSort;
import com.groupws.tkws.features.pessoas.web.dto.CreatePessoaRequest;
import com.groupws.tkws.features.pessoas.web.dto.UpdatePessoaRequest;
import com.groupws.tkws.shared.page.PageResponse;
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
 *   GET    /api/v1/pessoas/search           · autocomplete (combobox async)
 *   POST   /api/v1/pessoas                  · cria como LEAD
 *   PATCH  /api/v1/pessoas/{id}             · atualiza dados cadastrais
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
    private final UpdatePessoaUseCase updatePessoa;

    PessoaController(CreatePessoaUseCase createPessoa,
                     FindPessoaUseCase findPessoa,
                     CheckDuplicidadePessoaUseCase checkDuplicidade,
                     ConvertPessoaToClienteUseCase convertToCliente,
                     UpdatePessoaUseCase updatePessoa) {
        this.createPessoa = createPessoa;
        this.findPessoa = findPessoa;
        this.checkDuplicidade = checkDuplicidade;
        this.convertToCliente = convertToCliente;
        this.updatePessoa = updatePessoa;
    }

    /**
     * Listagem paginada das telas Leads/Clientes. Filtros opcionais: status,
     * busca textual `q` (nome/empresa/email/documento), tipoPessoa, cidade, uf
     * e ordenação `sort` (RECENTE | NOME | CONVERSAO). Paginação por
     * `limit`/`offset` — `limit` é limitado a 100 no servidor (ver ADR-022).
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ORG_ADMIN', 'COMERCIAL_ATENDIMENTO', 'COMERCIAL_PROPOSTA')")
    public ResponseEntity<PageResponse<PessoaView>> list(
        @CurrentTenant TenantContext tenant,
        @RequestParam(required = false) StatusPessoa status,
        @RequestParam(required = false) String q,
        @RequestParam(required = false) TipoPessoa tipoPessoa,
        @RequestParam(required = false) String cidade,
        @RequestParam(required = false) String uf,
        @RequestParam(required = false) String sort,
        @RequestParam(defaultValue = "50") int limit,
        @RequestParam(defaultValue = "0") int offset
    ) {
        int safeLimit = Math.max(1, Math.min(limit, 100));
        int safeOffset = Math.max(0, offset);
        PessoaListCriteria criteria = new PessoaListCriteria(
            status, q, tipoPessoa, cidade, uf, PessoaSort.fromOrDefault(sort));
        return ResponseEntity.ok(findPessoa.list(tenant.tenantId(), criteria, safeLimit, safeOffset));
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
     * Autocomplete · usado pelo Combobox async no frontend para escolher
     * Pessoa (Lead/Cliente) ao criar/editar uma Oportunidade.
     *
     * Casa parcialmente em nome do contato, nome da empresa e (quando o
     * termo tem dígitos) no documento normalizado. Sempre tenant-scoped.
     *
     * Query vazia retorna lista vazia · evita hit no banco quando o
     * combobox abre com o input em branco.
     */
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ORG_ADMIN', 'COMERCIAL_ATENDIMENTO', 'COMERCIAL_PROPOSTA')")
    public ResponseEntity<List<PessoaSearchView>> search(
        @CurrentTenant TenantContext tenant,
        @RequestParam(name = "q") String query,
        @RequestParam(defaultValue = "10") int limit
    ) {
        return ResponseEntity.ok(findPessoa.search(tenant.tenantId(), query, limit));
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
     * Atualiza os dados cadastrais de uma Pessoa (tipo, documento, contato).
     * Não altera status nem conversão. Ver ADR-018.
     */
    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('ORG_ADMIN', 'COMERCIAL_ATENDIMENTO', 'COMERCIAL_PROPOSTA')")
    public ResponseEntity<PessoaView> update(
        @PathVariable UUID id,
        @CurrentTenant TenantContext tenant,
        @Valid @RequestBody UpdatePessoaRequest request
    ) {
        PessoaView updated = updatePessoa.execute(
            tenant.tenantId(), PessoaId.of(id), request.toCommand(tenant.tenantId()));
        return ResponseEntity.ok(updated);
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

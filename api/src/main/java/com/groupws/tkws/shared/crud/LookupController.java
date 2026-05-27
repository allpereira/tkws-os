package com.groupws.tkws.shared.crud;

import com.groupws.tkws.shared.page.PageResponse;
import com.groupws.tkws.shared.page.Pagination;
import com.groupws.tkws.shared.web.tenant.CurrentTenant;
import com.groupws.tkws.shared.web.tenant.TenantContext;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.net.URI;
import java.util.UUID;

/**
 * Controller base · expõe os 5 endpoints CRUD padrão para uma lookup table.
 *
 * Cada feature concreta extende e adiciona:
 *   - `@RestController` + `@RequestMapping("/api/v1/...")`
 *   - Construtor que injeta o `LookupService` configurado (com seu repo
 *     e factory de entidade)
 *
 * Veja `OfertaController` como template.
 *
 * Endpoints:
 *   GET    /              · lista (filtrada por tenant)
 *   GET    /{id}          · detalhe
 *   POST   /              · cria
 *   PATCH  /{id}          · atualiza
 *   DELETE /{id}          · remove
 */
public abstract class LookupController<E extends LookupJpaEntity> {

    protected final LookupService<E> service;
    private final String basePath;

    protected LookupController(LookupService<E> service, String basePath) {
        this.service = service;
        this.basePath = basePath;
    }

    @GetMapping
    public ResponseEntity<PageResponse<LookupView>> list(
        @CurrentTenant TenantContext tenant,
        @RequestParam(defaultValue = "" + Pagination.DEFAULT_LIMIT) int limit,
        @RequestParam(defaultValue = "0") int offset
    ) {
        return ResponseEntity.ok(service.list(tenant.tenantId(), limit, offset));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LookupView> findById(
        @CurrentTenant TenantContext tenant,
        @PathVariable UUID id
    ) {
        return ResponseEntity.ok(service.findById(tenant.tenantId(), id));
    }

    @PostMapping
    public ResponseEntity<LookupView> create(
        @CurrentTenant TenantContext tenant,
        @Valid @RequestBody LookupRequest request
    ) {
        LookupView created = service.create(tenant.tenantId(), request);
        return ResponseEntity
            .created(URI.create(basePath + "/" + created.id()))
            .body(created);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<LookupView> update(
        @CurrentTenant TenantContext tenant,
        @PathVariable UUID id,
        @Valid @RequestBody LookupRequest request
    ) {
        return ResponseEntity.ok(service.update(tenant.tenantId(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(
        @CurrentTenant TenantContext tenant,
        @PathVariable UUID id
    ) {
        service.remove(tenant.tenantId(), id);
        return ResponseEntity.noContent().build();
    }
}

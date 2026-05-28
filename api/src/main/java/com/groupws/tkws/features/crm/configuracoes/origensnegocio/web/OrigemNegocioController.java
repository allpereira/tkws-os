package com.groupws.tkws.features.crm.configuracoes.origensnegocio.web;

import java.net.URI;
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

import com.groupws.tkws.features.crm.configuracoes.origensnegocio.application.OrigemNegocioService;
import com.groupws.tkws.features.crm.configuracoes.origensnegocio.application.OrigemNegocioView;
import com.groupws.tkws.features.crm.configuracoes.origensnegocio.domain.model.OrigemNegocioId;
import com.groupws.tkws.shared.page.PageResponse;
import com.groupws.tkws.shared.web.tenant.CurrentTenant;
import com.groupws.tkws.shared.web.tenant.TenantContext;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/crm/origens-negocio")
@PreAuthorize("hasRole('ORG_ADMIN')")
class OrigemNegocioController {

    private final OrigemNegocioService service;

    OrigemNegocioController(OrigemNegocioService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<PageResponse<OrigemNegocioView>> list(@CurrentTenant TenantContext tenant) {
        return ResponseEntity.ok(service.list(tenant.tenantId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrigemNegocioView> findById(
        @CurrentTenant TenantContext tenant,
        @PathVariable UUID id
    ) {
        return ResponseEntity.ok(service.findById(tenant.tenantId(), OrigemNegocioId.of(id)));
    }

    @PostMapping
    public ResponseEntity<OrigemNegocioView> create(
        @CurrentTenant TenantContext tenant,
        @Valid @RequestBody OrigemNegocioRequest request
    ) {
        OrigemNegocioView created = service.create(tenant.tenantId(), request.toCommand());
        return ResponseEntity.created(URI.create("/api/v1/crm/origens-negocio/" + created.id())).body(created);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<OrigemNegocioView> update(
        @CurrentTenant TenantContext tenant,
        @PathVariable UUID id,
        @Valid @RequestBody OrigemNegocioRequest request
    ) {
        return ResponseEntity.ok(service.update(tenant.tenantId(), OrigemNegocioId.of(id), request.toCommand()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(
        @CurrentTenant TenantContext tenant,
        @PathVariable UUID id
    ) {
        service.remove(tenant.tenantId(), OrigemNegocioId.of(id));
        return ResponseEntity.noContent().build();
    }
}

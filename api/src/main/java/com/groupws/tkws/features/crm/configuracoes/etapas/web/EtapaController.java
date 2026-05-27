package com.groupws.tkws.features.crm.configuracoes.etapas.web;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.groupws.tkws.features.crm.configuracoes.etapas.application.EtapaService;
import com.groupws.tkws.features.crm.configuracoes.etapas.application.EtapaView;
import com.groupws.tkws.features.crm.configuracoes.etapas.domain.model.EtapaId;
import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.PipelineId;
import com.groupws.tkws.shared.page.PageResponse;
import com.groupws.tkws.shared.web.tenant.CurrentTenant;
import com.groupws.tkws.shared.web.tenant.TenantContext;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/crm/etapas")
@PreAuthorize("hasRole('ORG_ADMIN')")
class EtapaController {

    private final EtapaService service;

    EtapaController(EtapaService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<PageResponse<EtapaView>> list(
        @CurrentTenant TenantContext tenant,
        @RequestParam(required = false) UUID pipelineId
    ) {
        return ResponseEntity.ok(
            service.list(tenant.tenantId(), pipelineId != null ? PipelineId.of(pipelineId) : null)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<EtapaView> findById(
        @CurrentTenant TenantContext tenant,
        @PathVariable UUID id
    ) {
        return ResponseEntity.ok(service.findById(tenant.tenantId(), EtapaId.of(id)));
    }

    @PostMapping
    public ResponseEntity<EtapaView> create(
        @CurrentTenant TenantContext tenant,
        @Valid @RequestBody EtapaRequest request
    ) {
        EtapaView created = service.create(tenant.tenantId(), request.toCommand());
        return ResponseEntity.created(URI.create("/api/v1/crm/etapas/" + created.id())).body(created);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<EtapaView> update(
        @CurrentTenant TenantContext tenant,
        @PathVariable UUID id,
        @Valid @RequestBody EtapaRequest request
    ) {
        return ResponseEntity.ok(service.update(tenant.tenantId(), EtapaId.of(id), request.toCommand()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(
        @CurrentTenant TenantContext tenant,
        @PathVariable UUID id
    ) {
        service.remove(tenant.tenantId(), EtapaId.of(id));
        return ResponseEntity.noContent().build();
    }
}

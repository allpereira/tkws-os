package com.groupws.tkws.features.crm.configuracoes.pipelines.web;

import com.groupws.tkws.features.crm.configuracoes.pipelines.application.PipelineService;
import com.groupws.tkws.features.crm.configuracoes.pipelines.application.PipelineView;
import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.ModuloPipeline;
import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.PipelineId;
import com.groupws.tkws.shared.page.PageResponse;
import com.groupws.tkws.shared.web.tenant.CurrentTenant;
import com.groupws.tkws.shared.web.tenant.TenantContext;
import jakarta.validation.Valid;
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

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/crm/pipelines")
@PreAuthorize("hasRole('ORG_ADMIN')")
class PipelineController {

    private final PipelineService service;

    PipelineController(PipelineService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<PageResponse<PipelineView>> list(
        @CurrentTenant TenantContext tenant,
        @RequestParam(required = false) ModuloPipeline modulo
    ) {
        return ResponseEntity.ok(service.list(tenant.tenantId(), modulo));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PipelineView> findById(
        @CurrentTenant TenantContext tenant,
        @PathVariable UUID id
    ) {
        return ResponseEntity.ok(service.findById(tenant.tenantId(), PipelineId.of(id)));
    }

    @PostMapping
    public ResponseEntity<PipelineView> create(
        @CurrentTenant TenantContext tenant,
        @Valid @RequestBody PipelineRequest request
    ) {
        PipelineView created = service.create(tenant.tenantId(), request.toCommand());
        return ResponseEntity.created(URI.create("/api/v1/crm/pipelines/" + created.id())).body(created);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<PipelineView> update(
        @CurrentTenant TenantContext tenant,
        @PathVariable UUID id,
        @Valid @RequestBody PipelineRequest request
    ) {
        return ResponseEntity.ok(service.update(tenant.tenantId(), PipelineId.of(id), request.toCommand()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(
        @CurrentTenant TenantContext tenant,
        @PathVariable UUID id
    ) {
        service.remove(tenant.tenantId(), PipelineId.of(id));
        return ResponseEntity.noContent().build();
    }
}

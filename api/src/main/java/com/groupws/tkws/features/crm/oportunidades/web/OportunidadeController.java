package com.groupws.tkws.features.crm.oportunidades.web;

import com.groupws.tkws.features.crm.configuracoes.etapas.domain.model.EtapaId;
import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.PipelineId;
import com.groupws.tkws.features.crm.oportunidades.application.OportunidadeService;
import com.groupws.tkws.features.crm.oportunidades.application.OportunidadeView;
import com.groupws.tkws.features.crm.oportunidades.domain.model.OportunidadeId;
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

/**
 * Endpoints de Oportunidades (= negócios) no CRM.
 *
 * Endpoints:
 *   GET    /api/v1/crm/oportunidades?pipelineId=&modulo=  · lista
 *   GET    /api/v1/crm/oportunidades/{id}                 · detalhe
 *   POST   /api/v1/crm/oportunidades                      · cria
 *   PATCH  /api/v1/crm/oportunidades/{id}                 · atualiza (todos os campos)
 *   POST   /api/v1/crm/oportunidades/{id}/mover           · move só a etapa
 *   DELETE /api/v1/crm/oportunidades/{id}                 · remove
 */
@RestController
@RequestMapping("/api/v1/crm/oportunidades")
@PreAuthorize("hasAnyRole('ORG_ADMIN', 'PROJECT_MANAGER', 'ARCHITECT')")
class OportunidadeController {

    private final OportunidadeService service;

    OportunidadeController(OportunidadeService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<OportunidadeView>> list(
        @CurrentTenant TenantContext tenant,
        @RequestParam(required = false) UUID pipelineId
    ) {
        return ResponseEntity.ok(service.list(
            tenant.tenantId(),
            pipelineId != null ? PipelineId.of(pipelineId) : null
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OportunidadeView> findById(
        @CurrentTenant TenantContext tenant,
        @PathVariable UUID id
    ) {
        return ResponseEntity.ok(service.findById(tenant.tenantId(), OportunidadeId.of(id)));
    }

    @PostMapping
    public ResponseEntity<OportunidadeView> create(
        @CurrentTenant TenantContext tenant,
        @Valid @RequestBody OportunidadeRequest request
    ) {
        OportunidadeView created = service.create(tenant.tenantId(), request.toCommand());
        return ResponseEntity
            .created(URI.create("/api/v1/crm/oportunidades/" + created.id()))
            .body(created);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<OportunidadeView> update(
        @CurrentTenant TenantContext tenant,
        @PathVariable UUID id,
        @Valid @RequestBody OportunidadeRequest request
    ) {
        return ResponseEntity.ok(service.update(
            tenant.tenantId(), OportunidadeId.of(id), request.toCommand()
        ));
    }

    /**
     * Endpoint dedicado para movimentar entre etapas (uso do Kanban arrasta).
     * Quando a etapa de destino tem `converte_lead_em_cliente=true`, o
     * agregado emite evento e a Pessoa é promovida automaticamente.
     */
    @PostMapping("/{id}/mover")
    public ResponseEntity<OportunidadeView> mover(
        @CurrentTenant TenantContext tenant,
        @PathVariable UUID id,
        @Valid @RequestBody MoveEtapaRequest body
    ) {
        return ResponseEntity.ok(service.moveToEtapa(
            tenant.tenantId(), OportunidadeId.of(id), EtapaId.of(body.etapaId())
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(
        @CurrentTenant TenantContext tenant,
        @PathVariable UUID id
    ) {
        service.remove(tenant.tenantId(), OportunidadeId.of(id));
        return ResponseEntity.noContent().build();
    }
}

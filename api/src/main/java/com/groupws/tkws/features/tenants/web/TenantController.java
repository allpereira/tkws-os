package com.groupws.tkws.features.tenants.web;

import com.groupws.tkws.features.tenants.application.dto.CreateTenantCommand;
import com.groupws.tkws.features.tenants.application.dto.TenantView;
import com.groupws.tkws.features.tenants.application.usecase.CreateTenantUseCase;
import com.groupws.tkws.features.tenants.application.usecase.FindTenantUseCase;
import com.groupws.tkws.features.tenants.domain.model.TenantId;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tenants")
class TenantController {

    private final CreateTenantUseCase createTenantUseCase;
    private final FindTenantUseCase findTenantUseCase;

    TenantController(CreateTenantUseCase createTenantUseCase,
                     FindTenantUseCase findTenantUseCase) {
        this.createTenantUseCase = createTenantUseCase;
        this.findTenantUseCase = findTenantUseCase;
    }

    @PostMapping
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<TenantView> create(@Valid @RequestBody CreateTenantCommand command) {
        TenantView created = createTenantUseCase.execute(command);
        return ResponseEntity
            .created(URI.create("/api/v1/tenants/" + created.id()))
            .body(created);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'ORG_ADMIN')")
    public ResponseEntity<TenantView> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(findTenantUseCase.byId(TenantId.of(id)));
    }

    @GetMapping("/by-slug/{slug}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'ORG_ADMIN')")
    public ResponseEntity<TenantView> findBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(findTenantUseCase.bySlug(slug));
    }
}

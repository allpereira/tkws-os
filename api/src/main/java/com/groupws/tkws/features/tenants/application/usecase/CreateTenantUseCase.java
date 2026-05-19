package com.groupws.tkws.features.tenants.application.usecase;

import com.groupws.tkws.features.tenants.application.dto.CreateTenantCommand;
import com.groupws.tkws.features.tenants.application.dto.TenantView;
import com.groupws.tkws.features.tenants.domain.exception.TenantSlugAlreadyTakenException;
import com.groupws.tkws.features.tenants.domain.model.Tenant;
import com.groupws.tkws.features.tenants.domain.port.TenantRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Use case: criar um novo tenant.
 * Orquestra: validar unicidade → criar agregado → persistir → publicar eventos.
 */
@Service
public class CreateTenantUseCase {

    private final TenantRepository tenantRepository;
    private final ApplicationEventPublisher eventPublisher;

    public CreateTenantUseCase(TenantRepository tenantRepository,
                               ApplicationEventPublisher eventPublisher) {
        this.tenantRepository = tenantRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public TenantView execute(CreateTenantCommand command) {
        if (tenantRepository.existsBySlug(command.slug())) {
            throw new TenantSlugAlreadyTakenException(command.slug());
        }

        Tenant tenant = Tenant.create(
            command.zitadelOrgId(),
            command.name(),
            command.slug()
        );

        Tenant saved = tenantRepository.save(tenant);

        // Publica eventos após persistência bem-sucedida
        saved.pullDomainEvents().forEach(eventPublisher::publishEvent);

        return TenantView.from(saved);
    }
}

package com.groupws.tkws.features.tenants.application.usecase;

import com.groupws.tkws.features.tenants.application.dto.TenantView;
import com.groupws.tkws.features.tenants.domain.exception.TenantNotFoundException;
import com.groupws.tkws.features.tenants.domain.model.TenantId;
import com.groupws.tkws.features.tenants.domain.port.TenantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FindTenantUseCase {

    private final TenantRepository tenantRepository;

    public FindTenantUseCase(TenantRepository tenantRepository) {
        this.tenantRepository = tenantRepository;
    }

    @Transactional(readOnly = true)
    public TenantView byId(TenantId id) {
        return tenantRepository.findById(id)
            .map(TenantView::from)
            .orElseThrow(() -> new TenantNotFoundException(id.toString()));
    }

    @Transactional(readOnly = true)
    public TenantView bySlug(String slug) {
        return tenantRepository.findBySlug(slug)
            .map(TenantView::from)
            .orElseThrow(() -> new TenantNotFoundException(slug));
    }
}

package com.groupws.tkws.features.invites.application.usecase;

import com.groupws.tkws.features.invites.application.dto.InviteListView;
import com.groupws.tkws.features.invites.domain.model.InviteStatus;
import com.groupws.tkws.features.invites.domain.port.InviteRepository;
import com.groupws.tkws.features.tenants.domain.model.TenantId;
import com.groupws.tkws.shared.page.PageResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Lista paginada de convites do tenant atual (tela de administração de Usuários).
 * Sempre tenant-scoped — o tenant vem do controller via {@code @CurrentTenant}.
 */
@Service
public class ListInvitesUseCase {

    private final InviteRepository invites;

    public ListInvitesUseCase(InviteRepository invites) {
        this.invites = invites;
    }

    @Transactional(readOnly = true)
    public PageResponse<InviteListView> execute(long tenantId, InviteStatus statusFilter, int limit, int offset) {
        int safeLimit = Math.max(1, Math.min(limit, 100));
        int safeOffset = Math.max(0, offset);
        TenantId tid = TenantId.of(tenantId);

        List<InviteListView> content = invites.findByTenant(tid, statusFilter, safeLimit, safeOffset)
            .stream()
            .map(InviteListView::from)
            .toList();
        long total = invites.countByTenant(tid, statusFilter);

        return PageResponse.of(content, safeLimit, safeOffset, total);
    }
}

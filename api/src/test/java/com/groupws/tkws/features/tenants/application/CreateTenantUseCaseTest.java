package com.groupws.tkws.features.tenants.application;

import com.groupws.tkws.features.tenants.application.dto.CreateTenantCommand;
import com.groupws.tkws.features.tenants.application.dto.TenantView;
import com.groupws.tkws.features.tenants.application.usecase.CreateTenantUseCase;
import com.groupws.tkws.features.tenants.domain.event.TenantCreatedEvent;
import com.groupws.tkws.features.tenants.domain.exception.TenantSlugAlreadyTakenException;
import com.groupws.tkws.features.tenants.domain.model.Tenant;
import com.groupws.tkws.features.tenants.domain.model.TenantId;
import com.groupws.tkws.features.tenants.domain.port.TenantRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Em produção o adapter de persistência chama `assignIdIfTransient` após o
 * INSERT (quando o BIGINT IDENTITY é gerado). Os mocks aqui simulam isso —
 * cada `save` atribui um id sintético e retorna o mesmo agregado.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("CreateTenantUseCase")
class CreateTenantUseCaseTest {

    @Mock TenantRepository tenantRepository;
    @Mock ApplicationEventPublisher eventPublisher;

    @InjectMocks CreateTenantUseCase useCase;

    private CreateTenantCommand validCommand;

    @BeforeEach
    void setUp() {
        validCommand = new CreateTenantCommand("zitadel-org-123", "Studio X", "studio-x");
    }

    private static Tenant simulateAdapterAssignsId(org.mockito.invocation.InvocationOnMock inv) {
        Tenant t = inv.getArgument(0);
        t.assignIdIfTransient(TenantId.of(1L));
        return t;
    }

    @Test
    @DisplayName("deve criar tenant quando slug não existir")
    void deveCriarTenant() {
        when(tenantRepository.existsBySlug("studio-x")).thenReturn(false);
        when(tenantRepository.save(any(Tenant.class)))
            .thenAnswer(CreateTenantUseCaseTest::simulateAdapterAssignsId);

        TenantView result = useCase.execute(validCommand);

        assertThat(result.slug()).isEqualTo("studio-x");
        assertThat(result.name()).isEqualTo("Studio X");
        assertThat(result.active()).isTrue();
        assertThat(result.id()).isEqualTo(1L);
    }

    @Test
    @DisplayName("deve persistir o tenant via repository")
    void devePersistir() {
        when(tenantRepository.existsBySlug(any())).thenReturn(false);
        when(tenantRepository.save(any(Tenant.class)))
            .thenAnswer(CreateTenantUseCaseTest::simulateAdapterAssignsId);

        useCase.execute(validCommand);

        ArgumentCaptor<Tenant> captor = ArgumentCaptor.forClass(Tenant.class);
        verify(tenantRepository).save(captor.capture());
        assertThat(captor.getValue().slug()).isEqualTo("studio-x");
    }

    @Test
    @DisplayName("deve publicar TenantCreatedEvent após persistir")
    void devePublicarEvento() {
        when(tenantRepository.existsBySlug(any())).thenReturn(false);
        when(tenantRepository.save(any(Tenant.class)))
            .thenAnswer(CreateTenantUseCaseTest::simulateAdapterAssignsId);

        useCase.execute(validCommand);

        verify(eventPublisher).publishEvent(any(TenantCreatedEvent.class));
    }

    @Test
    @DisplayName("deve lançar exceção quando slug já existir")
    void deveRejeitarSlugDuplicado() {
        when(tenantRepository.existsBySlug("studio-x")).thenReturn(true);

        assertThatThrownBy(() -> useCase.execute(validCommand))
            .isInstanceOf(TenantSlugAlreadyTakenException.class)
            .hasMessageContaining("studio-x");

        verify(tenantRepository, never()).save(any());
        verify(eventPublisher, never()).publishEvent(any());
    }
}

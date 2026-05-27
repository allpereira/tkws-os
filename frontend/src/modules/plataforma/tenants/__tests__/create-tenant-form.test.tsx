import { describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { renderWithProviders, screen, userEvent, waitFor } from '@/test/test-utils';
import { server } from '@/test/msw-server';
import { CreateTenantForm } from '@/modules/plataforma/tenants/components/create-tenant-form';

describe('CreateTenantForm', () => {
  it('deve renderizar todos os campos', () => {
    renderWithProviders(<CreateTenantForm />);

    expect(screen.getByLabelText(/nome do escritório/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/identificador/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zitadel org id/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /criar tenant/i })).toBeInTheDocument();
  });

  it('deve mostrar erros de validação ao submeter vazio', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateTenantForm />);

    await user.click(screen.getByRole('button', { name: /criar tenant/i }));

    await waitFor(() => {
      const alerts = screen.getAllByRole('alert');
      expect(alerts.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('deve mostrar erro de slug inválido', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateTenantForm />);

    await user.type(screen.getByLabelText(/nome do escritório/i), 'Studio X');
    await user.type(screen.getByLabelText(/identificador/i), 'SLUG INVÁLIDO');
    await user.type(screen.getByLabelText(/zitadel org id/i), 'zitadel-1');
    await user.click(screen.getByRole('button', { name: /criar tenant/i }));

    await waitFor(() => {
      expect(screen.getByText(/slug inválido/i)).toBeInTheDocument();
    });
  });

  it('deve criar tenant com sucesso e chamar onSuccess', async () => {
    const onSuccess = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<CreateTenantForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText(/nome do escritório/i), 'Studio Test');
    await user.type(screen.getByLabelText(/identificador/i), 'studio-test');
    await user.type(screen.getByLabelText(/zitadel org id/i), 'zitadel-org-test');
    await user.click(screen.getByRole('button', { name: /criar tenant/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(
        '00000000-0000-0000-0000-000000000010'
      );
    });
  });

  it('deve mostrar mensagem de erro quando API falhar', async () => {
    server.use(
      http.post('http://localhost:8080/api/v1/tenants', () => {
        return HttpResponse.json(
          { title: 'TENANT_SLUG_ALREADY_TAKEN', detail: 'Slug duplicado' },
          { status: 422 }
        );
      })
    );

    const user = userEvent.setup();
    renderWithProviders(<CreateTenantForm />);

    await user.type(screen.getByLabelText(/nome do escritório/i), 'Studio');
    await user.type(screen.getByLabelText(/identificador/i), 'duplicado');
    await user.type(screen.getByLabelText(/zitadel org id/i), 'org-1');
    await user.click(screen.getByRole('button', { name: /criar tenant/i }));

    await waitFor(() => {
      expect(screen.getByText(/erro ao criar tenant/i)).toBeInTheDocument();
    });
  });

  it('deve desabilitar botão durante submissão', async () => {
    // Segura a resposta da API para observar o estado "pending" sem corrida.
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    server.use(
      http.post('http://localhost:8080/api/v1/tenants', async () => {
        await gate;
        return HttpResponse.json(
          {
            id: 1,
            zitadelOrgId: 'org-1',
            name: 'Studio Test',
            slug: 'studio-test',
            active: true,
            createdAt: '2025-01-01T00:00:00Z',
            updatedAt: '2025-01-01T00:00:00Z',
          },
          { status: 201 }
        );
      })
    );

    const user = userEvent.setup();
    renderWithProviders(<CreateTenantForm />);

    await user.type(screen.getByLabelText(/nome do escritório/i), 'Studio Test');
    await user.type(screen.getByLabelText(/identificador/i), 'studio-test');
    await user.type(screen.getByLabelText(/zitadel org id/i), 'org-1');

    const button = screen.getByRole('button', { name: /criar tenant/i });
    await user.click(button);

    await waitFor(() => expect(button).toBeDisabled());

    release(); // libera a request pendente
  });
});

import { expect, test } from '@playwright/test';

/**
 * E2E do fluxo de criação de tenant.
 *
 * Pré-requisitos:
 *  - Backend rodando (docker compose up -d)
 *  - Zitadel configurado com usuário de teste com role system_admin
 *  - storageState pré-gerado via script auth.setup.ts (não incluído)
 *
 * Em CI, autenticação é feita via fluxo programático antes da suite.
 */
test.describe('Criar Tenant', () => {
  test.skip(
    !process.env.E2E_AUTHENTICATED,
    'Requer storageState autenticado. Configure E2E_AUTHENTICATED=true.'
  );

  test('admin cria tenant com sucesso', async ({ page }) => {
    await page.goto('/admin/tenants/new');

    await page.getByLabel(/nome do escritório/i).fill('E2E Studio');
    await page.getByLabel(/identificador/i).fill('e2e-studio');
    await page.getByLabel(/zitadel org id/i).fill('e2e-org-123');

    await page.getByRole('button', { name: /criar tenant/i }).click();

    await expect(page.getByText(/tenant criado/i)).toBeVisible({ timeout: 5000 });
  });

  test('mostra erro ao tentar slug inválido', async ({ page }) => {
    await page.goto('/admin/tenants/new');

    await page.getByLabel(/nome do escritório/i).fill('Studio');
    await page.getByLabel(/identificador/i).fill('SLUG INVÁLIDO');
    await page.getByLabel(/zitadel org id/i).fill('org-1');

    await page.getByRole('button', { name: /criar tenant/i }).click();

    await expect(page.getByText(/slug inválido/i)).toBeVisible();
  });
});

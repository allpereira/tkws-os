import { expect, test } from '@playwright/test';

/**
 * Smoke E2E: garante que o app carrega e redireciona pra autenticação.
 *
 * Pra testar fluxo completo de login, precisa de credenciais de teste configuradas no Zitadel
 * e usar fixtures separadas (veja docs/TESTING.md).
 */
test.describe('Smoke', () => {
  test('app carrega e redireciona pra Zitadel quando não autenticado', async ({ page }) => {
    await page.goto('/');

    // Espera redirecionamento pro Zitadel (ou tela de carregando)
    await page.waitForLoadState('domcontentloaded');

    // Em ambiente local, sem auth bypass, deve ir pra auth.tkws ou localhost:8088
    // Cobrimos os dois casos:
    await expect(async () => {
      const url = page.url();
      expect(url).toMatch(/(login|auth|callback|localhost:8088)/i);
    }).toPass({ timeout: 10_000 });
  });
});

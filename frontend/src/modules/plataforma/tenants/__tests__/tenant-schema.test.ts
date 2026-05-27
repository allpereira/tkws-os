import { describe, expect, it } from 'vitest';
import { createTenantSchema, tenantSchema } from '@/modules/plataforma/tenants/schema';

describe('Tenant Schemas', () => {
  describe('createTenantSchema', () => {
    it('deve aceitar input válido', () => {
      const result = createTenantSchema.safeParse({
        zitadelOrgId: 'zitadel-org-1',
        name: 'Studio X',
        slug: 'studio-x',
      });
      expect(result.success).toBe(true);
    });

    it.each([
      ['SlugMaiusculo', 'Slug inválido'],
      ['slug com espaço', 'Slug inválido'],
      ['-comeca-com-hifen', 'Slug inválido'],
      ['termina-com-hifen-', 'Slug inválido'],
      ['slug_underscore', 'Slug inválido'],
    ])('deve rejeitar slug inválido: %s', (slug) => {
      const result = createTenantSchema.safeParse({
        zitadelOrgId: 'x',
        name: 'Nome',
        slug,
      });
      expect(result.success).toBe(false);
    });

    it('deve rejeitar nome vazio', () => {
      const result = createTenantSchema.safeParse({
        zitadelOrgId: 'x',
        name: '',
        slug: 'slug-x',
      });
      expect(result.success).toBe(false);
    });

    it('deve rejeitar nome muito longo', () => {
      const result = createTenantSchema.safeParse({
        zitadelOrgId: 'x',
        name: 'a'.repeat(256),
        slug: 'slug-x',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('tenantSchema (resposta da API)', () => {
    it('deve aceitar resposta válida da API', () => {
      const result = tenantSchema.safeParse({
        id: 1,
        zitadelOrgId: 'zitadel-1',
        name: 'Nome',
        slug: 'nome',
        active: true,
        createdAt: '2025-05-17T12:00:00Z',
        updatedAt: '2025-05-17T12:00:00Z',
      });
      expect(result.success).toBe(true);
    });

    // id é BIGINT no backend (ADR-021), não UUID — o schema espera um número positivo.
    it('deve rejeitar id não numérico', () => {
      const result = tenantSchema.safeParse({
        id: 'not-a-number',
        zitadelOrgId: 'x',
        name: 'Nome',
        slug: 'slug',
        active: true,
        createdAt: '2025-05-17T12:00:00Z',
        updatedAt: '2025-05-17T12:00:00Z',
      });
      expect(result.success).toBe(false);
    });
  });
});

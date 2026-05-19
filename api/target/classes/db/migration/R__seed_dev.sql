-- Seed de desenvolvimento — só roda quando spring.flyway.placeholders.environment = 'dev'.
-- Em staging/prod, o placeholder é 'staging' ou 'production' e o IF abaixo bloqueia execução.
--
-- Repeatable migration (R__): roda toda vez que o checksum muda, mas só em dev por causa do
-- IF interno. NÃO ESCREVA `R__seed_PROD` ou similar — sempre seed = dev.
--
-- Idempotente: usa INSERT ... ON CONFLICT DO NOTHING.

DO $$
BEGIN
    IF '${environment}' = 'dev' THEN

        -- Tenant de desenvolvimento
        INSERT INTO tenants (id, zitadel_org_id, name, slug, status, active, created_at, updated_at)
        VALUES (
            '00000000-0000-0000-0000-000000000001',
            'dev-zitadel-org-id',
            'Studio Dev',
            'studio-dev',
            'ACTIVE',
            true,
            NOW(),
            NOW()
        )
        ON CONFLICT (id) DO NOTHING;

        -- Tenant adicional pra testar multi-tenancy localmente
        INSERT INTO tenants (id, zitadel_org_id, name, slug, status, active, created_at, updated_at)
        VALUES (
            '00000000-0000-0000-0000-000000000002',
            'dev-zitadel-org-id-2',
            'Atelier Test',
            'atelier-test',
            'ACTIVE',
            true,
            NOW(),
            NOW()
        )
        ON CONFLICT (id) DO NOTHING;

        -- Usuários de dev — só insere se ainda não existem com mesmo zitadel_id
        INSERT INTO users (id, zitadel_id, email, full_name, tenant_id, active, created_at, updated_at)
        VALUES (
            '00000000-0000-0000-0000-000000000010',
            'dev-zitadel-user-admin',
            'admin@tkws.local',
            'Allysson (Dev Admin)',
            '00000000-0000-0000-0000-000000000001',
            true,
            NOW(),
            NOW()
        )
        ON CONFLICT (zitadel_id) DO NOTHING;

        INSERT INTO users (id, zitadel_id, email, full_name, tenant_id, active, created_at, updated_at)
        VALUES (
            '00000000-0000-0000-0000-000000000011',
            'dev-zitadel-user-architect',
            'arquiteto@tkws.local',
            'Arquiteto Teste',
            '00000000-0000-0000-0000-000000000001',
            true,
            NOW(),
            NOW()
        )
        ON CONFLICT (zitadel_id) DO NOTHING;

        RAISE NOTICE 'Seed de dev executado: 2 tenants + 2 usuários';
    ELSE
        RAISE NOTICE 'Seed de dev pulado (environment = %)', '${environment}';
    END IF;
END $$;

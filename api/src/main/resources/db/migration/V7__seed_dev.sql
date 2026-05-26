-- Seed de desenvolvimento — executa uma única vez (migration versionada V7).
-- Só insere quando spring.flyway.placeholders.environment = 'dev'.
-- Em staging/prod, o placeholder bloqueia execução via IF interno.
--
-- NÃO use R__ para seed: repeatable reexecuta quando o checksum muda.
-- Para alterar dados de dev após o seed, edite via app ou migration V8+ pontual.

DO $$
DECLARE
    tenant_dev_id      BIGINT := 1;
    tenant_test_id     BIGINT := 2;
    pipe_comercial_id  UUID := '00000000-0000-0000-0000-000000001001';
    pipe_proposta_id   UUID := '00000000-0000-0000-0000-000000001002';

    -- Dados da Org "Group WS" no Zitadel local (Domain: group-ws.localhost).
    -- Atualize zitadel_org_dev se reiniciar o Zitadel com volume limpo.
    zitadel_org_dev    VARCHAR(255) := '373689462221242371';
    tenant_dev_name    VARCHAR(255) := 'Group WS';
    tenant_dev_slug    VARCHAR(100) := 'group-ws';
BEGIN
    IF '${environment}' = 'dev' THEN

        INSERT INTO tenants (id, zitadel_org_id, name, slug, status, active, created_at, updated_at)
        VALUES (
            tenant_dev_id,
            zitadel_org_dev,
            tenant_dev_name,
            tenant_dev_slug,
            'ACTIVE',
            true,
            NOW(),
            NOW()
        )
        ON CONFLICT (id) DO NOTHING;

        INSERT INTO tenants (id, zitadel_org_id, name, slug, status, active, created_at, updated_at)
        VALUES (
            tenant_test_id,
            'dev-zitadel-org-id-2',
            'Atelier Test',
            'atelier-test',
            'ACTIVE',
            true,
            NOW(),
            NOW()
        )
        ON CONFLICT (id) DO NOTHING;

        PERFORM setval(pg_get_serial_sequence('tenants', 'id'), GREATEST(tenant_dev_id, tenant_test_id));

        INSERT INTO users (id, zitadel_id, email, full_name, tenant_id, active, created_at, updated_at)
        VALUES (
            '00000000-0000-0000-0000-000000000010',
            'dev-zitadel-user-admin',
            'admin@tkws.local',
            'Allysson (Dev Admin)',
            tenant_dev_id,
            true,
            NOW(),
            NOW()
        )
        ON CONFLICT (id) DO NOTHING;

        INSERT INTO users (id, zitadel_id, email, full_name, tenant_id, active, created_at, updated_at)
        VALUES (
            '00000000-0000-0000-0000-000000000011',
            'dev-zitadel-user-comercial-atendimento',
            'atendimento@tkws.local',
            'Atendimento Comercial · Dev',
            tenant_dev_id,
            true,
            NOW(),
            NOW()
        )
        ON CONFLICT (id) DO NOTHING;

        INSERT INTO tipos_empresa (id, tenant_id, codigo, nome, ativo, created_at, updated_at) VALUES
            ('00000000-0000-0000-0000-000000002001', tenant_dev_id, 'TEM-001', 'Cliente',                   true, NOW(), NOW()),
            ('00000000-0000-0000-0000-000000002002', tenant_dev_id, 'TEM-002', 'Fornecedor',                true, NOW(), NOW()),
            ('00000000-0000-0000-0000-000000002003', tenant_dev_id, 'TEM-003', 'Construtora',              true, NOW(), NOW()),
            ('00000000-0000-0000-0000-000000002004', tenant_dev_id, 'TEM-004', 'Incorporadora',            true, NOW(), NOW()),
            ('00000000-0000-0000-0000-000000002005', tenant_dev_id, 'TEM-005', 'Parceiro',                 true, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING;

        INSERT INTO unidades (id, tenant_id, codigo, nome, ativo, created_at, updated_at) VALUES
            ('00000000-0000-0000-0000-000000003001', tenant_dev_id, 'UNI-001', 'Balneário Camboriú (SC)',  true, NOW(), NOW()),
            ('00000000-0000-0000-0000-000000003002', tenant_dev_id, 'UNI-002', 'Curitiba (PR)',  true, NOW(), NOW()),
            ('00000000-0000-0000-0000-000000003003', tenant_dev_id, 'UNI-003', 'São Paulo (SP)',  true, NOW(), NOW()),
            ('00000000-0000-0000-0000-000000003004', tenant_dev_id, 'UNI-004', 'Porto Alegre (RS)',  true, NOW(), NOW()),
            ('00000000-0000-0000-0000-000000003005', tenant_dev_id, 'UNI-005', 'Sorriso (MT)',  true, NOW(), NOW()),
            ('00000000-0000-0000-0000-000000003006', tenant_dev_id, 'UNI-006', 'Sinop (MT)',  true, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING;

        INSERT INTO tipos_projeto (id, tenant_id, codigo, nome, ativo, created_at, updated_at) VALUES
            ('00000000-0000-0000-0000-000000004001', tenant_dev_id, 'TPJT-001', 'Projeto arquitetônico',          true, NOW(), NOW()),
            ('00000000-0000-0000-0000-000000004002', tenant_dev_id, 'TPJT-002', 'Projeto de interiores',         true, NOW(), NOW()),
            ('00000000-0000-0000-0000-000000004003', tenant_dev_id, 'TPJT-003', 'Projeto Corporativo',           true, NOW(), NOW()),
            ('00000000-0000-0000-0000-000000004004', tenant_dev_id, 'TPJT-004', 'Área comum / Área de Lazer',    true, NOW(), NOW()),
            ('00000000-0000-0000-0000-000000004005', tenant_dev_id, 'TPJT-005', 'Reforma',                       true, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING;

        INSERT INTO setores (id, tenant_id, codigo, nome, ativo, created_at, updated_at) VALUES
            ('00000000-0000-0000-0000-000000005001', tenant_dev_id, 'SET-001', 'Comercial',       true, NOW(), NOW()),
            ('00000000-0000-0000-0000-000000005002', tenant_dev_id, 'SET-002', 'Tailor Made',        true, NOW(), NOW()),
            ('00000000-0000-0000-0000-000000005003', tenant_dev_id, 'SET-003', 'Administrativo', true, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING;

        INSERT INTO funcoes_pessoas (id, tenant_id, codigo, nome, ativo, created_at, updated_at) VALUES
            ('00000000-0000-0000-0000-000000006001', tenant_dev_id, 'FUN-001', 'Tecnologia',     true, NOW(), NOW()),
            ('00000000-0000-0000-0000-000000006002', tenant_dev_id, 'FUN-002', 'Comercial',      true, NOW(), NOW()),
            ('00000000-0000-0000-0000-000000006003', tenant_dev_id, 'FUN-003', 'Arquiteto',      true, NOW(), NOW()),
            ('00000000-0000-0000-0000-000000006004', tenant_dev_id, 'FUN-004', 'GC',      true, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING;

        INSERT INTO ofertas (id, tenant_id, codigo, nome, ativo, created_at, updated_at) VALUES
            ('00000000-0000-0000-0000-000000007001', tenant_dev_id, 'OFE-TKWS-RISCO', 'TKWS Risco',           true, NOW(), NOW()),
            ('00000000-0000-0000-0000-000000007002', tenant_dev_id, 'OFE-PMG', 'PMG',                   true, NOW(), NOW()),
            ('00000000-0000-0000-0000-000000007003', tenant_dev_id, 'OFE-PE', 'Projeto Externo',        true, NOW(), NOW()),
            ('00000000-0000-0000-0000-000000007004', tenant_dev_id, 'OFE-PC', 'Projeto Criativo',                true, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING;

        INSERT INTO tipos_pagamento (id, tenant_id, codigo, nome, ativo, created_at, updated_at) VALUES
            ('00000000-0000-0000-0000-000000008001', tenant_dev_id, 'TPG-001', 'Paga o Projeto',              true, NOW(), NOW()),
            ('00000000-0000-0000-0000-000000008002', tenant_dev_id, 'TPG-002', 'Só paga caso não fechar TKWS', true, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING;

        INSERT INTO pipelines (id, tenant_id, codigo, nome, descricao, modulo, ordem, ativo, created_at, updated_at) VALUES
            (pipe_comercial_id, tenant_dev_id, 'PIP-001', 'Comercial', 'Funil comercial · Lead → Cliente',  'atendimento', 0, true, NOW(), NOW()),
            (pipe_proposta_id,  tenant_dev_id, 'PIP-002', 'Proposta',  'Desenvolvimento e fechamento de proposta', 'proposta',    1, true, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING;

        INSERT INTO etapas (id, tenant_id, pipeline_id, codigo, nome, cor, probabilidade, tipo, ordem, converte_lead_em_cliente, ativo, created_at, updated_at) VALUES
            ('00000000-0000-0000-0000-000000009001', tenant_dev_id, pipe_comercial_id, 'ETA-001', 'Prospecção',   '#7F94A8', 10, 'aberta',  0, false, true, NOW(), NOW()),
            ('00000000-0000-0000-0000-000000009002', tenant_dev_id, pipe_comercial_id, 'ETA-002', 'Qualificação', '#74C7E4', 30, 'aberta',  1, false, true, NOW(), NOW()),
            ('00000000-0000-0000-0000-000000009003', tenant_dev_id, pipe_comercial_id, 'ETA-003', 'Proposta',     '#F2C94C', 50, 'aberta',  2, false, true, NOW(), NOW()),
            ('00000000-0000-0000-0000-000000009004', tenant_dev_id, pipe_comercial_id, 'ETA-004', 'Negociação',   '#F2994A', 75, 'aberta',  3, false, true, NOW(), NOW()),
            ('00000000-0000-0000-0000-000000009005', tenant_dev_id, pipe_comercial_id, 'ETA-005', 'Fechamento',   '#5FD9A5', 100, 'ganha',  4, true,  true, NOW(), NOW()),
            ('00000000-0000-0000-0000-000000009006', tenant_dev_id, pipe_comercial_id, 'ETA-006', 'Perdida',      '#F2994A', 75, 'perdida',  5, false, true, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING;

        INSERT INTO etapas (id, tenant_id, pipeline_id, codigo, nome, cor, probabilidade, tipo, ordem, converte_lead_em_cliente, ativo, created_at, updated_at) VALUES
            ('00000000-0000-0000-0000-000000009101', tenant_dev_id, pipe_proposta_id, 'ETA-101', 'Briefing',      '#7F94A8', 10, 'aberta', 0, false, true, NOW(), NOW()),
            ('00000000-0000-0000-0000-000000009102', tenant_dev_id, pipe_proposta_id, 'ETA-102', 'Criativo',      '#BB6BD9', 30, 'aberta', 1, false, true, NOW(), NOW()),
            ('00000000-0000-0000-0000-000000009103', tenant_dev_id, pipe_proposta_id, 'ETA-103', 'Orçamento',     '#74C7E4', 50, 'aberta', 2, false, true, NOW(), NOW()),
            ('00000000-0000-0000-0000-000000009104', tenant_dev_id, pipe_proposta_id, 'ETA-104', 'Apresentação',  '#F2C94C', 75, 'aberta', 3, false, true, NOW(), NOW()),
            ('00000000-0000-0000-0000-000000009105', tenant_dev_id, pipe_proposta_id, 'ETA-105', 'Aprovação',     '#5FD9A5', 100, 'ganha', 4, true,  true, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING;

        RAISE NOTICE 'Seed de dev (V7) executado: 2 tenants + 2 usuários + configurações CRM/Organização';
    ELSE
        RAISE NOTICE 'Seed de dev pulado (environment = %)', '${environment}';
    END IF;
END $$;

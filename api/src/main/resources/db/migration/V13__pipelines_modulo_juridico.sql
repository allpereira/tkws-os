-- ============================================================================
-- V13 · Habilita o módulo 'juridico' nos pipelines + seed do pipeline Jurídico
--
-- A constraint chk_pipelines_modulo (V6) só aceitava 'atendimento' e 'proposta'.
-- Esta migração estende o domínio permitido para incluir 'juridico'.
--
-- O pipeline "Jurídico" do seed de dev foi movido do V7 para cá porque depende
-- desta constraint relaxada (Flyway roda em ordem: V7 < V13, então não dava pra
-- semear 'juridico' no V7). O ALTER roda em todos os ambientes; o seed só em dev.
-- ============================================================================

-- Schema (todos os ambientes) · relaxa a constraint de módulo.
ALTER TABLE pipelines DROP CONSTRAINT chk_pipelines_modulo;
ALTER TABLE pipelines ADD CONSTRAINT chk_pipelines_modulo
    CHECK (modulo IN ('atendimento', 'proposta', 'juridico'));

-- Seed de dev (só quando environment = 'dev') · pipeline Jurídico + etapas.
DO $$
DECLARE
    tenant_dev_id      BIGINT := 1;
    pipe_juridico_id   UUID := '00000000-0000-0000-0000-000000001003';
BEGIN
    IF '${environment}' = 'dev' THEN

        INSERT INTO pipelines (id, tenant_id, codigo, nome, descricao, modulo, ordem, ativo, created_at, updated_at) VALUES
            (pipe_juridico_id, tenant_dev_id, 'PIP-003', 'Jurídico', 'Jurídico', 'juridico', 2, true, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING;

        INSERT INTO etapas (id, tenant_id, pipeline_id, codigo, nome, cor, probabilidade, tipo, ordem, converte_lead_em_cliente, ativo, created_at, updated_at) VALUES
            ('00000000-0000-0000-0000-000000009201', tenant_dev_id, pipe_juridico_id, 'ETA-201', 'Em Elaboração',          '#7F94A8', 10, 'ganha', 0, false, true, NOW(), NOW()),
            ('00000000-0000-0000-0000-000000009202', tenant_dev_id, pipe_juridico_id, 'ETA-202', 'Em Aprovação',           '#BB6BD9', 30, 'ganha', 1, false, true, NOW(), NOW()),
            ('00000000-0000-0000-0000-000000009203', tenant_dev_id, pipe_juridico_id, 'ETA-203', 'Aguardando Assinatura',  '#74C7E4', 50, 'ganha', 2, false, true, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING;

        RAISE NOTICE 'Seed de dev (V13) executado: pipeline Jurídico + 3 etapas';
    ELSE
        RAISE NOTICE 'Seed Jurídico (V13) pulado (environment = %)', '${environment}';
    END IF;
END $$;

-- ============================================================================
-- V12 · Origem de Negócio vira configuração de banco (ADR-025)
--
-- Antes: enum fixo `OrigemNegocio` no código + coluna oportunidades.origem.
-- Agora: tabela `origens_negocio` editável por tenant, com flags de regra
--   - exige_parceiro: a Oportunidade precisa de um parceiro indicador
--   - exige_detalhe : a Oportunidade precisa de texto livre (campo origem_outros)
--
-- Estratégia (ver decisão do produto · "seed + backfill por tenant"):
--   1. cria a tabela origens_negocio
--   2. semeia as 9 origens padrão em CADA tenant existente (preserva o enum)
--   3. adiciona oportunidades.origem_id e faz backfill a partir do enum antigo
--   4. torna origem_id NOT NULL e remove a coluna origem (enum)
--
-- Prefixo de código: ORI (convenção PREFIXO-NNN · ver V6 e codigo.ts).
-- ============================================================================

CREATE TABLE origens_negocio (
    id              UUID PRIMARY KEY,
    tenant_id       BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    codigo          VARCHAR(40) NOT NULL,
    nome            VARCHAR(80) NOT NULL,
    exige_parceiro  BOOLEAN NOT NULL DEFAULT FALSE,
    exige_detalhe   BOOLEAN NOT NULL DEFAULT FALSE,
    ativo           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL,
    CONSTRAINT uq_origens_negocio_tenant_codigo UNIQUE (tenant_id, codigo)
);
CREATE INDEX idx_origens_negocio_tenant_ativo ON origens_negocio (tenant_id, ativo);

COMMENT ON TABLE origens_negocio IS
    'Canais de origem das Oportunidades · editável por tenant (ADR-025). Substitui o enum OrigemNegocio.';
COMMENT ON COLUMN origens_negocio.exige_parceiro IS
    'Quando TRUE, a Oportunidade com esta origem exige um parceiro indicador (parceiro_id).';
COMMENT ON COLUMN origens_negocio.exige_detalhe IS
    'Quando TRUE, a Oportunidade com esta origem exige texto livre (origem_outros).';

-- Coluna temporária para mapear o enum legado durante o backfill.
ALTER TABLE origens_negocio ADD COLUMN legacy_enum VARCHAR(40);

-- Seed das origens padrão para cada tenant existente (todos os ambientes ·
-- é uma migração de dados que preserva o comportamento atual).
INSERT INTO origens_negocio
    (id, tenant_id, codigo, nome, exige_parceiro, exige_detalhe, ativo, created_at, updated_at, legacy_enum)
SELECT gen_random_uuid(), t.id, seed.codigo, seed.nome,
       seed.exige_parceiro, seed.exige_detalhe, TRUE, NOW(), NOW(), seed.legacy_enum
FROM tenants t
CROSS JOIN (VALUES
    ('ORI-001', 'Indicação de Parceiro', TRUE,  FALSE, 'INDICACAO_PARCEIRO'),
    ('ORI-002', 'Google',                FALSE, FALSE, 'GOOGLE'),
    ('ORI-003', 'Redes Sociais',         FALSE, FALSE, 'REDES_SOCIAIS'),
    ('ORI-004', 'Eventos',               FALSE, FALSE, 'EVENTOS'),
    ('ORI-005', 'Feiras',                FALSE, FALSE, 'FEIRAS'),
    ('ORI-006', 'Neolixer',              FALSE, FALSE, 'NEOLIXER'),
    ('ORI-007', 'Club',                  FALSE, FALSE, 'CLUB'),
    ('ORI-008', 'Partner',               FALSE, FALSE, 'PARTNER'),
    ('ORI-009', 'Outros',                FALSE, TRUE,  'OUTROS')
) AS seed(codigo, nome, exige_parceiro, exige_detalhe, legacy_enum);

-- Adiciona o FK na oportunidades.
ALTER TABLE oportunidades ADD COLUMN origem_id UUID REFERENCES origens_negocio(id);

-- Backfill: converte o enum antigo para o FK correspondente, dentro do tenant.
UPDATE oportunidades o
SET origem_id = ori.id
FROM origens_negocio ori
WHERE ori.tenant_id = o.tenant_id
  AND ori.legacy_enum = o.origem;

-- Rede de segurança: qualquer oportunidade ainda sem origem cai em "Outros".
UPDATE oportunidades o
SET origem_id = ori.id
FROM origens_negocio ori
WHERE o.origem_id IS NULL
  AND ori.tenant_id = o.tenant_id
  AND ori.legacy_enum = 'OUTROS';

ALTER TABLE oportunidades ALTER COLUMN origem_id SET NOT NULL;
CREATE INDEX idx_oportunidades_origem ON oportunidades (origem_id);

COMMENT ON COLUMN oportunidades.origem_id IS
    'Origem de negócio (FK origens_negocio). Substitui a antiga coluna enum `origem`.';

-- Remove a coluna enum legada e a coluna temporária de mapeamento.
ALTER TABLE oportunidades DROP COLUMN origem;
ALTER TABLE origens_negocio DROP COLUMN legacy_enum;

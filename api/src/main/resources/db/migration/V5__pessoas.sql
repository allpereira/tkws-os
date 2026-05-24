-- ============================================================================
-- V5 · pessoas
--
-- Cadastro único de pessoas (físicas e jurídicas) com estado LEAD | CLIENTE.
-- Lead vira Cliente automaticamente quando uma Oportunidade chega numa etapa
-- com a flag `converte_lead_em_cliente = true`.
--
-- Detecção de duplicidade:
--   - Por documento (CPF/CNPJ): UNIQUE constraint impede dois cadastros idênticos
--   - Por email/celular: busca soft (sem unique) · vendedor decide criar mesmo assim
--
-- Veja ADR-018 e docs/13-ONBOARDING.md.
-- ============================================================================

-- A extensão pg_trgm habilita busca por similaridade (LIKE/ILIKE acelerado)
-- e é pré-requisito do índice GIN abaixo (gin_trgm_ops). Por isso é criada
-- ANTES da tabela.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE pessoas (
    id               UUID PRIMARY KEY,
    tenant_id        UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

    tipo_pessoa      VARCHAR(2) NOT NULL,
    documento        VARCHAR(20),
    nome_contato     VARCHAR(160) NOT NULL,
    email_contato    VARCHAR(160),
    celular_contato  VARCHAR(20),
    nome_empresa     VARCHAR(160),

    status           VARCHAR(10) NOT NULL DEFAULT 'LEAD',
    convertido_em    TIMESTAMPTZ,

    endereco         VARCHAR(200),
    cidade           VARCHAR(80),
    uf               VARCHAR(2),
    cep              VARCHAR(10),
    notas            TEXT,

    created_at       TIMESTAMPTZ NOT NULL,
    updated_at       TIMESTAMPTZ NOT NULL,

    CONSTRAINT chk_pessoas_tipo   CHECK (tipo_pessoa IN ('PF', 'PJ')),
    CONSTRAINT chk_pessoas_status CHECK (status IN ('LEAD', 'CLIENTE'))
);

-- Documento único por tenant quando preenchido (NULLs não conflitam no Postgres).
CREATE UNIQUE INDEX uq_pessoas_tenant_documento
    ON pessoas (tenant_id, documento)
    WHERE documento IS NOT NULL;

CREATE INDEX idx_pessoas_tenant_status     ON pessoas (tenant_id, status);
CREATE INDEX idx_pessoas_tenant_email      ON pessoas (tenant_id, email_contato) WHERE email_contato IS NOT NULL;
CREATE INDEX idx_pessoas_tenant_celular    ON pessoas (tenant_id, celular_contato) WHERE celular_contato IS NOT NULL;
CREATE INDEX idx_pessoas_nome_contato_trgm ON pessoas USING gin (nome_contato gin_trgm_ops);

COMMENT ON TABLE pessoas IS
    'Cadastro único de pessoas (PF/PJ). Lead vira Cliente quando uma oportunidade chega numa etapa marcada como conversão.';

COMMENT ON COLUMN pessoas.documento IS
    'CPF (11 dígitos) ou CNPJ (14 dígitos) · armazenado normalizado (só dígitos).';

COMMENT ON COLUMN pessoas.status IS
    'LEAD = potencial · CLIENTE = fechou ao menos uma proposta.';

COMMENT ON COLUMN pessoas.convertido_em IS
    'Timestamp da conversão LEAD → CLIENTE. NULL enquanto LEAD.';

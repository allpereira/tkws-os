-- ============================================================================
-- V6 · CRM + Organização · schemas das demais tabelas de domínio
--
-- Cria as tabelas que o frontend já consome via API (mesmo que as features
-- Java só sejam implementadas em PRs futuras). DDL + constraints +
-- índices. Seeds globais em V7.
--
-- Estrutura padrão de cada tabela "config":
--   id (UUID), tenant_id (FK tenants), codigo (string), nome (string),
--   ativo (boolean), created_at, updated_at
--
-- Convenção de prefixo de código (ver memória feedback-configs-simplified):
--   SET (Setores) · TPR (Tipos de Projetos) · FUN (Funções de Pessoas)
--   EMP (Empreendimentos) · OFE (Ofertas) · UNI (Unidades)
--   TEM (Tipos de Empresa) · PIP (Pipelines) · ETA (Etapas)
--   TPG (Tipos de Pagamento) · TPS (Tipos de Propostas — REMOVIDO em V7)
-- ============================================================================

-- =========== Organização · configurações simples (codigo + nome + ativo) =====

CREATE TABLE setores (
    id          UUID PRIMARY KEY,
    tenant_id   BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    codigo      VARCHAR(40) NOT NULL,
    nome        VARCHAR(80) NOT NULL,
    ativo       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL,
    updated_at  TIMESTAMPTZ NOT NULL,
    CONSTRAINT uq_setores_tenant_codigo UNIQUE (tenant_id, codigo)
);
CREATE INDEX idx_setores_tenant_ativo ON setores (tenant_id, ativo);

CREATE TABLE funcoes_pessoas (
    id          UUID PRIMARY KEY,
    tenant_id   BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    codigo      VARCHAR(40) NOT NULL,
    nome        VARCHAR(80) NOT NULL,
    ativo       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL,
    updated_at  TIMESTAMPTZ NOT NULL,
    CONSTRAINT uq_funcoes_pessoas_tenant_codigo UNIQUE (tenant_id, codigo)
);
CREATE INDEX idx_funcoes_pessoas_tenant_ativo ON funcoes_pessoas (tenant_id, ativo);

CREATE TABLE tipos_empresa (
    id          UUID PRIMARY KEY,
    tenant_id   BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    codigo      VARCHAR(40) NOT NULL,
    nome        VARCHAR(80) NOT NULL,
    ativo       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL,
    updated_at  TIMESTAMPTZ NOT NULL,
    CONSTRAINT uq_tipos_empresa_tenant_codigo UNIQUE (tenant_id, codigo)
);
CREATE INDEX idx_tipos_empresa_tenant_ativo ON tipos_empresa (tenant_id, ativo);

CREATE TABLE tipos_projeto (
    id          UUID PRIMARY KEY,
    tenant_id   BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    codigo      VARCHAR(40) NOT NULL,
    nome        VARCHAR(80) NOT NULL,
    ativo       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL,
    updated_at  TIMESTAMPTZ NOT NULL,
    CONSTRAINT uq_tipos_projeto_tenant_codigo UNIQUE (tenant_id, codigo)
);
CREATE INDEX idx_tipos_projeto_tenant_ativo ON tipos_projeto (tenant_id, ativo);

CREATE TABLE unidades (
    id          UUID PRIMARY KEY,
    tenant_id   BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    codigo      VARCHAR(40) NOT NULL,
    nome        VARCHAR(120) NOT NULL,
    ativo       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL,
    updated_at  TIMESTAMPTZ NOT NULL,
    CONSTRAINT uq_unidades_tenant_codigo UNIQUE (tenant_id, codigo)
);
CREATE INDEX idx_unidades_tenant_ativo ON unidades (tenant_id, ativo);

CREATE TABLE empreendimentos (
    id          UUID PRIMARY KEY,
    tenant_id   BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    codigo      VARCHAR(40) NOT NULL,
    nome        VARCHAR(160) NOT NULL,
    ativo       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL,
    updated_at  TIMESTAMPTZ NOT NULL,
    CONSTRAINT uq_empreendimentos_tenant_codigo UNIQUE (tenant_id, codigo)
);
CREATE INDEX idx_empreendimentos_tenant_ativo ON empreendimentos (tenant_id, ativo);

CREATE TABLE ofertas (
    id          UUID PRIMARY KEY,
    tenant_id   BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    codigo      VARCHAR(40) NOT NULL,
    nome        VARCHAR(160) NOT NULL,
    ativo       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL,
    updated_at  TIMESTAMPTZ NOT NULL,
    CONSTRAINT uq_ofertas_tenant_codigo UNIQUE (tenant_id, codigo)
);
CREATE INDEX idx_ofertas_tenant_ativo ON ofertas (tenant_id, ativo);

COMMENT ON TABLE ofertas IS
    'Catálogo do que a organização oferece aos clientes. Tipo de Oferta selecionado ao criar uma Oportunidade (ex-Tipo de Proposta).';

-- =========== CRM · configurações comerciais ==================================

CREATE TABLE tipos_pagamento (
    id          UUID PRIMARY KEY,
    tenant_id   BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    codigo      VARCHAR(40) NOT NULL,
    nome        VARCHAR(80) NOT NULL,
    ativo       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL,
    updated_at  TIMESTAMPTZ NOT NULL,
    CONSTRAINT uq_tipos_pagamento_tenant_codigo UNIQUE (tenant_id, codigo)
);
CREATE INDEX idx_tipos_pagamento_tenant_ativo ON tipos_pagamento (tenant_id, ativo);

CREATE TABLE pipelines (
    id          UUID PRIMARY KEY,
    tenant_id   BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    codigo      VARCHAR(40) NOT NULL,
    nome        VARCHAR(80) NOT NULL,
    descricao   VARCHAR(280),
    modulo      VARCHAR(20) NOT NULL,                -- 'atendimento' | 'proposta'
    ordem       INT NOT NULL DEFAULT 0,
    ativo       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL,
    updated_at  TIMESTAMPTZ NOT NULL,
    CONSTRAINT uq_pipelines_tenant_codigo UNIQUE (tenant_id, codigo),
    CONSTRAINT chk_pipelines_modulo CHECK (modulo IN ('atendimento', 'proposta'))
);
CREATE INDEX idx_pipelines_tenant_modulo_ativo ON pipelines (tenant_id, modulo, ativo);

CREATE TABLE etapas (
    id                          UUID PRIMARY KEY,
    tenant_id                   BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    pipeline_id                 UUID NOT NULL REFERENCES pipelines(id) ON DELETE CASCADE,
    codigo                      VARCHAR(40) NOT NULL,
    nome                        VARCHAR(80) NOT NULL,
    descricao                   VARCHAR(280),
    cor                         VARCHAR(7) NOT NULL DEFAULT '#74C7E4',
    probabilidade               SMALLINT NOT NULL DEFAULT 50,
    tipo                        VARCHAR(10) NOT NULL DEFAULT 'aberta',  -- 'aberta'|'ganha'|'perdida'
    ordem                       INT NOT NULL DEFAULT 0,
    converte_lead_em_cliente    BOOLEAN NOT NULL DEFAULT FALSE,
    ativo                       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at                  TIMESTAMPTZ NOT NULL,
    updated_at                  TIMESTAMPTZ NOT NULL,
    CONSTRAINT uq_etapas_tenant_codigo  UNIQUE (tenant_id, codigo),
    CONSTRAINT chk_etapas_tipo          CHECK (tipo IN ('aberta', 'ganha', 'perdida')),
    CONSTRAINT chk_etapas_probabilidade CHECK (probabilidade BETWEEN 0 AND 100)
);
CREATE INDEX idx_etapas_pipeline_ordem ON etapas (pipeline_id, ordem);
CREATE INDEX idx_etapas_tenant_ativo   ON etapas (tenant_id, ativo);

COMMENT ON COLUMN etapas.converte_lead_em_cliente IS
    'Quando uma Oportunidade chega numa etapa com esta flag, a Pessoa vinculada vira CLIENTE.';

-- =========== Oportunidades (= negócios) ======================================

CREATE TABLE oportunidades (
    id                  UUID PRIMARY KEY,
    tenant_id           BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    pipeline_id         UUID NOT NULL REFERENCES pipelines(id),
    etapa_id            UUID NOT NULL REFERENCES etapas(id),
    pessoa_id           UUID REFERENCES pessoas(id) ON DELETE SET NULL,
    oferta_id           UUID REFERENCES ofertas(id),
    tipo_pagamento_id   UUID REFERENCES tipos_pagamento(id),
    empreendimento_id   UUID REFERENCES empreendimentos(id),
    tipo_projeto_id     UUID REFERENCES tipos_projeto(id),
    responsavel_id      UUID REFERENCES users(id),
    titulo              VARCHAR(200) NOT NULL,
    descricao           TEXT,
    valor               NUMERIC(14, 2) NOT NULL DEFAULT 0,
    metragem_m2         NUMERIC(10, 2),  -- usado para calcular Valor do Projeto = m² × 150 (configurável)
    prazo_fechamento    DATE,
    notas               TEXT,
    created_at          TIMESTAMPTZ NOT NULL,
    updated_at          TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_oportunidades_tenant_pipeline ON oportunidades (tenant_id, pipeline_id);
CREATE INDEX idx_oportunidades_etapa           ON oportunidades (etapa_id);
CREATE INDEX idx_oportunidades_pessoa          ON oportunidades (pessoa_id);

COMMENT ON TABLE oportunidades IS
    'Oportunidades (também chamadas negócios) · vivem dentro de Pipelines/Etapas. Quando chegam numa etapa com converte_lead_em_cliente=TRUE, promovem a Pessoa para CLIENTE.';

COMMENT ON COLUMN oportunidades.oferta_id IS
    'Substitui o antigo tipo_proposta_id. Referencia o catálogo de Ofertas.';

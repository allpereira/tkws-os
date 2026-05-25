-- Feature flags: permite ligar/desligar funcionalidades por tenant ou globalmente.
-- Ver ADR-013 e docs/12-FEATURE-FLAGS.md.
--
-- Quando criar feature flag nova:
-- 1. Insere registro nesta tabela via migration nova (V{N}__add_flag_*.sql)
-- 2. Usa no código via FeatureFlagService.isEnabled("nome-da-flag", tenantId)
-- 3. Quando remover: DELETE da tabela + remoção do código no mesmo PR

CREATE TABLE feature_flags (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                VARCHAR(100) NOT NULL UNIQUE,
    description         TEXT,
    default_enabled     BOOLEAN NOT NULL DEFAULT FALSE,
    enabled_for_tenants BIGINT[] NOT NULL DEFAULT '{}',
    disabled_for_tenants BIGINT[] NOT NULL DEFAULT '{}',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE feature_flags IS 'Feature flags pra ligar/desligar funcionalidades por tenant ou globalmente.';
COMMENT ON COLUMN feature_flags.name IS 'Identificador único da flag (kebab-case). Ex: new-budget-flow, mobile-uploads-v2';
COMMENT ON COLUMN feature_flags.default_enabled IS 'Se TRUE, ativa pra todos os tenants exceto os em disabled_for_tenants. Se FALSE, desativa pra todos exceto os em enabled_for_tenants.';
COMMENT ON COLUMN feature_flags.enabled_for_tenants IS 'Lista de tenant_ids que TÊM acesso (aplica quando default_enabled=FALSE)';
COMMENT ON COLUMN feature_flags.disabled_for_tenants IS 'Lista de tenant_ids que NÃO têm acesso (aplica quando default_enabled=TRUE)';

CREATE INDEX idx_feature_flags_name ON feature_flags(name);

-- Seed inicial de flags previstas
INSERT INTO feature_flags (name, description, default_enabled) VALUES
    ('crm-leads-v1', 'Módulo de CRM (gestão de leads). MVP da feature CRM.', false),
    ('orcamento-v1', 'Módulo de Orçamento. Depende de crm-leads-v1.', false),
    ('catalogo-produtos-v1', 'Catálogo de produtos compartilhado entre Orçamento e Suprimentos.', false),
    ('suprimentos-v1', 'Módulo de Suprimentos. Depende de catalogo-produtos-v1.', false),
    ('projetos-v1', 'Módulo de Projetos (turnkey). Depende de orcamento-v1.', false),
    ('mobile-app', 'Cliente mobile (Capacitor) disponível pra este tenant.', false),
    ('beta-features', 'Tenant participa do programa de features beta.', false);

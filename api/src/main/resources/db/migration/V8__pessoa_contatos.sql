-- ============================================================================
-- V8 · pessoa_contatos
--
-- Contatos associados a uma Pessoa (sócio, representante legal, parente,
-- cônjuge, …). Relação 1:N com `pessoas`. Ver ADR-023.
--
-- O conjunto válido de `tipo_relacionamento` depende do tipo da pessoa dona
-- (PF × PJ) e é validado na camada de aplicação — aqui guardamos só o CHECK
-- de domínio fechado (todos os valores possíveis).
-- ============================================================================

CREATE TABLE pessoa_contatos (
    id                   UUID PRIMARY KEY,
    pessoa_id            UUID NOT NULL REFERENCES pessoas(id) ON DELETE CASCADE,
    tenant_id            BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

    nome                 VARCHAR(160) NOT NULL,
    email                VARCHAR(160),
    telefone             VARCHAR(20),
    tipo_relacionamento  VARCHAR(30) NOT NULL,

    created_at           TIMESTAMPTZ NOT NULL,
    updated_at           TIMESTAMPTZ NOT NULL,

    CONSTRAINT chk_pessoa_contatos_relacionamento CHECK (tipo_relacionamento IN (
        'SOCIO', 'REPRESENTANTE_LEGAL',
        'PARENTE', 'PAI', 'MAE', 'FILHO', 'FILHA', 'CONJUGE', 'OUTROS'
    ))
);

CREATE INDEX idx_pessoa_contatos_pessoa ON pessoa_contatos (tenant_id, pessoa_id);

COMMENT ON TABLE pessoa_contatos IS
    'Contatos de uma Pessoa (sócios/representante para PJ; parentes/cônjuge para PF). Ver ADR-023.';

COMMENT ON COLUMN pessoa_contatos.tipo_relacionamento IS
    'Natureza do vínculo. PJ: SOCIO, REPRESENTANTE_LEGAL. PF: PARENTE, PAI, MAE, FILHO, FILHA, CONJUGE, OUTROS.';

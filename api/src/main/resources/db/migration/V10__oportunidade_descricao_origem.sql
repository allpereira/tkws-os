-- Oportunidade · descrição única (remove título), previsão de fechamento, origem do negócio.

ALTER TABLE oportunidades RENAME COLUMN prazo_fechamento TO previsao_fechamento;

UPDATE oportunidades
SET descricao = titulo
WHERE descricao IS NULL OR TRIM(descricao) = '';

ALTER TABLE oportunidades DROP COLUMN titulo;

ALTER TABLE oportunidades
    ALTER COLUMN descricao TYPE VARCHAR(200);

ALTER TABLE oportunidades
    ALTER COLUMN descricao SET NOT NULL;

ALTER TABLE oportunidades
    ADD COLUMN origem VARCHAR(40),
    ADD COLUMN origem_outros VARCHAR(160),
    ADD COLUMN parceiro_id UUID REFERENCES pessoas(id) ON DELETE SET NULL;

UPDATE oportunidades SET origem = 'OUTROS' WHERE origem IS NULL;

ALTER TABLE oportunidades ALTER COLUMN origem SET NOT NULL;

CREATE INDEX idx_oportunidades_parceiro ON oportunidades (parceiro_id);

COMMENT ON COLUMN oportunidades.descricao IS
    'Identificação do negócio em uma linha (ex.: unidade + briefing). Substitui o antigo titulo.';

COMMENT ON COLUMN oportunidades.previsao_fechamento IS
    'Data prevista de fechamento do negócio (antes prazo_fechamento).';

COMMENT ON COLUMN oportunidades.origem IS
    'Canal de origem do negócio (INDICACAO_PARCEIRO, GOOGLE, REDES_SOCIAIS, EVENTOS, FEIRAS, OUTROS).';

COMMENT ON COLUMN oportunidades.origem_outros IS
    'Detalhe quando origem = OUTROS.';

COMMENT ON COLUMN oportunidades.parceiro_id IS
    'Parceiro indicador · obrigatório quando origem = INDICACAO_PARCEIRO.';

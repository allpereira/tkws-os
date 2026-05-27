-- Registros migrados em V10 ficaram com origem = OUTROS sem detalhe.
-- Permite listar/editar até o usuário informar a origem real.

UPDATE oportunidades
SET origem_outros = 'Não informado (legado)'
WHERE origem = 'OUTROS'
  AND (origem_outros IS NULL OR TRIM(origem_outros) = '');

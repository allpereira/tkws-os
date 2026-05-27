-- V9 · índices de apoio à listagem filtrada de Pessoas (telas Leads/Clientes).
-- Ver ADR-022 (paginação) e o endpoint GET /api/v1/pessoas com filtros
-- status / tipoPessoa / cidade / uf + busca textual + ordenação.

-- Filtro por tipo de pessoa (PF/PJ) dentro do tenant.
CREATE INDEX IF NOT EXISTS idx_pessoas_tenant_tipo
    ON pessoas (tenant_id, tipo_pessoa);

-- Filtro por localização (UF e cidade) dentro do tenant.
CREATE INDEX IF NOT EXISTS idx_pessoas_tenant_uf_cidade
    ON pessoas (tenant_id, uf, cidade);

-- Ordenação "convertido recente" em Clientes (status='CLIENTE' + convertido_em desc).
CREATE INDEX IF NOT EXISTS idx_pessoas_tenant_convertido_em
    ON pessoas (tenant_id, convertido_em DESC);

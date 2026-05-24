# ADR-018 — Pessoas unificadas (Lead + Cliente em uma tabela)

**Status:** Aceito
**Data:** 2026-05-23
**Decisores:** Allysson Pereira (CEO Group WS)

## Contexto

O TKWS OS atende escritórios de arquitetura que trabalham com um funil comercial clássico:

1. Capta um **lead** (alguém potencialmente interessado).
2. Conversa, qualifica, manda proposta.
3. Lead **vira cliente** quando fecha uma proposta.

Modelos comuns em CRMs colocam Lead e Cliente em **tabelas separadas** com promoção (cópia de dados de uma para a outra). Isso causa três problemas concretos:

1. **Duplicação:** o mesmo CPF/CNPJ vira dois registros, o histórico fragmenta.
2. **Tooling duplicado:** dois CRUDs, dois sets de endpoints, dois schemas Zod, duas listas para o vendedor olhar.
3. **Estado escondido:** "essa pessoa já é cliente?" exige cruzar tabelas.

Além disso, na hora de criar uma **Oportunidade** (no módulo Atendimento), o vendedor frequentemente já conhece a pessoa de algum contato anterior — precisa que o sistema **detecte automaticamente** se aquele documento/email/celular já existe e sugira o cadastro, em vez de criar um Lead duplicado.

## Decisão

**Uma única tabela `pessoas` com coluna `status` (LEAD | CLIENTE).**

- Pessoa nasce sempre como **LEAD** quando entra no funil.
- Vira **CLIENTE** automaticamente quando uma Oportunidade chega numa **etapa marcada como "converte lead em cliente"** (flag `converte_lead_em_cliente` nas Etapas).
- `Leads` e `Clientes` no frontend são **views/filtros** sobre `/api/v1/pessoas?status=LEAD` ou `?status=CLIENTE`.

### Campos mínimos para criar um Lead

Ao criar uma Oportunidade na tela de Atendimento, o vendedor precisa cadastrar uma Pessoa rapidamente. Os campos pedidos no momento são:

- **Tipo de pessoa** (PF | PJ)
- **Documento** (CPF se PF, CNPJ se PJ) — **opcional**
- **Nome do contato** (obrigatório)
- **Email do contato** — opcional
- **Celular do contato** — opcional
- **Nome da empresa** — só PJ, opcional

Demais campos (endereço, notas, score) são preenchidos depois, no detalhe da Pessoa.

### Detecção de duplicidade

Antes de criar uma Pessoa nova ao iniciar uma Oportunidade, o frontend chama:

- `GET /api/v1/pessoas/buscar?documento=...` (busca exata · se achar e for CLIENTE, **alertar** "essa pessoa já é cliente").
- `GET /api/v1/pessoas/buscar?email=...&celular=...` (busca soft · se achar, **sugerir** usar o cadastro existente).

O vendedor pode optar por **criar mesmo assim** quando só email/celular bate (pode ser homônimo). Quando **CPF/CNPJ bate**, a criação duplicada é bloqueada (DB unique constraint por `tenant_id + documento`).

### Etapas marcam conversão

Cada Etapa tem `converte_lead_em_cliente BOOLEAN`. Por padrão `false`. As etapas terminais positivas (Fechamento no pipeline Comercial; Aprovação no pipeline de Proposta) marcam `true`. Quando uma Oportunidade chega lá, o sistema:

1. Atualiza `pessoa.status = CLIENTE`.
2. Marca `pessoa.convertido_em = NOW()`.
3. Publica evento `PessoaConvertedToClienteEvent`.

## Alternativas consideradas

### A) Manter `leads` e `clientes` separados, com promoção (REJEITADO)
- Cópia de dados, dois CRUDs, integridade frágil.

### B) Tabela `pessoas` + `clientes` herda 1:1 (REJEITADO)
- Complexidade desnecessária; mesmo dado em duas tabelas relacionadas. Não há campos exclusivos de cliente que justifiquem.

### C) Tabela única + status (ACEITO) ✓
- Histórico unificado, dedup trivial, view simples.

## Consequências

### Positivas
- Endpoint único, cadastro único, schema Zod único.
- Dedup nativa via constraint `UNIQUE(tenant_id, documento)`.
- Histórico preservado quando vira cliente (data de conversão registrada).
- Frontend pode listar "leads" e "clientes" como dois views/abas.

### Negativas
- Migração de dados existentes (se houver) precisa mapear `leads`+`clientes` → `pessoas`. Como temos backend novo, não há dados em produção — sem custo.
- Frontend precisa renomear módulos `leads/` e `clientes/` para `pessoas/` (próxima PR).

### Trade-offs
- Não suporta campos exclusivos de Cliente (e.g., "data de assinatura do contrato"). Resolvemos isso colocando esses campos na **Oportunidade** (que registra o fechamento), não na Pessoa. Pessoa permanece o cadastro de contato.

## Modelo de dados

```sql
CREATE TABLE pessoas (
    id              UUID PRIMARY KEY,
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    tipo_pessoa     VARCHAR(2) NOT NULL,            -- 'PF' | 'PJ'
    documento       VARCHAR(20),                     -- CPF ou CNPJ · normalizado (só dígitos)
    nome_contato    VARCHAR(160) NOT NULL,
    email_contato   VARCHAR(160),
    celular_contato VARCHAR(20),
    nome_empresa    VARCHAR(160),                    -- só PJ
    status          VARCHAR(10) NOT NULL DEFAULT 'LEAD', -- 'LEAD' | 'CLIENTE'
    convertido_em   TIMESTAMPTZ,                     -- preenchido quando vira CLIENTE
    endereco        VARCHAR(200),
    cidade          VARCHAR(80),
    uf              CHAR(2),
    cep             VARCHAR(10),
    notas           TEXT,
    created_at      TIMESTAMPTZ NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL,

    CONSTRAINT uq_pessoas_tenant_documento UNIQUE (tenant_id, documento),
    CONSTRAINT chk_pessoas_tipo CHECK (tipo_pessoa IN ('PF', 'PJ')),
    CONSTRAINT chk_pessoas_status CHECK (status IN ('LEAD', 'CLIENTE'))
);
```

## Componente afetado

- Backend: feature `pessoas` (nova).
- Frontend: `modules/crm/leads/` e `modules/crm/clientes/` serão unificados em `modules/crm/pessoas/` em PR separada.
- Etapas: nova coluna `converte_lead_em_cliente`.

## Relacionado

- [ADR-017](ADR-017-modules-domain-first.md) · estrutura de módulos
- [docs/00-ARCHITECTURE.md](../00-ARCHITECTURE.md) · Clean Architecture
- [docs/10-FEATURE-CHECKLIST.md](../10-FEATURE-CHECKLIST.md)

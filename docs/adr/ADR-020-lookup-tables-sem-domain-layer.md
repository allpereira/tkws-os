# ADR-020 — Lookup tables sem domain layer (Clean Architecture pragmática)

**Status:** Aceito
**Data:** 2026-05-23
**Decisores:** Allysson Pereira

## Contexto

O TKWS OS tem **8 tabelas de configuração** que seguem o padrão idêntico:

```
id · tenant_id · codigo · nome · ativo · created_at · updated_at
```

| Feature | Endpoint |
|---|---|
| Ofertas | `/api/v1/organizacao/ofertas` |
| Tipos de Empresa | `/api/v1/organizacao/tipos-empresa` |
| Unidades | `/api/v1/organizacao/unidades` |
| Setores | `/api/v1/organizacao/setores` |
| Tipos de Projeto | `/api/v1/organizacao/tipos-projeto` |
| Funções de Pessoas | `/api/v1/organizacao/funcoes-pessoas` |
| Empreendimentos | `/api/v1/organizacao/empreendimentos` |
| Tipos de Pagamento | `/api/v1/crm/tipos-pagamento` |

Nenhuma tem invariantes próprias além das já enforçadas pelo schema (`UNIQUE(tenant_id, codigo)`, `NOT NULL` em codigo/nome). Nenhuma emite eventos de domínio. Nenhuma tem comportamento — são puras tabelas de referência (lookup tables).

Se aplicarmos Clean Architecture COMPLETA (Aggregate Root + ID type + Repository port + Use cases + DTOs + JpaEntity + JpaRepository + Adapter + Controller + Request + View) para cada uma, ficamos com **~80 arquivos** que repetem exatamente o mesmo padrão. Isso é DRY violation gritante e desfavorável a leitura — não traz nenhum benefício porque não há regras de negócio próprias para encapsular.

## Decisão

**Lookup tables não têm domain layer separada.** Em vez disso, vivem todas sob uma abstração em `shared/crud/`:

```
shared/crud/
├── LookupJpaEntity        (@MappedSuperclass · campos comuns)
├── LookupRequest          (DTO create/update)
├── LookupView             (DTO response)
├── LookupRepository<E>    (interface base · @NoRepositoryBean)
├── LookupService<E>       (5 ops CRUD · genérico)
├── LookupController<E>    (5 endpoints REST · abstract)
├── LookupNotFoundException
└── LookupCodigoDuplicadoException
```

Cada feature contém apenas:

```
features/<dominio>/configuracoes/<feature>/
├── <Nome>JpaEntity.java       · 5 linhas (extends LookupJpaEntity)
├── <Nome>JpaRepository.java   · 3 linhas (extends LookupRepository<Nome>)
└── <Nome>Controller.java      · ~15 linhas (extends LookupController)
```

Multi-tenancy via `@CurrentTenant TenantContext` (ver ADR-019).

## Critério para promover uma lookup table a feature completa

Se uma das 8 features acima passar a ter:

- Invariantes de negócio próprias (ex: "código não pode mudar após criação")
- Eventos de domínio (ex: "AtivacaoOfertaPedidaEvent")
- Lógica condicional complexa (ex: "ao desativar oferta, marcar oportunidades pendentes como…")
- Múltiplos campos com semântica forte (ex: pipelines tem `modulo`, etapas tem `cor`/`tipo`/`probabilidade`)

**...então ela é promovida para Clean Architecture completa** (domain/application/infrastructure/web próprios). Não é exceção, é o caminho natural quando a complexidade aparece.

## Features que **não** seguem este padrão (Clean Architecture completa)

- `pessoas` — agregado com estado (LEAD/CLIENTE), eventos, regras
- `pipelines` — tem `modulo`, `ordem`, e referência cíclica com etapas
- `etapas` — pertence a pipeline, tem `cor`/`tipo`/`probabilidade`/`converte_lead_em_cliente`
- `oportunidades` — múltiplas FKs (pessoa, oferta, pipeline, etapa, tipo_pagamento), regra de promover Pessoa para Cliente

Essas têm comportamento próprio e merecem Aggregate Roots.

## Alternativas consideradas

### A) Clean Architecture completa para todas as 8 (REJEITADO)
- ~80 arquivos. DRY violation. Sem benefício porque não há lógica para encapsular.

### B) Spring Data direto no controller (REJEITADO)
- Quebra ArchUnit (controller acessando `@Entity` direto).
- Sem tipagem de DTOs públicos.

### C) Abstração `Lookup*` no shared, features finas (ACEITO) ✓
- 3 arquivos por feature.
- Tipagem preservada (JpaEntity tipado, controller tipado).
- ArchUnit feliz (controllers usam Service, Service usa Repository).
- Promoção para Clean Architecture completa é caminho natural quando lógica aparecer.

## Consequências

### Positivas
- ~24 arquivos para 8 features em vez de ~80.
- API consistente — todas as 8 lookups têm exatamente os mesmos endpoints/payloads.
- Trocar `LookupRequest` (e.g., adicionar campo `ordem`) afeta as 8 de uma vez.

### Negativas
- Quando uma lookup table for promovida a feature completa (terá comportamento próprio), precisa migrar de `LookupJpaEntity` para Aggregate Root próprio. Caminho documentado mas é trabalho real.
- ArchUnit precisa de regra: `shared.crud` é o único package onde `@Entity` pode aparecer fora de `infrastructure/persistence/`. Adicionar exceção.

### Trade-offs
- "Anemic domain" para essas 8 entidades. Aceitável porque o "domínio" delas é uma tabela de referência — não há comportamento para encapsular.

## Implementação

Ver `shared/crud/` e qualquer das 8 features (e.g., `features/organizacao/ofertas/`).

## Relacionado

- [ADR-017](ADR-017-modules-domain-first.md) · estrutura de módulos
- [ADR-018](ADR-018-pessoas-unificadas.md) · Pessoas (Clean Architecture completa)
- [ADR-019](ADR-019-tenant-context-from-jwt.md) · `@CurrentTenant`
- [docs/00-ARCHITECTURE.md](../00-ARCHITECTURE.md)

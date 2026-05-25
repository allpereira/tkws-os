# ADRs — Architecture Decision Records

> Decisões arquiteturais importantes do TKWS OS. Cada decisão grande vira um ADR aqui.

## Por que ADRs

- **Memória institucional:** daqui a 6 meses, ninguém lembra por que escolhemos X
- **Onboarding:** novo dev (humano ou IA) entende rapidamente o "porquê"
- **Reversibilidade consciente:** se mudar de ideia, registra o porquê da mudança

## Quando criar um ADR

Sempre que houver decisão arquitetural com:
- Múltiplas alternativas viáveis
- Trade-offs significativos
- Impacto em mais de uma feature
- Reversão custosa

## Template

Use o template em `_template.md` ao criar um novo ADR. Numeração sequencial: `ADR-NNN-titulo-curto.md`.

## Status de um ADR

- **Proposed:** em discussão
- **Accepted:** decisão tomada, em vigor
- **Deprecated:** substituído por outro ADR
- **Superseded by ADR-XXX:** explicitamente substituído

## Convenção de status (escolhida)

Use sempre **inglês** (`Accepted`, `Deprecated`, `Superseded by ADR-XXX`).
ADRs antigos em português (`Aceito`) podem permanecer mas qualquer ADR novo
ou revisado deve usar a forma em inglês.

## Index

> **Gap intencional**: ADR-017 não foi escrito (número pulado). Não usar essa
> numeração para ADRs futuros · prefira seguir a sequência (022, 023, ...).

| # | Título | Status | Data |
|---|---|---|---|
| 001 | Clean Architecture + DDD tático + Feature-based | Accepted | 2025-05 |
| 002 | Backend em Java 21 + Spring Boot 3 | Accepted | 2025-05 |
| 003 | Frontend em React 19 | Accepted | 2025-05 |
| 004 | Auth via Zitadel self-hosted | Accepted | 2025-05 |
| 005 | Cloud em AWS (sa-east-1) | Accepted | 2025-05 |
| 006 | Docker Compose puro (backend) | Accepted (atualizado por 012 para frontend) | 2025-05 |
| 007 | Multi-tenancy via discriminator + RLS | Accepted (tipo atualizado por 021) | 2025-05 |
| 008 | Testing Trophy (Kent Dodds) | Accepted | 2025-05 |
| 009 | ArchUnit para validar fronteiras | Accepted | 2025-05 |
| 010 | TanStack Router (não React Router) | Accepted | 2025-05 |
| 011 | Monorepo único | Accepted | 2025-05 |
| 012 | Cloudflare Pages para frontend | Accepted | 2025-05 |
| 013 | Feature flags via tabela + Caffeine | Accepted | 2025-05 |
| 014 | Auto-cadastro com aprovação manual | Accepted | 2025-05 |
| 015 | Custom Login V2 (SPA própria) | Accepted | 2026-05 |
| 016 | Cadastro de membros via convite por email | Accepted | 2026-05 |
| 017 | (não existe · gap intencional) | — | — |
| 018 | Pessoas unificadas (Lead + Cliente em uma tabela) | Accepted | 2026-05 |
| 019 | Tenant context resolvido do JWT, nunca de query/body | Accepted | 2026-05 |
| 020 | Lookup tables sem domain layer (Clean Architecture pragmática) | Accepted | 2026-05 |
| 021 | `tenants.id` como BIGINT, `zitadel_org_id` à parte | Accepted | 2026-05 |

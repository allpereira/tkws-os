# ADR-025: Origem de Negócio configurável (enum → Aggregate Root)

**Status:** Accepted
**Data:** 2026-05-27
**Decisores:** Allysson

## Contexto

A origem de uma Oportunidade (canal: Google, Indicação de Parceiro, Eventos…)
era um `enum OrigemNegocio` fixo no código — tanto no backend
(`features/crm/oportunidades/domain/model/OrigemNegocio.java`, 6 valores) quanto
no frontend (`ORIGEM_NEGOCIO`, 9 valores). Isso gerava:

- **Divergência** entre as listas (backend 6 vs frontend 9: `NEOLIXER`, `CLUB`,
  `PARTNER` só existiam no front e quebrariam ao chegar no backend).
- **Acoplamento de produto a deploy:** cada tenant que quisesse um novo canal
  precisava de alteração de código + release.

A origem ainda carrega duas regras de negócio: `INDICACAO_PARCEIRO` exige um
parceiro indicador (`parceiroId`) e `OUTROS` exige texto livre (`origemOutros`).

## Decisão

Origem de Negócio vira **configuração de banco editável por tenant**, modelada
como **Aggregate Root** (não lookup table de 3 campos da ADR-020), porque carrega
duas flags com semântica de regra:

- `exige_parceiro` — a Oportunidade exige `parceiroId`.
- `exige_detalhe` — a Oportunidade exige `origemOutros`.

A Oportunidade passa a referenciar `origem_id` (FK) em vez do enum. As flags não
moram na Oportunidade: o `OportunidadeService` as consulta via o port
`OrigemLookup` (espelhando o já existente `EtapaLookup`) e as passa para
`Oportunidade.create()` / `updateDetalhes()`, que então validam. Isso mantém o
limite entre features — Oportunidades não importa a JPA entity de Origens, só
pergunta o que precisa pelo service público.

Migração (V12): cria `origens_negocio`, semeia as 9 origens padrão em cada tenant
existente (preservando o comportamento atual), adiciona `oportunidades.origem_id`,
faz backfill a partir do enum antigo e remove a coluna `origem`.

## Alternativas consideradas

1. **Lookup table simples (ADR-020)** — só `codigo + nome + ativo`. Prós: mínimo
   código (3 arquivos via `LookupController`). Contra: não comportaria as flags
   de regra; perderíamos a exigência de parceiro/detalhe ou teríamos que
   hard-codar códigos reservados.
2. **Códigos reservados** — lookup simples + frontend tratando `INDICACAO_PARCEIRO`
   e `OUTROS` como especiais. Contra: reacopla comportamento a strings de código,
   frágil e não configurável.
3. **Aggregate Root com flags (escolhida)** — preserva 100% do comportamento, é
   configurável por tenant e segue o padrão já consolidado de `Etapa` +
   `EtapaLookup`. Custo: mais arquivos que um lookup.

## Consequências

### Positivas

- Cada tenant modela seus próprios canais sem deploy.
- Acaba a divergência backend/frontend (lista única, vinda do banco).
- Regras (parceiro/detalhe) ficam configuráveis por origem, não fixas em 2 valores.

### Negativas / Trade-offs

- Mais superfície de código que um lookup simples (domain/application/infra/web).
- O formulário de Oportunidade valida parceiro/detalhe em runtime (as flags vêm da
  origem carregada), não em Zod puro.

### Riscos

- Tenant sem nenhuma origem cadastrada não consegue criar Oportunidade (origem é
  obrigatória). Mitigado pelo seed da V12 nos tenants existentes e pelo hint no
  formulário ("cadastre em Configurações → CRM → Origens de Negócio"). Novos
  tenants seguem o mesmo modelo de Pipelines/Etapas (cadastro pelo admin).

## Notas adicionais

- Tabela: `api/.../db/migration/V12__origens_negocio.sql`.
- Backend: `features/crm/configuracoes/origensnegocio/` + port
  `oportunidades/domain/port/OrigemLookup.java`.
- Frontend: `modules/crm/configuracoes/origens-negocio/` + rota
  `/settings/crm/origens-negocio`.
- Relacionado: ADR-018 (cadastro unificado Pessoa), ADR-020 (lookup tables),
  ADR-024 (status HTTP de DomainException).

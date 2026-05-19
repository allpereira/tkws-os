# ADR-013: Feature flags via tabela própria + Caffeine cache

**Status:** Accepted
**Data:** 2025-05
**Decisores:** Allysson

## Contexto

Vamos precisar:
- Liberar features pra beta testers (1 tenant antes dos outros)
- Desligar funcionalidade problemática em produção sem rollback
- Migration gradual entre versões de uma feature (dark launch)
- Eventual customização por contrato enterprise

Decidir: implementação interna ou ferramenta dedicada?

## Decisão

Sistema **interno simples**: tabela `feature_flags` no Postgres, service Java com cache
Caffeine (60s TTL).

## Alternativas consideradas

1. **Unleash (open source, self-hosted)** — robusto, UI bonita
   - Pros: maduro, features avançadas (gradual rollout, segmentação por atributo)
   - Contras: mais um container pra operar, banco próprio, complexidade injustificada no MVP
2. **LaunchDarkly / Flagsmith / GrowthBook (SaaS)**
   - Pros: zero ops, UI excelente
   - Contras: custo recorrente (LaunchDarkly $$$), vendor extra, dependência pra função core
3. **Variável de ambiente** (booleana no `.env`)
   - Pros: trivial
   - Contras: granularidade zero (tudo ou nada), requer redeploy pra mudar, sem por-tenant
4. **Escolhida: tabela interna + Caffeine** — atende 95% dos casos com 5% do esforço.
   Postgres já está aí, Caffeine é leve, código simples. Quando outgrow, migra pra Unleash
   com pouca refatoração (mesma API de service).

## Consequências

### Positivas
- Zero infra adicional (banco já existe, cache é em memória)
- Cache de 60s = leitura é praticamente grátis
- Lógica explícita no código (sem mágica de SDK)
- Migrations versionadas (quem ativou o quê, quando, está no git)

### Negativas
- Sem UI pra mexer (admin precisa rodar SQL ou usar endpoint REST a ser criado)
- Sem gradual rollout percentual (só por tenant explícito)
- Sem segmentação por atributo do usuário (só por tenant_id)
- Cada instância da API tem seu próprio cache (drift de até 60s entre instâncias)

### Riscos
- Devs/IAs esquecem de **remover** flag após feature estabilizar → vira dívida técnica.
  Mitigar: revisão trimestral de flags com tempo > 6 meses

## Quando reavaliar

- Mais de 20 flags ativas simultaneamente
- Necessidade de gradual rollout percentual (10% dos usuários, 25%, etc)
- Necessidade de segmentação complexa (por país, plano, role)
- Time de produto independente precisando mexer em flags sem dev

Nesses casos, migrar pra **Unleash self-hosted** ou **Flagsmith self-hosted** (open source,
sem custo recorrente).

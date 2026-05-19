# ADR-008: Testing Trophy (Kent Dodds) em vez de pirâmide clássica

**Status:** Accepted
**Data:** 2025-05
**Decisores:** Allysson

## Contexto

Estratégia clássica de testes (pirâmide: muitos unit, alguns integration, poucos E2E) foi
formulada quando integration tests eram lentos e caros. Com Testcontainers, MSW e Playwright,
integration tests viraram baratos e dão mais confiança por linha de teste.

Para dev solo + IA gerando código, decidir onde investir esforço de teste é crítico.

## Decisão

Adotar o **Testing Trophy de Kent Dodds**:

```
              E2E (poucos)         Fluxos críticos do negócio
       Integration (muito)         FOCO PRINCIPAL
            Unit (médio)           Lógica complexa de domínio
       Static (sempre)             TypeScript, ESLint, ArchUnit
```

## Alternativas consideradas

1. **Pirâmide clássica (Cohn)** — muitos unit, poucos IT. Funciona, mas unit testes do tipo
   "mocka tudo" testam mais a implementação que o comportamento. Dão pouca confiança de que
   o sistema funciona.
2. **Trophy invertida (E2E heavy)** — só E2E. Lento, caro, frágil. Difícil isolar falhas.
3. **Só ArchUnit + smoke E2E** — minimalismo extremo. Bugs de lógica passam.
4. **Escolhida:** Trophy — integration tests com Testcontainers (backend) e MSW
   (frontend) dão confiança real com tempo de execução aceitável. Unit fica reservado pra
   lógica de domínio complexa.

## Onde investimos esforço

| Camada | Quantidade | Por quê |
|---|---|---|
| Static (TS, ESLint, ArchUnit) | Sempre | Previne classes de bug inteiras |
| Unit (domain) | Médio | Invariantes de regra de negócio (testa ms) |
| Unit (application/use case) | Baixo | UseCase é orquestração — IT cobre melhor |
| Integration (repository) | Alto | Postgres real via Testcontainers — pega bugs de SQL |
| Integration (controller/IT) | Alto | HTTP → DB completo — pega bugs de fluxo |
| Integration (frontend hooks/components) | Alto | MSW + Testing Library — pega bugs reais |
| E2E (Playwright) | Baixo | Smoke tests + fluxos críticos |

## Consequências

### Positivas
- Mais bugs pegos por hora de esforço de teste
- Refatoração mais segura (testes não amarrados a implementação)
- Cobertura significativa sem maratona de unit test
- Onboarding de novos devs (humanos ou IA) mais fácil

### Negativas
- IT mais lentos que unit (10s vs 1ms cada)
- Setup inicial maior (Testcontainers, MSW)
- Reuso requer disciplina (helpers, fixtures)

### Riscos
- Cobertura em unit pode parecer baixa pra quem não conhece a filosofia — mitigar:
  documentar bem (este ADR + `docs/02-TESTING.md`)
- IT lentos em massa → pipeline lenta — mitigar: paralelismo, reusar Testcontainers

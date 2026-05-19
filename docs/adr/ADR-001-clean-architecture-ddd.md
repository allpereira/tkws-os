# ADR-001: Clean Architecture + DDD tático + Feature-based packaging

**Status:** Accepted
**Data:** 2025-05
**Decisores:** Allysson

## Contexto

TKWS OS terá múltiplos módulos (CRM, Orçamento, Suprimentos, Catálogo, Projetos) com regras
de negócio distintas. Dev solo precisa de estrutura que:
- Permita evolução modular
- Facilite teste isolado de regras de negócio
- Suporte extração de módulos para microserviços no futuro (sem reescrita)
- Tenha fronteiras claras enforcáveis automaticamente

## Decisão

Adotar **Clean Architecture** com **DDD tático** organizado por **feature-based packaging**.

Estrutura por feature: `domain → application → infrastructure → web` (camadas) +
agregados, value objects, ports e domain events.

## Alternativas consideradas

1. **Estrutura tradicional Spring (por camada técnica)** — `controllers/`, `services/`, `repositories/`.
   Familiar, mas mistura features e dificulta extração.
2. **Hexagonal puro sem DDD tático** — ports/adapters sem agregados explícitos. Suficiente,
   mas perde benefícios de modelar invariantes em agregados.
3. **DDD + microserviços desde dia 1** — overkill pra dev solo. Adiamento de valor.
4. **Escolhida:** Clean Architecture + DDD tático + feature-based — dá modelagem rica, fronteiras
   testáveis (ArchUnit), e caminho de evolução pra microserviços sem reescrita.

## Consequências

### Positivas
- Domain puro = teste em milissegundos sem Spring
- Trocar persistência/framework não afeta core do negócio
- Cada feature evolui independente
- ArchUnit valida fronteiras no build (sem revisão manual)

### Negativas
- Mais arquivos por feature (4 camadas + DTOs)
- Curva de aprendizado pra quem nunca fez Clean Arch
- Conversão Domain ↔ JpaEntity é boilerplate

### Riscos
- Sobre-engineering em features triviais — mitigar com pragmatismo (não criar 17 VOs onde 1 string basta)

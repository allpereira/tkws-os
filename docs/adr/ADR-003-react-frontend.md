# ADR-003: Frontend em React 19 (não Vue)

**Status:** Accepted
**Data:** 2025-05
**Decisores:** Allysson

## Contexto

Allysson tem expertise prévia em Vue 3, e a versão inicial da arquitetura especificou Vue. Porém,
o desenvolvimento do TKWS OS será feito **solo com forte uso de IAs** (Claude Code, Cursor,
Copilot). Não haverá time humano nos próximos 6-12 meses.

## Decisão

**React 19** com **TypeScript**, **Vite**, **TanStack Router**, **TanStack Query**, **shadcn/ui**.

## Alternativas consideradas

1. **Vue 3 + Nuxt/Composition API** — expertise existente do dev. Mas IAs geram React melhor
   (volume de dados de treino) e shadcn-vue está sempre atrás do shadcn original.
2. **Svelte/SvelteKit** — sintaxe ainda mais concisa, mas comunidade menor e menos suporte de IA.
3. **Solid.js** — performance superior, mas ecossistema imaturo.
4. **Escolhida:** React — IAs entregam 30% mais produtividade gerando React vs Vue, shadcn/ui é
   nativo, TanStack ecosystem é first-class, mercado de devs maior para contratação futura.

## Consequências

### Positivas
- IAs geram código React com menos alucinação
- shadcn/ui completo (não port da comunidade)
- TanStack (Router, Query, Form, Table) é first-class em React
- Mercado abundante de devs React no Brasil

### Negativas
- Curva de aprendizado pra Allysson (vindo de Vue)
- Mais decisões a tomar (React é biblioteca, não framework)
- Hooks têm pegadinhas (dependency array, stale closures)

### Riscos
- Allysson menos produtivo nas primeiras semanas — mitigar com IA gerando boilerplate

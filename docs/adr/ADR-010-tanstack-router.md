# ADR-010: TanStack Router (não React Router)

**Status:** Accepted
**Data:** 2025-05
**Decisores:** Allysson

## Contexto

Frontend React precisa de roteamento. React Router é padrão de facto, mas TanStack Router
emergiu como alternativa moderna com vantagens significativas pra TypeScript.

## Decisão

**TanStack Router** com **TanStack Query** (mesmo ecossistema, integração natural).

## Alternativas consideradas

1. **React Router v7 (anteriormente Remix)** — popular, batalhado. Mas type-safety de
   parâmetros e search params é manual e propenso a erros. Loaders integram com Suspense mas
   exigem migração.
2. **Next.js (App Router)** — framework completo, file-based routing. Mas TKWS OS é SPA
   (autenticação client-side via Zitadel), e Next traz peso SSR/Edge desnecessário.
3. **Wouter** — micro-biblioteca, mas falta features avançadas (loaders, search params tipados).
4. **Escolhida:** TanStack Router — type-safety end-to-end (rotas, params, search params),
   integração nativa com TanStack Query, devtools excelentes, code-splitting automático.

## Vantagens concretas

### Type-safety total

```tsx
// Definindo rota:
const tenantRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tenants/$id',
  validateSearch: z.object({ tab: z.enum(['info', 'users']).optional() }),
  component: TenantPage,
});

// Navegando:
<Link to="/tenants/$id" params={{ id: '...' }} search={{ tab: 'info' }} />
//   ^ erro de tipo se rota não existir
//                params obrigatório se $param na rota
//                                search validado por Zod
```

### Integração com Query

Loader já invalida cache automaticamente, evita refetch em navegação rápida.

### Devtools

UI no canto da tela mostra todas as rotas, params, matches — debugging cai pra zero.

## Consequências

### Positivas
- Bugs de navegação raros (TypeScript pega no compile)
- Search params tipados (não mais `URLSearchParams` cru)
- Code-splitting automático por rota
- Devtools melhores que qualquer alternativa

### Negativas
- Comunidade menor que React Router (menos Stack Overflow)
- API ainda evolui (TanStack Router 1.x, mais novo)
- Curva de aprendizado dos generators de tipos

### Riscos
- Quebra de API em versão futura — mitigar: lock de versão major, ler changelog antes de bump
- Mantenedor (Tanner Linsley) é pessoa só — mas o ecossistema TanStack é robusto e financiado

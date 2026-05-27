# ADR-022: Paginação de listagens via envelope `limit/offset`

**Status:** Accepted
**Data:** 2026-05-26
**Decisores:** Allysson

## Contexto

`docs/00-ARCHITECTURE.md` exige paginação obrigatória em toda listagem e o
`docs/10-FEATURE-CHECKLIST.md` registra "Lista usa `Pageable`". Apesar disso,
os endpoints de listagem existentes (`GET /api/v1/pessoas`, oportunidades,
lookups) retornavam `List<DTO>` cru — sem total, sem metadados de página —
violando a regra 10 do `CLAUDE.md` ("nunca retornar `List<X>` cru de endpoint").

A tela de Leads/Clientes precisa de listagem com busca textual, filtros
(tipoPessoa, cidade, UF), ordenação e paginação **server-side** (a UI carrega
no máximo 100 registros por página e navega entre páginas). Isso obriga a
formalizar um contrato de paginação reutilizável pelo projeto inteiro, já que
nenhum envelope genérico existia.

## Decisão

Adotar um envelope genérico **`PageResponse<T>`** (em
`com.groupws.tkws.shared.page`) como retorno padrão de toda listagem paginada,
e manter a convenção de query params **`limit` + `offset`** (já usada pelo
endpoint de pessoas) em vez de migrar para `page` + `size`.

Forma do envelope:

```json
{
  "content": [ /* DTOs da página atual */ ],
  "limit": 50,
  "offset": 0,
  "total": 137,
  "hasNext": true
}
```

- `limit` é limitado no servidor a **100** (teto duro), default 50.
- `offset` é saneado para `>= 0`.
- `hasNext = offset + content.size() < total`.
- Internamente o adapter JPA continua usando `PageRequest`/`Sort` do Spring
  Data (convertendo `offset/limit` → `page`), então a diretriz "lista usa
  `Pageable`" do checklist segue honrada na camada de infraestrutura.

## Alternativas consideradas

1. **`page` + `size` + `Page<T>` do Spring Data** — idiomático Spring, serializa
   automático. Contras: o JSON do `Page` do Spring é instável entre versões e
   expõe campos demais (`pageable`, `sort`, `numberOfElements`…); o frontend já
   conversava em `limit/offset`; trocaria o contrato existente sem ganho real.
2. **Manter `List<DTO>` cru** — zero esforço, mas viola a regra 10 e impede
   exibir contagem total/paginação inteligente na UI.
3. **Escolhida — `limit/offset` + `PageResponse<T>` próprio** — contrato enxuto
   e estável, retrocompatível com os params atuais de pessoas, controlado por
   nós (sem vazar internals do Spring), e reutilizável por todas as features.

## Consequências

### Positivas

- Contrato de paginação único e previsível para todo o projeto.
- Retrocompatível: clientes que já mandavam `?limit=&offset=` continuam válidos;
  só o corpo da resposta passou de array para `{ content, … }`.
- `total` permite paginação inteligente e contadores na UI.
- Domínio permanece puro: `PageResponse` vive em `shared/page` (sem Spring/JPA),
  e o port expõe `list(...)` + `count(...)` em vez de um tipo `Page` do Spring.

### Negativas / Trade-offs

- Diverge do `Page<T>`/`Pageable` canônico do Spring no contrato HTTP (a
  conversão fica no adapter).
- Quem consumia `GET /api/v1/pessoas` como array precisa ler `.content` agora
  (migração feita no frontend neste mesmo PR).

### Riscos

- Listas pré-existentes que ainda retornam `List<DTO>` cru (oportunidades,
  lookups) seguem fora do padrão até serem migradas — dívida conhecida, a ser
  endereçada quando cada uma ganhar paginação real.

## Notas adicionais

- Implementação inicial: feature `pessoas` (telas Leads/Clientes).
- Relacionado: ADR-018 (Pessoas unificadas Lead/Cliente).

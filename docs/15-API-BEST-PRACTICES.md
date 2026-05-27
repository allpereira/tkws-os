# 15 — Boas Práticas da API (Backend)

> Lições aprendidas que viraram regra. Cada item nasceu de um bug real em
> produção/dev. **Antes de abrir um endpoint novo ou escrever uma query JPQL,
> releia as seções relevantes aqui.** Complementa (não substitui) o
> [00-ARCHITECTURE](00-ARCHITECTURE.md) e o [02-TESTING](02-TESTING.md).

---

## 1. Todo verbo HTTP que o frontend chama precisa de mapping + IT

### O problema (caso real · PATCH de Pessoa → 405)

O frontend chamava `PATCH /api/v1/pessoas/{id}` para editar um lead, mas o
`PessoaController` só tinha `GET`, `POST` e `POST /{id}/converter`. Como a rota
`/{id}` **existia** (para `GET`), o Spring respondia **`405 Method Not Allowed`**
— não `404`. Isso despista: o caminho existe, o verbo não.

### A regra

1. **Mapeie explicitamente cada operação que o cliente consome.** Confira o
   `api.ts` da feature no frontend (`api.get/post/patch/delete`) e garanta um
   `@GetMapping`/`@PostMapping`/`@PatchMapping`/... correspondente.
2. **Todo controller tem um Web IT que cobre _todos_ os endpoints** (REST Assured
   + JWT mockado), exercitando cada verbo de ponta a ponta. Um IT que faz `PATCH`
   teria pego o 405 no build, não em produção. Cobertura parcial deixa buracos:
   o IT só protege o que ele de fato chama.
3. **`405` quase sempre significa "verbo faltando", não "rota faltando".**
   Quando vir 405, procure o `@XxxMapping` ausente antes de qualquer outra coisa.

**Referências de Web IT** (copie o estilo): `PessoaControllerIT` (cobre list,
byId, search, buscar, create, **patch**, converter + autorização 401/403 +
isolamento de tenant) e `ContatoControllerIT`. Ambos em
`features/pessoas/web/` herdando de `AbstractIntegrationTest` + `@Import(MockJwtConfig.class)`.

### Convenção de verbos no TKWS OS

| Operação | Verbo | Observação |
|---|---|---|
| Criar | `POST /recurso` | retorna `201 Created` + `Location` |
| Atualizar dados cadastrais | `PATCH /recurso/{id}` | substituição do estado do formulário |
| Transição de estado | `POST /recurso/{id}/acao` | ex.: `/converter` · idempotente quando possível |
| Buscar/listar | `GET` | listagem **sempre paginada** (regra 10 do CLAUDE.md) |

---

## 2. Parâmetro `String` nullable em JPQL → `CAST(... AS string)` no PostgreSQL

### O problema (caso real · listagem de Pessoa → `lower(bytea)`)

A query de listagem filtrada tinha filtros opcionais:

```jpql
AND (:q IS NULL OR LOWER(p.nomeContato) LIKE LOWER(CONCAT('%', :q, '%')))
```

Quando o filtro vinha `null` (o caso padrão — abrir a tela sem filtrar), o
endpoint estourava com:

```
ERROR: function lower(bytea) does not exist
```

**Causa:** quando um parâmetro `String` é vinculado como `null`, o driver JDBC
do PostgreSQL **não consegue inferir o tipo** e o envia como `bytea`. O
`LOWER(... bytea ...)` então não casa com nenhuma função. O ramo `:q IS NULL OR`
**não salva** — o PostgreSQL ainda precisa *planejar/tipar* a expressão inteira
antes de avaliar o short-circuit.

### A regra

**Todo parâmetro `String` opcional (que pode chegar `null`) usado dentro de uma
função (`LOWER`, `CONCAT`, `LIKE`, `=`) deve ser envolvido em
`CAST(:param AS string)`** para fixar o tipo do bind.

```jpql
-- ❌ ERRADO · bind nulo vira bytea
AND (:cidade IS NULL OR LOWER(p.cidade) LIKE LOWER(CONCAT('%', :cidade, '%')))
AND (:status IS NULL OR p.status = :status)

-- ✅ CERTO · CAST fixa o tipo do parâmetro
AND (CAST(:cidade AS string) IS NULL
     OR LOWER(p.cidade) LIKE LOWER(CONCAT('%', CAST(:cidade AS string), '%')))
AND (CAST(:status AS string) IS NULL OR p.status = CAST(:status AS string))
```

Vale para igualdade (`=`) também: `texto = bytea` também não existe no PostgreSQL.

### Alternativas aceitas

- **Sentinela em vez de null:** passar `""` (string vazia) do adapter e comparar
  com `<>` / `=` em vez de `IS NULL`. Strings não-nulas têm tipo conhecido.
  (É o que já fazemos com `:qDigits` — `onlyDigits()` retorna `""`, nunca null.)
- Não confie em `IS NULL OR ...` para "desligar" o tipo: o planner tipifica a
  expressão inteira independentemente do short-circuit.

### Como pegar isso no build

ITs de repositório (`*RepositoryIT`) **devem incluir um caso com todos os
filtros nulos** (a listagem "crua"). Esse caminho é o que dispara o `bytea`.
Veja `PessoaRepositoryIT#filtraPorStatus` e similares.

> ⚠️ **Atenção ao ambiente de teste.** Se os `*IT.java` não rodam contra um
> PostgreSQL real (Testcontainers travado por Docker Desktop bugado), bugs de
> dialeto como este **passam despercebidos**. Use o workaround `TKWS_TEST_DB_URL`
> (ver [02-TESTING](02-TESTING.md) § Troubleshooting e `AbstractIntegrationTest`)
> para rodar os ITs contra o `tkws-postgres` local antes de subir.

---

## 3. Multi-tenancy nunca vem do body

`tenantId` é resolvido por `@CurrentTenant` (JWT/`X-Tenant-Id`) e injetado no
Command pelo controller — **nunca** é campo de request DTO. Vale para todo
endpoint novo, incluindo updates. Ver [ADR-019](adr/ADR-019-*.md).

---

## 4. Dedup em update ignora a própria entidade

Ao validar unicidade (ex.: documento de Pessoa) num **update**, a checagem deve
**ignorar a própria entidade** — senão editar um registro sem trocar o campo
único dispara falso `409`/duplicidade:

```java
boolean pertenceAOutra = repository.findByDocumento(tenantId, normalizado)
    .filter(outra -> !outra.id().equals(id))   // <- ignora a própria
    .isPresent();
```

No **create** não há essa ressalva (qualquer match é duplicidade).

---

## 5. Troubleshooting · `java.lang.Error: Unresolved compilation problem` em IT

Se um IT que **passava** começa a estourar `java.lang.Error: Unresolved
compilation problem` (geralmente apontando para uma classe que você nem tocou,
ex.: `GlobalExceptionHandler`), o culpado costuma ser um **`.class` obsoleto e
quebrado em `target/classes`**: o compilador do Eclipse (language server do
VSCode/IDE) grava bytecode "com erro embutido" quando o fonte está num estado
intermediário não-compilável, e o `mvn` incremental às vezes reaproveita esse
`.class` em vez de recompilar com o `javac`.

**Sintoma típico:** o contexto Spring sobe, mas ao acionar o método afetado
(ex.: um `@ExceptionHandler`) ele lança `Error` em runtime — e como o contexto
fica em cache como falho, **todos** os ITs subsequentes erram em cascata.

**Solução:**

```bash
mvn -o clean compile            # recompila tudo com o javac
# se `clean` falhar com "Failed to delete target/classes",
# encerre o app que está rodando (porta 8080) e/ou force o recompile:
touch src/main/java/.../ClasseAfetada.java && mvn -o compile
```

Comum quando há **edição concorrente** do `main` (outro dev/agente mexendo numa
feature enquanto você roda ITs). Antes de culpar seu teste, recompile limpo.

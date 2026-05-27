# ADR-024: Status HTTP na própria DomainException (handler genérico)

**Status:** Accepted
**Data:** 2026-05-27
**Decisores:** Allysson

## Contexto

O `GlobalExceptionHandler` (em `shared/infrastructure`) tinha handlers
`@ExceptionHandler` específicos para exceções de **uma feature** — as três de
`invites` (`DuplicateInviteException` → 409, `InviteNotFoundException` → 404,
`InviteNotAcceptableException` → 410). Para isso ele **importava classes do
`features/invites/domain/exception`**, violando a fronteira de camadas validada
pelo ArchUnit (`shared/infrastructure` não é a camada `Infrastructure` de uma
feature e não pode acessar o `domain` de uma feature). A violação estava
mascarada por compilação incremental e só apareceu num `clean build`.

Causa raiz: ao contrário de `pessoas`/`tenants` (cujas exceções já estendiam
`DomainException` e caíam no handler genérico → 422), as exceções de `invites`
estendiam `RuntimeException` direto. Como não tinham como comunicar o status HTTP
desejado, foi preciso criar handlers dedicados — e o acoplamento veio junto.

## Decisão

A exceção de domínio **carrega o próprio status HTTP**, e o handler genérico
mapeia qualquer `DomainException` sem conhecer nenhuma feature.

- `DomainException` ganha um campo `int httpStatus` (default `422`), além do `code`.
  É um `int` puro — **não** o `HttpStatus` do Spring — para manter o `domain`
  livre de framework.
- O único handler relevante vira:

  ```java
  @ExceptionHandler(DomainException.class)
  ProblemDetail handleDomain(DomainException ex) {
      var p = ProblemDetail.forStatusAndDetail(HttpStatus.valueOf(ex.httpStatus()), ex.getMessage());
      p.setType(URI.create("https://errors.tkws.com.br/" + ex.code().toLowerCase()));
      p.setTitle(ex.code());
      return p;
  }
  ```

- Toda exceção de regra de negócio estende `DomainException` e declara seu status
  (ex.: `super("invites.not_found", "...", 404)`). 422 quando omitido.

Resultado: removidos os 3 handlers específicos e os 3 imports de domínio do
`GlobalExceptionHandler`; ArchUnit volta a passar; o código (`code`) dotted
(`invites.duplicate`) fica consistente com `pessoas.not_found`.

## Alternativas consideradas

1. **`@RestControllerAdvice` local por feature** (`invites/web/...`) — respeita a
   camada (web da feature acessa seu domínio), mas espalha o tratamento de erro,
   duplica o boilerplate de `ProblemDetail` e foge do "um handler global".
2. **Mapa `code → status` no handler** — centraliza, mas vira ponto de manutenção
   paralelo e desacoplado da exceção que conhece seu próprio significado.
3. **Escolhida — status na `DomainException`** — a exceção é a dona da informação
   "que status HTTP isto representa"; o handler fica trivial e agnóstico de feature.

## Consequências

### Positivas

- Zero acoplamento `shared → features/*/domain`; ArchUnit verde.
- Adicionar uma feature nova não exige tocar no `GlobalExceptionHandler`.
- Convenção única de `code`/título (`feature.motivo`) e mapeamento de status.

### Negativas / Trade-offs

- `DomainException` passa a conhecer um conceito "de transporte" (status HTTP),
  ainda que como `int` neutro. Aceitável: é semântica de erro de negócio, não de
  framework.

### Riscos

- Mudança de contrato: o `title` do problem+json das exceções de invite passou de
  `DUPLICATE_INVITE` para `invites.duplicate` (o status HTTP foi preservado).
  Verificado que nem o `frontend/` nem o `login/` dependem dessas strings.

## Notas adicionais

- Relacionado: ADR-009 (ArchUnit valida fronteiras).

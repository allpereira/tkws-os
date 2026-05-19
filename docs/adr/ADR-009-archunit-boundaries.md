# ADR-009: ArchUnit para validar fronteiras arquiteturais

**Status:** Accepted
**Data:** 2025-05
**Decisores:** Allysson

## Contexto

Clean Architecture + DDD têm regras estruturais críticas:
- Domain não importa Spring/JPA
- Features não dependem entre si
- Use cases não acessam JPA direto

Em projetos reais, **essas regras erodem em meses** quando dependem só de revisão manual.
Com dev solo + IA, é AINDA mais fácil deixar passar (IA pode importar JPA em domain sem perceber).

## Decisão

Adotar **ArchUnit** como testes de arquitetura rodando no build. Violação = build vermelho.

## Alternativas consideradas

1. **Apenas code review** — não escalável, vulnerável a pressa, IA não revisa fronteiras.
2. **Linter customizado (Checkstyle/SpotBugs)** — possível, mas não tem semântica de arquitetura.
3. **jdepend / jqassistant** — mais pesados, menos legíveis.
4. **Modulith (Spring Modulith)** — interessante, mas amarra ao Spring e tem learning curve.
5. **Escolhida:** ArchUnit — regras em Java, legíveis como testes, integradas ao JUnit, comunidade
   grande, zero overhead em runtime (só roda em test).

## Regras configuradas (`ArchitectureTest.java`)

1. **Domain limpo:**
   - `..domain..` não importa `org.springframework..`
   - `..domain..` não importa `jakarta.persistence..` ou `org.hibernate..`
   - `..domain..` não importa `..infrastructure..` ou `..web..`

2. **Application limpo:**
   - `..application..` não importa `jakarta.persistence..` ou `org.hibernate..`

3. **Features isoladas:**
   - Classes em `..features.X..` não podem ser usadas por `..features.Y..` (X ≠ Y)

4. **Convenções de nome:**
   - Classes em `..usecase..` terminam com `UseCase`
   - Classes em `..web..` terminam com `Controller`
   - Classes anotadas com `@Entity` ficam em `..infrastructure.persistence..`

5. **Boas práticas:**
   - Sem `@Autowired` em campos (só constructor injection)
   - Sem dependências cíclicas entre packages

## Consequências

### Positivas
- Build vermelho ao primeiro erro arquitetural — feedback imediato
- IA não consegue acidentalmente quebrar Clean Arch
- Documentação executável (regras = código = realidade)
- Refatoração segura (ArchUnit pega regressão arquitetural)

### Negativas
- Falsos positivos em casos legítimos raros — mitigar com `Ignore` documentado
- Curva de aprendizado pra escrever novas regras
- Roda em test (algum overhead no `mvn verify`)

### Riscos
- Regras se tornarem "ruído" e devs começarem a contornar — mitigar: aceitar que regra
  ficou obsoleta, refatorá-la com mesmo rigor de outras decisões

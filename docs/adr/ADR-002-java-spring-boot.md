# ADR-002: Backend em Java 21 + Spring Boot 3

**Status:** Accepted
**Data:** 2025-05
**Decisores:** Allysson

## Contexto

Backend precisa atender 300+ usuários simultâneos com picos de processamento (relatórios,
importações de planilha, integrações). Dev é solo com expertise em Java/Spring.

## Decisão

**Java 21 (LTS)** com **Spring Boot 3.3+** e **virtual threads habilitadas**.

## Alternativas consideradas

1. **Node.js + NestJS** — stack unificada com frontend, ecossistema de auth moderno (Better Auth).
   Mas dev solo perderia 80-120h de produtividade em curva de aprendizado.
2. **Go** — performance excelente, baixo footprint. Mas zero expertise no time, e benefício real
   pra MVP é marginal.
3. **Quarkus** — mais leve que Spring, startup rápido. Mas comunidade menor que Spring, e dev
   precisaria aprender CDI e Panache.
4. **Escolhida:** Java + Spring — máxima produtividade do dev existente, ecossistema gigante,
   virtual threads do Java 21 resolvem o problema histórico de concorrência síncrona.

## Consequências

### Positivas
- Dev consegue iterar rápido (alta familiaridade)
- Spring Data, Spring Security, Spring Cloud — ecossistema imbatível
- Virtual threads = concorrência massiva sem complexidade reativa
- Mercado grande de devs Java pra contratação futura

### Negativas
- Maior consumo de RAM que Node/Go (~400-800MB por instância)
- Boilerplate maior (mitigado com Lombok + records)
- Startup mais lento que Quarkus Native

### Riscos
- Acoplamento ao ecossistema Spring — mitigar com Clean Architecture (domain puro)

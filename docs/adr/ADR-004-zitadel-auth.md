# ADR-004: Autenticação via Zitadel self-hosted

**Status:** Accepted
**Data:** 2025-05
**Decisores:** Allysson

## Contexto

Sistema multi-tenant exige solução de auth com:
- Múltiplas organizações isoladas (cada escritório = um tenant)
- Suporte a MFA, passkeys, SSO corporativo (para clientes enterprise)
- Custo previsível (ou zero) no crescimento
- API completa pra automação de onboarding
- LGPD/auditoria nativa

## Decisão

**Zitadel self-hosted** rodando em container junto com a stack, integrado via OIDC com Spring
Security (resource server) e react-oidc-context (frontend).

## Alternativas consideradas

1. **AWS Cognito** — managed, free tier generoso. Mas multi-tenancy é hack (user pools por
   tenant), customização limitada, sem passkeys nativos. Vendor lock-in pesado.
2. **Auth0** — produto excelente. Mas $228/mês a partir de 1000 MAUs com features de
   multi-tenancy, escalando rápido pra 4-5 dígitos.
3. **Keycloak** — open source veterano. Multi-tenancy via realms, mas UI dated, sem passkeys
   robustos, configuração XML-pesada.
4. **Supabase Auth** — moderna, mas amarrada ao Supabase como backend, e multi-tenancy
   requer workaround.
5. **Better Auth (Node)** — moderno e elegante, mas é JavaScript-only e exige backend Node.
6. **Escolhida:** Zitadel — multi-tenancy de primeira classe (organizações nativas), passkeys
   robustos, OIDC padrão (sem lock-in profundo), custo zero self-hosted.

## Consequências

### Positivas
- Zero custo recorrente (só infra)
- Multi-tenancy nativo (organizações)
- Passkeys, MFA, magic link prontos
- API completa pra onboarding automatizado
- Auditoria built-in

### Negativas
- Operação adicional (mais um container pra manter)
- Curva de aprendizado da UI Zitadel
- Não tem managed se eu quiser escapar de ops

### Riscos
- Bug grave no Zitadel em produção (mitigar: ficar em versão stable, ler changelog)
- Perder masterkey = perde dados de auth (mitigar: cópia em 1Password + AWS Secrets)

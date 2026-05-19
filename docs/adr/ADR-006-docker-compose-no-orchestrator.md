# ADR-006: Docker Compose puro (sem Coolify/K8s/Nomad)

**Status:** Accepted (atualizado por ADR-012 — frontend movido pra Cloudflare Pages)
**Data:** 2025-05
**Decisores:** Allysson

## Contexto

Precisamos orquestrar containers em produção (API, Zitadel, Redis, Caddy — frontend
movido pra Cloudflare Pages conforme ADR-012). Opções vão de "raw compose" até
"Kubernetes gerenciado". Para dev solo, simplicidade vence sofisticação até dor real aparecer.

## Decisão

**Docker Compose puro** com **Caddy** como reverse proxy, para o **backend (API + Zitadel + Redis)**.
Sem PaaS, sem orquestrador.

## Alternativas consideradas

1. **Coolify** — Heroku-like self-hosted, UI bonita. Mas adiciona uma camada de complexidade
   (Coolify quebra = nada funciona), tem bugs em versões recentes, e abstrai coisas que
   eventualmente você precisa entender.
2. **Dokku** — mais simples que Coolify, menos features. Mesmo problema de abstração.
3. **Kubernetes (EKS, K3s)** — overkill absurdo pra 1-2 servidores. Custo operacional altíssimo.
4. **Nomad** — meio termo. Comunidade pequena, sem ganho real vs compose nesse estágio.
5. **AWS ECS** — managed, integrado, mas custo extra ($30-60/mês mínimo) e lock-in AWS.
6. **Escolhida:** Compose + Caddy — controle total, zero camadas de abstração, debuggable,
   portátil pra qualquer VPS, custa zero a mais.

## Consequências

### Positivas
- Compose é simples e bem documentado
- Caddy resolve TLS automaticamente (Let's Encrypt)
- Zero curva de aprendizado adicional
- Portável (sai do AWS se quiser, leva o compose)
- Custo: zero a mais do que a VM já consome

### Negativas
- Sem auto-scaling horizontal automático
- Sem failover automático se VM cair (mitigar com Multi-AZ no banco + UptimeRobot)
- Deploys precisam de SSH (não tão "Heroku-like")

### Riscos
- Quando atingir limite de uma VM, migração pra K8s será grande — mitigar: arquitetura já
  é stateless, então migração futura é factível sem reescrever app

## Quando reavaliar

- Mais de 1 servidor de app necessário simultâneo
- Necessidade de auto-scaling baseado em carga
- Time cresceu pra 3+ devs e operação manual virou gargalo

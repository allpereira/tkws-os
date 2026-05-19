# docker/frontend/

> **STATUS: ARQUIVADO** — Mantido como fallback caso seja necessário voltar a servir o
> frontend em container (ver ADR-012).

Frontend é hospedado em **Cloudflare Pages** (ver `docs/03-DEPLOY.md` e `docs/adr/ADR-012`).

Estes arquivos (Dockerfile + nginx.conf) **não são usados em produção atualmente**, mas
ficam aqui caso seja necessário migrar de volta. Migração reversa: ~2h. Ver "Migrar de
volta pra container" em `docs/03-DEPLOY.md`.

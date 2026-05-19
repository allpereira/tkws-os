# ADR-005: Cloud em AWS (não OCI/GCP/Azure)

**Status:** Accepted
**Data:** 2025-05
**Decisores:** Allysson

## Contexto

Precisamos de cloud com:
- Postgres gerenciado confiável e barato em região brasileira
- ARM disponível (economia de custo + performance)
- Ecossistema maduro de ferramentas e tutoriais
- Free tier robusto para validação do MVP
- Suporte a LGPD (residência de dados no Brasil)

## Decisão

**AWS** na região **sa-east-1 (São Paulo)**, com **Graviton (ARM)** para EC2 e RDS quando aplicável.

## Alternativas consideradas

1. **OCI (Oracle Cloud)** — free tier ETERNO generoso. Mas Allysson já operou Gescomex em OCI
   e enfrentou: documentação fraca, comunidade pequena, IPs reservados problemáticos, sem ARM
   em todas as regiões BR.
2. **GCP** — excelente em data/AI, mas Cloud SQL é caro, ecossistema BR pequeno.
3. **Azure** — ótimo se você é Microsoft shop. Não é o caso.
4. **DigitalOcean / Hetzner** — preços imbatíveis. Mas sem RDS equivalente, sem ARM em SA,
   sem maturidade enterprise pra futuro.
5. **Render / Railway / Fly.io** — DX excelente, mas opaco e caro em escala.
6. **Escolhida:** AWS — best-in-class em RDS, Graviton (~40% mais barato que x86), comunidade
   massiva, sa-east-1 madura, free tier 12 meses + tier eterno generoso, escapabilidade futura
   (terraform mantém infra portátil).

## Consequências

### Positivas
- RDS é referência em managed Postgres
- Graviton entrega 40% mais perf/$
- Free tier 12 meses cobre validação MVP gratuita
- IAM granular e auditável (CloudTrail)
- Ecossistema infinito (Lambda, S3, SES, etc se precisar)
- Mercado de devs com AWS é o maior

### Negativas
- Custo maior que VPS depois do free tier
- Complexidade do Console AWS (muitas opções)
- Surpresas de billing são comuns (configurar alertas!)

### Riscos
- Lock-in profundo se usar serviços proprietários — mitigar usando só RDS + EC2 + S3
  (todos têm equivalentes em qualquer cloud)
- Bill shock — mitigar com Cost Anomaly Detection + budget alerts

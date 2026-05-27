# ADR-023 — Cadastro direto de Cliente + Contatos da Pessoa

**Status:** Aceito
**Data:** 2026-05-26
**Decisores:** Allysson Pereira (CEO Group WS)

## Contexto

A [ADR-018](ADR-018-pessoas-unificadas.md) unificou Lead e Cliente numa única tabela
`pessoas` com coluna `status` e definiu que **Cliente nasce de Lead convertido**
automaticamente (quando uma Oportunidade entra numa etapa com
`converte_lead_em_cliente = true`). A criação manual de Cliente foi propositalmente
deixada de fora — o funil era "tudo começa como Lead".

Na prática o escritório precisa de dois fluxos que a 018 não cobria:

1. **Cadastrar um Cliente direto.** Nem todo cliente passa pelo funil de Lead dentro
   do sistema — muitos já chegam fechados (indicação, contrato assinado fora da
   ferramenta). Forçar "crie um Lead e converta" é fricção desnecessária.

2. **Contatos da Pessoa.** Um cliente — seja PF ou PJ — tem pessoas de contato
   associadas além do contato principal do cadastro:
   - **PJ (empresa):** sócios, representante legal.
   - **PF (pessoa):** parentes (pai, mãe, filho, filha, cônjuge, outros).

   Hoje o cadastro só guarda **um** contato (os campos `nome_contato`,
   `email_contato`, `celular_contato` na própria `pessoas`). Não há onde registrar
   "o representante legal da Acme é o João" ou "o cônjuge da Ana é o Carlos".

## Decisão

### 1. Permitir criar Pessoa já como CLIENTE

`CreatePessoaUseCase` passa a aceitar o `status` inicial (`LEAD` por padrão,
`CLIENTE` quando a tela de Clientes cria direto). Quando nasce CLIENTE, o agregado
marca `convertido_em = now()` e emite **os dois** eventos: `PessoaCreatedEvent`
(com `status=CLIENTE`) e `PessoaConvertedToClienteEvent` (para os mesmos
consumidores da conversão por funil não precisarem de caso especial).

O backend só aceita `LEAD` ou `CLIENTE` na criação — `FORNECEDOR`/`PARCEIRO`
continuam reservados para evolução futura e não são expostos no create.
A detecção de duplicidade por documento (UNIQUE `tenant_id + documento`) vale
igual: criar Cliente não fura a regra.

A conversão automática de Lead→Cliente da 018 **continua valendo** — este ADR só
adiciona o caminho manual; não remove nada.

### 2. Contatos como agregado próprio (`Contato`), 1:N com Pessoa

Nova tabela `pessoa_contatos` referenciando `pessoas(id)`. Cada contato tem:

| Campo | Observação |
|---|---|
| `nome` | obrigatório |
| `email` | opcional |
| `telefone` | opcional |
| `tipo_relacionamento` | obrigatório · enum dependente do tipo da Pessoa |

`tipo_relacionamento` é um enum fechado cuja aplicabilidade depende do
`tipo_pessoa` do dono:

- **PJ:** `SOCIO`, `REPRESENTANTE_LEGAL`
- **PF:** `PARENTE`, `PAI`, `MAE`, `FILHO`, `FILHA`, `CONJUGE`, `OUTROS`

O **use case** valida a compatibilidade (relacionamento PJ só em Pessoa PJ e
vice-versa) carregando a Pessoa dona — relacionamento incompatível dispara
`RelacionamentoIncompativelException` (HTTP 422).

#### Por que agregado próprio e não entidade dentro do agregado Pessoa

`Pessoa` é um `final class` com persistência single-table e fluxo de criação
"mínimo" (ADR-018). Embutir uma coleção `@OneToMany` no agregado:
- explodiria o construtor/reconstitute (já com 17 parâmetros),
- forçaria carregar contatos em toda listagem de Leads/Clientes (que não os usam),
- acoplaria o churn de cascade/orphanRemoval ao caminho quente de save.

Contatos têm ciclo de vida gerenciado **sempre via** a Pessoa dona (são
tenant-scoped e sempre acessados por `pessoaId`), mas modelá-los como **agregado
pequeno referenciando `pessoaId`** (padrão "small aggregates, reference by id",
Vaughn Vernon) é mais barato e testável aqui. Eles vivem na **mesma feature**
`pessoas/` — não há acesso cross-feature, então a regra 4 do CLAUDE.md é respeitada.

#### Endpoints

```
GET    /api/v1/pessoas/{pessoaId}/contatos            · lista contatos da pessoa
POST   /api/v1/pessoas/{pessoaId}/contatos            · adiciona contato
PATCH  /api/v1/pessoas/{pessoaId}/contatos/{id}       · edita contato
DELETE /api/v1/pessoas/{pessoaId}/contatos/{id}       · remove contato
```

Mesmas roles do `PessoaController` (`org_admin`, `comercial_atendimento`,
`comercial_proposta`). Tenant resolvido por `@CurrentTenant` (ADR-019).

### 3. Frontend

A tela `/crm/clientes` deixa de ser read-only e ganha um formulário com abas:
- **Dados** — campos PF (nome, CPF, email, celular) ou PJ (razão social, CNPJ,
  contato, email, celular) conforme o tipo.
- **Contatos** — lista editável de contatos (nome, email, telefone, relacionamento),
  com as opções de relacionamento filtradas por PF/PJ.

> Endereço/notas ainda não são editáveis pela API de Pessoas (não fazem parte de
> `CreatePessoaCommand`/`UpdatePessoaCommand`); ficam fora deste cadastro até a API
> expor esses campos — fora do escopo desta ADR.

A aba Contatos só fica disponível depois que o cliente é salvo (precisa de `id`
para pendurar os contatos). Em criação, ao salvar a primeira vez o diálogo
transiciona para modo edição já com a aba Contatos habilitada.

## Consequências

**Positivas**
- Cobre o fluxo real do escritório (cliente direto + rede de contatos).
- Não invalida a 018 — soma um caminho, mantém a conversão por funil.
- `Contato` isolado mantém o caminho quente de listagem de Pessoas leve.

**Negativas / trade-offs**
- Em criação, contatos exigem um segundo passo (salvar a Pessoa primeiro). Aceito
  por simplicidade e robustez (sem transação distribuída no cliente).
- `tipo_relacionamento` acoplado ao `tipo_pessoa`: trocar PF↔PJ de uma Pessoa com
  contatos exige revisar os relacionamentos (validação no use case protege a
  invariante; a UI alerta).

## Alternativas consideradas

- **Entidade dentro do agregado `Pessoa` com cascade.** Mais "purista" em DDD, mas
  invasivo no agregado existente e penaliza o caminho de listagem. Rejeitado.
- **Reabrir tabelas separadas Lead/Cliente.** Contraria a 018 inteira. Rejeitado.
- **Permitir `status` arbitrário no create.** Risco de criar FORNECEDOR/PARCEIRO sem
  feature pronta. Restringido a LEAD/CLIENTE.

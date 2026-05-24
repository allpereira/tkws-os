import { CrudPage } from '@/components/tkws/crud-page'
import { Badge } from '@/components/ui/badge'
import { usePessoas } from '@/modules/crm/pessoas/api'
import type { Pessoa } from '@/modules/crm/pessoas/schema'

/**
 * Tela "Clientes" · view sobre `Pessoa` filtrada por status=CLIENTE.
 *
 * Cliente é Pessoa que já fechou ao menos uma proposta (promovido
 * automaticamente pela regra de "etapa de conversão" no Atendimento).
 * Ver ADR-018.
 *
 * Criação manual de cliente foi removida: clientes nascem de leads
 * convertidos. Para cadastrar uma pessoa nova, use /crm/leads.
 */
export function ClientesPage() {
  const listQuery = usePessoas('CLIENTE')

  return (
    <CrudPage<Pessoa>
      crumb="CRM"
      title="Clientes"
      description="Pessoas que já fecharam ao menos uma proposta. Promovidas automaticamente quando uma Oportunidade chega em etapa de conversão."
      newButtonLabel=""
      listQuery={listQuery}
      removeMutation={{ mutateAsync: async () => undefined, isPending: false, error: null } as never}
      columns={[
        {
          key: 'tipoPessoa',
          header: '',
          width: 'w-12',
          cell: (r) => <Badge variant="outline">{r.tipoPessoa}</Badge>,
        },
        {
          key: 'nomeContato',
          header: 'Nome',
          cell: (r) => <span className="font-medium">{r.nomeContato}</span>,
        },
        {
          key: 'nomeEmpresa',
          header: 'Empresa',
          cell: (r) => <span className="text-muted-foreground">{r.nomeEmpresa ?? '—'}</span>,
        },
        {
          key: 'documento',
          header: 'Documento',
          width: 'w-44',
          cell: (r) => <span className="font-mono text-xs">{r.documento ?? '—'}</span>,
        },
        {
          key: 'convertidoEm',
          header: 'Convertido em',
          cell: (r) =>
            r.convertidoEm ? (
              <span className="text-muted-foreground text-xs">
                {new Date(r.convertidoEm).toLocaleDateString('pt-BR')}
              </span>
            ) : (
              '—'
            ),
        },
      ]}
      getRowKey={(r) => r.id}
      getRowLabel={(r) => r.nomeContato}
      formDialogTitle={() => 'Cliente'}
      renderForm={() => (
        <div className="p-4 text-sm" style={{ color: 'var(--text-soft)' }}>
          Edição de Cliente será implementada em PR futura. Por ora, edite via tela Leads — a
          conversão preserva os dados.
        </div>
      )}
    />
  )
}

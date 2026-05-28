import { CrudPage } from '@/components/tkws/crud-page'
import { Badge } from '@/components/ui/badge'
import { useOrigensNegocio, useRemoveOrigemNegocio } from '../api'
import type { OrigemNegocio } from '../schema'
import { OrigemNegocioForm } from './origem-negocio-form'

export function OrigensNegocioPage() {
  const listQuery = useOrigensNegocio()
  const removeMut = useRemoveOrigemNegocio()

  return (
    <CrudPage<OrigemNegocio>
      crumb="Configurações · CRM"
      title="Origens de Negócio"
      description="Canais de origem das oportunidades · antes fixos no código, agora editáveis."
      newButtonLabel="Nova origem"
      listQuery={listQuery}
      removeMutation={removeMut}
      columns={[
        {
          key: 'codigo',
          header: 'Código',
          width: 'w-28',
          cell: (r) => <span className="font-mono text-xs">{r.codigo}</span>,
        },
        { key: 'nome', header: 'Nome', cell: (r) => <span className="font-medium">{r.nome}</span> },
        {
          key: 'exigeParceiro',
          header: 'Regras',
          cell: (r) => (
            <div className="flex flex-wrap gap-1">
              {r.exigeParceiro && <Badge variant="secondary">Exige parceiro</Badge>}
              {r.exigeDetalhe && <Badge variant="secondary">Exige detalhe</Badge>}
              {!r.exigeParceiro && !r.exigeDetalhe && <span className="text-muted-foreground">—</span>}
            </div>
          ),
        },
        {
          key: 'ativo',
          header: 'Status',
          width: 'w-24',
          cell: (r) =>
            r.ativo ? <Badge variant="success">Ativa</Badge> : <Badge variant="secondary">Inativa</Badge>,
        },
      ]}
      getRowKey={(r) => r.id}
      getRowLabel={(r) => r.nome}
      formDialogTitle={(item) => (item ? `Editar · ${item.nome}` : 'Nova origem de negócio')}
      formDialogDescription="Origens aparecem no seletor 'Origem' ao cadastrar uma oportunidade."
      renderForm={(item, close) => (
        <OrigemNegocioForm initial={item} existingItems={listQuery.data} onSuccess={close} />
      )}
    />
  )
}

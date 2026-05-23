import * as React from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { DataTable, type DataTableColumn } from './data-table'
import { PageHeader } from './page-header'
import { ConfirmDialog } from './confirm-dialog'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

/**
 * CrudPage · template reutilizável de página CRUD.
 *
 * Composição:
 *   - PageHeader com botão "Novo"
 *   - DataTable com colunas configuráveis
 *   - Coluna de ações (editar, excluir) já incluída
 *   - Dialog de form (passado como children render-prop)
 *   - ConfirmDialog automático ao excluir
 *
 * O autor da feature só fornece:
 *   - title/description
 *   - listQuery (TanStack)
 *   - removeMutation (TanStack)
 *   - columns (sem ações — adicionamos automático)
 *   - renderForm(item, close) → JSX do form
 *   - getRowKey
 */

export interface CrudPageProps<T> {
  title: string
  crumb?: string
  description?: string
  newButtonLabel?: string
  emptyTitle?: string
  listQuery: UseQueryResult<T[]>
  removeMutation: UseMutationResult<void, Error, string>
  columns: DataTableColumn<T>[]
  getRowKey: (row: T) => string
  getRowLabel: (row: T) => string
  /** Render do formulário · recebe item (undefined = create) e close handler */
  renderForm: (item: T | undefined, close: () => void) => React.ReactNode
  formDialogTitle: (item: T | undefined) => string
  formDialogDescription?: string
}

export function CrudPage<T>({
  title,
  crumb,
  description,
  newButtonLabel = '+ Novo',
  emptyTitle,
  listQuery,
  removeMutation,
  columns,
  getRowKey,
  getRowLabel,
  renderForm,
  formDialogTitle,
  formDialogDescription,
}: CrudPageProps<T>) {
  const [editing, setEditing] = React.useState<T | undefined>(undefined)
  const [formOpen, setFormOpen] = React.useState(false)
  const [toDelete, setToDelete] = React.useState<T | undefined>(undefined)

  const openNew = () => {
    setEditing(undefined)
    setFormOpen(true)
  }
  const openEdit = (item: T) => {
    setEditing(item)
    setFormOpen(true)
  }
  const closeForm = () => setFormOpen(false)

  const handleDelete = async () => {
    if (!toDelete) return
    await removeMutation.mutateAsync(getRowKey(toDelete))
    setToDelete(undefined)
  }

  // Coluna de ações injetada automaticamente
  const augmentedColumns: DataTableColumn<T>[] = [
    ...columns,
    {
      key: '__actions__',
      header: '',
      align: 'right',
      width: 'w-24',
      cell: (row) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Editar ${getRowLabel(row)}`}
            onClick={(e) => {
              e.stopPropagation()
              openEdit(row)
            }}
          >
            <Pencil size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Excluir ${getRowLabel(row)}`}
            onClick={(e) => {
              e.stopPropagation()
              setToDelete(row)
            }}
          >
            <Trash2 size={14} className="text-destructive" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        crumb={crumb}
        title={title}
        description={description}
        actions={
          <Button onClick={openNew}>
            <Plus size={14} /> {newButtonLabel}
          </Button>
        }
      />

      {listQuery.isError ? (
        <div className="bg-destructive/10 text-destructive rounded-md border border-destructive/30 px-4 py-3 text-sm">
          Erro ao carregar dados · {listQuery.error?.message}
          <Button variant="ghost" size="sm" className="ml-2" onClick={() => listQuery.refetch()}>
            Tentar novamente
          </Button>
        </div>
      ) : (
        <DataTable
          data={listQuery.data}
          columns={augmentedColumns}
          isLoading={listQuery.isLoading}
          emptyTitle={emptyTitle ?? title}
          emptyDescription="Comece criando o primeiro registro."
          emptyAction={
            <Button onClick={openNew}>
              <Plus size={14} /> {newButtonLabel}
            </Button>
          }
          getRowKey={getRowKey}
          onRowClick={openEdit}
        />
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{formDialogTitle(editing)}</DialogTitle>
            {formDialogDescription && <DialogDescription>{formDialogDescription}</DialogDescription>}
          </DialogHeader>
          <DialogBody>{renderForm(editing, closeForm)}</DialogBody>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(undefined)}
        title={toDelete ? `Excluir "${getRowLabel(toDelete)}"` : 'Excluir'}
        description="O registro será removido permanentemente."
        variant="danger"
        confirmLabel="Sim, excluir"
        loading={removeMutation.isPending}
        onConfirm={handleDelete}
      />
    </>
  )
}

/** Footer padrão para forms · cancela + salva */
export function FormDialogFooter({
  onCancel,
  loading,
  submitLabel = 'Salvar',
}: {
  onCancel: () => void
  loading?: boolean
  submitLabel?: string
}) {
  return (
    <div className="-mx-6 -mb-5 mt-5 flex flex-row-reverse items-center gap-2 border-t px-6 py-4">
      <Button type="submit" disabled={loading}>
        {loading ? <Spinner size={12} /> : null}
        {loading ? 'Salvando…' : submitLabel}
      </Button>
      <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
        Cancelar
      </Button>
    </div>
  )
}

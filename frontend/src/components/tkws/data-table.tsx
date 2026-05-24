import * as React from 'react'
import { Spinner } from '@/components/ui/spinner'
import { EmptyState } from '@/components/ui/empty-state'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DataTableColumn<T> {
  key: string
  header: React.ReactNode
  /** Render cell · default `String(row[key])` */
  cell?: (row: T) => React.ReactNode
  /** Largura · ex: 'w-28' */
  width?: string
  /** Alinhamento · default 'left' */
  align?: 'left' | 'right' | 'center'
}

export interface DataTableProps<T> {
  data: T[] | undefined
  columns: DataTableColumn<T>[]
  isLoading?: boolean
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: React.ReactNode
  onRowClick?: (row: T) => void
  getRowKey: (row: T) => string
}

/**
 * DataTable · wrapper de Table que lida com:
 *  - isLoading → Spinner
 *  - empty → EmptyState
 *  - rows clicáveis
 *
 * Para tables complexas (sort, filters, virtualization) use TanStack Table
 * direto · este é o atalho 80% dos casos.
 */
export function DataTable<T>({
  data,
  columns,
  isLoading,
  emptyTitle = 'Sem registros',
  emptyDescription = 'Não há dados para exibir nesta tabela.',
  emptyAction,
  onRowClick,
  getRowKey,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size={20} label="Carregando registros" />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={<Inbox size={20} strokeWidth={1.6} />}
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead
              key={col.key}
              className={cn(
                col.width,
                col.align === 'right' && 'text-right',
                col.align === 'center' && 'text-center',
              )}
            >
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow
            key={getRowKey(row)}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            className={cn(onRowClick && 'cursor-pointer')}
          >
            {columns.map((col) => (
              <TableCell
                key={col.key}
                className={cn(
                  col.align === 'right' && 'text-right',
                  col.align === 'center' && 'text-center',
                )}
              >
                {col.cell ? col.cell(row) : ((row as Record<string, unknown>)[col.key] as React.ReactNode)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

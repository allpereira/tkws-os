import { Building2, Mail, MapPin, MoreVertical, Phone, User } from 'lucide-react'
import { Avatar, initialsOf } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { Pessoa } from '../schema'

/** Formata CPF/CNPJ para leitura · entrada já vem só com dígitos do backend. */
export function formatDocumento(doc?: string | null, tipo?: 'PF' | 'PJ'): string | null {
  if (!doc) return null
  const d = doc.replace(/\D/g, '')
  if ((tipo === 'PF' || d.length === 11) && d.length === 11) {
    return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }
  if (d.length === 14) {
    return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }
  return doc
}

interface PessoaCardProps {
  pessoa: Pessoa
  onClick?: () => void
  /** Quando passado, exibe o menu de ações (⋮) com "Editar". */
  onEdit?: () => void
  /** Rodapé extra · ex.: data de conversão em Clientes. */
  meta?: React.ReactNode
}

/**
 * Card de Pessoa (Lead/Cliente) para a visualização em cards das telas de CRM.
 * Composto 100% de primitivos do design-system (Card · Avatar · Badge ·
 * DropdownMenu). Ver feedback "DS → Frontend é espelho".
 */
export function PessoaCard({ pessoa, onClick, onEdit, meta }: PessoaCardProps) {
  const isPJ = pessoa.tipoPessoa === 'PJ'
  const primary = isPJ && pessoa.nomeEmpresa ? pessoa.nomeEmpresa : pessoa.nomeContato
  const secondary = isPJ && pessoa.nomeEmpresa ? pessoa.nomeContato : null
  const doc = formatDocumento(pessoa.documento, pessoa.tipoPessoa)
  const local = [pessoa.cidade, pessoa.uf].filter(Boolean).join(' · ')

  return (
    <Card
      className={cn(
        'flex flex-col gap-3 p-4 transition-all',
        onClick && 'cursor-pointer hover:-translate-y-0.5 hover:shadow-[var(--shadow-2)]',
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
    >
      <div className="flex items-start gap-3">
        <Avatar size="md">
          {isPJ ? <Building2 size={16} /> : initialsOf(primary)}
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium" style={{ color: 'var(--text)' }}>
              {primary}
            </span>
            <Badge tone={isPJ ? 'purple' : 'brand'}>{pessoa.tipoPessoa}</Badge>
          </div>
          {secondary && (
            <span className="flex items-center gap-1 truncate text-[12px]" style={{ color: 'var(--text-soft)' }}>
              <User size={11} /> {secondary}
            </span>
          )}
        </div>
        {onEdit && (
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={`Ações de ${primary}`}
              onClick={(e) => e.stopPropagation()}
              className="-mr-1 -mt-1 inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-[var(--brand-soft)]"
              style={{ color: 'var(--text-soft)' }}
            >
              <MoreVertical size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                }}
              >
                Editar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="flex flex-col gap-1.5 text-[12.5px]" style={{ color: 'var(--text-soft)' }}>
        {pessoa.emailContato && (
          <span className="flex items-center gap-1.5 truncate">
            <Mail size={13} className="shrink-0" /> {pessoa.emailContato}
          </span>
        )}
        {pessoa.celularContato && (
          <span className="flex items-center gap-1.5">
            <Phone size={13} className="shrink-0" /> {pessoa.celularContato}
          </span>
        )}
        {local && (
          <span className="flex items-center gap-1.5">
            <MapPin size={13} className="shrink-0" /> {local}
          </span>
        )}
        {doc && <span className="mono text-[11.5px]">{doc}</span>}
      </div>

      {meta && (
        <div className="mt-auto border-t pt-2 text-[11.5px]" style={{ borderColor: 'var(--line-1)', color: 'var(--text-mute)' }}>
          {meta}
        </div>
      )}
    </Card>
  )
}

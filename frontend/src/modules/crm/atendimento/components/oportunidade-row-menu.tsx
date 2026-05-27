import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export interface OportunidadeRowMenuProps {
  onEdit: () => void
  onDelete: () => void
  disabled?: boolean
  /**
   * Estilo do trigger:
   *  - 'kebab' · 28x28, ideal para canto de card no Kanban
   *  - 'icon'  · 28x28 quadrado para hover-row de lista densa
   */
  variant?: 'kebab' | 'icon'
  /** Se passado, sobreescreve o style/ariaLabel do trigger */
  triggerLabel?: string
}

/**
 * Menu de ações inline · "Editar" e "Excluir".
 * Stopa propagation para não disparar o clique do card/row pai.
 */
export function OportunidadeRowMenu({
  onEdit,
  onDelete,
  disabled,
  variant = 'kebab',
  triggerLabel = 'Mais ações',
}: OportunidadeRowMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <button
          type="button"
          aria-label={triggerLabel}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className={cn(
            'flex cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-white/[0.06] disabled:opacity-50',
            variant === 'kebab' ? 'h-7 w-7' : 'h-7 w-7',
          )}
          style={{ color: 'var(--text-mute)' }}
        >
          <MoreHorizontal size={14} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onEdit}>
          <Pencil size={12} /> Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={onDelete}
          style={{ color: 'var(--danger)' }}
        >
          <Trash2 size={12} /> Excluir oportunidade
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

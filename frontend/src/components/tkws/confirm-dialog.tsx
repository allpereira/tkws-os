import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

export interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'default'
  loading?: boolean
  onConfirm: () => void | Promise<void>
}

/**
 * ConfirmDialog · diálogo de confirmação genérico.
 * Use para ações destrutivas (excluir, arquivar) ou irreversíveis.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'default',
  loading,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            {variant === 'danger' && (
              <span
                className="inline-flex h-8 w-8 items-center justify-center rounded-[10px]"
                style={{ background: 'rgba(235, 87, 87, 0.14)', color: 'var(--danger)' }}
              >
                <AlertTriangle size={15} />
              </span>
            )}
            <DialogTitle>{title}</DialogTitle>
          </div>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogBody>
          <p className="text-[13px]" style={{ color: 'var(--text-soft)' }}>
            Essa ação não pode ser desfeita. Confirme apenas se tem certeza.
          </p>
        </DialogBody>
        <DialogFooter>
          <Button
            variant={variant === 'danger' ? 'danger' : 'default'}
            disabled={loading}
            onClick={() => void onConfirm()}
          >
            {loading ? 'Processando…' : confirmLabel}
          </Button>
          <Button variant="outline" disabled={loading} onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

import * as React from 'react'
import { Mail, RefreshCw, UserPlus, XCircle } from 'lucide-react'
import { PageShell } from '@/components/tkws/page-shell'
import { DataTable, type DataTableColumn } from '@/components/tkws/data-table'
import { ConfirmDialog } from '@/components/tkws/confirm-dialog'
import { SystemFrame } from '@/components/tkws/system-frame'
import { Button } from '@/components/ui/button'
import { Badge, type BadgeTone } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { parseApiError, formatApiErrorInfo } from '@/lib/api-error'
import { useInvites, useRevokeInvite, useResendInvite } from '../api'
import {
  INVITE_ROLE_LABELS,
  INVITE_STATUS_LABELS,
  type InviteListItem,
  type InviteStatus,
} from '../schema'

const STATUS_TONE: Record<InviteStatus, BadgeTone> = {
  PENDING: 'warning',
  ACCEPTED: 'success',
  EXPIRED: 'neutral',
  REVOKED: 'danger',
}

const dateFmt = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
function fmtDate(iso: string): string {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '—' : dateFmt.format(d)
}

const InviteFormLazy = React.lazy(() =>
  import('./invite-form').then((m) => ({ default: m.InviteForm })),
)

export function UsuariosPage() {
  const listQuery = useInvites()
  const revokeMut = useRevokeInvite()
  const resendMut = useResendInvite()

  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [revoking, setRevoking] = React.useState<InviteListItem | null>(null)
  const [banner, setBanner] = React.useState<{ tone: 'success'; message: string } | null>(null)
  const [actionError, setActionError] = React.useState<string | null>(null)

  // O backend (@PreAuthorize) é a fonte de verdade da autorização. Se o usuário
  // não for admin, a listagem volta 403 — mostramos a tela de acesso restrito em
  // vez de confiar só no claim de roles do token (que pode não vir · ver useRoles).
  const listError = listQuery.isError ? parseApiError(listQuery.error) : null
  if (listError?.status === 403) {
    return (
      <SystemFrame
        bigNum="403"
        bigEmTone="danger"
        label="Acesso restrito"
        title="Sem permissão"
        italic="para esta área."
        description="A gestão de usuários é exclusiva de administradores do escritório. Fale com um org_admin se você precisa convidar pessoas."
        info="/settings/usuarios"
        actions={null}
      />
    )
  }

  const invites = listQuery.data?.content ?? []

  const handleResend = async (invite: InviteListItem) => {
    setActionError(null)
    try {
      await resendMut.mutateAsync(invite.id)
      setBanner({ tone: 'success', message: `Convite reenviado para ${invite.email}.` })
    } catch (err) {
      setActionError(formatApiErrorInfo(parseApiError(err)))
    }
  }

  const confirmRevoke = async () => {
    if (!revoking) return
    setActionError(null)
    try {
      await revokeMut.mutateAsync(revoking.id)
      setBanner({ tone: 'success', message: `Convite de ${revoking.email} cancelado.` })
      setRevoking(null)
    } catch (err) {
      setActionError(formatApiErrorInfo(parseApiError(err)))
      setRevoking(null)
    }
  }

  const columns: DataTableColumn<InviteListItem>[] = [
    {
      key: 'email',
      header: 'Usuário',
      cell: (r) => (
        <div className="flex flex-col">
          <span className="font-medium">{r.email}</span>
          {r.fullName && <span className="text-[12px] text-muted-foreground">{r.fullName}</span>}
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Papel',
      width: 'w-56',
      cell: (r) => <Badge tone="neutral">{INVITE_ROLE_LABELS[r.role]}</Badge>,
    },
    {
      key: 'status',
      header: 'Status',
      width: 'w-32',
      cell: (r) => <Badge tone={STATUS_TONE[r.status]}>{INVITE_STATUS_LABELS[r.status]}</Badge>,
    },
    {
      key: 'expiresAt',
      header: 'Expira em',
      width: 'w-40',
      cell: (r) => <span className="text-[12px] text-muted-foreground">{fmtDate(r.expiresAt)}</span>,
    },
    {
      key: 'actions',
      header: '',
      width: 'w-32',
      align: 'right',
      cell: (r) =>
        r.status === 'PENDING' ? (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Reenviar convite para ${r.email}`}
              title="Reenviar convite"
              disabled={resendMut.isPending}
              onClick={() => void handleResend(r)}
            >
              <RefreshCw />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Cancelar convite de ${r.email}`}
              title="Cancelar convite"
              onClick={() => setRevoking(r)}
            >
              <XCircle />
            </Button>
          </div>
        ) : null,
    },
  ]

  return (
    <PageShell
      crumb="Configurações"
      title="Usuários"
      italic="& convites"
      description="Convide pessoas para o escritório. Cada convidado recebe um email e só ganha acesso depois de confirmar pelo link e definir a senha — você nunca compartilha senhas."
      actions={
        <Button onClick={() => setDialogOpen(true)}>
          <UserPlus /> Convidar usuário
        </Button>
      }
    >
      {banner && (
        <div className="mb-4">
          <Alert tone="success">
            <AlertDescription>{banner.message}</AlertDescription>
          </Alert>
        </div>
      )}

      {actionError && (
        <div className="mb-4">
          <Alert tone="danger">
            <AlertTitle>Não foi possível concluir a ação</AlertTitle>
            <AlertDescription>{actionError}</AlertDescription>
          </Alert>
        </div>
      )}

      {listQuery.isError && (
        <div className="mb-4">
          <Alert tone="danger">
            <AlertTitle>Erro ao carregar convites</AlertTitle>
            <AlertDescription>{formatApiErrorInfo(parseApiError(listQuery.error))}</AlertDescription>
          </Alert>
        </div>
      )}

      <DataTable
        data={invites}
        columns={columns}
        isLoading={listQuery.isLoading}
        getRowKey={(r) => r.id}
        emptyTitle="Nenhum convite ainda"
        emptyDescription="Convide a primeira pessoa para o escritório."
        emptyAction={
          <Button onClick={() => setDialogOpen(true)}>
            <UserPlus /> Convidar usuário
          </Button>
        }
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convidar usuário</DialogTitle>
            <DialogDescription>
              <span className="inline-flex items-center gap-1.5">
                <Mail size={13} /> Um email de confirmação será enviado ao endereço informado.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <React.Suspense fallback={null}>
              <InviteFormLazy
                onCancel={() => setDialogOpen(false)}
                onSuccess={(created) => {
                  setDialogOpen(false)
                  setBanner({
                    tone: 'success',
                    message: `Convite enviado para ${created.email}. O acesso é ativado quando a pessoa confirmar pelo email.`,
                  })
                }}
              />
            </React.Suspense>
          </DialogBody>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={revoking !== null}
        onOpenChange={(open) => !open && setRevoking(null)}
        title="Cancelar convite"
        description={
          revoking
            ? `O link enviado para ${revoking.email} deixará de funcionar. Esta ação não pode ser desfeita.`
            : undefined
        }
        confirmLabel="Cancelar convite"
        variant="danger"
        loading={revokeMut.isPending}
        onConfirm={confirmRevoke}
      />
    </PageShell>
  )
}

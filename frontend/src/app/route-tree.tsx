import { lazy, Suspense, useEffect } from 'react'
import {
  Outlet,
  createRootRoute,
  createRoute,
  useNavigate,
} from '@tanstack/react-router'
import { Home, Search } from 'lucide-react'
import { useAuth } from 'react-oidc-context'
import { AppShell } from '@/components/tkws/app-shell'
import { PageShell } from '@/components/tkws/page-shell'
import { SystemFrame } from '@/components/tkws/system-frame'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useRequireAuth } from '@/modules/plataforma/auth/use-require-auth'
import {
  AuthErrorPanel,
  AuthSetupRequired,
} from '@/modules/plataforma/auth/components/auth-gate'
import { useCurrentUser } from '@/modules/plataforma/users/api'

// =============================================================================
// LAZY pages · todas atrás de Suspense para baixar sob demanda
// =============================================================================

const lazyPage = <K extends string>(
  importer: () => Promise<Record<K, React.ComponentType<unknown>>>,
  key: K,
) => lazy(() => importer().then((m) => ({ default: m[key] })))

// Settings · CRM
const TiposPagamentoPage = lazyPage(
  () => import('@/modules/crm/configuracoes/tipos-pagamentos/components/tipos-pagamento-page'),
  'TiposPagamentoPage',
)
const PipelinesPage = lazyPage(
  () => import('@/modules/crm/configuracoes/pipelines/components/pipelines-page'),
  'PipelinesPage',
)
const EtapasPage = lazyPage(
  () => import('@/modules/crm/configuracoes/etapas/components/etapas-page'),
  'EtapasPage',
)
const OrigensNegocioPage = lazyPage(
  () => import('@/modules/crm/configuracoes/origens-negocio/components/origens-negocio-page'),
  'OrigensNegocioPage',
)

// Settings · Organização
const OfertasPage = lazyPage(
  () => import('@/modules/organizacao/configuracoes/ofertas/components/ofertas-page'),
  'OfertasPage',
)
const TiposEmpresaPage = lazyPage(
  () => import('@/modules/organizacao/configuracoes/tipos-empresa/components/tipos-empresa-page'),
  'TiposEmpresaPage',
)
const UnidadesPage = lazyPage(
  () => import('@/modules/organizacao/configuracoes/unidades/components/unidades-page'),
  'UnidadesPage',
)
const SetoresPage = lazyPage(
  () => import('@/modules/organizacao/configuracoes/setores/components/setores-page'),
  'SetoresPage',
)
const TiposProjetoPage = lazyPage(
  () => import('@/modules/organizacao/configuracoes/tipos-projetos/components/tipos-projeto-page'),
  'TiposProjetoPage',
)
const FuncoesPessoasPage = lazyPage(
  () => import('@/modules/organizacao/configuracoes/funcoes-pessoas/components/funcoes-pessoas-page'),
  'FuncoesPessoasPage',
)
const EmpreendimentosPage = lazyPage(
  () => import('@/modules/organizacao/configuracoes/empreendimentos/components/empreendimentos-page'),
  'EmpreendimentosPage',
)

// Settings · Plataforma (admin do escritório)
const UsuariosPage = lazyPage(
  () => import('@/modules/plataforma/usuarios/components/usuarios-page'),
  'UsuariosPage',
)

// CRM
const LeadsPage = lazyPage(
  () => import('@/modules/crm/leads/components/leads-page'),
  'LeadsPage',
)
const ClientesPage = lazyPage(
  () => import('@/modules/crm/clientes/components/clientes-page'),
  'ClientesPage',
)
const AtendimentoPage = lazyPage(
  () => import('@/modules/crm/atendimento/components/atendimento-page'),
  'AtendimentoPage',
)
const PropostasPage = lazyPage(
  () => import('@/modules/crm/propostas/components/propostas-page'),
  'PropostasPage',
)

// =============================================================================
// Root + auth wrapper
// =============================================================================

function PageFallback() {
  return (
    <div className="flex h-[40vh] items-center justify-center" aria-live="polite">
      <Spinner size={20} label="Carregando…" />
    </div>
  )
}

function FullPageSpinner({ label }: { label: string }) {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ background: 'var(--bg)' }}
      aria-live="polite"
    >
      <Spinner size={22} label={label} />
    </div>
  )
}

function AuthenticatedShell({ children }: { children: React.ReactNode }) {
  const { auth, configured, blockingError, isRedirecting } = useRequireAuth()
  const me = useCurrentUser(auth.user?.access_token)

  if (!configured) return <AuthSetupRequired />
  if (blockingError) {
    return (
      <AuthErrorPanel
        title="Não foi possível iniciar o login"
        message={blockingError}
        onRetry={() => window.location.reload()}
      />
    )
  }
  if (auth.isLoading || me.isLoading) {
    return <FullPageSpinner label="Carregando…" />
  }
  if (isRedirecting || !auth.isAuthenticated) {
    return <FullPageSpinner label="Redirecionando para login…" />
  }
  if (me.isError) {
    const status =
      me.error && typeof me.error === 'object' && 'response' in me.error
        ? (me.error as { response?: { status?: number } }).response?.status
        : undefined
    return (
      <AuthErrorPanel
        title="Não foi possível carregar seu perfil"
        message={
          status === 401
            ? 'A API rejeitou o token (401). No Zitadel, defina o app Web com Access Token Type JWT, faça logout/login e confira VITE_ZITADEL_CLIENT_ID no .env.local.'
            : status === 400
              ? 'A API não encontrou e-mail no token. Faça logout/login; no Zitadel, confira scope email no app Web.'
              : me.error instanceof Error
                ? me.error.message
                : 'Verifique se a API está em execução em http://localhost:8080.'
        }
        onRetry={() => void me.refetch()}
      />
    )
  }

  return (
    <AppShell user={{ name: me.data?.fullName ?? undefined, email: me.data?.email ?? undefined }}>
      <Suspense fallback={<PageFallback />}>{children}</Suspense>
    </AppShell>
  )
}

const rootRoute = createRootRoute({
  component: () => (
    <AuthenticatedShell>
      <Outlet />
    </AuthenticatedShell>
  ),
  notFoundComponent: NotFoundPage,
})

// =============================================================================
// OIDC callback (sem shell · só processa o redirect)
// =============================================================================

function OidcCallbackPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    if (auth.isAuthenticated) void navigate({ to: '/' })
  }, [auth.isAuthenticated, navigate])
  if (auth.error) {
    return (
      <AuthErrorPanel
        title="Falha ao concluir login"
        message={auth.error.message}
        onRetry={() => window.location.assign('/')}
      />
    )
  }
  return <FullPageSpinner label="Concluindo login…" />
}

// =============================================================================
// Home · dashboard editorial simples
// =============================================================================

// =============================================================================
// Página 404 · System pattern (SystemFrame)
// =============================================================================

function NotFoundPage() {
  const path = typeof window !== 'undefined' ? window.location.pathname : ''
  const timestamp =
    typeof window !== 'undefined'
      ? new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
      : ''
  return (
    <SystemFrame
      bigNum="404"
      bigEmTone="brand"
      label="Página não encontrada"
      title="Esse caminho"
      italic="não existe."
      description="O link que você seguiu está quebrado, ou o recurso foi movido. Acontece. Volte para o início ou use a busca pra encontrar o que precisa."
      info={`${path} · ${timestamp}`}
      actions={
        <>
          <Button asChild>
            <a href="/">
              <Home size={14} /> Voltar ao início
            </a>
          </Button>
          <Button variant="outline" onClick={() => alert('Em breve: busca global ⌘K')}>
            <Search size={14} /> Buscar
          </Button>
        </>
      }
    />
  )
}

function HomePage() {
  return (
    <PageShell
      breadcrumbs={[{ label: 'Início', current: true }]}
      title="Bem-vindo ao"
      italic="TKWS OS"
      description="Use a navegação à esquerda para acessar o módulo CRM (leads, clientes, atendimento, propostas) e as Configurações de CRM e Organização."
    >
      <></>
    </PageShell>
  )
}

// =============================================================================
// Route definitions
// =============================================================================

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: HomePage })
const callbackRoute = createRoute({ getParentRoute: () => rootRoute, path: '/callback', component: OidcCallbackPage })

// Settings · CRM
const settingsCrmTiposPagamentosRoute = createRoute({ getParentRoute: () => rootRoute, path: '/settings/crm/tipos-pagamentos', component: TiposPagamentoPage })
const settingsCrmPipelinesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/settings/crm/pipelines', component: PipelinesPage })
const settingsCrmEtapasRoute = createRoute({ getParentRoute: () => rootRoute, path: '/settings/crm/etapas', component: EtapasPage })
const settingsCrmOrigensNegocioRoute = createRoute({ getParentRoute: () => rootRoute, path: '/settings/crm/origens-negocio', component: OrigensNegocioPage })

// Settings · Organização
const settingsOrgOfertasRoute = createRoute({ getParentRoute: () => rootRoute, path: '/settings/organizacao/ofertas', component: OfertasPage })
const settingsOrgTiposEmpresaRoute = createRoute({ getParentRoute: () => rootRoute, path: '/settings/organizacao/tipos-empresa', component: TiposEmpresaPage })
const settingsOrgUnidadesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/settings/organizacao/unidades', component: UnidadesPage })
const settingsOrgSetoresRoute = createRoute({ getParentRoute: () => rootRoute, path: '/settings/organizacao/setores', component: SetoresPage })
const settingsOrgTiposProjetosRoute = createRoute({ getParentRoute: () => rootRoute, path: '/settings/organizacao/tipos-projetos', component: TiposProjetoPage })
const settingsOrgFuncoesPessoasRoute = createRoute({ getParentRoute: () => rootRoute, path: '/settings/organizacao/funcoes-pessoas', component: FuncoesPessoasPage })
const settingsOrgEmpreendimentosRoute = createRoute({ getParentRoute: () => rootRoute, path: '/settings/organizacao/empreendimentos', component: EmpreendimentosPage })
const settingsUsuariosRoute = createRoute({ getParentRoute: () => rootRoute, path: '/settings/usuarios', component: UsuariosPage })

// CRM
const crmLeadsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/crm/leads', component: LeadsPage })
const crmClientesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/crm/clientes', component: ClientesPage })
const crmAtendimentoRoute = createRoute({ getParentRoute: () => rootRoute, path: '/crm/atendimento', component: AtendimentoPage })
const crmPropostasRoute = createRoute({ getParentRoute: () => rootRoute, path: '/crm/propostas', component: PropostasPage })

export const routeTree = rootRoute.addChildren([
  indexRoute,
  callbackRoute,
  // Settings
  settingsCrmTiposPagamentosRoute,
  settingsCrmPipelinesRoute,
  settingsCrmEtapasRoute,
  settingsCrmOrigensNegocioRoute,
  settingsOrgOfertasRoute,
  settingsOrgTiposEmpresaRoute,
  settingsOrgUnidadesRoute,
  settingsOrgSetoresRoute,
  settingsOrgTiposProjetosRoute,
  settingsOrgFuncoesPessoasRoute,
  settingsOrgEmpreendimentosRoute,
  settingsUsuariosRoute,
  // CRM
  crmLeadsRoute,
  crmClientesRoute,
  crmAtendimentoRoute,
  crmPropostasRoute,
])

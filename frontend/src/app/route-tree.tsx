import { lazy, Suspense, useEffect } from 'react'
import {
  Outlet,
  createRootRoute,
  createRoute,
  useNavigate,
} from '@tanstack/react-router'
import { useAuth } from 'react-oidc-context'
import { AppShell } from '@/components/tkws/app-shell'
import { Spinner } from '@/components/ui/spinner'
import { useRequireAuth } from '@/modules/plataforma/auth/hooks/use-require-auth'
import {
  AuthErrorPanel,
  AuthSetupRequired,
} from '@/modules/plataforma/auth/components/auth-gate'
import { useCurrentUser } from '@/modules/plataforma/users/hooks/use-current-user'

// =============================================================================
// LAZY pages · todas atrás de Suspense para baixar sob demanda
// =============================================================================

const lazyPage = <K extends string>(
  importer: () => Promise<Record<K, React.ComponentType<unknown>>>,
  key: K,
) => lazy(() => importer().then((m) => ({ default: m[key] })))

// Settings · CRM
const TiposPropostaPage = lazyPage(
  () => import('@/modules/crm/configuracoes/tipos-propostas/components/tipos-proposta-page'),
  'TiposPropostaPage',
)
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

// Settings · Empresa
const ProdutosPage = lazyPage(
  () => import('@/modules/empresa/configuracoes/produtos/components/produtos-page'),
  'ProdutosPage',
)
const SetoresPage = lazyPage(
  () => import('@/modules/empresa/configuracoes/setores/components/setores-page'),
  'SetoresPage',
)
const TiposProjetoPage = lazyPage(
  () => import('@/modules/empresa/configuracoes/tipos-projetos/components/tipos-projeto-page'),
  'TiposProjetoPage',
)
const FuncoesPessoasPage = lazyPage(
  () => import('@/modules/empresa/configuracoes/funcoes-pessoas/components/funcoes-pessoas-page'),
  'FuncoesPessoasPage',
)
const EmpreendimentosPage = lazyPage(
  () => import('@/modules/empresa/configuracoes/empreendimentos/components/empreendimentos-page'),
  'EmpreendimentosPage',
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
    return <div className="text-muted-foreground p-8">Carregando…</div>
  }
  if (isRedirecting || !auth.isAuthenticated) {
    return <div className="text-muted-foreground p-8">Redirecionando para login…</div>
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
  return <div className="text-muted-foreground p-8">Concluindo login…</div>
}

// =============================================================================
// Home · dashboard simples por enquanto
// =============================================================================

function HomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold tracking-tight">Bem-vindo ao TKWS OS</h1>
      <p className="text-muted-foreground">
        Use a navegação à esquerda para acessar Configurações (CRM e Empresa) e o módulo CRM.
      </p>
    </div>
  )
}

// =============================================================================
// Route definitions
// =============================================================================

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: HomePage })
const callbackRoute = createRoute({ getParentRoute: () => rootRoute, path: '/callback', component: OidcCallbackPage })

// Settings · CRM
const settingsCrmTiposPropostasRoute = createRoute({ getParentRoute: () => rootRoute, path: '/settings/crm/tipos-propostas', component: TiposPropostaPage as any })
const settingsCrmTiposPagamentosRoute = createRoute({ getParentRoute: () => rootRoute, path: '/settings/crm/tipos-pagamentos', component: TiposPagamentoPage as any })
const settingsCrmPipelinesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/settings/crm/pipelines', component: PipelinesPage as any })
const settingsCrmEtapasRoute = createRoute({ getParentRoute: () => rootRoute, path: '/settings/crm/etapas', component: EtapasPage as any })

// Settings · Empresa
const settingsEmpresaProdutosRoute = createRoute({ getParentRoute: () => rootRoute, path: '/settings/empresa/produtos', component: ProdutosPage as any })
const settingsEmpresaSetoresRoute = createRoute({ getParentRoute: () => rootRoute, path: '/settings/empresa/setores', component: SetoresPage as any })
const settingsEmpresaTiposProjetosRoute = createRoute({ getParentRoute: () => rootRoute, path: '/settings/empresa/tipos-projetos', component: TiposProjetoPage as any })
const settingsEmpresaFuncoesPessoasRoute = createRoute({ getParentRoute: () => rootRoute, path: '/settings/empresa/funcoes-pessoas', component: FuncoesPessoasPage as any })
const settingsEmpresaEmpreendimentosRoute = createRoute({ getParentRoute: () => rootRoute, path: '/settings/empresa/empreendimentos', component: EmpreendimentosPage as any })

// CRM
const crmLeadsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/crm/leads', component: LeadsPage as any })
const crmClientesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/crm/clientes', component: ClientesPage as any })
const crmAtendimentoRoute = createRoute({ getParentRoute: () => rootRoute, path: '/crm/atendimento', component: AtendimentoPage as any })
const crmPropostasRoute = createRoute({ getParentRoute: () => rootRoute, path: '/crm/propostas', component: PropostasPage as any })

export const routeTree = rootRoute.addChildren([
  indexRoute,
  callbackRoute,
  // Settings
  settingsCrmTiposPropostasRoute,
  settingsCrmTiposPagamentosRoute,
  settingsCrmPipelinesRoute,
  settingsCrmEtapasRoute,
  settingsEmpresaProdutosRoute,
  settingsEmpresaSetoresRoute,
  settingsEmpresaTiposProjetosRoute,
  settingsEmpresaFuncoesPessoasRoute,
  settingsEmpresaEmpreendimentosRoute,
  // CRM
  crmLeadsRoute,
  crmClientesRoute,
  crmAtendimentoRoute,
  crmPropostasRoute,
])

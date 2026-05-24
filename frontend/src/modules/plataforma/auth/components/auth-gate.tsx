import { Mail, RefreshCw, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SystemFrame } from '@/components/tkws/system-frame'

/**
 * Telas de gate de autenticação · todas seguem o System Pages pattern
 * (SystemFrame com big-num editorial, label mono, título serif+italic,
 * descrição, ações e info técnica no rodapé).
 *
 * Veja `docs/14-DESIGN-SYSTEM-SYNC.md` para o pattern oficial e
 * `design-system/src/pages/patterns/SystemPages.tsx` para variantes.
 */

type AuthSetupRequiredProps = { docsPath?: string }

export function AuthSetupRequired({ docsPath = 'docs/04-AUTH.md' }: AuthSetupRequiredProps) {
  return (
    <SystemFrame
      layout="full"
      bigNum="503"
      bigEmTone="warning"
      label="Autenticação não configurada"
      title="O TKWS OS precisa"
      italic="ser configurado."
      description="O frontend ainda não conhece o Client ID do Zitadel. Copie .env.example para .env.local e defina VITE_ZITADEL_CLIENT_ID; em seguida reinicie o Vite."
      info={`SETUP · veja ${docsPath} · ZITADEL · VITE`}
      actions={
        <>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw size={14} /> Recarregar
          </Button>
          <Button variant="outline" asChild>
            <a href="mailto:suporte@groupws.com.br?subject=TKWS%20OS%20-%20Setup%20de%20autentica%C3%A7%C3%A3o">
              <Mail size={14} /> Falar com suporte
            </a>
          </Button>
        </>
      }
    />
  )
}

type AuthErrorPanelProps = {
  title: string
  message: string
  onRetry?: () => void
}

export function AuthErrorPanel({ title, message, onRetry }: AuthErrorPanelProps) {
  const timestamp = new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
  return (
    <SystemFrame
      layout="full"
      bigNum="401"
      bigEmTone="danger"
      label={title}
      title="Não conseguimos"
      italic="autenticar você."
      description={message}
      info={`AUTH · ${timestamp}`}
      actions={
        <>
          {onRetry && (
            <Button onClick={onRetry}>
              <RefreshCw size={14} /> Tentar novamente
            </Button>
          )}
          <Button variant="outline" asChild>
            <a href="mailto:suporte@groupws.com.br?subject=TKWS%20OS%20-%20Falha%20de%20autentica%C3%A7%C3%A3o">
              <Settings size={14} /> Falar com suporte
            </a>
          </Button>
        </>
      }
    />
  )
}

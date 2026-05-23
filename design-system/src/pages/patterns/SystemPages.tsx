import { Construction, Home, Mail, RotateCcw, Search, WifiOff } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Button } from '@/components/ui/button'
import type { AIPrompt } from '@/lib/prompts'

/**
 * Fiel ao HTML · ds-error-page:
 *   container bg surface-1 · border line-2 · radius 14px · padding 80px 32px · text-center
 *   big-num: Fraunces 140px / 300 · letter-spacing -0.05em · line-height 0.9
 *           em: italic brand
 *   label: mono 11px / tracking 2px uppercase text-mute · margin-bottom 14px
 *   h2: Fraunces 36px / 300 · letter-spacing -0.025em · em italic text-soft
 *   p: 15px text-soft · max-w 460px · margin 16px auto 28px
 *   actions: gap 10px center flex-wrap
 *   info: mono 10px · margin-top 32px · padding-top 22px · border-top line-1
 */

const prompt: AIPrompt = {
  componente: 'Pattern · System pages',
  import: '// Composição: big-num Fraunces + label mono + h2 + descrição + ações + info',
  contexto:
    'Páginas de sistema · 404, 500, manutenção, sem internet, sucesso, em construção. SEMPRE com big-num em Fraunces 140px (italic colorido) · NUNCA "Oops" ou "Page not found" genéricos. Sempre uma ação clara de saída e info técnica no rodapé.',
  quandoUsar: [
    '404 · rota não encontrada',
    '500 · erro de servidor',
    'Manutenção programada',
    'Sem internet · PWA offline',
    'Sucesso pós-pagamento ou cadastro',
    'Em construção (feature flag)',
  ],
  props: [],
  antiPatterns: [
    'Páginas de erro sem ação · usuário fica preso',
    'Texto genérico "algo deu errado" · sem contexto',
    'Sem big-num · perde identidade editorial',
    'Sem info técnica · suporte não consegue debugar',
  ],
  exemplo: `<SystemFrame
  bigNum="404"
  bigEmTone="brand"
  label="Página não encontrada"
  title="Esse caminho"
  italic="não existe."
  description="..."
  info="/projetos/2410 · 16/05/2026 14:22"
  actions={<Button>Voltar ao cockpit</Button>}
/>`,
  relacionados: ['EmptyState', 'Alert'],
}

export function SystemPagesPattern() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        num="P21"
        category="Pattern · System Pages"
        title="System Pages"
        italic="404 · 500 · manutenção · sucesso"
        description="Páginas de sistema com big-num editorial. Sempre ação clara de saída. Nunca 'Oops'."
        tag="6 variantes"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="404 · não encontrado" />
      <Showcase padding="none">
        <SystemFrame
          bigNum="404"
          bigEmTone="brand"
          label="Página não encontrada"
          title="Esse caminho"
          italic="não existe."
          description="O link que você seguiu está quebrado, ou o recurso foi movido. Acontece. Volte para o cockpit ou use a busca pra encontrar o que precisa."
          info="/projetos/2410-yachthouse · 16/05/2026 14:22"
          actions={
            <>
              <Button><Home size={14} /> Voltar ao cockpit</Button>
              <Button variant="outline"><Search size={14} /> Buscar</Button>
            </>
          }
        />
      </Showcase>

      <SubHead num="B" title="500 · erro de servidor" />
      <Showcase padding="none">
        <SystemFrame
          bigNum="500"
          bigEmTone="danger"
          label="Erro interno"
          title="Algo deu errado"
          italic="aqui do nosso lado."
          description="Não é com você. A engenharia já foi notificada e está investigando. Geralmente resolve em alguns minutos — tente novamente."
          info="ERR_INTERNAL · REQ-ID e83a-7f1b-9c4d · 14:42"
          actions={
            <>
              <Button onClick={() => location.reload()}><RotateCcw size={14} /> Tentar novamente</Button>
              <Button variant="outline"><Mail size={14} /> Reportar com detalhe</Button>
            </>
          }
        />
      </Showcase>

      <SubHead num="C" title="Maintenance · manutenção programada" />
      <Showcase padding="none">
        <SystemFrame
          bigNum="·"
          bigEmTone="warning"
          label="Manutenção programada"
          title="Voltamos em"
          italic="30 minutos."
          description="Estamos fazendo uma atualização rápida do sistema. Seus dados estão seguros — o TKWS OS volta automaticamente para você. Sem ação necessária."
          info="DEPLOY V1.4.2 · INÍCIO 14:00 · FIM PREVISTO 14:30"
          actions={
            <>
              <Button variant="outline"><RotateCcw size={14} /> Verificar agora</Button>
              <Button><Mail size={14} /> Avisar quando voltar</Button>
            </>
          }
        />
      </Showcase>

      <SubHead num="D" title="Offline · sem conexão" />
      <Showcase padding="none">
        <SystemFrame
          customBig={
            <div
              className="serif font-light"
              style={{
                fontSize: 80,
                color: 'var(--text-mute)',
                marginBottom: 20,
                lineHeight: 0.9,
              }}
            >
              <WifiOff size={80} strokeWidth={1} />
            </div>
          }
          label="Sem conexão"
          title="Você está"
          italic="offline."
          description="O TKWS OS funciona em modo limitado offline — você pode ver dados em cache, mas não pode salvar. Reconectaremos automaticamente."
          info="DESCONECTADO HÁ 0:42 · ÚLTIMA SYNC 14:00"
          actions={
            <>
              <Button><RotateCcw size={14} /> Tentar reconectar</Button>
              <Button variant="outline">Ver dados em cache</Button>
            </>
          }
        />
      </Showcase>

      <SubHead num="E" title="Em construção · feature flag" />
      <Showcase padding="none">
        <SystemFrame
          customBig={
            <div
              className="serif font-light"
              style={{
                fontSize: 80,
                color: 'var(--brand)',
                marginBottom: 20,
                lineHeight: 0.9,
              }}
            >
              <Construction size={80} strokeWidth={1} />
            </div>
          }
          label="Em construção"
          title="Estamos"
          italic="chegando."
          description="O módulo de Catálogo Externo libera para o seu plano no dia 28/05/2026. Você será notificado por email."
          info="FEATURE_FLAG catalog_external · LIBERAÇÃO 28/05/2026"
          actions={<Button variant="outline"><Mail size={14} /> Avise-me</Button>}
        />
      </Showcase>

      <SubHead num="F" title="Sucesso · pós-cadastro" />
      <Showcase padding="none">
        <SystemFrame
          customBig={
            <div
              className="serif font-light"
              style={{
                fontSize: 140,
                color: 'var(--success)',
                marginBottom: 28,
                letterSpacing: '-0.05em',
                lineHeight: 0.9,
              }}
            >
              <em className="italic">✓</em>
            </div>
          }
          label="Tudo certo"
          title="Bem-vindo"
          italic="à plataforma."
          description="Sua conta TKWS OS está pronta. Confirmamos seu email · siga para o onboarding em 4 etapas."
          info="ONBOARDING_STEP 0 · ACCOUNT_CREATED 14:55"
          actions={
            <>
              <Button>Começar onboarding</Button>
              <Button variant="ghost">Pular para o app</Button>
            </>
          }
        />
      </Showcase>
    </div>
  )
}

/** Fiel à anatomia ds-error-page do HTML. */
function SystemFrame({
  bigNum,
  bigEmTone = 'brand',
  customBig,
  label,
  title,
  italic,
  description,
  info,
  actions,
}: {
  bigNum?: string
  bigEmTone?: 'brand' | 'danger' | 'warning' | 'alert' | 'success'
  customBig?: React.ReactNode
  label: string
  title: string
  italic: string
  description: string
  info?: string
  actions: React.ReactNode
}) {
  const emColor = `var(--${bigEmTone})`
  return (
    <div
      className="text-center"
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--line-2)',
        borderRadius: 14,
        padding: '80px 32px',
      }}
    >
      {customBig ? (
        customBig
      ) : (
        <div
          className="serif font-light"
          style={{
            fontSize: 140,
            letterSpacing: '-0.05em',
            color: 'var(--text)',
            lineHeight: 0.9,
            marginBottom: 28,
          }}
        >
          <em className="italic" style={{ color: emColor }}>
            {bigNum}
          </em>
        </div>
      )}

      <div
        className="mono"
        style={{
          fontSize: 11,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'var(--text-mute)',
          marginBottom: 14,
        }}
      >
        {label}
      </div>

      <h2
        className="serif"
        style={{
          fontSize: 36,
          fontWeight: 300,
          letterSpacing: '-0.025em',
          color: 'var(--text)',
          lineHeight: 1.05,
        }}
      >
        {title}
        <br />
        <em className="italic font-light" style={{ color: 'var(--text-soft)' }}>
          {italic}
        </em>
      </h2>

      <p
        style={{
          fontSize: 15,
          lineHeight: 1.6,
          color: 'var(--text-soft)',
          maxWidth: 460,
          margin: '16px auto 28px',
        }}
      >
        {description}
      </p>

      <div className="flex flex-wrap justify-center gap-2.5">{actions}</div>

      {info && (
        <div
          className="mono"
          style={{
            marginTop: 32,
            paddingTop: 22,
            borderTop: '1px solid var(--line-1)',
            fontSize: 10,
            color: 'var(--text-mute)',
            letterSpacing: '0.8px',
          }}
        >
          {info}
        </div>
      )}
    </div>
  )
}

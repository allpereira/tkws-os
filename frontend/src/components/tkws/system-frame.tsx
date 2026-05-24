import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * SystemFrame · Pattern oficial TKWS OS para páginas de sistema.
 *
 * Casos: 404 · 500 · manutenção · sem internet · sucesso · em construção.
 * SEMPRE com big-num em Fraunces 140px (italic colorido).
 * NUNCA "Oops" ou "Page not found" genéricos.
 * Sempre uma ação clara de saída e info técnica no rodapé.
 *
 * Fiel ao helper privado em `design-system/src/pages/patterns/SystemPages.tsx`.
 *
 * Anti-patterns:
 *   ✗ Sem ação · usuário fica preso
 *   ✗ Texto genérico "algo deu errado"
 *   ✗ Sem big-num · perde identidade editorial
 *   ✗ Sem info técnica · suporte não consegue debugar
 *
 * Uso típico:
 *   <SystemFrame
 *     bigNum="404"
 *     bigEmTone="brand"
 *     label="Página não encontrada"
 *     title="Esse caminho"
 *     italic="não existe."
 *     description="..."
 *     info="/path · 16/05/2026 14:22"
 *     actions={<Button>Voltar ao cockpit</Button>}
 *   />
 */

type Tone = 'brand' | 'danger' | 'warning' | 'alert' | 'success'

export interface SystemFrameProps {
  /** Número/símbolo grande (140px). Ex: "404", "500", "·". Ignorado se `customBig` for passado. */
  bigNum?: string
  /** Cor do big-num em italic. Default: 'brand'. */
  bigEmTone?: Tone
  /** Substitui o big-num por um ReactNode customizado (ex: ícone <WifiOff />). */
  customBig?: ReactNode
  /** Mono uppercase acima do título. Ex: "Página não encontrada". */
  label: string
  /** Título serif Fraunces · primeira parte (regular). */
  title: string
  /** Continuação do título em italic. */
  italic: string
  /** Texto explicativo · até 460px de largura. */
  description: string
  /** Linha técnica no rodapé · mono pequena. Ex: "REQ-ID xxx · 14:22". */
  info?: string
  /** Botões de ação. Idealmente 1 primária + 1 secundária. */
  actions: ReactNode
  /** Inteiro = página inteira centralizada (min-h-screen). Compacto = só o card. Default: 'inline'. */
  layout?: 'inline' | 'full'
  className?: string
}

export function SystemFrame({
  bigNum,
  bigEmTone = 'brand',
  customBig,
  label,
  title,
  italic,
  description,
  info,
  actions,
  layout = 'inline',
  className,
}: SystemFrameProps) {
  const emColor = `var(--${bigEmTone})`

  const card = (
    <div
      className={cn('text-center', className)}
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

  if (layout === 'full') {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-4 py-12"
        style={{ background: 'var(--bg)' }}
      >
        <div className="w-full max-w-xl">{card}</div>
      </div>
    )
  }

  return card
}

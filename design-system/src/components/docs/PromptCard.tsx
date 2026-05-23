import { useState } from 'react'
import { Bot, Check, Copy, FileCode2 } from 'lucide-react'
import { type AIPrompt, promptToMarkdown } from '@/lib/prompts'
import { cn } from '@/lib/utils'

type Props = {
  prompt: AIPrompt
}

export function PromptCard({ prompt }: Props) {
  const [copied, setCopied] = useState(false)
  const [copiedImport, setCopiedImport] = useState(false)

  const md = promptToMarkdown(prompt)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(md)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const handleCopyImport = async () => {
    await navigator.clipboard.writeText(prompt.import)
    setCopiedImport(true)
    setTimeout(() => setCopiedImport(false), 1500)
  }

  return (
    <section
      className="mb-6 overflow-hidden rounded-2xl border"
      style={{
        background:
          'linear-gradient(135deg, var(--brand-soft) 0%, transparent 60%), var(--surface-1)',
        borderColor: 'var(--brand)',
      }}
    >
      {/* Header */}
      <header
        className="flex items-start justify-between gap-4 px-5 py-4"
        style={{ borderBottom: '1px solid var(--line-1)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: 'var(--brand)', color: 'var(--bg)' }}
          >
            <Bot size={20} strokeWidth={1.7} />
          </div>
          <div>
            <div
              className="mono text-[10px] font-bold uppercase tracking-[1.6px]"
              style={{ color: 'var(--brand)' }}
            >
              Prompt para IA · agentes
            </div>
            <h4
              className="serif text-[18px] font-normal tracking-tight"
              style={{ color: 'var(--text)' }}
            >
              {prompt.componente}
            </h4>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className={cn(
            'inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-[12px] font-semibold transition-all'
          )}
          style={{
            background: copied ? 'var(--success)' : 'var(--brand)',
            borderColor: copied ? 'var(--success)' : 'var(--brand)',
            color: 'var(--bg)',
          }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copiado!' : 'Copiar prompt'}
        </button>
      </header>

      <div className="grid grid-cols-2 gap-0 max-[900px]:grid-cols-1">
        {/* Esquerda · contexto + quando usar */}
        <div className="p-5" style={{ borderRight: '1px solid var(--line-1)' }}>
          <div className="mb-4">
            <SectionLabel>Contexto</SectionLabel>
            <p
              className="mt-1.5 text-[13.5px] leading-[1.65]"
              style={{ color: 'var(--text-soft)' }}
            >
              {prompt.contexto}
            </p>
          </div>
          <div className="mb-4">
            <SectionLabel>Quando usar</SectionLabel>
            <ul className="mt-2 space-y-1.5">
              {prompt.quandoUsar.map((q, i) => (
                <li
                  key={i}
                  className="grid grid-cols-[16px_1fr] gap-2 text-[13px] leading-[1.55]"
                  style={{ color: 'var(--text-soft)' }}
                >
                  <span style={{ color: 'var(--success)' }}>✓</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionLabel>Anti-patterns</SectionLabel>
            <ul className="mt-2 space-y-1.5">
              {prompt.antiPatterns.map((a, i) => (
                <li
                  key={i}
                  className="grid grid-cols-[16px_1fr] gap-2 text-[13px] leading-[1.55]"
                  style={{ color: 'var(--text-soft)' }}
                >
                  <span style={{ color: 'var(--danger)' }}>✗</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Direita · import + props + exemplo */}
        <div className="p-5">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <SectionLabel>Import</SectionLabel>
              <button
                onClick={handleCopyImport}
                className="inline-flex h-6 w-6 items-center justify-center rounded transition-all hover:brightness-125"
                style={{
                  background: 'var(--surface-2)',
                  color: copiedImport ? 'var(--success)' : 'var(--text-soft)',
                }}
                aria-label="Copiar import"
              >
                {copiedImport ? <Check size={11} /> : <Copy size={11} />}
              </button>
            </div>
            <pre
              className="mono mt-1.5 overflow-x-auto rounded-lg p-3 text-[11.5px] leading-relaxed"
              style={{
                background: 'var(--bg)',
                color: 'var(--brand)',
              }}
            >
              <code>{prompt.import}</code>
            </pre>
          </div>

          <div className="mb-4">
            <SectionLabel>Props principais</SectionLabel>
            <div className="mt-2 space-y-1">
              {prompt.props.map((p) => (
                <div
                  key={p.name}
                  className="grid grid-cols-[auto_auto_1fr] items-baseline gap-2 rounded px-2 py-1.5 text-[12px]"
                  style={{ background: 'var(--surface-2)' }}
                >
                  <code
                    className="mono font-semibold"
                    style={{ color: 'var(--brand)' }}
                  >
                    {p.name}
                  </code>
                  <span
                    className="mono text-[10.5px]"
                    style={{ color: 'var(--text-mute)' }}
                  >
                    {p.type}
                  </span>
                  <span style={{ color: 'var(--text-soft)' }}>{p.description}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <FileCode2 size={12} style={{ color: 'var(--text-mute)' }} />
              <SectionLabel>Exemplo</SectionLabel>
            </div>
            <pre
              className="mono overflow-x-auto rounded-lg p-3 text-[11.5px] leading-relaxed"
              style={{
                background: 'var(--bg)',
                color: 'var(--text-soft)',
                maxHeight: 280,
              }}
            >
              <code>{prompt.exemplo}</code>
            </pre>
          </div>
        </div>
      </div>

      {prompt.relacionados && prompt.relacionados.length > 0 && (
        <footer
          className="flex flex-wrap items-center gap-2 px-5 py-3"
          style={{ borderTop: '1px solid var(--line-1)', background: 'var(--surface-2)' }}
        >
          <span
            className="mono text-[10px] font-bold uppercase tracking-wider"
            style={{ color: 'var(--text-mute)' }}
          >
            Relacionados:
          </span>
          {prompt.relacionados.map((r) => (
            <span
              key={r}
              className="rounded-full border px-2 py-0.5 text-[11px]"
              style={{
                background: 'var(--surface-1)',
                borderColor: 'var(--line-2)',
                color: 'var(--text-soft)',
              }}
            >
              {r}
            </span>
          ))}
        </footer>
      )}
    </section>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="mono text-[10px] font-bold uppercase tracking-[1.6px]"
      style={{ color: 'var(--text-mute)' }}
    >
      {children}
    </span>
  )
}

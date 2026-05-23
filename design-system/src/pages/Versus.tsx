import { Check, X } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'

const erp = [
  'Densidade extrema "porque o ERP X faz assim"',
  'Botão primário roxo · gradient genérico de SaaS B2B',
  'Listas como vista padrão para tudo',
  'Forms de 40 campos em uma única tela',
  'Texto pequeno, contraste duvidoso',
  'Densidade vs clareza · sempre densidade',
]

const tkws = [
  'Whitespace radical · densidade só quando a operação exige',
  'Navy + cyan disciplinado · cores classificam, não decoram',
  'Conteúdo visual primeiro · renders, plantas, moodboards',
  'Sectioned forms com TOC · wizard quando dependente',
  'Tipografia editorial · Fraunces + Inter + Mono',
  'Clareza vence sempre. Foco vence flexibilidade.',
]

export function VersusPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="03"
        category="Versus"
        title="ERP genérico"
        italic="vs. TKWS OS"
        description="O que recusamos ativamente vs. o que escolhemos como linguagem do produto. Esta lista é viva — quando algo escapar, levantamos a mão."
        tag="comparativo"
      />

      <div className="grid grid-cols-2 gap-5 max-[760px]:grid-cols-1">
        <article
          className="rounded-2xl border p-7"
          style={{
            background: 'var(--surface-1)',
            borderColor: 'var(--line-1)',
          }}
        >
          <div
            className="mono mb-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[1.6px]"
            style={{ color: 'var(--danger)' }}
          >
            <X size={13} strokeWidth={2.4} /> ERP / SaaS B2B genérico
          </div>
          <h3 className="serif text-[24px] font-normal tracking-tight" style={{ color: 'var(--text)' }}>
            O que não somos
          </h3>
          <ul className="mt-5 space-y-3">
            {erp.map((e, i) => (
              <li
                key={i}
                className="grid grid-cols-[16px_1fr] items-start gap-2 text-[13.5px] leading-relaxed"
                style={{ color: 'var(--text-soft)' }}
              >
                <X size={13} style={{ color: 'var(--danger)' }} strokeWidth={2.2} />
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </article>

        <article
          className="rounded-2xl border p-7"
          style={{
            background:
              'linear-gradient(135deg, var(--brand-soft) 0%, transparent 70%), var(--surface-1)',
            borderColor: 'var(--brand)',
          }}
        >
          <div
            className="mono mb-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[1.6px]"
            style={{ color: 'var(--brand)' }}
          >
            <Check size={13} strokeWidth={2.4} /> TKWS OS
          </div>
          <h3 className="serif text-[24px] font-normal tracking-tight" style={{ color: 'var(--text)' }}>
            O que somos
          </h3>
          <ul className="mt-5 space-y-3">
            {tkws.map((t, i) => (
              <li
                key={i}
                className="grid grid-cols-[16px_1fr] items-start gap-2 text-[13.5px] leading-relaxed"
                style={{ color: 'var(--text-soft)' }}
              >
                <Check size={13} style={{ color: 'var(--brand)' }} strokeWidth={2.2} />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  )
}

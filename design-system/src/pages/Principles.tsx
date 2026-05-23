import {
  Crop,
  Droplets,
  Eye,
  Image as ImageIcon,
  Layers,
  Wind,
} from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'

const principles = [
  {
    n: '01',
    icon: <Crop size={20} strokeWidth={1.5} />,
    title: 'Tipografia editorial',
    description:
      'Fraunces nos títulos, Inter no corpo, JetBrains Mono nos sinais técnicos. Hierarquia por contraste de família, não por tamanho exagerado.',
  },
  {
    n: '02',
    icon: <Droplets size={20} strokeWidth={1.5} />,
    title: 'Paleta disciplinada',
    description:
      'Navy + cyan + 6 semânticas. Cores existem para classificar (status, squad, severidade), não para decorar.',
  },
  {
    n: '03',
    icon: <Wind size={20} strokeWidth={1.5} />,
    title: 'Whitespace radical',
    description:
      '140px entre seções editoriais, 28px nos cards. Densidade só onde a operação exige.',
  },
  {
    n: '04',
    icon: <Layers size={20} strokeWidth={1.5} />,
    title: 'Materialidade sutil',
    description: 'Grain noise sobre o fundo. Sombras precisas, nunca difusas.',
  },
  {
    n: '05',
    icon: <Eye size={20} strokeWidth={1.5} />,
    title: 'Motion como linguagem',
    description:
      'Toda transição comunica estado. Curvas long-and-low. Durações editoriais. Respeite prefers-reduced-motion.',
  },
  {
    n: '06',
    icon: <ImageIcon size={20} strokeWidth={1.5} />,
    title: 'Conteúdo visual em primeiro plano',
    description:
      'Renders, plantas, moodboards. Listas são exceção, não regra. Quando lista, traz thumb.',
  },
]

export function PrinciplesPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="02"
        category="Princípios"
        title="Os 6 pilares editoriais"
        description="Estes seis princípios decidem todo caso cinza. Quando estiver dividido entre densidade e clareza, escolha clareza. Quando dividido entre flexibilidade e foco, escolha foco."
        tag="filosofia"
      />

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl max-[760px]:grid-cols-1"
           style={{ background: 'var(--line-1)' }}>
        {principles.map((p) => (
          <article
            key={p.n}
            className="flex flex-col gap-3 p-7"
            style={{ background: 'var(--surface-1)' }}
          >
            <div className="flex items-center gap-3">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}
              >
                {p.icon}
              </span>
              <div>
                <div
                  className="mono text-[10px] font-bold uppercase tracking-[1.6px]"
                  style={{ color: 'var(--text-mute)' }}
                >
                  Princípio {p.n}
                </div>
                <h3
                  className="serif text-[20px] font-normal tracking-tight"
                  style={{ color: 'var(--text)' }}
                >
                  {p.title}
                </h3>
              </div>
            </div>
            <p
              className="text-[14px] leading-[1.65]"
              style={{ color: 'var(--text-soft)' }}
            >
              {p.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}

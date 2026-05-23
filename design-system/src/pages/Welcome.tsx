import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  Bot,
  Layers,
  Paintbrush,
  Shapes,
  Sparkles,
  Type,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const featureCards = [
  {
    to: '/principles',
    icon: <Sparkles size={18} strokeWidth={1.7} />,
    badge: 'Documentação',
    title: 'Princípios',
    body: 'Os 6 pilares editoriais — tipografia, paleta disciplinada, whitespace radical, materialidade sutil, motion como linguagem, conteúdo visual em primeiro plano.',
  },
  {
    to: '/typography',
    icon: <Type size={18} strokeWidth={1.7} />,
    badge: 'Fundamentos',
    title: 'Tipografia',
    body: 'Fraunces serif para títulos editoriais. Inter para o corpo. JetBrains Mono para códigos e meta. Hierarquia por contraste de família, não por tamanho.',
  },
  {
    to: '/color',
    icon: <Paintbrush size={18} strokeWidth={1.7} />,
    badge: 'Fundamentos',
    title: 'Cor',
    body: 'Navy + cyan + 6 semânticas. Cores existem para classificar — status, squad, severidade — não para decorar.',
  },
  {
    to: '/components/button',
    icon: <Shapes size={18} strokeWidth={1.7} />,
    badge: 'Componentes',
    title: 'Catálogo',
    body: '45+ componentes sobre shadcn/ui + Radix Primitives. Cada um com prompt para IA, exemplo copiável e anti-patterns.',
  },
  {
    to: '/ai-prompts',
    icon: <Bot size={18} strokeWidth={1.7} />,
    badge: 'IA & Agentes',
    title: 'Prompts para IA',
    body: 'Cada componente expõe um prompt estruturado: contexto, quando usar, props, anti-patterns e exemplo. Cole no Cursor, Claude Code ou Copilot.',
  },
  {
    to: '/best-practices',
    icon: <Layers size={18} strokeWidth={1.7} />,
    badge: 'Boas práticas',
    title: 'Construindo telas',
    body: 'Telas-mãe (List · Detail · Wizard · Settings), padrões de form, decision trees e o Definition of Done de cada PR.',
  },
]

export function WelcomePage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-3 flex items-center gap-2">
        <Badge tone="brand" pulse>
          Living guide · v1.0
        </Badge>
        <span
          className="mono text-[10px] font-bold uppercase tracking-[1.6px]"
          style={{ color: 'var(--text-mute)' }}
        >
          00 · Welcome
        </span>
      </div>

      <h1
        className="serif text-[clamp(40px,7vw,68px)] font-light leading-[1.02] tracking-tight"
        style={{ color: 'var(--text)' }}
      >
        Design System para{' '}
        <em className="italic" style={{ color: 'var(--brand)' }}>
          arquitetos.
        </em>
        <br />
        Não para back-office.
      </h1>

      <p
        className="mt-6 max-w-3xl text-[16px] leading-[1.7]"
        style={{ color: 'var(--text-soft)' }}
      >
        O TKWS OS Design System é a fonte da verdade visual e arquitetural do produto.
        Cada componente foi construído sobre <b style={{ color: 'var(--text)' }}>React 19 + shadcn/ui + Radix Primitives + Tailwind v4</b>,
        com acessibilidade resolvida no Radix e customização total no repo.
        Esta documentação é {' '}
        <b style={{ color: 'var(--brand)' }}>viva e interativa</b> — clique, digite, arraste.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link to={'/components/button' as any}>
            Ver catálogo de componentes <ArrowRight size={14} />
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to={'/ai-prompts' as any}>
            <Bot size={14} /> Prompts para IA
          </Link>
        </Button>
      </div>

      <div className="mt-14 grid grid-cols-2 gap-4 max-[760px]:grid-cols-1">
        {featureCards.map((f) => (
          <Link key={f.to} to={f.to as any} className="no-underline">
            <Card variant="hover" className="h-full">
              <CardHeader>
                <div className="flex items-center gap-2.5">
                  <span
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg"
                    style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}
                  >
                    {f.icon}
                  </span>
                  <div>
                    <div
                      className="mono text-[9.5px] font-bold uppercase tracking-[1.4px]"
                      style={{ color: 'var(--text-mute)' }}
                    >
                      {f.badge}
                    </div>
                    <CardTitle>{f.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>{f.body}</CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div
        className="mt-14 rounded-2xl border p-7"
        style={{
          background:
            'linear-gradient(135deg, var(--brand-soft) 0%, transparent 60%), var(--surface-1)',
          borderColor: 'var(--brand)',
        }}
      >
        <div
          className="mono mb-2 text-[10px] font-bold uppercase tracking-[1.6px]"
          style={{ color: 'var(--brand)' }}
        >
          Como esta documentação está organizada
        </div>
        <h3
          className="serif text-[22px] font-normal tracking-tight"
          style={{ color: 'var(--text)' }}
        >
          Cada componente expõe quatro lentes
        </h3>
        <ul
          className="mt-4 grid grid-cols-2 gap-3 text-[13.5px] leading-relaxed max-[760px]:grid-cols-1"
          style={{ color: 'var(--text-soft)' }}
        >
          <li>
            <b style={{ color: 'var(--text)' }}>1 · Showcase visual</b> — interativo, com botão{' '}
            <em>Ver código</em> e <em>Copiar</em>.
          </li>
          <li>
            <b style={{ color: 'var(--text)' }}>2 · Prompt para IA</b> — contexto, quando usar, props,
            anti-patterns, exemplo. Botão copiar para colar no agente.
          </li>
          <li>
            <b style={{ color: 'var(--text)' }}>3 · Variantes</b> — todos os estados (default, hover,
            error, disabled) e tamanhos.
          </li>
          <li>
            <b style={{ color: 'var(--text)' }}>4 · Anti-patterns</b> — o que evitar, com justificativa.
          </li>
        </ul>
      </div>
    </div>
  )
}

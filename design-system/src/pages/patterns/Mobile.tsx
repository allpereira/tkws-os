import { Bell, Camera, ChevronLeft, Home as HomeIcon, Image as ImageIcon, MessageSquare, MoreHorizontal, User as UserIcon } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Pattern · Mobile · Capacitor',
  import: '// Composição: native shell · bottom tab bar · pull-to-refresh · capture',
  contexto:
    'App mobile via Capacitor 6 · iOS/Android. Bottom tab bar como nav primária · Drawer (vaul) para ações contextuais · @capacitor/camera para foto de obra · haptics ao tap em CTAs. Densidade Standard. Safe areas respeitadas.',
  quandoUsar: [
    'App mobile para Gestor de Obra (capturar fotos)',
    'Portal do Cliente mobile (PWA + Capacitor)',
    'Notificações push de prazo crítico',
  ],
  props: [],
  antiPatterns: [
    'Sidebar lateral em mobile · use bottom tabs',
    'DataTable em mobile portrait · vire Cards stack',
    'Sem safe-area-inset-bottom · botões cobertos pela home bar do iOS',
  ],
  exemplo: `// App.tsx
<CapacitorApp>
  <BottomTabs>
    <Tab to="/home" icon={Home} />
    <Tab to="/photos" icon={Camera} />
    <Tab to="/chat" icon={MessageSquare} />
    <Tab to="/me" icon={User} />
  </BottomTabs>
</CapacitorApp>`,
  relacionados: ['Drawer', 'Sheet (bottom)', 'Capacitor'],
}

export function MobilePattern() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        num="P25"
        category="Pattern · Mobile · Capacitor"
        title="Mobile patterns"
        italic="iOS + Android · Capacitor 6"
        description="Bottom tab bar, drawer mobile, captura nativa de fotos, push notifications. Safe areas respeitadas."
        tag="Capacitor 6"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="App de obra · capturar fotos + bottom tabs" />
      <Showcase>
        <div className="flex justify-center">
          <PhoneFrame>
            {/* Status bar */}
            <div
              className="flex items-center justify-between px-5 py-2"
              style={{ background: 'var(--surface-1)', color: 'var(--text)' }}
            >
              <span className="mono text-[10px] font-bold">9:42</span>
              <div className="flex items-center gap-1.5">
                <span className="mono text-[10px]" style={{ color: 'var(--text-mute)' }}>5G</span>
                <span className="mono text-[10px]">100%</span>
              </div>
            </div>

            {/* App header */}
            <div
              className="flex items-center justify-between border-b px-4 py-3"
              style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}
            >
              <Button variant="ghost" size="icon"><ChevronLeft size={16} /></Button>
              <div className="text-center">
                <div className="serif text-[16px] font-normal" style={{ color: 'var(--text)' }}>
                  Obra · Yachthouse 2104
                </div>
                <div className="mono text-[9.5px]" style={{ color: 'var(--text-mute)' }}>
                  Vistoria · 18/05
                </div>
              </div>
              <Button variant="ghost" size="icon"><MoreHorizontal size={16} /></Button>
            </div>

            {/* Body · cards stack */}
            <div className="flex-1 space-y-3 overflow-y-auto p-3">
              <Card>
                <CardContent className="!p-3">
                  <div className="mono text-[10px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                    Progresso da obra
                  </div>
                  <div className="serif mt-1 text-[24px] font-light leading-none" style={{ color: 'var(--text)' }}>
                    65%
                  </div>
                  <div className="mt-2">
                    <Progress value={65} tone="warning" />
                  </div>
                  <div className="mono mt-2 text-[10px]" style={{ color: 'var(--warning)' }}>
                    8 dias atrasado · granito São Gabriel
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="!p-3">
                  <div className="flex items-center justify-between">
                    <div className="mono text-[10px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                      Fotos de hoje
                    </div>
                    <Badge tone="brand">12 fotos</Badge>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-1.5">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-md"
                        style={{ background: `linear-gradient(135deg, var(--surface-3), var(--surface-4))` }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="!p-3">
                  <div className="mono text-[10px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                    Punch list · 4
                  </div>
                  <ul className="mt-2 space-y-1.5 text-[12px]">
                    {['#001 Esquadria vão sup.', '#002 Granito mancha', '#003 LED arandela', '#004 Box selante'].map((t) => (
                      <li key={t} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--warning)' }} />
                        <span style={{ color: 'var(--text-soft)' }}>{t}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* FAB · captura */}
            <div className="absolute right-4 bottom-20">
              <button
                className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full shadow-2xl"
                style={{ background: 'var(--brand)', color: 'var(--bg)' }}
                aria-label="Capturar foto"
              >
                <Camera size={22} strokeWidth={1.8} />
              </button>
            </div>

            {/* Bottom tab bar */}
            <div
              className="grid grid-cols-4 border-t"
              style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}
            >
              {[
                { ic: <HomeIcon size={18} />, lbl: 'Home', active: true },
                { ic: <Camera size={18} />, lbl: 'Fotos' },
                { ic: <MessageSquare size={18} />, lbl: 'Chat', badge: '3' },
                { ic: <UserIcon size={18} />, lbl: 'Eu' },
              ].map((t) => (
                <button
                  key={t.lbl}
                  className="relative flex cursor-pointer flex-col items-center gap-0.5 py-3"
                  style={{ color: t.active ? 'var(--brand)' : 'var(--text-mute)' }}
                >
                  {t.ic}
                  <span className="mono text-[9px] font-bold uppercase tracking-[1.2px]">{t.lbl}</span>
                  {t.badge && (
                    <span
                      className="absolute top-2 right-[28%] inline-flex h-3.5 min-w-3.5 items-center justify-center rounded-full px-1 text-[9px] font-bold"
                      style={{ background: 'var(--danger)', color: '#fff' }}
                    >
                      {t.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </PhoneFrame>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 max-[760px]:grid-cols-1">
          <FeatureBlock icon={<Camera size={16} />} label="@capacitor/camera" desc="Foto de obra · upload no background com fila offline" />
          <FeatureBlock icon={<Bell size={16} />} label="@capacitor/push" desc="Notificações de prazo crítico · obra atrasada · NF pendente" />
          <FeatureBlock icon={<ImageIcon size={16} />} label="@capacitor/filesystem" desc="Salvar PDF de orçamento localmente · compartilhar via nativo" />
        </div>
      </Showcase>
    </div>
  )
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative flex w-[360px] flex-col overflow-hidden rounded-[40px] border-[8px] shadow-2xl"
      style={{
        height: 720,
        background: 'var(--bg)',
        borderColor: '#1a2533',
      }}
    >
      {/* Notch */}
      <div className="absolute top-3 left-1/2 z-10 h-5 w-32 -translate-x-1/2 rounded-full" style={{ background: '#0a1119' }} />
      {children}
    </div>
  )
}

function FeatureBlock({ icon, label, desc }: { icon: React.ReactNode; label: string; desc: string }) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{ background: 'var(--surface-1)', borderColor: 'var(--line-1)' }}
    >
      <span
        className="flex h-9 w-9 items-center justify-center rounded-lg"
        style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}
      >
        {icon}
      </span>
      <code className="mono mt-3 block text-[11.5px] font-bold" style={{ color: 'var(--brand)' }}>
        {label}
      </code>
      <p className="mt-1 text-[12.5px] leading-relaxed" style={{ color: 'var(--text-soft)' }}>
        {desc}
      </p>
    </div>
  )
}

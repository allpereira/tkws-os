import * as React from 'react'
import {
  Bell,
  Camera,
  ChevronRight,
  Clock,
  Filter,
  Heart,
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  MessageCircle,
  Mic,
  Plus,
  Search,
  Send,
  Settings,
  ShoppingCart,
  Signal,
  User,
  Users,
  Wifi,
  X,
} from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { Avatar, AvatarFallback, AvatarGroup } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

/**
 * MOBILE · Versão Capacitor dos componentes do design system.
 *
 * Tudo renderizado dentro de um iPhone frame realista (375×812 / 390×844)
 * com safe areas, status bar e home indicator. Mostra como cada padrão TKWS
 * adapta a mobile · drawer vira bottom-sheet, tab-bar vira nav primary,
 * KPI hero vira cards verticais, etc.
 */

interface PhoneFrameProps {
  title?: string
  children: React.ReactNode
  width?: number
  height?: number
  device?: 'iphone' | 'android'
  className?: string
}

function PhoneFrame({ title, children, width = 375, height = 700, device = 'iphone', className }: PhoneFrameProps) {
  const radius = device === 'iphone' ? 44 : 32
  const notchH = device === 'iphone' ? 26 : 0

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div
        className="relative overflow-hidden"
        style={{
          width,
          height,
          background: 'var(--bg)',
          border: '6px solid #0a0a0a',
          borderRadius: radius,
          boxShadow: 'var(--shadow-4), 0 0 0 1px var(--line-3)',
        }}
      >
        {/* Status bar (iPhone notch) */}
        {device === 'iphone' && (
          <>
            <div
              className="absolute top-0 left-1/2 z-20 -translate-x-1/2 rounded-b-[18px]"
              style={{
                width: 124,
                height: notchH,
                background: '#0a0a0a',
              }}
            />
            <div
              className="absolute top-0 right-0 left-0 z-10 flex items-center justify-between px-7"
              style={{ height: notchH + 8, color: 'var(--text)' }}
            >
              <span
                className="mono text-[11px] font-semibold"
                style={{ paddingTop: 4 }}
              >
                14:22
              </span>
              <span
                className="flex items-center gap-1"
                style={{ paddingTop: 4 }}
              >
                <Signal size={12} strokeWidth={2.2} />
                <Wifi size={12} strokeWidth={2.2} />
                <span
                  className="mono text-[9.5px] font-bold"
                  style={{ marginLeft: 4 }}
                >
                  100%
                </span>
              </span>
            </div>
          </>
        )}

        {/* Conteúdo · area segura */}
        <div
          className="relative h-full overflow-y-auto"
          style={{
            paddingTop: notchH + 6,
            paddingBottom: 24,
          }}
        >
          {children}
        </div>

        {/* Home indicator */}
        {device === 'iphone' && (
          <div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full"
            style={{
              width: 124,
              height: 4,
              background: 'var(--text)',
              opacity: 0.6,
            }}
          />
        )}
      </div>
      {title && (
        <div
          className="mono text-[10.5px] font-semibold uppercase tracking-[1.2px]"
          style={{ color: 'var(--text-mute)' }}
        >
          {title}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// TabBar inferior
// =============================================================================

const tabs = [
  { icon: Home, label: 'Início', active: true },
  { icon: LayoutDashboard, label: 'Projetos' },
  { icon: Users, label: 'CRM' },
  { icon: Bell, label: 'Atividade', badge: 12 },
  { icon: User, label: 'Eu' },
]

function MobileTabBar() {
  return (
    <nav
      className="sticky bottom-0 z-10 grid grid-cols-5 border-t"
      style={{
        background: 'var(--surface-1)',
        borderColor: 'var(--line-1)',
        paddingBottom: 4,
      }}
    >
      {tabs.map((t) => (
        <button
          key={t.label}
          className="relative flex cursor-pointer flex-col items-center gap-1 py-2"
          style={{
            color: t.active ? 'var(--brand)' : 'var(--text-mute)',
            background: 'transparent',
            border: 0,
          }}
        >
          <t.icon size={20} strokeWidth={t.active ? 2 : 1.7} />
          <span className="mono text-[9px] font-semibold uppercase tracking-[0.8px]">
            {t.label}
          </span>
          {t.badge && (
            <span
              className="mono absolute top-1 right-1/2 inline-flex h-4 min-w-4 translate-x-3 items-center justify-center rounded-full px-1 text-[9px] font-bold"
              style={{ background: 'var(--danger)', color: '#fff' }}
            >
              {t.badge}
            </span>
          )}
        </button>
      ))}
    </nav>
  )
}

// =============================================================================
// Telas demo (renderizadas dentro dos iPhones)
// =============================================================================

function ScreenHome() {
  return (
    <>
      <div className="flex h-full flex-col">
        <div className="flex-1 px-4 pt-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="mono text-[9.5px] font-semibold uppercase tracking-[1.3px]" style={{ color: 'var(--text-mute)' }}>
                Sexta · 17 maio
              </div>
              <h1 className="serif text-[22px] font-normal" style={{ color: 'var(--text)', letterSpacing: '-0.025em' }}>
                Olá, <em className="italic font-normal" style={{ color: 'var(--brand)' }}>Allysson.</em>
              </h1>
            </div>
            <Avatar size="md" style={{ background: 'var(--purple)' }}>
              <AvatarFallback>AP</AvatarFallback>
            </Avatar>
          </div>

          {/* KPI cards verticais */}
          <div className="mt-4 grid gap-2">
            <Card className="!p-3">
              <div className="mono text-[9px] font-semibold uppercase tracking-[1.2px]" style={{ color: 'var(--text-mute)' }}>
                Portfólio ativo
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span
                  className="serif font-light"
                  style={{ fontSize: 26, color: 'var(--text)', letterSpacing: '-0.025em', lineHeight: 1 }}
                >
                  R$ 87,4M
                </span>
                <Badge tone="success">+18%</Badge>
              </div>
            </Card>
            <div className="grid grid-cols-2 gap-2">
              <Card className="!p-3">
                <div className="mono text-[9px] font-semibold uppercase tracking-[1.2px]" style={{ color: 'var(--text-mute)' }}>
                  Obras
                </div>
                <span
                  className="serif font-light"
                  style={{ fontSize: 22, color: 'var(--text)', letterSpacing: '-0.025em', lineHeight: 1 }}
                >
                  12
                </span>
              </Card>
              <Card className="!p-3">
                <div className="mono text-[9px] font-semibold uppercase tracking-[1.2px]" style={{ color: 'var(--text-mute)' }}>
                  Margem
                </div>
                <div className="flex items-baseline gap-1">
                  <span
                    className="serif font-light"
                    style={{ fontSize: 22, color: 'var(--text)', letterSpacing: '-0.025em', lineHeight: 1 }}
                  >
                    31,2
                  </span>
                  <span className="text-[12px] font-semibold" style={{ color: 'var(--success)' }}>
                    %
                  </span>
                </div>
              </Card>
            </div>
          </div>

          {/* Hoje */}
          <div className="mt-5">
            <div className="mb-2 flex items-baseline justify-between">
              <h3 className="serif text-[15px] font-normal" style={{ color: 'var(--text)' }}>
                Hoje · <em className="italic" style={{ color: 'var(--text-soft)' }}>3 marcos</em>
              </h3>
              <button
                className="text-[11.5px] font-semibold"
                style={{ color: 'var(--brand)', background: 'transparent', border: 0 }}
              >
                Ver tudo
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              {[
                { ttl: 'Visita Yachthouse 2104', meta: '09:30 · BC/SC', tone: 'warning' as const },
                { ttl: 'Apresentar render · Vitra', meta: '14:00 · sala 3', tone: 'purple' as const },
                { ttl: 'Daily Squad Orion', meta: '16:00 · 30 min', tone: 'success' as const },
              ].map((e, i) => (
                <Card key={i} className="!p-3" accent={e.tone}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>
                        {e.ttl}
                      </div>
                      <div
                        className="mono mt-0.5 text-[10.5px]"
                        style={{ color: 'var(--text-mute)' }}
                      >
                        <Clock size={9} className="mr-1 inline" />
                        {e.meta}
                      </div>
                    </div>
                    <ChevronRight size={14} style={{ color: 'var(--text-mute)' }} />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* FAB */}
        <button
          className="fixed right-4 bottom-16 z-20 inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full"
          style={{
            background: 'var(--brand)',
            color: 'var(--bg)',
            boxShadow: 'var(--shadow-3)',
            position: 'absolute',
          }}
        >
          <Plus size={20} strokeWidth={2} />
        </button>
      </div>

      <MobileTabBar />
    </>
  )
}

function ScreenList() {
  return (
    <>
      <div className="flex-1 px-4 pt-3">
        <div className="mb-3 flex items-center justify-between">
          <h1 className="serif text-[20px] font-normal" style={{ color: 'var(--text)' }}>
            Projetos <em className="italic" style={{ color: 'var(--text-soft)' }}>· 43</em>
          </h1>
          <button className="cursor-pointer" style={{ background: 'transparent', border: 0, color: 'var(--text-mute)' }}>
            <Filter size={18} strokeWidth={1.7} />
          </button>
        </div>
        <Input icon={<Search size={14} />} placeholder="Buscar projeto…" />

        {/* Filter chips */}
        <div className="mt-3 -mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1">
          {['Todos · 43', 'Em obra · 12', 'Atrasados · 3', 'Briefing · 8'].map((c, i) => (
            <span
              key={c}
              className="inline-flex shrink-0 cursor-pointer items-center rounded-full border px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap"
              style={{
                background: i === 0 ? 'var(--brand)' : 'var(--surface-2)',
                color: i === 0 ? 'var(--bg)' : 'var(--text-soft)',
                borderColor: i === 0 ? 'var(--brand)' : 'var(--line-2)',
              }}
            >
              {c}
            </span>
          ))}
        </div>

        {/* List */}
        <div className="mt-3 flex flex-col gap-2 pb-4">
          {[
            { ttl: 'Yachthouse 2104', sub: 'Andrade · 280 m²', val: 'R$ 2,4M', status: 'Atrasado', tone: 'danger' as const, prog: 62 },
            { ttl: 'Cob. Vitra 1801', sub: 'Salles · 540 m²', val: 'R$ 3,98M', status: 'No prazo', tone: 'success' as const, prog: 84 },
            { ttl: 'Titanium 101', sub: 'Signature · 920 m²', val: 'R$ 9,5M', status: 'Em obra', tone: 'purple' as const, prog: 14 },
            { ttl: 'Brava Home', sub: 'Vieira · 320 m²', val: 'R$ 1,78M', status: 'Em obra', tone: 'warning' as const, prog: 41 },
          ].map((p, i) => (
            <Card key={i} className="!p-3">
              <div className="flex items-start gap-3">
                <div
                  className="h-14 w-12 shrink-0 rounded-[6px]"
                  style={{
                    background: `linear-gradient(135deg, var(--${p.tone}) 0%, var(--surface-3) 100%)`,
                    opacity: 0.85,
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-[13.5px] font-semibold" style={{ color: 'var(--text)' }}>
                        {p.ttl}
                      </div>
                      <div className="mono mt-0.5 text-[10px]" style={{ color: 'var(--text-mute)' }}>
                        {p.sub}
                      </div>
                    </div>
                    <Badge tone={p.tone}>{p.status}</Badge>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-baseline justify-between">
                      <span
                        className="serif font-light"
                        style={{ fontSize: 16, color: 'var(--text)', letterSpacing: '-0.02em' }}
                      >
                        {p.val}
                      </span>
                      <span className="mono text-[10px]" style={{ color: 'var(--text-mute)' }}>
                        {p.prog}%
                      </span>
                    </div>
                    <Progress value={p.prog} tone={p.tone === 'danger' ? 'danger' : 'brand'} className="mt-1.5" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <MobileTabBar />
    </>
  )
}

function ScreenChat() {
  return (
    <>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div
          className="flex items-center gap-3 border-b px-4 py-3"
          style={{ borderColor: 'var(--line-1)' }}
        >
          <button style={{ background: 'transparent', border: 0, color: 'var(--text-mute)' }}>
            <X size={18} />
          </button>
          <Avatar size="sm" style={{ background: 'var(--purple)' }}>
            <AvatarFallback>LZ</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>
              Loiana Zoboli
            </div>
            <div className="mono text-[10px]" style={{ color: 'var(--success)' }}>
              ● online · há 2 min
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <div className="mb-3 text-center">
            <span className="mono text-[10px]" style={{ color: 'var(--text-mute)' }}>
              HOJE
            </span>
          </div>
          {[
            { me: false, body: 'Olá Allysson! Recebi o briefing.', t: '14:18' },
            { me: false, body: 'Tenho 3 dúvidas sobre a cozinha — pode falar agora?', t: '14:18' },
            { me: true, body: 'Oi Loiana, posso sim. Pode ligar?', t: '14:20' },
            { me: false, body: 'Vou abrir uma call. Em 30s.', t: '14:21' },
            { me: true, body: 'Show', t: '14:21' },
            { me: false, body: <span>👍 <span style={{ color: 'var(--brand)', fontWeight: 600 }}>@allysson</span> tô te ligando agora</span>, t: '14:22' },
          ].map((m, i) => (
            <div key={i} className={cn('mb-2 flex', m.me ? 'justify-end' : 'justify-start')}>
              <div
                className="max-w-[80%] rounded-[14px] px-3 py-2"
                style={{
                  background: m.me ? 'var(--brand)' : 'var(--surface-2)',
                  color: m.me ? 'var(--bg)' : 'var(--text)',
                  borderBottomRightRadius: m.me ? 4 : 14,
                  borderBottomLeftRadius: m.me ? 14 : 4,
                }}
              >
                <div className="text-[13px]" style={{ lineHeight: 1.4 }}>
                  {m.body}
                </div>
                <div
                  className="mono mt-0.5 text-[9px]"
                  style={{
                    color: m.me ? 'rgba(6,24,40,0.6)' : 'var(--text-mute)',
                    textAlign: 'right',
                  }}
                >
                  {m.t}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Composer */}
        <div
          className="flex items-center gap-2 border-t px-3 py-2"
          style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}
        >
          <button
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full"
            style={{ background: 'var(--surface-2)', color: 'var(--text-soft)', border: 0 }}
          >
            <Plus size={16} />
          </button>
          <input
            type="text"
            placeholder="Mensagem"
            className="flex-1 rounded-full px-3 py-2 text-[13px] outline-none"
            style={{
              background: 'var(--surface-2)',
              color: 'var(--text)',
              border: '1px solid var(--line-2)',
            }}
          />
          <button
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full"
            style={{ background: 'var(--brand)', color: 'var(--bg)', border: 0 }}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </>
  )
}

function ScreenBottomSheet() {
  return (
    <div className="relative flex h-full flex-col">
      {/* Background sheet (lista de projetos com scrim) */}
      <div className="flex-1 px-4 pt-3" style={{ filter: 'blur(2px)', opacity: 0.5 }}>
        <h1 className="serif text-[20px] font-normal" style={{ color: 'var(--text)' }}>
          Projetos
        </h1>
        <Input icon={<Search size={14} />} placeholder="Buscar…" className="mt-2" />
        <div className="mt-3 flex flex-col gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="!p-3">
              <div style={{ color: 'var(--text)' }}>Yachthouse {i}</div>
            </Card>
          ))}
        </div>
      </div>
      {/* Scrim */}
      <div
        className="absolute inset-0 z-10"
        style={{ background: 'rgba(6,24,40,0.55)', backdropFilter: 'blur(4px)' }}
      />
      {/* Bottom Sheet */}
      <div
        className="absolute right-0 bottom-0 left-0 z-20 rounded-t-[20px]"
        style={{
          background: 'var(--surface-1)',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.32)',
        }}
      >
        <div className="flex justify-center pt-2 pb-1">
          <span
            className="h-1.5 w-12 rounded-full"
            style={{ background: 'var(--line-3)' }}
          />
        </div>
        <div className="px-5 pt-3 pb-5">
          <h3 className="serif text-[18px] font-normal" style={{ color: 'var(--text)' }}>
            Filtrar projetos
          </h3>
          <p className="mt-1 text-[12px]" style={{ color: 'var(--text-soft)' }}>
            Selecione os critérios para refinar a busca.
          </p>

          <div className="mt-4 space-y-3">
            <div>
              <div className="mono mb-1.5 text-[10px] font-semibold uppercase tracking-[1.2px]" style={{ color: 'var(--text-mute)' }}>
                Status
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Todos', 'Em obra', 'Atrasado', 'Briefing'].map((s, i) => (
                  <span
                    key={s}
                    className="cursor-pointer rounded-full border px-3 py-1 text-[11px] font-semibold"
                    style={{
                      background: i === 1 ? 'var(--brand)' : 'transparent',
                      color: i === 1 ? 'var(--bg)' : 'var(--text-soft)',
                      borderColor: i === 1 ? 'var(--brand)' : 'var(--line-2)',
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="mono mb-1.5 text-[10px] font-semibold uppercase tracking-[1.2px]" style={{ color: 'var(--text-mute)' }}>
                Squad
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Orion', 'Vega', 'Apollo', 'Comet'].map((s) => (
                  <span
                    key={s}
                    className="cursor-pointer rounded-full border px-3 py-1 text-[11px] font-semibold"
                    style={{ borderColor: 'var(--line-2)', color: 'var(--text-soft)' }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-[10px] border px-3 py-2.5" style={{ borderColor: 'var(--line-1)' }}>
              <div>
                <div className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>
                  Apenas favoritos
                </div>
                <div className="mono text-[10px]" style={{ color: 'var(--text-mute)' }}>
                  Marcados com ♡
                </div>
              </div>
              <Switch />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <Button variant="outline">Limpar</Button>
            <Button>Aplicar · 12</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ScreenCart() {
  return (
    <>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-4 py-3"
          style={{ borderColor: 'var(--line-1)' }}
        >
          <button style={{ background: 'transparent', border: 0, color: 'var(--text-mute)' }}>
            <ChevronRight size={18} className="rotate-180" />
          </button>
          <h1 className="serif text-[17px] font-normal" style={{ color: 'var(--text)' }}>
            Sacola <em className="italic" style={{ color: 'var(--brand)' }}>· 4</em>
          </h1>
          <button style={{ background: 'transparent', border: 0, color: 'var(--text-mute)' }}>
            <ShoppingCart size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {[
            { nm: 'Porcelanato Calacatta Gold', sub: '120×120 · Polido', qty: 18, price: 'R$ 6.156', bg: 'linear-gradient(135deg, #E8E2D0 0%, #A89484 100%)' },
            { nm: 'Madeira Tauari', sub: '30×120 · Verniz fosco', qty: 30, price: 'R$ 7.440', bg: 'linear-gradient(135deg, #B8A07A 0%, #6B4F2E 100%)' },
            { nm: 'Granito São Gabriel', sub: 'Polido · 18 m²', qty: 18, price: 'R$ 75.600', bg: 'linear-gradient(135deg, #D8C9B5 0%, #A89484 100%)' },
            { nm: 'Instalação porcelanato', sub: 'Serviço · 18 m²', qty: null, price: 'R$ 3.240', bg: 'var(--brand-soft)', service: true },
          ].map((p, i) => (
            <div
              key={i}
              className="grid grid-cols-[56px_1fr_auto] gap-3 border-b py-3"
              style={{ borderColor: 'var(--line-1)' }}
            >
              <div
                className="aspect-[4/5] rounded-[8px]"
                style={{
                  background: p.bg,
                  display: p.service ? 'flex' : undefined,
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--brand)',
                  fontFamily: p.service ? 'Fraunces, serif' : undefined,
                  fontSize: 12,
                }}
              >
                {p.service && 'SVC'}
              </div>
              <div>
                <div className="text-[12.5px] font-semibold" style={{ color: 'var(--text)' }}>
                  {p.nm}
                </div>
                <div className="mono mt-0.5 text-[10px]" style={{ color: 'var(--text-mute)' }}>
                  {p.sub}
                </div>
                {p.qty && (
                  <div className="mt-1.5 inline-flex items-center overflow-hidden rounded-[6px] border" style={{ borderColor: 'var(--line-2)' }}>
                    <button className="h-6 w-6 cursor-pointer text-[11px]" style={{ background: 'var(--surface-2)', color: 'var(--text-soft)', border: 0 }}>−</button>
                    <span className="num-tabular w-8 text-center text-[11px] font-semibold" style={{ color: 'var(--text)' }}>{p.qty}</span>
                    <button className="h-6 w-6 cursor-pointer text-[11px]" style={{ background: 'var(--surface-2)', color: 'var(--text-soft)', border: 0 }}>+</button>
                  </div>
                )}
              </div>
              <div className="text-right">
                <span
                  className="serif font-light"
                  style={{ fontSize: 14, color: 'var(--text)', letterSpacing: '-0.02em' }}
                >
                  {p.price}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Foot */}
        <div
          className="border-t px-4 pt-3 pb-3"
          style={{ borderColor: 'var(--line-1)', background: 'var(--surface-2)' }}
        >
          <div className="mb-2 flex items-baseline justify-between">
            <span
              className="mono text-[10px] font-semibold uppercase tracking-[1.4px]"
              style={{ color: 'var(--text-mute)' }}
            >
              Total
            </span>
            <span
              className="serif font-light"
              style={{ fontSize: 24, color: 'var(--text)', letterSpacing: '-0.025em' }}
            >
              R$ <em className="italic" style={{ color: 'var(--brand)' }}>91.752</em>
            </span>
          </div>
          <Button className="w-full">Finalizar pedido →</Button>
        </div>
      </div>
    </>
  )
}

function ScreenNotifications() {
  return (
    <>
      <div className="flex-1 px-4 pt-3 pb-3">
        <div className="mb-3 flex items-center justify-between">
          <h1 className="serif text-[20px] font-normal" style={{ color: 'var(--text)' }}>
            Notificações
          </h1>
          <button
            className="text-[11.5px] font-semibold"
            style={{ background: 'transparent', border: 0, color: 'var(--brand)' }}
          >
            Marcar lidas
          </button>
        </div>

        <div className="-mx-4 mb-3 flex gap-0 border-b px-4" style={{ borderColor: 'var(--line-1)' }}>
          {['Tudo · 12', 'Menções · 3', 'Atribuídas · 5'].map((t, i) => (
            <button
              key={t}
              className="cursor-pointer px-3 py-2 text-[12px] font-semibold"
              style={{
                background: 'transparent',
                border: 0,
                color: i === 0 ? 'var(--text)' : 'var(--text-mute)',
                borderBottom: `2px solid ${i === 0 ? 'var(--brand)' : 'transparent'}`,
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mono mb-2 text-[9.5px] font-semibold uppercase tracking-[1.3px]" style={{ color: 'var(--text-mute)' }}>
          Hoje
        </div>
        <div className="flex flex-col">
          {[
            { ic: 'LZ', bg: 'var(--purple)', body: <><b style={{ color: 'var(--text)' }}>Loiana</b> mencionou você em <b style={{ color: 'var(--text)' }}>Yachthouse 2104</b></>, preview: '"@allysson confirmamos entrega…"', t: '14:22', unread: true },
            { ic: 'AV', bg: 'var(--warning)', body: <><b style={{ color: 'var(--text)' }}>Ana</b> atribuiu você ao <b style={{ color: 'var(--text)' }}>Palazzo Lumini</b></>, t: '11:10', unread: true },
            { ic: '✓', bg: 'var(--brand-soft)', color: 'var(--brand)', body: <>Orçamento <b style={{ color: 'var(--text)' }}>v3</b> aprovado</>, preview: 'R$ 2,4M · pronto pra obra', t: '12:48', unread: true },
          ].map((n, i) => (
            <div
              key={i}
              className="grid grid-cols-[36px_1fr_8px] gap-3 border-b py-3"
              style={{
                borderColor: 'var(--line-1)',
                background: n.unread ? 'rgba(116,199,228,0.04)' : 'transparent',
              }}
            >
              <span
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-bold"
                style={{
                  background: n.bg,
                  color: (n as any).color ?? 'var(--bg)',
                }}
              >
                {n.ic}
              </span>
              <div>
                <div className="text-[12.5px] leading-[1.4]" style={{ color: 'var(--text-soft)' }}>
                  {n.body}
                </div>
                {n.preview && (
                  <div className="mt-1 text-[11px]" style={{ color: 'var(--text-mute)' }}>
                    {n.preview}
                  </div>
                )}
                <div className="mono mt-0.5 text-[10px]" style={{ color: 'var(--text-mute)' }}>
                  {n.t}
                </div>
              </div>
              <span
                className="mt-2 h-1.5 w-1.5 rounded-full"
                style={{ background: n.unread ? 'var(--brand)' : 'transparent' }}
              />
            </div>
          ))}
        </div>
      </div>
      <MobileTabBar />
    </>
  )
}

function ScreenForm() {
  return (
    <div className="flex h-full flex-col">
      <div
        className="flex items-center justify-between border-b px-4 py-3"
        style={{ borderColor: 'var(--line-1)' }}
      >
        <button style={{ background: 'transparent', border: 0, color: 'var(--text-mute)' }}>
          <X size={18} />
        </button>
        <h1 className="serif text-[16px] font-normal" style={{ color: 'var(--text)' }}>
          Novo projeto
        </h1>
        <button
          className="text-[11.5px] font-semibold"
          style={{ background: 'transparent', border: 0, color: 'var(--brand)' }}
        >
          Salvar
        </button>
      </div>

      {/* Wizard mini · 3 steps */}
      <div className="px-4 pt-3">
        <div className="flex items-center gap-2">
          {['Briefing', 'Equipe', 'Revisar'].map((step, i) => (
            <React.Fragment key={step}>
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{
                    background: i === 0 ? 'var(--brand)' : 'var(--surface-3)',
                    color: i === 0 ? 'var(--bg)' : 'var(--text-mute)',
                  }}
                >
                  {i + 1}
                </span>
                <span
                  className="mono text-[10px] font-semibold uppercase tracking-[1px]"
                  style={{ color: i === 0 ? 'var(--text)' : 'var(--text-mute)' }}
                >
                  {step}
                </span>
              </div>
              {i < 2 && (
                <span className="h-px flex-1" style={{ background: 'var(--line-2)' }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        <div className="flex flex-col gap-3.5">
          <div>
            <label className="mono mb-1.5 block text-[10px] font-semibold uppercase tracking-[1.2px]" style={{ color: 'var(--text-mute)' }}>
              Nome do projeto <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <Input placeholder="ex: Apto Yachthouse 2104" defaultValue="Yachthouse 2104" />
          </div>
          <div>
            <label className="mono mb-1.5 block text-[10px] font-semibold uppercase tracking-[1.2px]" style={{ color: 'var(--text-mute)' }}>
              Cliente
            </label>
            <Input placeholder="Buscar cliente…" defaultValue="Família Andrade" />
          </div>
          <div>
            <label className="mono mb-1.5 block text-[10px] font-semibold uppercase tracking-[1.2px]" style={{ color: 'var(--text-mute)' }}>
              Área (m²)
            </label>
            <Input type="text" inputMode="numeric" defaultValue="280" />
          </div>
          <div>
            <label className="mono mb-1.5 block text-[10px] font-semibold uppercase tracking-[1.2px]" style={{ color: 'var(--text-mute)' }}>
              Tipo
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {['Decoração', 'Reforma + dec', 'Apenas projeto', 'Consultoria'].map((t, i) => (
                <button
                  key={t}
                  className="cursor-pointer rounded-[8px] border px-2 py-2.5 text-[11.5px] font-semibold"
                  style={{
                    background: i === 0 ? 'var(--brand-soft)' : 'transparent',
                    color: i === 0 ? 'var(--brand)' : 'var(--text-soft)',
                    borderColor: i === 0 ? 'var(--brand)' : 'var(--line-2)',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mono mb-1.5 block text-[10px] font-semibold uppercase tracking-[1.2px]" style={{ color: 'var(--text-mute)' }}>
              Observações
            </label>
            <textarea
              rows={3}
              defaultValue="Família alto padrão · entrega prevista 06/2026"
              className="w-full rounded-[10px] border p-3 text-[13px] outline-none"
              style={{
                background: 'var(--surface-2)',
                borderColor: 'var(--line-2)',
                color: 'var(--text)',
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="border-t px-4 py-3"
        style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}
      >
        <Button className="w-full">
          Continuar para Equipe →
        </Button>
      </div>
    </div>
  )
}

function ScreenSettings() {
  return (
    <>
      <div className="flex-1 px-4 pt-3 pb-3">
        <h1 className="serif text-[20px] font-normal" style={{ color: 'var(--text)' }}>
          Ajustes
        </h1>

        {/* Profile */}
        <Card className="!mt-3 !p-3">
          <div className="flex items-center gap-3">
            <Avatar size="lg" style={{ background: 'var(--purple)' }}>
              <AvatarFallback>AP</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="serif text-[17px] font-normal" style={{ color: 'var(--text)' }}>
                Allysson Pereira
              </div>
              <div className="mono text-[10.5px]" style={{ color: 'var(--text-mute)' }}>
                CTO · TKWS · allysson@tkws.os
              </div>
            </div>
            <ChevronRight size={14} style={{ color: 'var(--text-mute)' }} />
          </div>
        </Card>

        <div className="mt-5">
          <div className="mono mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[1.3px]" style={{ color: 'var(--text-mute)' }}>
            Preferências
          </div>
          <Card className="!p-0 overflow-hidden">
            {[
              { ic: Bell, label: 'Notificações', sub: 'Push + email + digest', toggle: true, on: true },
              { ic: Camera, label: 'Câmera & mídia', sub: 'Permissão para punch list' },
              { ic: ImageIcon, label: 'Tema', sub: 'Auto (segue sistema)' },
              { ic: Mic, label: 'Voz · Lúmen', sub: 'IA por voz desativada', toggle: true, on: false },
              { ic: Settings, label: 'Conta · senha · 2FA' },
              { ic: MessageCircle, label: 'Ajuda · suporte' },
            ].map((row, i, arr) => (
              <div
                key={row.label}
                className={cn('grid grid-cols-[28px_1fr_auto] items-center gap-3 px-3.5 py-3', i < arr.length - 1 && 'border-b')}
                style={{ borderColor: 'var(--line-1)' }}
              >
                <span
                  className="inline-flex h-7 w-7 items-center justify-center rounded-[7px]"
                  style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}
                >
                  <row.ic size={14} strokeWidth={1.7} />
                </span>
                <div>
                  <div className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>
                    {row.label}
                  </div>
                  {row.sub && (
                    <div className="text-[11px]" style={{ color: 'var(--text-mute)' }}>
                      {row.sub}
                    </div>
                  )}
                </div>
                {row.toggle ? (
                  <Switch defaultChecked={row.on} />
                ) : (
                  <ChevronRight size={14} style={{ color: 'var(--text-mute)' }} />
                )}
              </div>
            ))}
          </Card>
        </div>

        <Button variant="outline" className="mt-5 w-full">
          Sair
        </Button>
      </div>
      <MobileTabBar />
    </>
  )
}

// =============================================================================
// PAGE
// =============================================================================

export function MobileComponentsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        num="P25.1"
        category="Mobile · Componentes"
        title="Componentes em Mobile"
        italic="iPhone · 375×700 · safe areas · Capacitor-ready"
        description="Como cada padrão TKWS adapta para mobile. Cards verticais em vez de grid, drawer vira bottom-sheet, dropdown vira action-sheet, navegação principal em tab-bar inferior."
        tag="8 telas"
      />

      <SubHead num="A" title="Home · cockpit pessoal" italic="hero KPI + agenda de hoje + FAB" />
      <Showcase>
        <div className="flex flex-wrap items-start gap-8">
          <PhoneFrame title="Home · cockpit">
            <ScreenHome />
          </PhoneFrame>
          <div className="max-w-md">
            <h4 className="serif text-[18px] font-normal" style={{ color: 'var(--text)' }}>
              Estratégia
            </h4>
            <ul className="mt-3 flex flex-col gap-2 text-[13px]" style={{ color: 'var(--text-soft)' }}>
              <li><b style={{ color: 'var(--text)' }}>Hero KPI editorial</b> · receita do mês em Fraunces 26px, badge de delta colado · contexto antes de detalhes.</li>
              <li><b style={{ color: 'var(--text)' }}>KPI grid 1 col + 2 cols</b> · destaca o principal, lateraliza os secundários.</li>
              <li><b style={{ color: 'var(--text)' }}>Agenda de hoje</b> · 3 marcos com hora · accent border tone semântico.</li>
              <li><b style={{ color: 'var(--text)' }}>FAB</b> · 48×48 brand, bottom-right, shadow-3 · ação primária sempre alcançável.</li>
              <li><b style={{ color: 'var(--text)' }}>TabBar</b> · 5 items, ícone 20px + label mono 9px · badge no Atividade.</li>
            </ul>
          </div>
        </div>
      </Showcase>

      <SubHead num="B" title="Lista de projetos" italic="thumb 4:5 + título + status + progress" />
      <Showcase>
        <div className="flex flex-wrap items-start gap-8">
          <PhoneFrame title="Lista · scroll vertical">
            <ScreenList />
          </PhoneFrame>
          <div className="max-w-md">
            <h4 className="serif text-[18px] font-normal" style={{ color: 'var(--text)' }}>
              Densidade mobile
            </h4>
            <ul className="mt-3 flex flex-col gap-2 text-[13px]" style={{ color: 'var(--text-soft)' }}>
              <li><b style={{ color: 'var(--text)' }}>Filter chips scrolláveis</b> · horizontal overflow · primeira sempre brand (clear).</li>
              <li><b style={{ color: 'var(--text)' }}>Thumb gradient 56×70</b> · cor do status, sem foto, performático.</li>
              <li><b style={{ color: 'var(--text)' }}>Progress dentro do card</b> · valor + % alinhados acima da bar.</li>
              <li><b style={{ color: 'var(--text)' }}>Badge inline</b> · status à direita do título · cor semantic.</li>
            </ul>
          </div>
        </div>
      </Showcase>

      <SubHead num="C" title="Chat 1:1 · syncrono" italic="bubbles · composer fixed · presence" />
      <Showcase>
        <div className="flex flex-wrap items-start gap-8">
          <PhoneFrame title="Chat · DM com squad">
            <ScreenChat />
          </PhoneFrame>
          <div className="max-w-md">
            <h4 className="serif text-[18px] font-normal" style={{ color: 'var(--text)' }}>
              Anatomia do chat
            </h4>
            <ul className="mt-3 flex flex-col gap-2 text-[13px]" style={{ color: 'var(--text-soft)' }}>
              <li><b style={{ color: 'var(--text)' }}>Header presence</b> · avatar + nome + dot online · pulse no live.</li>
              <li><b style={{ color: 'var(--text)' }}>Bubbles me/them</b> · me = brand · radius diferente (4 no canto inferior do lado do remetente).</li>
              <li><b style={{ color: 'var(--text)' }}>Mensagem com @mention</b> · brand-soft inline + weight 600.</li>
              <li><b style={{ color: 'var(--text)' }}>Composer fixed</b> · plus + input pill + send · keyboard-aware.</li>
            </ul>
          </div>
        </div>
      </Showcase>

      <SubHead num="D" title="Bottom Sheet · filtros" italic="overlay com scrim · drag handle" />
      <Showcase>
        <div className="flex flex-wrap items-start gap-8">
          <PhoneFrame title="Bottom Sheet · filtros">
            <ScreenBottomSheet />
          </PhoneFrame>
          <div className="max-w-md">
            <h4 className="serif text-[18px] font-normal" style={{ color: 'var(--text)' }}>
              Bottom Sheet sobre Drawer
            </h4>
            <ul className="mt-3 flex flex-col gap-2 text-[13px]" style={{ color: 'var(--text-soft)' }}>
              <li><b style={{ color: 'var(--text)' }}>Drag handle</b> · pill 12×6 line-3 · gesto natural de fechar.</li>
              <li><b style={{ color: 'var(--text)' }}>Scrim escuro</b> · rgba(6,24,40,0.55) com blur 4px · contexto preservado.</li>
              <li><b style={{ color: 'var(--text)' }}>Chips de filtros</b> · selecionados em brand · não-selecionados borda line-2.</li>
              <li><b style={{ color: 'var(--text)' }}>Footer 2 botões</b> · cancelar (outline) + aplicar com contagem (primary).</li>
              <li><b style={{ color: 'var(--text)' }}>Background visível</b> · com blur 2px · indica de onde veio.</li>
            </ul>
          </div>
        </div>
      </Showcase>

      <SubHead num="E" title="Carrinho · checkout" italic="lista densa + footer total grudado" />
      <Showcase>
        <div className="flex flex-wrap items-start gap-8">
          <PhoneFrame title="Cart · catálogo">
            <ScreenCart />
          </PhoneFrame>
          <div className="max-w-md">
            <h4 className="serif text-[18px] font-normal" style={{ color: 'var(--text)' }}>
              Carrinho mobile-first
            </h4>
            <ul className="mt-3 flex flex-col gap-2 text-[13px]" style={{ color: 'var(--text-soft)' }}>
              <li><b style={{ color: 'var(--text)' }}>Item row</b> · 56px thumb + info + preço · qty stepper inline.</li>
              <li><b style={{ color: 'var(--text)' }}>Serviços misturados</b> · placeholder SVC brand-soft no lugar de foto.</li>
              <li><b style={{ color: 'var(--text)' }}>Footer fixed</b> · total Fraunces 24px + CTA full-width.</li>
              <li><b style={{ color: 'var(--text)' }}>Sem TabBar</b> · checkout é flow exclusivo, foco em concluir.</li>
            </ul>
          </div>
        </div>
      </Showcase>

      <SubHead num="F" title="Notificações" italic="3 tabs · agrupamento por data · unread dot" />
      <Showcase>
        <div className="flex flex-wrap items-start gap-8">
          <PhoneFrame title="Atividade · feed">
            <ScreenNotifications />
          </PhoneFrame>
          <div className="max-w-md">
            <h4 className="serif text-[18px] font-normal" style={{ color: 'var(--text)' }}>
              Inbox de notificações
            </h4>
            <ul className="mt-3 flex flex-col gap-2 text-[13px]" style={{ color: 'var(--text-soft)' }}>
              <li><b style={{ color: 'var(--text)' }}>Tabs underline</b> · same as desktop · com count.</li>
              <li><b style={{ color: 'var(--text)' }}>Unread em brand-soft 4%</b> · sutil · não dominante.</li>
              <li><b style={{ color: 'var(--text)' }}>Avatar system (✓ brand-soft + border brand)</b> · diferencia bot do humano.</li>
              <li><b style={{ color: 'var(--text)' }}>Dot brand</b> · indica unread · vira invisível quando read.</li>
              <li><b style={{ color: 'var(--text)' }}>Agrupamento mono</b> · "HOJE" / "ONTEM" · hierarquia visual.</li>
            </ul>
          </div>
        </div>
      </Showcase>

      <SubHead num="G" title="Formulário · wizard mini" italic="3 steps · X close · save no header" />
      <Showcase>
        <div className="flex flex-wrap items-start gap-8">
          <PhoneFrame title="Novo projeto · wizard">
            <ScreenForm />
          </PhoneFrame>
          <div className="max-w-md">
            <h4 className="serif text-[18px] font-normal" style={{ color: 'var(--text)' }}>
              Form adaptado
            </h4>
            <ul className="mt-3 flex flex-col gap-2 text-[13px]" style={{ color: 'var(--text-soft)' }}>
              <li><b style={{ color: 'var(--text)' }}>Wizard mini no topo</b> · 3 steps · current brand, próximos surface-3.</li>
              <li><b style={{ color: 'var(--text)' }}>Modal-style header</b> · X close + título + Salvar (link brand).</li>
              <li><b style={{ color: 'var(--text)' }}>Tipo em grid 2×2</b> · não-radio tradicional · scan rápido.</li>
              <li><b style={{ color: 'var(--text)' }}>CTA full-width fixed</b> · "Continuar para Equipe →" sempre visível.</li>
              <li><b style={{ color: 'var(--text)' }}>Labels mono uppercase</b> · same do desktop · mantém identidade.</li>
            </ul>
          </div>
        </div>
      </Showcase>

      <SubHead num="H" title="Ajustes · profile + preferences" italic="card profile + list group + toggles inline" />
      <Showcase>
        <div className="flex flex-wrap items-start gap-8">
          <PhoneFrame title="Settings · ajustes">
            <ScreenSettings />
          </PhoneFrame>
          <div className="max-w-md">
            <h4 className="serif text-[18px] font-normal" style={{ color: 'var(--text)' }}>
              Settings padrão TKWS
            </h4>
            <ul className="mt-3 flex flex-col gap-2 text-[13px]" style={{ color: 'var(--text-soft)' }}>
              <li><b style={{ color: 'var(--text)' }}>Profile card hero</b> · avatar lg + nome Fraunces + email mono.</li>
              <li><b style={{ color: 'var(--text)' }}>List group em card</b> · ícone box 28×28 brand-soft · seções separadas por border-bottom line-1.</li>
              <li><b style={{ color: 'var(--text)' }}>Toggle inline</b> · switches para preferências on/off.</li>
              <li><b style={{ color: 'var(--text)' }}>Chevron right</b> · indica drilling em sub-screen.</li>
              <li><b style={{ color: 'var(--text)' }}>Sair em outline</b> · ação destrutiva mas não primária.</li>
            </ul>
          </div>
        </div>
      </Showcase>

      <SubHead num="I" title="Princípios mobile" italic="o que muda em relação ao desktop" />
      <Showcase>
        <div className="grid grid-cols-2 gap-4 max-[760px]:grid-cols-1">
          {[
            { label: 'Stack vertical', body: 'Tudo em coluna única (sem grid 2/3 cols). Hero KPI + lista + ações empilhados.' },
            { label: 'TabBar inferior', body: 'Substitui sidebar lateral. 5 items max, ícone + label mono 9px, ativo em brand.' },
            { label: 'Bottom Sheet > Drawer', body: 'Substituiu Dialog/Sheet desktop. Drag handle + scrim + background visível com blur.' },
            { label: 'Footer CTA fixo', body: 'Botão primário grudado no fim · keyboard-aware (Capacitor SafeArea). Cancelar quando exists fica à esquerda.' },
            { label: 'Filter chips horizontais', body: 'Substituem FilterSidebar lateral · overflow-x-auto · scroll natural com inertia.' },
            { label: 'FAB onde precisar', body: 'Action primária flutuante 48×48 brand + shadow-3 · bottom-right, acima do TabBar.' },
            { label: 'Cards menores', body: 'Padding 12 (não 20), font 13.5px (não 15), ícone 14-16px (não 18-22).' },
            { label: 'Safe areas', body: 'Padding-top notch (26px iPhone), padding-bottom home indicator (12px), padding lateral 16px.' },
          ].map((p) => (
            <Card key={p.label} className="!p-4">
              <div className="mono text-[10.5px] font-semibold uppercase tracking-[1.3px]" style={{ color: 'var(--brand)' }}>
                {p.label}
              </div>
              <p className="mt-1.5 text-[12.5px] leading-[1.55]" style={{ color: 'var(--text-soft)' }}>
                {p.body}
              </p>
            </Card>
          ))}
        </div>
      </Showcase>

      <SubHead num="J" title="Componentes Avatar Group mobile" italic="presence inline · 4 max + counter" />
      <Showcase>
        <div className="flex items-center gap-4">
          <AvatarGroup>
            <Avatar size="sm" style={{ background: 'var(--purple)' }}><AvatarFallback>LZ</AvatarFallback></Avatar>
            <Avatar size="sm" style={{ background: 'var(--warning)', color: 'var(--bg)' }}><AvatarFallback>AV</AvatarFallback></Avatar>
            <Avatar size="sm" style={{ background: 'var(--success)', color: 'var(--bg)' }}><AvatarFallback>JQ</AvatarFallback></Avatar>
            <Avatar size="sm" style={{ background: 'var(--pink)' }}><AvatarFallback>RL</AvatarFallback></Avatar>
            <Avatar size="sm" style={{ background: 'var(--text-mute)', color: 'var(--bg)' }}><AvatarFallback>+3</AvatarFallback></Avatar>
          </AvatarGroup>
          <div className="text-[12.5px]" style={{ color: 'var(--text-soft)' }}>
            <b style={{ color: 'var(--text)' }}>Loiana, Ana</b> e +5 vendo
          </div>
        </div>
      </Showcase>
    </div>
  )
}

import { useState } from 'react'
import { Bell, Building2, CreditCard, Globe, Key, Plug, User, Users } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input, Field, FieldHint } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import type { AIPrompt } from '@/lib/prompts'

const navItems = [
  { id: 'profile', label: 'Perfil', icon: <User size={14} /> },
  { id: 'org', label: 'Organização', icon: <Building2 size={14} /> },
  { id: 'team', label: 'Equipe e Squads', icon: <Users size={14} /> },
  { id: 'billing', label: 'Cobrança', icon: <CreditCard size={14} /> },
  { id: 'security', label: 'Segurança', icon: <Key size={14} /> },
  { id: 'notifications', label: 'Notificações', icon: <Bell size={14} /> },
  { id: 'integrations', label: 'Integrações', icon: <Plug size={14} /> },
  { id: 'locale', label: 'Idioma e região', icon: <Globe size={14} /> },
]

const prompt: AIPrompt = {
  componente: 'Pattern · Settings Screen',
  import: '// Composição: Sidebar (app block) à esquerda + Cards no content',
  contexto:
    'Tela de configurações · sidebar fixo à esquerda com grupos de items · content com Cards de seção. Cada Card pode ser autosave (Switch · aplica imediato) ou form-style (Save explícito). Padrão: hierarquia mais ampla → mais específica de cima pra baixo.',
  quandoUsar: [
    'Settings da conta / organização',
    'Configurações do projeto (overrides locais)',
    'Admin de feature flags',
  ],
  props: [],
  antiPatterns: [
    'Settings em Tabs · ruim para muitos grupos',
    'Misturar autosave (Switch) e form-save no mesmo Card sem deixar claro',
    'Sem busca em settings com 30+ opções',
  ],
  exemplo: `<div className="grid grid-cols-[260px_1fr]">
  <Sidebar>...</Sidebar>
  <div>
    {active === 'profile' && <ProfileSection />}
    {active === 'notifications' && <NotificationsSection />}
    ...
  </div>
</div>`,
  relacionados: ['Sidebar', 'Card', 'Switch'],
}

export function SettingsPattern() {
  const [active, setActive] = useState('profile')
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        num="P09.4"
        category="Pattern · Settings"
        title="Settings Screen"
        italic="sidebar nav + content blocks"
        description="Configurações com sidebar à esquerda. Use autosave (Switch) ou form-save explícito por Card."
        tag="tela completa"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Configurações da conta" />
      <Showcase padding="none">
        <div className="grid grid-cols-[260px_1fr] max-[900px]:grid-cols-1" style={{ minHeight: 540 }}>
          <Sidebar>
            <SidebarHeader>
              <Avatar size="md" square style={{ background: 'var(--purple)' }}>
                <AvatarFallback>WS</AvatarFallback>
              </Avatar>
              <div className="leading-tight">
                <div className="text-[12.5px] font-bold" style={{ color: 'var(--text)' }}>WS Group</div>
                <div className="mono text-[10px]" style={{ color: 'var(--text-mute)' }}>Premium plan</div>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarMenu>
                  {navItems.map((n) => (
                    <SidebarMenuItem key={n.id}>
                      <SidebarMenuButton
                        icon={n.icon}
                        active={active === n.id}
                        onClick={() => setActive(n.id)}
                      >
                        {n.label}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <Badge tone="brand">Plano Premium</Badge>
            </SidebarFooter>
          </Sidebar>

          <div className="overflow-y-auto p-6 max-[900px]:p-4">
            {active === 'profile' && (
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Identificação</CardTitle>
                    <CardDescription>Como você aparece para o squad e o cliente</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 max-[760px]:grid-cols-1">
                      <Field>
                        <Label>Nome completo</Label>
                        <Input defaultValue="Allysson Pereira" />
                      </Field>
                      <Field>
                        <Label>Email</Label>
                        <Input defaultValue="allysson@tkws.com.br" type="email" />
                        <FieldHint>Mudanças aqui precisam de reconfirmação</FieldHint>
                      </Field>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                      <Button variant="ghost">Cancelar</Button>
                      <Button>Salvar</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {active === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle>Notificações</CardTitle>
                  <CardDescription>Aplicado imediatamente · sem precisar salvar</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    {[
                      ['Email · milestones de projeto', true],
                      ['Email · novos comentários', true],
                      ['Email · digest semanal', false],
                      ['Push · cliente respondeu', true],
                      ['SMS · obra atrasada (crítico)', false],
                    ].map(([lbl, on], i) => (
                      <label key={i} className="flex cursor-pointer items-center justify-between">
                        <span className="text-[13px]" style={{ color: 'var(--text)' }}>{lbl as string}</span>
                        <Switch defaultChecked={Boolean(on)} />
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {!['profile', 'notifications'].includes(active) && (
              <Card>
                <CardHeader>
                  <CardTitle>{navItems.find((n) => n.id === active)?.label}</CardTitle>
                  <CardDescription>Conteúdo específico desta seção · siga o mesmo padrão de Card + Form ou Switch.</CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        </div>
      </Showcase>
    </div>
  )
}

import { Bell, Box, Folder, Home, Inbox, Settings, Users } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Sidebar (app block)',
  import: "import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'",
  contexto:
    'Sidebar de nav primária do app TKWS · não confundir com a sidebar de docs deste site. Composta por Header (logo/team switcher) · Content (grupos com itens) · Footer (user · settings). Suporta colapso para 68px.',
  quandoUsar: [
    'Nav primária do app interno (com 5+ itens)',
    'Apps power-user · paradigma desktop',
    'Layout principal · ao lado do main content',
  ],
  props: [
    { name: 'collapsed', type: 'boolean', description: 'Modo compacto · só ícones' },
    { name: 'SidebarMenuButton', type: '{ active, icon, badge }', description: 'Item de menu com ícone, badge e estado ativo' },
  ],
  antiPatterns: [
    'Sidebar em portal externo · use NavigationMenu',
    'Sidebar sem agrupamento (SidebarGroup) com 8+ itens',
    'Hardcode de largura · use o componente que cuida do collapse',
  ],
  exemplo: `<Sidebar>
  <SidebarHeader>
    <Avatar><AvatarFallback>WS</AvatarFallback></Avatar>
    <div>
      <div className="text-[12.5px] font-bold">WS Group</div>
      <div className="mono text-[10px]">Premium plan</div>
    </div>
  </SidebarHeader>
  <SidebarContent>
    <SidebarGroup>
      <SidebarGroupLabel>Operação</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton icon={<Folder size={14}/>} active>Projetos</SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  </SidebarContent>
  <SidebarFooter>…</SidebarFooter>
</Sidebar>`,
  relacionados: ['NavigationMenu', 'Menubar'],
}

export function SidebarPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="08.7"
        category="Navigation · Sidebar"
        title="Sidebar (app)"
        italic="nav primária"
        description="Sidebar do app TKWS · grupos de items com ícones, badges e estado ativo."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Sidebar completa" />
      <Showcase padding="none">
        <div className="flex h-[480px]">
          <Sidebar>
            <SidebarHeader>
              <Avatar size="md" square style={{ background: 'var(--purple)' }}>
                <AvatarFallback>WS</AvatarFallback>
              </Avatar>
              <div className="leading-tight">
                <div className="text-[12.5px] font-bold" style={{ color: 'var(--text)' }}>
                  WS Group
                </div>
                <div className="mono text-[10px]" style={{ color: 'var(--text-mute)' }}>
                  Premium plan
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Operação</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton icon={<Home size={14} />}>Dashboard</SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton icon={<Folder size={14} />} active badge={<Badge tone="brand">43</Badge>}>
                      Projetos
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton icon={<Users size={14} />}>Clientes</SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton icon={<Box size={14} />} hasChildren>Catálogo</SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel>Comunicação</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton icon={<Inbox size={14} />} badge={<Badge tone="danger">3</Badge>}>
                      Inbox
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton icon={<Bell size={14} />}>Notificações</SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <button
                className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-[12.5px] transition-colors hover:bg-white/[0.06]"
                style={{ color: 'var(--text-soft)' }}
              >
                <Settings size={14} />
                Configurações
              </button>
            </SidebarFooter>
          </Sidebar>
          <div
            className="flex flex-1 items-center justify-center"
            style={{ background: 'var(--bg)' }}
          >
            <div className="text-center">
              <div
                className="mono text-[10.5px] font-bold uppercase tracking-[1.6px]"
                style={{ color: 'var(--text-mute)' }}
              >
                Main content
              </div>
              <div className="serif mt-2 text-[24px] font-light" style={{ color: 'var(--text)' }}>
                Página da rota ativa
              </div>
            </div>
          </div>
        </div>
      </Showcase>
    </div>
  )
}

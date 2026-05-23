import { Bell, ChevronRight, Lock, User } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { ListGroup, ListGroupItem } from '@/components/ui/list-group'
import { Badge } from '@/components/ui/badge'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'ListGroup',
  import: "import { ListGroup, ListGroupItem } from '@/components/ui/list-group'",
  contexto:
    'Lista vertical de itens interativos · settings, links, opções. Cada item tem leading (ícone), description e trailing (badge/chevron). Para projetos com thumb/progress, use RichList; para tabular, Table.',
  quandoUsar: [
    'Tela de settings (Conta, Notificações, Segurança)',
    'Lista de links em página de perfil',
    'Onboarding · escolha do tipo de conta',
  ],
  props: [
    { name: 'asButton (item)', type: 'boolean', description: 'Adiciona cursor pointer + hover · default true' },
    { name: 'active', type: 'boolean', description: 'Item selecionado · brand-soft bg' },
    { name: 'leading / trailing', type: 'ReactNode', description: 'Conteúdo em colunas extras' },
    { name: 'description', type: 'ReactNode', description: 'Texto secundário sob o título' },
  ],
  antiPatterns: [
    'ListGroup para dados tabulares · use Table',
    'ListGroup sem leading icon em settings · perde legibilidade',
  ],
  exemplo: `<ListGroup>
  <ListGroupItem
    leading={<User size={16} />}
    description="Nome, email, foto"
    trailing={<ChevronRight size={13} />}
    onSelect={() => navigate({ to: '/settings/account' })}
  >
    Conta
  </ListGroupItem>
</ListGroup>`,
  relacionados: ['RichList', 'Card'],
}

export function ListGroupPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="11.13"
        category="Data Display · ListGroup"
        title="List Group"
        italic="settings · links"
        description="Lista vertical interativa. Use para settings e listas de opções. Para projetos com thumb, use RichList."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Settings menu" />
      <Showcase>
        <div className="max-w-md">
          <ListGroup>
            <ListGroupItem
              leading={<User size={16} style={{ color: 'var(--brand)' }} />}
              description="Nome, email, foto de perfil"
              trailing={<ChevronRight size={13} style={{ color: 'var(--text-mute)' }} />}
            >
              Conta
            </ListGroupItem>
            <ListGroupItem
              leading={<Bell size={16} style={{ color: 'var(--warning)' }} />}
              description="Email, push, SMS · por categoria"
              trailing={
                <div className="flex items-center gap-1.5">
                  <Badge tone="warning">3</Badge>
                  <ChevronRight size={13} style={{ color: 'var(--text-mute)' }} />
                </div>
              }
            >
              Notificações
            </ListGroupItem>
            <ListGroupItem
              leading={<Lock size={16} style={{ color: 'var(--success)' }} />}
              description="Senha, 2FA, sessões ativas"
              trailing={<ChevronRight size={13} style={{ color: 'var(--text-mute)' }} />}
              active
            >
              Segurança
            </ListGroupItem>
          </ListGroup>
        </div>
      </Showcase>
    </div>
  )
}

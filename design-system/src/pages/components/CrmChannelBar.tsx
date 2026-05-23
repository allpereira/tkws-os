import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { ChannelBar } from '@/components/tkws/crm-channel-bar'
import { toast } from 'sonner'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'CRM · ChannelBar',
  import: "import { ChannelBar, type ChannelKind, type ChannelButton } from '@/components/tkws/crm-channel-bar'",
  contexto:
    'Barra de ações rápidas de contato · phone · email · whatsapp · video · sms. Variant inline (ícones) ou cards (vertical). Suporta badge contador (mensagens não lidas). Use no header de Contact Card e em CRM Detail Panel.',
  quandoUsar: [
    'Header do Contact Detail panel',
    'Quick actions em row de lead/cliente',
    'Drawer de contato · variant cards',
  ],
  props: [
    { name: 'channels', type: 'ChannelButton[]', description: '{ kind, value?, badge?, disabled?, onClick? }' },
    { name: 'variant', type: '"inline" | "cards"', description: 'inline = ícones · cards = grid vertical com label' },
    { name: 'size', type: '"sm" | "md" | "lg"', description: 'Tamanho dos botões inline' },
  ],
  antiPatterns: [
    'ChannelBar com 6+ canais · vire menu',
    'Sem tooltip → usuário não sabe qual ícone é qual',
    'Email/Phone hardcoded · use os valores do contato',
  ],
  exemplo: `<ChannelBar
  channels={[
    { kind: 'phone', value: '+55 47 98xxx-xxxx', onClick: () => call() },
    { kind: 'email', value: 'cliente@email.com', onClick: () => mail() },
    { kind: 'whatsapp', value: '+5547...', badge: 3, onClick: () => wa() }
  ]}
/>`,
  relacionados: ['ContactCard', 'DealCard'],
}

export function CrmChannelBarPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="CRM.2"
        category="CRM · ChannelBar"
        title="Channel Bar"
        italic="ligar · email · whatsapp · video · sms"
        description="Barra de ações rápidas de contato com tooltips. 2 variantes: inline (ícones) e cards (vertical com label)."
        tag="5 canais"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Inline · 5 canais" />
      <Showcase>
        <ChannelBar
          channels={[
            { kind: 'phone', value: '(47) 98xxx-xxxx', onClick: () => toast.success('Discando…') },
            { kind: 'whatsapp', value: '+55 47 98xxx-xxxx', badge: 3, onClick: () => toast.success('WhatsApp aberto') },
            { kind: 'email', value: 'andrade@email.com', onClick: () => toast.success('Compose aberto') },
            { kind: 'video', onClick: () => toast.success('Sala criada') },
            { kind: 'sms', onClick: () => toast.success('SMS') },
          ]}
        />
      </Showcase>

      <SubHead num="B" title="Tamanhos" />
      <Showcase>
        <div className="flex flex-col gap-3">
          <ChannelBar
            size="sm"
            channels={[
              { kind: 'phone', value: '(47) 98xxx-xxxx' },
              { kind: 'whatsapp', badge: 3 },
              { kind: 'email' },
            ]}
          />
          <ChannelBar
            size="md"
            channels={[
              { kind: 'phone', value: '(47) 98xxx-xxxx' },
              { kind: 'whatsapp', badge: 3 },
              { kind: 'email' },
            ]}
          />
          <ChannelBar
            size="lg"
            channels={[
              { kind: 'phone', value: '(47) 98xxx-xxxx' },
              { kind: 'whatsapp', badge: 3 },
              { kind: 'email' },
            ]}
          />
        </div>
      </Showcase>

      <SubHead num="C" title="Cards · header do Contact Detail" />
      <Showcase>
        <ChannelBar
          variant="cards"
          channels={[
            { kind: 'phone', onClick: () => toast.success('Ligando…') },
            { kind: 'whatsapp', badge: 3, onClick: () => toast.success('WhatsApp') },
            { kind: 'email', onClick: () => toast.success('Email') },
            { kind: 'video', onClick: () => toast.success('Video') },
          ]}
        />
      </Showcase>
    </div>
  )
}

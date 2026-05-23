import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Avatar, AvatarFallback, AvatarImage, AvatarGroup } from '@/components/ui/avatar'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Avatar',
  import: "import { Avatar, AvatarFallback, AvatarImage, AvatarGroup } from '@/components/ui/avatar'",
  contexto:
    'Avatar representa pessoa, squad ou cliente. Sempre forneça fallback de iniciais (2 letras). 4 tamanhos: sm (24px), md (32px), lg (40px), xl (56px). Use AvatarGroup com -ml-2 sobreposto quando exibir times.',
  quandoUsar: [
    'Identificar pessoa em lista, header, comentário',
    'Squad/cliente em projeto ou card',
    'Group de membros (Super Squad) com sobreposição',
    'Quadrado (square) para projetos · circular para pessoas',
  ],
  props: [
    { name: 'size', type: '"sm" | "md" | "lg" | "xl"', description: 'Tamanho · md é o padrão' },
    { name: 'square', type: 'boolean', description: 'Use para projetos/edifícios · pessoas ficam round' },
  ],
  antiPatterns: [
    'Avatar sem fallback de iniciais',
    'Avatar maior que xl — quebra hierarquia',
    'Avatar como botão de ação — use IconButton',
  ],
  exemplo: `<Avatar size="md">
  <AvatarImage src={user.photo} alt={user.name} />
  <AvatarFallback>{initials(user.name)}</AvatarFallback>
</Avatar>

<AvatarGroup>
  {team.map(u => <Avatar key={u.id}>{initials(u.name)}</Avatar>)}
</AvatarGroup>`,
  relacionados: ['Card', 'HoverCard'],
}

export function AvatarPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="06.6"
        category="Foundation · Avatar"
        title="Avatar"
        italic="pessoa · squad · cliente"
        description="Iniciais como fallback. Round para pessoas, square para projetos. Group com sobreposição para times."
        tag="4 tamanhos · group"
      />

      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Tamanhos" italic="sm · md · lg · xl" />
      <Showcase title="4 tamanhos disponíveis"
        code={`<Avatar size="sm"><AvatarFallback>LF</AvatarFallback></Avatar>
<Avatar size="md"><AvatarFallback>LZ</AvatarFallback></Avatar>
<Avatar size="lg"><AvatarFallback>AV</AvatarFallback></Avatar>
<Avatar size="xl"><AvatarFallback>RW</AvatarFallback></Avatar>`}
      >
        <div className="flex items-center gap-4">
          <Avatar size="sm"><AvatarFallback>LF</AvatarFallback></Avatar>
          <Avatar size="md"><AvatarFallback>LZ</AvatarFallback></Avatar>
          <Avatar size="lg"><AvatarFallback>AV</AvatarFallback></Avatar>
          <Avatar size="xl" style={{ background: 'var(--purple)' }}><AvatarFallback>RW</AvatarFallback></Avatar>
          <Avatar size="lg" square><AvatarFallback>RQ</AvatarFallback></Avatar>
        </div>
      </Showcase>

      <SubHead num="B" title="AvatarGroup" italic="time / squad" />
      <Showcase title="Sobreposição para times"
        code={`<AvatarGroup>
  <Avatar><AvatarFallback>LZ</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>AV</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>RL</AvatarFallback></Avatar>
</AvatarGroup>`}
      >
        <AvatarGroup>
          <Avatar><AvatarFallback>LZ</AvatarFallback></Avatar>
          <Avatar style={{ background: 'var(--warning)' }}><AvatarFallback>AV</AvatarFallback></Avatar>
          <Avatar style={{ background: 'var(--purple)' }}><AvatarFallback>RL</AvatarFallback></Avatar>
          <Avatar style={{ background: 'var(--success)' }}><AvatarFallback>JQ</AvatarFallback></Avatar>
          <Avatar style={{ background: 'var(--text-mute)' }}><AvatarFallback>+3</AvatarFallback></Avatar>
        </AvatarGroup>
      </Showcase>
    </div>
  )
}

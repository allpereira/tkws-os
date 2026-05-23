import { Download, Plus } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Button } from '@/components/ui/button'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Button',
  import: "import { Button } from '@/components/ui/button'",
  contexto:
    'Botão é a ação primária da interface TKWS. 5 variantes: default (cyan, ação principal), secondary, outline, ghost (sem fundo) e danger (vermelho · destrutivo). Sempre prefira o variant padrão para a ação primária da tela — somente uma por contexto.',
  quandoUsar: [
    'Ação principal da tela ou card (use variant="default")',
    'Ações secundárias inline (variant="secondary" ou "outline")',
    'Ações destrutivas confirmadas (variant="danger" + AlertDialog)',
    'Ícone sozinho como ação (size="icon")',
  ],
  props: [
    { name: 'variant', type: '"default" | "secondary" | "outline" | "ghost" | "danger"', description: 'Hierarquia visual da ação' },
    { name: 'size', type: '"default" | "sm" | "lg" | "icon"', description: 'Padrão sm para toolbars densas' },
    { name: 'disabled', type: 'boolean', description: 'Bloqueia ação · prefira validação que indica POR QUE está bloqueado' },
    { name: 'asChild', type: 'boolean', description: 'Use com <Link> do TanStack Router para acessibilidade' },
  ],
  antiPatterns: [
    'Mais de UM botão primário (variant="default") na mesma tela ou seção',
    'Cor de fundo manual em vez de variant — quebra o sistema',
    'Texto vazio para botão-ícone — sempre forneça aria-label',
    'Botão primário para ação destrutiva — use variant="danger" + confirmação',
  ],
  exemplo: `<Button variant="default">
  <Plus size={14} /> Novo projeto
</Button>

<Button variant="outline" size="sm">
  <Download size={12} /> Exportar
</Button>

<Button variant="danger" asChild>
  <Link to="/excluir">Excluir registro</Link>
</Button>`,
  relacionados: ['Link', 'Tooltip', 'AlertDialog'],
}

export function ButtonPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="06.1"
        category="Foundation · Button"
        title="Button"
        italic="ações primárias e secundárias"
        description="5 variantes hierárquicas + 4 tamanhos. Apenas uma ação primária por contexto. Sempre forneça aria-label em botões só de ícone."
        tag="5 variantes · 4 tamanhos"
      />

      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Hierarquia" italic="default → secondary → outline → ghost → danger" />
      <Showcase
        title="As 5 variantes"
        description="Uma primária por tela. Secondary/outline para ações de apoio. Ghost para limpar contexto."
        code={`<Button variant="default"><Plus size={14}/> Novo projeto</Button>
<Button variant="secondary">Editar</Button>
<Button variant="outline">Filtrar</Button>
<Button variant="ghost">Cancelar</Button>
<Button variant="danger">Excluir</Button>`}
      >
        <div className="flex flex-wrap gap-3">
          <Button variant="default"><Plus size={14} /> Novo projeto</Button>
          <Button variant="secondary">Editar</Button>
          <Button variant="outline">Filtrar</Button>
          <Button variant="ghost">Cancelar</Button>
          <Button variant="danger">Excluir</Button>
        </div>
      </Showcase>

      <SubHead num="B" title="Tamanhos" italic="default · sm · lg · icon" />
      <Showcase
        title="Tamanhos"
        description="Use sm em toolbars densas. lg em CTAs hero. icon em botões compactos."
        code={`<Button size="sm">Small</Button>
<Button>Default</Button>
<Button size="lg">Large</Button>
<Button size="icon" aria-label="Adicionar"><Plus size={16}/></Button>`}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="Adicionar"><Plus size={16} /></Button>
        </div>
      </Showcase>

      <SubHead num="C" title="Com ícone" italic="lucide-react · strokeWidth 1.5" />
      <Showcase
        title="Botão com ícone"
        description="Use lucide-react. Tamanho 14-16px. strokeWidth 1.5 combina com o tom editorial."
        code={`<Button><Plus size={14}/> Novo projeto</Button>
<Button variant="outline"><Download size={12}/> Exportar</Button>`}
      >
        <div className="flex flex-wrap gap-3">
          <Button><Plus size={14} /> Novo projeto</Button>
          <Button variant="outline"><Download size={12} /> Exportar</Button>
        </div>
      </Showcase>

      <SubHead num="D" title="Estados" italic="disabled · loading" />
      <Showcase
        title="Estado desabilitado"
        description="Prefira validação que indica POR QUE está bloqueado. Use Tooltip para explicar."
        code={`<Button disabled>Aguardando assinatura</Button>`}
      >
        <Button disabled>Aguardando assinatura</Button>
      </Showcase>
    </div>
  )
}

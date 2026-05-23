import { useState } from 'react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { InlineEdit } from '@/components/ui/inline-edit'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'InlineEdit',
  import: "import { InlineEdit } from '@/components/ui/inline-edit'",
  contexto:
    'Célula editável inline · clique para entrar em modo edit. Enter ou blur salva, Escape cancela. Bom para tabelas onde abrir um Drawer/Dialog seria overkill. Mantenha valores simples (string, número) · para campos complexos use Drawer.',
  quandoUsar: [
    'Tabela de projetos · valor/margem/nome editável direto',
    'Detail card com campos simples atualizáveis',
    'Kanban cards com título inline',
    'Especificação de material · valor por linha',
  ],
  props: [
    { name: 'value', type: 'string', description: 'Valor atual' },
    { name: 'onChange', type: '(next: string) => void', description: 'Recebe valor novo no commit' },
    { name: 'display', type: '(v) => ReactNode', description: 'Render customizado (cor/peso) no modo display' },
    { name: 'type', type: '"text" | "number"', description: 'Tipo do input em edit mode' },
    { name: 'width', type: 'number', description: 'Largura em px do input em edit' },
    { name: 'align', type: '"left" | "right" | "center"', description: 'Alinhamento do texto' },
  ],
  antiPatterns: [
    'Usar para campos complexos · use Drawer/Dialog',
    'Sem feedback de save (toast) em mudanças destrutivas',
    'Inline edit em campos críticos sem permission check',
  ],
  exemplo: `<InlineEdit
  value={projeto.nome}
  onChange={(v) => updateProjeto({ ...projeto, nome: v })}
/>

<InlineEdit
  value={String(projeto.valor)}
  type="number"
  align="right"
  display={(v) => <span className="num-tabular">R$ {v}</span>}
  onChange={(v) => updateValor(parseInt(v))}
/>`,
  relacionados: ['Input', 'Table', 'Drawer'],
}

interface Project {
  id: number
  name: string
  value: string
  margin: string
  marginTone: 'success' | 'warning' | 'danger'
}

export function InlineEditPage() {
  const [name, setName] = useState('Yachthouse 2104')
  const [projects, setProjects] = useState<Project[]>([
    { id: 1, name: 'Yachthouse 2104', value: 'R$ 2,4M', margin: '28,2%', marginTone: 'warning' },
    { id: 2, name: 'Cob. Vitra 1801', value: 'R$ 3,98M', margin: '31,1%', marginTone: 'success' },
    { id: 3, name: 'Apto Brava Home', value: 'R$ 1,78M', margin: '28%', marginTone: 'warning' },
    { id: 4, name: 'Cob. Titanium 101', value: 'R$ 9,5M', margin: '35%', marginTone: 'success' },
  ])

  const updateProject = (id: number, field: keyof Project, value: string) => {
    setProjects((p) => p.map((proj) => (proj.id === id ? { ...proj, [field]: value } : proj)))
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="07.19"
        category="Inputs · InlineEdit"
        title="InlineEdit"
        italic="clique para editar célula"
        description="Edição inline em tabelas e cards. Enter/blur salva, Escape cancela. Hover mostra pencil ✎."
        tag="cell · card"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Standalone · hover mostra ✎ + click edita" />
      <Showcase>
        <div className="flex flex-col gap-4 max-w-md">
          <div>
            <div className="mono mb-1 text-[10.5px] font-semibold uppercase tracking-[1.2px]" style={{ color: 'var(--text-mute)' }}>
              Hover · cursor "edit"
            </div>
            <InlineEdit value={name} onChange={setName} />
          </div>
          <div className="text-[12px] mono" style={{ color: 'var(--text-mute)' }}>
            Valor salvo: <span style={{ color: 'var(--text)' }}>{name}</span>
          </div>
        </div>
      </Showcase>

      <SubHead num="B" title="Em tabela · valor + margem inline" />
      <Showcase>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Projeto</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="text-right">Margem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <InlineEdit value={p.name} onChange={(v) => updateProject(p.id, 'name', v)} />
                </TableCell>
                <TableCell className="text-right">
                  <InlineEdit
                    value={p.value}
                    onChange={(v) => updateProject(p.id, 'value', v)}
                    align="right"
                    width={100}
                    display={(v) => <span className="num-tabular">{v}</span>}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <InlineEdit
                    value={p.margin}
                    onChange={(v) => updateProject(p.id, 'margin', v)}
                    align="right"
                    width={80}
                    display={(v) => (
                      <span className="num-tabular" style={{ color: `var(--${p.marginTone})` }}>
                        {v}
                      </span>
                    )}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Showcase>
    </div>
  )
}

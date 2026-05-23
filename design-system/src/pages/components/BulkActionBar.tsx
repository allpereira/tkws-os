import { useState } from 'react'
import { Archive, Tag, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { BulkActionBar } from '@/components/tkws/bulk-action-bar'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import type { AIPrompt } from '@/lib/prompts'

const items = [
  '#2410 · Yachthouse 2104',
  '#2411 · Cobertura Titanium',
  '#2412 · Vitra 1801',
  '#2413 · Sky Resort',
  '#2414 · Campo Belo SP',
]

const prompt: AIPrompt = {
  componente: 'BulkActionBar',
  import: "import { BulkActionBar } from '@/components/tkws/bulk-action-bar'",
  contexto:
    'Barra flutuante no rodapé · aparece quando há 1+ itens selecionados. Use motion (já incluído) para entrada slide-up. Ações destrutivas devem ter confirm via AlertDialog. Sempre ofereça X para limpar seleção.',
  quandoUsar: [
    'DataTable com seleção múltipla',
    'RichList com checkbox por linha',
    'Mass actions sobre projetos / fornecedores',
  ],
  props: [
    { name: 'count', type: 'number', description: 'Total selecionado' },
    { name: 'onClear', type: '() => void', description: 'Limpa seleção' },
    { name: 'children', type: 'ReactNode', description: 'Botões de ação' },
  ],
  antiPatterns: [
    'BulkActionBar sem onClear',
    'Ações destrutivas sem AlertDialog',
    'BulkActionBar visível com count=0',
  ],
  exemplo: `<BulkActionBar count={selected.length} onClear={() => setSelected([])}>
  <Button variant="outline" size="sm"><Tag size={12}/> Etiquetar</Button>
  <Button variant="outline" size="sm"><Archive size={12}/> Arquivar</Button>
  <Button variant="danger" size="sm"><Trash2 size={12}/> Excluir</Button>
</BulkActionBar>`,
  relacionados: ['DataTable', 'AlertDialog', 'Checkbox'],
}

export function BulkActionBarPage() {
  const [selected, setSelected] = useState<string[]>(['#2411 · Cobertura Titanium', '#2413 · Sky Resort'])

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="12.5"
        category="Layout · Bulk Action Bar"
        title="Bulk Action Bar"
        italic="ações em massa"
        description="Barra flutuante aparece com seleção múltipla. Sempre tenha X para limpar. Ações destrutivas via AlertDialog."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Lista selecionável · veja a barra aparecer abaixo" />
      <Showcase>
        <div className="space-y-2">
          {items.map((it) => {
            const isSel = selected.includes(it)
            return (
              <label
                key={it}
                className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors"
                style={{
                  background: isSel ? 'var(--brand-soft)' : 'var(--surface-1)',
                  borderColor: isSel ? 'var(--brand)' : 'var(--line-1)',
                }}
              >
                <Checkbox
                  checked={isSel}
                  onCheckedChange={(c) =>
                    setSelected((s) => (c ? [...s, it] : s.filter((x) => x !== it)))
                  }
                />
                <span className="text-[13.5px]" style={{ color: 'var(--text)' }}>
                  {it}
                </span>
              </label>
            )
          })}
        </div>
        <BulkActionBar count={selected.length} onClear={() => setSelected([])}>
          <Button variant="outline" size="sm">
            <Tag size={12} /> Etiquetar
          </Button>
          <Button variant="outline" size="sm">
            <Archive size={12} /> Arquivar
          </Button>
          <Button variant="danger" size="sm">
            <Trash2 size={12} /> Excluir
          </Button>
        </BulkActionBar>
      </Showcase>
    </div>
  )
}

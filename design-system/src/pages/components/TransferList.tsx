import { useState } from 'react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { TransferList, type TransferItem } from '@/components/tkws/transfer-list'
import type { AIPrompt } from '@/lib/prompts'

const initialSource: TransferItem[] = [
  { id: '1', label: 'Marmoraria São Gabriel', meta: 'Granitos · BC/SC' },
  { id: '2', label: 'Madeireira Itajaí', meta: 'Marcenaria sob medida · Itajaí' },
  { id: '3', label: 'Iluminação Lúmen', meta: 'Cênica · SP' },
  { id: '4', label: 'Vidraçaria Pelotas', meta: 'Box e espelhos · RS' },
  { id: '5', label: 'Mosaico Pisos', meta: 'Cerâmica · Curitiba' },
  { id: '6', label: 'Docol Metais', meta: 'Acabamentos · Joinville' },
]

const initialTarget: TransferItem[] = [
  { id: '7', label: 'Marcenaria Sereno', meta: 'Premium · BC/SC' },
  { id: '8', label: 'Tintas Suvinil', meta: 'Tinta interna · SP' },
]

const prompt: AIPrompt = {
  componente: 'TransferList',
  import: "import { TransferList, type TransferItem } from '@/components/tkws/transfer-list'",
  contexto:
    'Dual-pane com busca em cada lado · move items entre Disponíveis ↔ Selecionados. Use para escolher fornecedores, equipe, tags, permissões. Suporta multi-seleção em cada pane antes de mover.',
  quandoUsar: [
    'Escolher fornecedores para uma cotação',
    'Atribuir equipe a um projeto',
    'Configurar permissões granulares',
  ],
  props: [
    { name: 'source / target', type: 'TransferItem[]', description: 'Listas controladas' },
    { name: 'onChange', type: '({source, target}) => void', description: 'Callback ao mover items' },
    { name: 'sourceTitle / targetTitle', type: 'string', description: 'Customiza headers' },
  ],
  antiPatterns: [
    'TransferList com < 5 items · use Checkbox simples',
    'TransferList sem busca em listas > 20 items',
  ],
  exemplo: `const [state, setState] = useState({ source: available, target: selected })

<TransferList
  source={state.source}
  target={state.target}
  onChange={setState}
  sourceTitle="Fornecedores cadastrados"
  targetTitle="Convidados para cotar"
/>`,
  relacionados: ['Combobox', 'ToggleGroup'],
}

export function TransferListPage() {
  const [state, setState] = useState({ source: initialSource, target: initialTarget })
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        num="22.3"
        category="Inputs · TransferList"
        title="Transfer List"
        italic="dual-pane · busca"
        description="Move items entre dois painéis com busca. Use para fornecedores, equipe, permissões."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Convidar fornecedores para cotação" />
      <Showcase>
        <TransferList
          source={state.source}
          target={state.target}
          onChange={setState}
          sourceTitle="Fornecedores cadastrados"
          targetTitle="Convidados para cotar"
        />
      </Showcase>
    </div>
  )
}

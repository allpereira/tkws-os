import { useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { FileInput } from '@/components/ui/file-input'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'FileInput',
  import: "import { FileInput } from '@/components/ui/file-input'",
  contexto:
    'Upload com react-dropzone · drag and drop ou clique. Lista de arquivos com tamanho formatado. Para uploads massivos com progress por arquivo, faça wrapper customizado com TanStack Query mutations.',
  quandoUsar: [
    'Upload de plantas, renders, contratos',
    'Anexo a comentários em obra',
    'Importação de planilhas (XLSX) com sheetjs',
  ],
  props: [
    { name: 'onDrop', type: '(files: File[]) => void', description: 'Callback dos arquivos aceitos' },
    { name: 'value', type: 'File[]', description: 'Lista controlada · mostra abaixo do dropzone' },
    { name: 'onRemove', type: '(file: File) => void', description: 'Remove arquivo da lista' },
    { name: 'accept · maxSize · multiple', type: 'DropzoneOptions', description: 'Repasse react-dropzone' },
  ],
  antiPatterns: [
    'FileInput sem accept · usuário envia arquivo errado e descobre tarde',
    'Sem maxSize · upload de 500MB trava UI',
  ],
  exemplo: `const [files, setFiles] = useState<File[]>([])

<FileInput
  value={files}
  onDrop={(accepted) => setFiles(f => [...f, ...accepted])}
  onRemove={(file) => setFiles(f => f.filter(x => x !== file))}
  accept={{ 'application/pdf': ['.pdf'], 'image/*': ['.png', '.jpg'] }}
  maxSize={10 * 1024 * 1024}
  multiple
  hint="PDF · JPG · PNG · até 10MB cada"
/>`,
  relacionados: ['Dropzone', 'Progress'],
}

export function FileInputPage() {
  const [files, setFiles] = useState<File[]>([])
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="07.13"
        category="Inputs · FileInput"
        title="File Input"
        italic="drag-and-drop · dropzone"
        description="Upload via react-dropzone. Sempre defina accept e maxSize."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Upload de plantas e renders" />
      <Showcase>
        <FileInput
          value={files}
          onDrop={(accepted) => {
            setFiles((f) => [...f, ...accepted])
            toast.success(`${accepted.length} arquivo(s) adicionado(s)`)
          }}
          onRemove={(file) => setFiles((f) => f.filter((x) => x !== file))}
          accept={{
            'application/pdf': ['.pdf'],
            'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
          }}
          maxSize={10 * 1024 * 1024}
          multiple
          label="Arraste plantas/renders ou clique"
          hint="PDF · PNG · JPG · até 10MB cada"
        />
      </Showcase>
    </div>
  )
}

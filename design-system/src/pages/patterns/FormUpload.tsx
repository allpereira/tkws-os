import { useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { FileInput } from '@/components/ui/file-input'
import { Input, Field, FieldHint } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Pattern · Form com Upload',
  import: '// Composição: FileInput + Progress + react-hook-form + presigned URL flow',
  contexto:
    'Padrão para forms que recebem arquivos · plantas, renders, contratos. Upload acontece em paralelo ao preenchimento · cada arquivo mostra Progress individual. Form só finaliza quando todos uploads terminam OU usuário marca "vincular depois".',
  quandoUsar: [
    'Upload de contratos no cadastro de cliente',
    'Plantas e renders no cadastro de projeto',
    'Anexos em punch list de obra',
  ],
  props: [],
  antiPatterns: [
    'Bloquear o form enquanto faz upload · UX trava',
    'Upload sem Progress · usuário não sabe se travou',
    'Sem retry · 1 arquivo falha, perdeu tudo',
  ],
  exemplo: `// 1) FileInput captura arquivos
// 2) Para cada arquivo: getPresignedUrl() → axios.put com onUploadProgress
// 3) Estado: { file, progress, status: 'uploading' | 'done' | 'error' }
// 4) Form fields independentes · usuário continua preenchendo
// 5) Submit só habilita quando todos uploads ok`,
  relacionados: ['FileInput', 'Form', 'Progress'],
}

export function FormUploadPattern() {
  const [files, setFiles] = useState<{ file: File; progress: number; status: 'uploading' | 'done' | 'error' }[]>([
    { file: { name: 'planta-baixa.pdf', size: 2_400_000 } as File, progress: 100, status: 'done' },
    { file: { name: 'render-living.png', size: 8_700_000 } as File, progress: 64, status: 'uploading' },
    { file: { name: 'contrato-assinado.pdf', size: 1_200_000 } as File, progress: 0, status: 'error' },
  ])

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="P10.2"
        category="Pattern · Form Upload"
        title="Form com Upload"
        italic="paralelo · com progress"
        description="Upload roda em paralelo ao preenchimento. Cada arquivo com Progress individual. Submit só quando todos terminam."
        tag="upload em paralelo"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Cadastro · documentos do projeto" />
      <Showcase>
        <form className="grid gap-5">
          <div className="grid grid-cols-2 gap-4 max-[760px]:grid-cols-1">
            <Field>
              <Label required>Nome do projeto</Label>
              <Input defaultValue="Yachthouse 2104" />
            </Field>
            <Field>
              <Label>Cliente</Label>
              <Input defaultValue="Família Andrade" />
            </Field>
          </div>

          <Field>
            <Label>Briefing curto</Label>
            <Textarea rows={3} placeholder="Resumo do projeto…" />
          </Field>

          <div>
            <Label>Documentos · plantas, renders, contratos</Label>
            <div className="mt-2">
              <FileInput
                onDrop={(accepted) =>
                  toast.success(`${accepted.length} arquivo(s) adicionado(s)`)
                }
                accept={{
                  'application/pdf': ['.pdf'],
                  'image/*': ['.png', '.jpg', '.jpeg'],
                }}
                maxSize={20 * 1024 * 1024}
                multiple
                hint="PDF · PNG · JPG · até 20MB cada"
              />
            </div>

            {/* Status por arquivo */}
            <ul className="mt-3 grid gap-2">
              {files.map((f, i) => (
                <li
                  key={i}
                  className="grid grid-cols-[1fr_120px_auto] items-center gap-3 rounded-lg border p-3"
                  style={{ background: 'var(--surface-2)', borderColor: 'var(--line-1)' }}
                >
                  <div className="min-w-0">
                    <div className="truncate text-[12.5px] font-semibold" style={{ color: 'var(--text)' }}>
                      {f.file.name}
                    </div>
                    <div className="mono text-[10px]" style={{ color: 'var(--text-mute)' }}>
                      {Math.round(f.file.size / 1024)} KB
                    </div>
                  </div>
                  <Progress
                    value={f.progress}
                    tone={f.status === 'error' ? 'danger' : f.status === 'done' ? 'success' : 'brand'}
                  />
                  <Badge tone={f.status === 'done' ? 'success' : f.status === 'error' ? 'danger' : 'brand'}>
                    {f.status === 'done' ? 'Pronto' : f.status === 'error' ? 'Retentar' : `${f.progress}%`}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <span className="mono text-[10.5px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
              2 de 3 uploads concluídos · 1 com erro
            </span>
            <div className="flex gap-2">
              <Button variant="ghost">Cancelar</Button>
              <Button disabled>Salvar projeto</Button>
            </div>
          </div>
        </form>
      </Showcase>
    </div>
  )
}

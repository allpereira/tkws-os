import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'AspectRatio',
  import: "import { AspectRatio } from '@/components/ui/aspect-ratio'",
  contexto:
    'Mantém proporção fixa do filho independente do width. Use para renders/plantas/cover de projetos · evita layout shift. Sempre prefira a tokens conhecidos: 4/5 (cover de projeto), 16/9 (render), 1/1 (avatar grande).',
  quandoUsar: [
    'Cover de projeto (4/5 retrato)',
    'Render / plant view (16/9)',
    'Thumb quadrada em grid (1/1)',
    'Vídeo embed (16/9)',
  ],
  props: [
    { name: 'ratio', type: 'number', description: 'Largura/altura · ex: 16/9, 4/5' },
  ],
  antiPatterns: [
    'Height fixo em imagem responsiva · use AspectRatio',
    'CSS aspect-ratio inline sem fallback · use o primitive',
  ],
  exemplo: `<AspectRatio ratio={16/9}>
  <img src={renderUrl} alt="Yachthouse 2104" className="h-full w-full rounded-xl object-cover" />
</AspectRatio>`,
  relacionados: ['Carousel', 'DetailHero'],
}

export function AspectRatioPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="11.9"
        category="Data Display · AspectRatio"
        title="Aspect Ratio"
        italic="proporção fixa"
        description="Mantém ratio fixo independente do width. Use 4/5 para cover de projeto, 16/9 para renders."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="3 ratios comuns" />
      <Showcase>
        <div className="grid grid-cols-3 gap-3 max-[760px]:grid-cols-1">
          {[
            { ratio: 16 / 9, label: '16/9 · render' },
            { ratio: 4 / 5, label: '4/5 · projeto' },
            { ratio: 1 / 1, label: '1/1 · thumb' },
          ].map((r) => (
            <div key={r.label}>
              <AspectRatio ratio={r.ratio}>
                <div
                  className="flex h-full w-full items-center justify-center rounded-xl"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--surface-2), var(--surface-4))',
                    color: 'var(--text-mute)',
                  }}
                >
                  <span className="mono text-[10.5px] font-bold uppercase tracking-[1.4px]">
                    {r.label}
                  </span>
                </div>
              </AspectRatio>
            </div>
          ))}
        </div>
      </Showcase>
    </div>
  )
}

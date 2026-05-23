import { useState } from 'react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Lightbox, LightboxTrigger, type LightboxImage } from '@/components/ui/lightbox'
import type { AIPrompt } from '@/lib/prompts'

const images: LightboxImage[] = [
  { alt: 'Living · Yachthouse 2104', caption: 'Living com pé direito duplo · luz natural maximizada', placeholderColor: 'linear-gradient(135deg, #103E66, #074F7E)' },
  { alt: 'Cozinha · cobre-bancada Quartzito', caption: 'Bancada em quartzito imperial · marcenaria sob medida', placeholderColor: 'linear-gradient(135deg, #0A2F4D, #1F6E8A)' },
  { alt: 'Master · vista para o mar', caption: 'Suíte master · 32 m² · vista frontal', placeholderColor: 'linear-gradient(135deg, #08263F, #5BA5C2)' },
  { alt: 'BWC Master · cuba esculpida', caption: 'Cuba em travertino esculpido · iluminação cênica', placeholderColor: 'linear-gradient(135deg, #0E3A5E, #BB6BD9)' },
]

const prompt: AIPrompt = {
  componente: 'Lightbox',
  import: "import { Lightbox, LightboxTrigger, type LightboxImage } from '@/components/ui/lightbox'",
  contexto:
    'Visualizador de imagem full-screen com navegação por setas/teclado, thumbs e captions. Use para renders, fotos de obra, moodboards. Estado controlado · você gerencia open/index para integrar com keyboard shortcuts e analytics.',
  quandoUsar: [
    'Galeria de renders do projeto',
    'Vistorias com fotos da obra',
    'Moodboards expandidos',
  ],
  props: [
    { name: 'images', type: 'LightboxImage[]', description: '{ src?, alt, caption?, placeholderColor? }' },
    { name: 'open / onOpenChange', type: 'controlled', description: 'Estado externo' },
    { name: 'index / onIndexChange', type: 'controlled', description: 'Imagem atual' },
  ],
  antiPatterns: [
    'Lightbox sem alt · acessibilidade quebra',
    'Sem suporte a teclado (←/→) · perde UX',
    'Carregar imagens sem lazy ou srcset · pesado',
  ],
  exemplo: `const [open, setOpen] = useState(false)
const [idx, setIdx] = useState(0)

<LightboxTrigger onClick={() => { setIdx(0); setOpen(true) }}>
  <img src={thumb1} alt="Living" />
</LightboxTrigger>

<Lightbox
  images={images}
  open={open}
  onOpenChange={setOpen}
  index={idx}
  onIndexChange={setIdx}
/>`,
  relacionados: ['Carousel', 'Dialog'],
}

export function LightboxPage() {
  const [open, setOpen] = useState(false)
  const [idx, setIdx] = useState(0)

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="11.14"
        category="Data Display · Lightbox"
        title="Lightbox"
        italic="renders · moodboards · obra"
        description="Visualizador full-screen com setas/teclado, thumbs e captions. Estado controlado."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Galeria · clique para abrir" />
      <Showcase>
        <div className="grid grid-cols-4 gap-3 max-[760px]:grid-cols-2">
          {images.map((img, i) => (
            <LightboxTrigger
              key={i}
              onClick={() => {
                setIdx(i)
                setOpen(true)
              }}
              className="aspect-square rounded-lg"
            >
              <div
                className="flex h-full w-full items-center justify-center"
                style={{ background: img.placeholderColor }}
              >
                <span
                  className="mono text-[10px] font-bold uppercase tracking-[1.4px]"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  {img.alt.split(' · ')[0]}
                </span>
              </div>
            </LightboxTrigger>
          ))}
        </div>

        <Lightbox images={images} open={open} onOpenChange={setOpen} index={idx} onIndexChange={setIdx} />
      </Showcase>
    </div>
  )
}

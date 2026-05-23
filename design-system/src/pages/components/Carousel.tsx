import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { AIPrompt } from '@/lib/prompts'

const slides = [
  { id: 1, title: 'Yachthouse 2104', meta: 'F. Andrade · 280 m²', color: 'linear-gradient(135deg, #103E66, #074F7E)' },
  { id: 2, title: 'Cobertura Titanium', meta: 'WS Group · 920 m²', color: 'linear-gradient(135deg, #0A2F4D, #1F6E8A)' },
  { id: 3, title: 'Vitra 1801', meta: 'F. Costa · 145 m²', color: 'linear-gradient(135deg, #08263F, #5BA5C2)' },
  { id: 4, title: 'Sky Resort', meta: 'F. Oz · 1200 m²', color: 'linear-gradient(135deg, #0E3A5E, #BB6BD9)' },
]

const prompt: AIPrompt = {
  componente: 'Carousel',
  import: "// Custom carousel · adapte com embla-carousel-react se precisar de gestos avançados",
  contexto:
    'Carrossel de imagens · use APENAS quando há real galeria visual (renders, moodboards). Para listas tabulares, use DataTable. Sempre tenha navegação por dots/setas e suporte touch swipe.',
  quandoUsar: [
    'Galeria de renders de projeto',
    'Moodboards · 3-8 imagens',
    'Onboarding com slides de feature',
  ],
  props: [
    { name: 'snap', type: 'boolean', description: 'Scroll snap por slide' },
  ],
  antiPatterns: [
    'Carousel para conteúdo textual (autoplay esconde info)',
    'Carousel infinito · perde contexto',
    'Sem indicadores (dots)',
  ],
  exemplo: `<Carousel snap>
  <CarouselSlide>render 1</CarouselSlide>
  <CarouselSlide>render 2</CarouselSlide>
</Carousel>`,
  relacionados: ['AspectRatio'],
}

export function CarouselPage() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const scrollTo = (i: number) => {
    if (!ref.current) return
    const child = ref.current.children[i] as HTMLElement | undefined
    if (child) {
      child.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
      setActive(i)
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="11.8"
        category="Data Display · Carousel"
        title="Carousel"
        italic="renders · moodboards"
        description="Use APENAS para conteúdo visual (galeria de imagens). Para listas, DataTable. Sempre com indicadores e swipe."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Galeria de renders" italic="scroll snap + dots" />
      <Showcase padding="none">
        <div className="relative">
          <div
            ref={ref}
            className="flex gap-3 overflow-x-auto p-5 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'none' }}
          >
            {slides.map((s, i) => (
              <div
                key={s.id}
                className="aspect-[16/10] w-[78%] shrink-0 snap-start overflow-hidden rounded-xl border p-6"
                style={{ background: s.color, borderColor: 'var(--line-2)' }}
                onScroll={() => setActive(i)}
              >
                <div className="flex h-full flex-col justify-end">
                  <div
                    className="mono text-[10px] font-bold uppercase tracking-[1.6px]"
                    style={{ color: 'rgba(255,255,255,0.6)' }}
                  >
                    Slide {s.id}
                  </div>
                  <div
                    className="serif text-[28px] font-light tracking-tight"
                    style={{ color: '#fff' }}
                  >
                    {s.title}
                  </div>
                  <div className="text-[12px]" style={{ color: 'rgba(255,255,255,0.75)' }}>
                    {s.meta}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t p-3" style={{ borderColor: 'var(--line-1)' }}>
            <div className="flex gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  aria-label={`Ir para slide ${i + 1}`}
                  className={cn('h-1.5 rounded-full transition-all')}
                  style={{
                    width: active === i ? 24 : 8,
                    background: active === i ? 'var(--brand)' : 'var(--line-3)',
                  }}
                />
              ))}
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                aria-label="Anterior"
                onClick={() => scrollTo(Math.max(0, active - 1))}
              >
                <ChevronLeft size={14} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label="Próximo"
                onClick={() => scrollTo(Math.min(slides.length - 1, active + 1))}
              >
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        </div>
      </Showcase>
    </div>
  )
}

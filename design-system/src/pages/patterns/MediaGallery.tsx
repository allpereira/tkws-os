import { useState } from 'react'
import { Download, Filter, Folder, ImageIcon, Maximize2, Share2 } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle'
import { Lightbox, LightboxTrigger, type LightboxImage } from '@/components/ui/lightbox'
import type { AIPrompt } from '@/lib/prompts'

const images: LightboxImage[] = [
  { alt: 'Living · vista frontal', caption: 'Living · vista frontal · render maio/2026', placeholderColor: 'linear-gradient(135deg, #103E66, #074F7E)' },
  { alt: 'Cozinha · bancada', caption: 'Cozinha · bancada quartzito imperial', placeholderColor: 'linear-gradient(135deg, #0A2F4D, #1F6E8A)' },
  { alt: 'Master · vista mar', caption: 'Master · vista para o mar · 32 m²', placeholderColor: 'linear-gradient(135deg, #08263F, #5BA5C2)' },
  { alt: 'BWC · cuba esculpida', caption: 'BWC Master · cuba travertino', placeholderColor: 'linear-gradient(135deg, #0E3A5E, #BB6BD9)' },
  { alt: 'Terraço · pôr-do-sol', caption: 'Terraço · 64 m² · vista 180°', placeholderColor: 'linear-gradient(135deg, #074F7E, #F178B6)' },
  { alt: 'Office · biblioteca', caption: 'Office · marcenaria piso ao teto', placeholderColor: 'linear-gradient(135deg, #103E66, #BB6BD9)' },
  { alt: 'Suíte 1', caption: 'Suíte 1 · vista lateral', placeholderColor: 'linear-gradient(135deg, #5BA5C2, #F2C94C)' },
  { alt: 'Suíte 2', caption: 'Suíte 2 · cabeceira', placeholderColor: 'linear-gradient(135deg, #1F6E8A, #74C7E4)' },
]

const folders = [
  { id: 'renders', label: 'Renders', count: 18, current: true },
  { id: 'plantas', label: 'Plantas', count: 6 },
  { id: 'moodboards', label: 'Moodboards', count: 4 },
  { id: 'obra', label: 'Fotos obra', count: 87 },
  { id: 'docs', label: 'Documentos', count: 14 },
]

const prompt: AIPrompt = {
  componente: 'Pattern · Media Gallery',
  import: '// Composição: Folder sidebar + grid + Lightbox',
  contexto:
    'Galeria de mídia · organizada por pastas (renders, plantas, moodboards, fotos de obra). Grid editorial · click abre Lightbox. Multi-seleção para download/share. Use react-pdf para gerar contact sheet.',
  quandoUsar: [
    'Aba "Mídia" do detalhe de projeto',
    'Galeria pública compartilhada com cliente',
    'Biblioteca de moodboards reutilizáveis',
  ],
  props: [],
  antiPatterns: [
    'Carregar todas as imagens em alta · sempre srcset + lazy',
    'Galeria sem alt · acessibilidade quebra',
    'Sem multi-seleção em galeria com 50+ items',
  ],
  exemplo: `// Grid 4-col com srcset
// Click → Lightbox controlado
// Multi-select: Shift+click ou Cmd+click
// Toolbar aparece quando há seleção (BulkActionBar)`,
  relacionados: ['Lightbox', 'Carousel', 'AspectRatio'],
}

export function MediaGalleryPattern() {
  const [open, setOpen] = useState(false)
  const [idx, setIdx] = useState(0)

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        num="P19"
        category="Pattern · Media Gallery"
        title="Media Gallery"
        italic="renders · plantas · obra"
        description="Galeria organizada por pastas. Click abre Lightbox. Use srcset + lazy loading."
        tag="tela completa"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Galeria do projeto · Yachthouse 2104" />
      <Showcase padding="none">
        <div className="grid grid-cols-[240px_1fr] max-[900px]:grid-cols-1" style={{ minHeight: 540 }}>
          {/* Folders sidebar */}
          <aside className="border-r p-4 max-[900px]:border-r-0 max-[900px]:border-b" style={{ borderColor: 'var(--line-1)' }}>
            <div className="mono mb-3 text-[10.5px] font-bold uppercase tracking-[1.6px]" style={{ color: 'var(--text-mute)' }}>
              Pastas
            </div>
            <ul className="flex flex-col gap-1">
              {folders.map((f) => (
                <li key={f.id}>
                  <button
                    className="grid w-full grid-cols-[20px_1fr_auto] items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[13px] font-medium transition-colors"
                    style={{
                      background: f.current ? 'var(--brand-soft)' : 'transparent',
                      color: f.current ? 'var(--brand)' : 'var(--text-soft)',
                    }}
                  >
                    <Folder size={14} />
                    <span>{f.label}</span>
                    <Badge tone={f.current ? 'brand' : 'neutral'}>{f.count}</Badge>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div>
            <div
              className="flex items-center justify-between border-b p-4"
              style={{ borderColor: 'var(--line-1)' }}
            >
              <div className="flex items-center gap-3">
                <span className="serif text-[20px] font-normal tracking-tight" style={{ color: 'var(--text)' }}>
                  Renders
                </span>
                <Badge tone="brand">{images.length}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <ToggleGroup type="single" defaultValue="grid">
                  <ToggleGroupItem value="grid" size="sm">Grid</ToggleGroupItem>
                  <ToggleGroupItem value="contact" size="sm">Contact</ToggleGroupItem>
                </ToggleGroup>
                <Button variant="outline" size="sm">
                  <Filter size={12} /> Filtros
                </Button>
                <Button size="sm">
                  <Download size={12} /> Download
                </Button>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-4 gap-3 p-4 max-[760px]:grid-cols-2">
              {images.map((img, i) => (
                <LightboxTrigger
                  key={i}
                  onClick={() => {
                    setIdx(i)
                    setOpen(true)
                  }}
                  className="aspect-[4/5] rounded-lg"
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
          </div>
        </div>
      </Showcase>

      <SubHead num="B" title="Empty state · pasta vazia" />
      <Showcase>
        <Card>
          <CardContent className="!p-8 text-center">
            <ImageIcon size={32} style={{ color: 'var(--text-mute)' }} className="mx-auto" />
            <div className="serif mt-3 text-[20px] font-light tracking-tight" style={{ color: 'var(--text)' }}>
              Pasta vazia
            </div>
            <p className="mx-auto mt-2 max-w-md text-[13px]" style={{ color: 'var(--text-soft)' }}>
              Faça upload de renders, plantas ou fotos de obra. Aceitamos PNG, JPG e PDF até 20MB cada.
            </p>
            <Button className="mt-4">Fazer upload</Button>
          </CardContent>
        </Card>
      </Showcase>
    </div>
  )
}

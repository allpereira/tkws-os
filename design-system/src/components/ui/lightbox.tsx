import * as React from 'react'
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react'
import { Dialog, DialogContent } from './dialog'
import { Button } from './button'
import { cn } from '@/lib/utils'

export interface LightboxImage {
  src?: string
  alt: string
  /** Caption opcional */
  caption?: string
  /** placeholder se não houver src · cor de fundo */
  placeholderColor?: string
}

export interface LightboxProps {
  images: LightboxImage[]
  open: boolean
  onOpenChange: (open: boolean) => void
  /** índice atual · controlado */
  index: number
  onIndexChange: (i: number) => void
}

export function Lightbox({ images, open, onOpenChange, index, onIndexChange }: LightboxProps) {
  const current = images[index]

  React.useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') onIndexChange(Math.min(images.length - 1, index + 1))
      if (e.key === 'ArrowLeft') onIndexChange(Math.max(0, index - 1))
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, index, images.length, onIndexChange])

  if (!current) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="!max-w-screen !top-0 !left-0 !translate-x-0 !translate-y-0 !h-screen !w-screen !rounded-none !p-0"
        style={{ background: 'rgba(6,24,40,0.96)', borderColor: 'transparent', height: '100vh', width: '100vw', maxWidth: 'none' }}
      >
        {/* Top bar */}
        <div className="absolute top-0 right-0 left-0 z-10 flex items-center justify-between p-5">
          <div className="mono text-[11px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-soft)' }}>
            {index + 1} / {images.length} · {current.alt}
          </div>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} aria-label="Fechar">
            <X size={16} />
          </Button>
        </div>

        {/* Image */}
        <div className="flex h-full w-full items-center justify-center">
          {current.src ? (
            <img
              src={current.src}
              alt={current.alt}
              className="max-h-[80vh] max-w-[80vw] object-contain"
            />
          ) : (
            <div
              className="flex aspect-[3/2] w-[70vw] max-w-4xl items-center justify-center rounded-lg"
              style={{
                background: current.placeholderColor ?? 'linear-gradient(135deg, var(--surface-3) 0%, var(--surface-4) 60%, var(--brand-soft) 100%)',
              }}
            >
              <span className="mono text-[12px] font-bold uppercase tracking-[1.6px]" style={{ color: 'var(--text-mute)' }}>
                {current.alt}
              </span>
            </div>
          )}
        </div>

        {/* Navegação */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onIndexChange(Math.max(0, index - 1))}
          disabled={index === 0}
          aria-label="Anterior"
          className={cn('absolute top-1/2 left-5 -translate-y-1/2')}
        >
          <ChevronLeft size={20} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onIndexChange(Math.min(images.length - 1, index + 1))}
          disabled={index === images.length - 1}
          aria-label="Próxima"
          className={cn('absolute top-1/2 right-5 -translate-y-1/2')}
        >
          <ChevronRight size={20} />
        </Button>

        {/* Caption */}
        {current.caption && (
          <div className="absolute right-0 bottom-0 left-0 p-6 text-center">
            <p className="serif text-[16px] font-light tracking-tight" style={{ color: 'var(--text)' }}>
              {current.caption}
            </p>
          </div>
        )}

        {/* Thumbs */}
        <div className="absolute right-0 bottom-20 left-0 flex justify-center gap-2 px-4">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => onIndexChange(i)}
              className={cn(
                'h-10 w-14 cursor-pointer overflow-hidden rounded-md border-2 transition-all',
                i === index ? 'opacity-100' : 'opacity-50 hover:opacity-80'
              )}
              style={{
                borderColor: i === index ? 'var(--brand)' : 'transparent',
                background: img.placeholderColor ?? 'var(--surface-3)',
              }}
              aria-label={`Imagem ${i + 1}`}
            >
              {img.src && <img src={img.src} alt={img.alt} className="h-full w-full object-cover" />}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

/** Trigger pequeno para abrir Lightbox a partir de uma thumb. */
export function LightboxTrigger({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode
  onClick: () => void
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn('group relative cursor-pointer overflow-hidden', className)}
    >
      {children}
      <span
        className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
        style={{ background: 'rgba(6,24,40,0.45)' }}
      >
        <Maximize2 size={18} style={{ color: '#fff' }} />
      </span>
    </button>
  )
}

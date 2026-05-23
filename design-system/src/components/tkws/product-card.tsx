import * as React from 'react'
import { Heart, ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * ProductCard · cartão de produto fiel ao ds-product-card do HTML.
 *
 *   • aspect-ratio 4/5 na imagem · gradient overlay no bottom
 *   • Badge-top no canto esquerdo (4 cores: brand/sale=danger/new=success/featured=purple/exclusive=warning)
 *   • Wish button (heart) no canto direito · circular · backdrop blur
 *   • Quick-add button no bottom da imagem · OPACITY 0 default · aparece em hover
 *   • Swatches mini (color dots) no bottom · ESCONDE em hover (dá lugar ao quick-add)
 *   • Body: code (mono) · nm (Fraunces 16px) · supplier (mono) · rating · price-row · stock
 *
 * Variantes:
 *   • default: grid card
 *   • featured: 2 col × 2 row · imagem aspect 1:1 · nome 24px
 *   • list: horizontal · 140px image + body + actions column
 */

export type ProductBadgeTone = 'brand' | 'sale' | 'new' | 'featured' | 'exclusive'

const badgeColor: Record<ProductBadgeTone, { bg: string; color: string }> = {
  brand: { bg: 'var(--brand)', color: 'var(--bg)' },
  sale: { bg: 'var(--danger)', color: '#fff' },
  new: { bg: 'var(--success)', color: 'var(--bg)' },
  featured: { bg: 'var(--purple)', color: 'var(--bg)' },
  exclusive: { bg: 'var(--warning)', color: 'var(--bg)' },
}

export type StockState = 'in' | 'warn' | 'out' | 'order'
const stockConfig: Record<StockState, { label: string; color: string }> = {
  in: { label: 'Em estoque', color: 'var(--success)' },
  warn: { label: 'Últimas peças', color: 'var(--warning)' },
  out: { label: 'Esgotado', color: 'var(--danger)' },
  order: { label: 'Sob encomenda', color: 'var(--brand)' },
}

export interface ProductCardProps {
  /** Código curto · ex: "MRMR-0142" */
  code?: string
  /** Nome · serif com suporte a italic via <em> */
  name: React.ReactNode
  /** Fornecedor */
  supplier?: string
  /** Preço atual · em centavos */
  price: number
  /** Preço de · risco · em centavos */
  priceOld?: number
  /** Unidade do preço · "/ m²", "/ un" */
  priceUnit?: string
  /** Avaliação 0-5 */
  rating?: { stars: number; count: number }
  /** Estoque */
  stock?: { state: StockState; customLabel?: string }
  /** Badge no canto da imagem */
  badge?: { label: string; tone: ProductBadgeTone }
  /** Cores disponíveis (mini swatches no canto inferior) */
  swatches?: string[]
  /** Placeholder color/gradient para a imagem · usa quando não há src */
  imagePlaceholder?: string
  /** Imagem (opcional) */
  imageSrc?: string
  /** Variant */
  variant?: 'default' | 'featured' | 'list'
  wished?: boolean
  onWish?: () => void
  onAddToCart?: () => void
  onClick?: () => void
  className?: string
}

function formatBRL(cents: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(cents / 100)
}

export function ProductCard({
  code,
  name,
  supplier,
  price,
  priceOld,
  priceUnit,
  rating,
  stock,
  badge,
  swatches,
  imagePlaceholder,
  imageSrc,
  variant = 'default',
  wished,
  onWish,
  onAddToCart,
  onClick,
  className,
}: ProductCardProps) {
  const isList = variant === 'list'
  const stockC = stock ? stockConfig[stock.state] : null
  const save = priceOld && price < priceOld ? Math.round(((priceOld - price) / priceOld) * 100) : 0

  return (
    <article
      onClick={onClick}
      className={cn(
        'group relative flex cursor-pointer overflow-hidden rounded-[12px] border',
        isList ? 'flex-row' : 'flex-col',
        variant === 'featured' && 'sm:col-span-2 sm:row-span-2',
        className
      )}
      style={{
        background: 'var(--surface-1)',
        borderColor: 'var(--line-2)',
        transition: 'all 0.22s cubic-bezier(.4,.2,.2,1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = 'var(--shadow-3)'
        e.currentTarget.style.borderColor = 'var(--line-3)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = ''
        e.currentTarget.style.borderColor = 'var(--line-2)'
      }}
    >
      {/* IMAGE */}
      <div
        className={cn(
          'relative overflow-hidden',
          isList ? 'h-full w-[140px] shrink-0' : '',
        )}
        style={{
          aspectRatio: isList ? '1 / 1' : variant === 'featured' ? '1 / 1' : '4 / 5',
          background: imagePlaceholder ?? 'var(--surface-3)',
        }}
      >
        {imageSrc && <img src={imageSrc} alt="" className="h-full w-full object-cover" />}

        {/* Gradient overlay no bottom */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.3))',
          }}
        />

        {/* Badge top esquerdo */}
        {badge && (
          <span
            className="mono absolute top-2.5 left-2.5 rounded-[4px] px-2 py-1 text-[9.5px] font-extrabold uppercase tracking-[0.8px]"
            style={{ background: badgeColor[badge.tone].bg, color: badgeColor[badge.tone].color, zIndex: 1 }}
          >
            {badge.label}
          </span>
        )}

        {/* Wish · canto direito */}
        {onWish !== undefined && (
          <button
            type="button"
            aria-label={wished ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            onClick={(e) => {
              e.stopPropagation()
              onWish?.()
            }}
            className="absolute top-2.5 right-2.5 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full backdrop-blur transition-all hover:scale-105"
            style={{
              background: wished ? 'var(--danger)' : 'rgba(6,24,40,0.7)',
              border: wished ? '1px solid var(--danger)' : '1px solid var(--line-2)',
              color: wished ? '#fff' : 'var(--text)',
              zIndex: 1,
            }}
          >
            <Heart size={14} strokeWidth={1.8} fill={wished ? 'currentColor' : 'none'} />
          </button>
        )}

        {/* Swatches mini · ESCONDEM em hover (dá lugar ao quick-add) */}
        {swatches && swatches.length > 0 && (
          <div
            className="absolute bottom-2.5 left-2.5 inline-flex gap-[3px] transition-opacity group-hover:opacity-0"
            style={{ zIndex: 1 }}
          >
            {swatches.slice(0, 5).map((c, i) => (
              <span
                key={i}
                className="h-3.5 w-3.5 rounded-full"
                style={{ background: c, border: '2px solid #fff', boxShadow: '0 0 0 1px rgba(0,0,0,0.2)' }}
              />
            ))}
            {swatches.length > 5 && (
              <span
                className="mono inline-flex h-3.5 items-center justify-center rounded-full px-1 text-[8px] font-bold"
                style={{ background: 'rgba(6,24,40,0.8)', color: '#fff' }}
              >
                +{swatches.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Quick add · OPACITY 0 default, opacity 1 em hover */}
        {onAddToCart && !isList && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onAddToCart?.()
            }}
            className="absolute right-2.5 bottom-2.5 left-2.5 inline-flex translate-y-2 items-center justify-center gap-1.5 rounded-[8px] border-0 px-3 py-2.5 text-[12px] font-bold opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"
            style={{
              background: 'var(--bg)',
              color: 'var(--text)',
              fontFamily: 'inherit',
              transitionTimingFunction: 'cubic-bezier(.4,.2,.2,1)',
              transitionDuration: '0.22s',
              zIndex: 1,
            }}
          >
            <ShoppingCart size={12} strokeWidth={2} /> Adicionar
          </button>
        )}
      </div>

      {/* BODY */}
      <div
        className={cn(
          'flex flex-1 flex-col gap-1.5',
          isList ? 'p-4 px-5' : 'p-3.5'
        )}
      >
        {code && (
          <div className="mono text-[10px] font-semibold uppercase tracking-[1px]" style={{ color: 'var(--text-mute)' }}>
            {code}
          </div>
        )}
        <h4
          className={cn(
            'serif font-normal leading-[1.2]',
            variant === 'featured' ? 'text-[24px]' : 'text-[16px]'
          )}
          style={{ color: 'var(--text)', letterSpacing: '-0.015em' }}
        >
          {name}
        </h4>
        {supplier && (
          <div className="mono text-[10px]" style={{ color: 'var(--text-mute)', letterSpacing: '0.3px' }}>
            {supplier}
          </div>
        )}
        {rating && (
          <div className="mt-0.5 flex items-center gap-1.5">
            <span className="inline-flex items-center" style={{ color: 'var(--warning)', fontSize: 11, letterSpacing: '-1px' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ color: i < Math.round(rating.stars) ? 'var(--warning)' : 'var(--line-3)' }}>
                  ★
                </span>
              ))}
            </span>
            <span className="mono text-[10px]" style={{ color: 'var(--text-mute)' }}>
              {rating.stars.toFixed(1)} · ({rating.count})
            </span>
          </div>
        )}

        {/* Price row */}
        <div
          className="mt-1.5 flex flex-wrap items-baseline gap-2 border-t pt-2"
          style={{ borderColor: 'var(--line-1)' }}
        >
          <span
            className="serif font-normal"
            style={{ color: 'var(--text)', fontSize: 19, letterSpacing: '-0.02em' }}
          >
            {formatBRL(price)}
            {priceUnit && (
              <em className="italic" style={{ color: 'var(--text-soft)', fontSize: 11, fontWeight: 400 }}>
                {' '}
                {priceUnit}
              </em>
            )}
          </span>
          {priceOld && (
            <span className="mono text-[11px] line-through" style={{ color: 'var(--text-mute)' }}>
              {formatBRL(priceOld)}
            </span>
          )}
          {save > 0 && (
            <span className="mono ml-auto text-[10px] font-bold" style={{ color: 'var(--success)' }}>
              -{save}%
            </span>
          )}
        </div>

        {stockC && (
          <div className="mono flex items-center gap-1.5 text-[10px]" style={{ color: stockC.color, letterSpacing: '0.5px' }}>
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: stockC.color }} />
            {stock?.customLabel ?? stockC.label}
          </div>
        )}
      </div>

      {/* ACTIONS column · só para variant list */}
      {isList && (
        <div
          className="flex flex-col justify-center gap-2 border-l p-4 px-5"
          style={{ borderColor: 'var(--line-1)', minWidth: 200 }}
        >
          {onAddToCart && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAddToCart?.()
              }}
              className="inline-flex items-center justify-center gap-1.5 rounded-[10px] border-0 px-4 py-2 text-[13px] font-bold transition-all hover:brightness-110"
              style={{ background: 'var(--brand)', color: 'var(--bg)' }}
            >
              <ShoppingCart size={13} strokeWidth={2} /> Adicionar
            </button>
          )}
          {onWish !== undefined && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onWish?.()
              }}
              className="inline-flex items-center justify-center gap-1.5 rounded-[10px] border px-4 py-2 text-[12.5px] font-semibold transition-all hover:brightness-110"
              style={{
                background: wished ? 'var(--brand-soft)' : 'transparent',
                borderColor: wished ? 'var(--brand)' : 'var(--line-2)',
                color: wished ? 'var(--brand)' : 'var(--text-soft)',
              }}
            >
              <Heart size={13} strokeWidth={1.8} fill={wished ? 'currentColor' : 'none'} />
              {wished ? 'Salvo' : 'Favoritar'}
            </button>
          )}
        </div>
      )}
    </article>
  )
}

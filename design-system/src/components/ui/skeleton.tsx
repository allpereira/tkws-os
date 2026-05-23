import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Fiel ao HTML · ds-skel:
 *   gradient surface-2 → surface-3 → surface-2 · animation shimmer 1.5s
 *   radius 6px default
 */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-shimmer rounded-[6px]', className)} {...props} />
}

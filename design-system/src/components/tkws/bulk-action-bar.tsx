import * as React from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export interface BulkActionBarProps {
  count: number
  onClear: () => void
  children: React.ReactNode
}

export function BulkActionBar({ count, onClear, children }: BulkActionBarProps) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2, ease: [0.4, 0.2, 0.2, 1] }}
          className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2"
        >
          <div
            className="flex items-center gap-3 rounded-full border px-3 py-2 shadow-2xl backdrop-blur-lg"
            style={{
              background: 'rgba(10,47,77,0.94)',
              borderColor: 'var(--brand)',
            }}
          >
            <button
              onClick={onClear}
              aria-label="Limpar seleção"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:brightness-125"
              style={{ background: 'var(--surface-3)', color: 'var(--text-soft)' }}
            >
              <X size={14} />
            </button>
            <span
              className="mono text-[11px] font-bold uppercase tracking-wider"
              style={{ color: 'var(--brand)' }}
            >
              {count} selecionados
            </span>
            <span className="h-5 w-px" style={{ background: 'var(--line-2)' }} />
            <div className="flex items-center gap-2">{children}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

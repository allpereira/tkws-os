import * as React from 'react'
import { useDropzone, type DropzoneOptions } from 'react-dropzone'
import { File as FileIcon, Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FileInputProps extends Omit<DropzoneOptions, 'onDrop'> {
  onDrop?: (files: File[]) => void
  value?: File[]
  onRemove?: (file: File) => void
  className?: string
  /** Label customizado · default "Arraste arquivos ou clique para selecionar" */
  label?: string
  hint?: string
}

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / (1024 * 1024)).toFixed(1)} MB`
}

export function FileInput({
  onDrop,
  value = [],
  onRemove,
  className,
  label = 'Arraste arquivos ou clique para selecionar',
  hint,
  ...dropzoneOptions
}: FileInputProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    ...dropzoneOptions,
  })

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-7 text-center transition-colors'
        )}
        style={{
          borderColor: isDragActive ? 'var(--brand)' : 'var(--line-2)',
          background: isDragActive ? 'var(--brand-soft)' : 'var(--surface-1)',
        }}
      >
        <input {...getInputProps()} />
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}
        >
          <Upload size={18} strokeWidth={1.7} />
        </span>
        <span className="text-[13.5px] font-semibold" style={{ color: 'var(--text)' }}>
          {label}
        </span>
        {hint && (
          <span className="mono text-[10.5px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
            {hint}
          </span>
        )}
      </div>

      {value.length > 0 && (
        <ul className="grid gap-1.5">
          {value.map((f, i) => (
            <li
              key={i}
              className="flex items-center gap-3 rounded-md border px-3 py-2"
              style={{ background: 'var(--surface-2)', borderColor: 'var(--line-1)' }}
            >
              <FileIcon size={14} style={{ color: 'var(--brand)' }} />
              <div className="min-w-0 flex-1">
                <div
                  className="truncate text-[12.5px] font-semibold"
                  style={{ color: 'var(--text)' }}
                >
                  {f.name}
                </div>
                <div className="mono text-[10px]" style={{ color: 'var(--text-mute)' }}>
                  {formatBytes(f.size)}
                </div>
              </div>
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(f)}
                  aria-label="Remover"
                  className="inline-flex h-6 w-6 items-center justify-center rounded-md transition-colors hover:brightness-125"
                  style={{ color: 'var(--text-mute)' }}
                >
                  <X size={13} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

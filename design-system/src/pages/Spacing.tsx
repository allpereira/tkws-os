import { PageHeader } from '@/components/docs/PageHeader'
import { SubHead, Showcase } from '@/components/docs/Showcase'

const gutters = [
  { token: '--gutter-lg', value: '140px', use: 'Entre seções editoriais' },
  { token: '--gutter-md', value: '100px', use: 'Seções normais' },
  { token: '--gutter-sm', value: '60px', use: 'Sub-seções' },
]

const radii = [
  { value: '4px', use: 'pills, badges, mini-chips' },
  { value: '6–8px', use: 'buttons, list items, inputs' },
  { value: '10–12px', use: 'cards, panels' },
  { value: '14px', use: 'dialogs, modals' },
  { value: '999px', use: 'pills perfectly rounded' },
  { value: '50%', use: 'avatars' },
]

const padding = [
  { token: 'Card padding', value: '20–28px', use: 'Cards e panels' },
  { token: 'Stack gap', value: '8–16px', use: 'Entre itens de lista' },
  { token: 'Inline gap', value: '6–10px', use: 'Entre badges, chips' },
]

export function SpacingPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="06"
        category="Fundamentos · Espaçamento & Radius"
        title="Whitespace radical."
        italic="Densidade só quando exigida."
        description="140px entre seções editoriais. 60px nas sub-seções. Densidade na operação (datatables, kanban), respiro no editorial (hero, manifesto)."
        tag="ritmo + radius"
      />

      <SubHead num="06.1" title="Gutters" italic="ritmo entre seções" />
      <div className="grid gap-3">
        {gutters.map((g) => (
          <div
            key={g.token}
            className="grid grid-cols-[200px_1fr] items-center gap-4 rounded-xl border p-4"
            style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}
          >
            <div>
              <code className="mono text-[12px] font-bold" style={{ color: 'var(--brand)' }}>
                {g.token}
              </code>
              <div className="mono mt-1 text-[10.5px]" style={{ color: 'var(--text-mute)' }}>
                {g.value} · {g.use}
              </div>
            </div>
            <div className="relative h-3 overflow-hidden rounded" style={{ background: 'var(--surface-3)' }}>
              <div
                className="h-full"
                style={{
                  background: 'var(--brand-soft)',
                  width: g.value,
                  maxWidth: '100%',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <SubHead num="06.2" title="Padding internos" />
      <Showcase
        title="Tokens de padding"
        description="Aplicados consistentemente em cards, listas e badges."
      >
        <div className="grid gap-3">
          {padding.map((p) => (
            <div
              key={p.token}
              className="grid grid-cols-[200px_120px_1fr] items-center gap-4 text-[13px]"
              style={{ color: 'var(--text-soft)' }}
            >
              <b style={{ color: 'var(--text)' }}>{p.token}</b>
              <code className="mono" style={{ color: 'var(--brand)' }}>
                {p.value}
              </code>
              <span>{p.use}</span>
            </div>
          ))}
        </div>
      </Showcase>

      <SubHead num="06.3" title="Border radius" italic="6 níveis" />
      <div className="grid grid-cols-3 gap-3 max-[760px]:grid-cols-2">
        {radii.map((r) => (
          <div
            key={r.value}
            className="flex flex-col items-center gap-2 rounded-xl border p-5 text-center"
            style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}
          >
            <div
              className="h-16 w-16"
              style={{
                background: 'var(--brand-soft)',
                border: '2px solid var(--brand)',
                borderRadius: r.value,
              }}
            />
            <code className="mono text-[12px] font-bold" style={{ color: 'var(--brand)' }}>
              {r.value}
            </code>
            <div className="text-[11.5px]" style={{ color: 'var(--text-mute)' }}>
              {r.use}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

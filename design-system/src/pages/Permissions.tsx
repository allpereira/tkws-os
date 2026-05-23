import { Check, Eye, Lock, X } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { SubHead } from '@/components/docs/Showcase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type Perm = 'C' | 'R' | 'U' | 'D' | '-'

const roles = ['Diretor', 'COO', 'CFO', 'Líder Squad', 'Arquiteto', 'Cliente', 'Fornecedor'] as const
type Role = typeof roles[number]

interface Resource {
  resource: string
  cat: string
  perms: Record<Role, Perm[]>
}

const matrix: Resource[] = [
  {
    resource: 'Projetos',
    cat: 'CRUD',
    perms: {
      Diretor: ['C', 'R', 'U', 'D'],
      COO: ['C', 'R', 'U', 'D'],
      CFO: ['R'],
      'Líder Squad': ['C', 'R', 'U'],
      Arquiteto: ['R', 'U'],
      Cliente: ['R'],
      Fornecedor: ['-'],
    },
  },
  {
    resource: 'Clientes',
    cat: 'CRUD',
    perms: {
      Diretor: ['C', 'R', 'U', 'D'],
      COO: ['C', 'R', 'U'],
      CFO: ['R'],
      'Líder Squad': ['R'],
      Arquiteto: ['R'],
      Cliente: ['-'],
      Fornecedor: ['-'],
    },
  },
  {
    resource: 'Orçamentos',
    cat: 'Financeiro',
    perms: {
      Diretor: ['C', 'R', 'U', 'D'],
      COO: ['C', 'R', 'U'],
      CFO: ['R', 'U'],
      'Líder Squad': ['C', 'R', 'U'],
      Arquiteto: ['R'],
      Cliente: ['R'],
      Fornecedor: ['-'],
    },
  },
  {
    resource: 'Notas Fiscais',
    cat: 'Financeiro',
    perms: {
      Diretor: ['C', 'R', 'U', 'D'],
      COO: ['R'],
      CFO: ['C', 'R', 'U', 'D'],
      'Líder Squad': ['R'],
      Arquiteto: ['-'],
      Cliente: ['R'],
      Fornecedor: ['C', 'R'],
    },
  },
  {
    resource: 'Briefings',
    cat: 'Projeto',
    perms: {
      Diretor: ['C', 'R', 'U', 'D'],
      COO: ['R'],
      CFO: ['-'],
      'Líder Squad': ['C', 'R', 'U'],
      Arquiteto: ['C', 'R', 'U'],
      Cliente: ['R', 'U'],
      Fornecedor: ['-'],
    },
  },
  {
    resource: 'Spec / Catálogo',
    cat: 'Projeto',
    perms: {
      Diretor: ['C', 'R', 'U', 'D'],
      COO: ['C', 'R', 'U'],
      CFO: ['R'],
      'Líder Squad': ['C', 'R', 'U'],
      Arquiteto: ['C', 'R', 'U'],
      Cliente: ['-'],
      Fornecedor: ['R'],
    },
  },
  {
    resource: 'Obra / Punch list',
    cat: 'Operação',
    perms: {
      Diretor: ['R'],
      COO: ['C', 'R', 'U', 'D'],
      CFO: ['-'],
      'Líder Squad': ['C', 'R', 'U'],
      Arquiteto: ['C', 'R', 'U'],
      Cliente: ['R'],
      Fornecedor: ['R', 'U'],
    },
  },
  {
    resource: 'Cotações (fornecedor)',
    cat: 'Operação',
    perms: {
      Diretor: ['R', 'U'],
      COO: ['C', 'R', 'U'],
      CFO: ['R'],
      'Líder Squad': ['C', 'R'],
      Arquiteto: ['R'],
      Cliente: ['-'],
      Fornecedor: ['C', 'R', 'U'],
    },
  },
  {
    resource: 'Squads · membros',
    cat: 'Admin',
    perms: {
      Diretor: ['C', 'R', 'U', 'D'],
      COO: ['C', 'R', 'U'],
      CFO: ['R'],
      'Líder Squad': ['R'],
      Arquiteto: ['R'],
      Cliente: ['-'],
      Fornecedor: ['-'],
    },
  },
  {
    resource: 'Configurações da org',
    cat: 'Admin',
    perms: {
      Diretor: ['C', 'R', 'U', 'D'],
      COO: ['R', 'U'],
      CFO: ['R'],
      'Líder Squad': ['-'],
      Arquiteto: ['-'],
      Cliente: ['-'],
      Fornecedor: ['-'],
    },
  },
]

const permColor: Record<Perm, { bg: string; color: string; label: string }> = {
  C: { bg: 'rgba(95,217,165,0.18)', color: 'var(--success)', label: 'C' },
  R: { bg: 'var(--brand-soft)', color: 'var(--brand)', label: 'R' },
  U: { bg: 'rgba(242,201,76,0.18)', color: 'var(--warning)', label: 'U' },
  D: { bg: 'rgba(235,87,87,0.14)', color: 'var(--danger)', label: 'D' },
  '-': { bg: 'transparent', color: 'var(--text-mute)', label: '—' },
}

export function PermissionsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        num="P37"
        category="Documentação · Permissões"
        title="Matriz de permissões"
        italic="RBAC · 7 roles"
        description="Define o que cada role pode fazer com cada recurso. C = criar, R = ler, U = atualizar, D = deletar. Validação dupla: front (esconde ações) + back (rejeita 403)."
        tag={`${roles.length} roles · ${matrix.length} recursos`}
      />

      {/* Legenda */}
      <div className="mb-6 flex flex-wrap gap-2">
        {Object.entries(permColor)
          .filter(([k]) => k !== '-')
          .map(([k, v]) => (
            <span
              key={k}
              className="inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px]"
              style={{ background: v.bg, borderColor: v.color, color: v.color }}
            >
              <span className="mono font-bold">{v.label}</span>
              <span>
                {k === 'C' && 'Criar'}
                {k === 'R' && 'Ler'}
                {k === 'U' && 'Atualizar'}
                {k === 'D' && 'Deletar'}
              </span>
            </span>
          ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Matriz por recurso × role</CardTitle>
          <Badge tone="brand">{matrix.length} recursos</Badge>
        </CardHeader>
        <CardContent className="!p-0 overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ background: 'var(--surface-2)' }}>
                <th className="mono px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                  Recurso
                </th>
                {roles.map((r) => (
                  <th
                    key={r}
                    className="mono px-3 py-2.5 text-center text-[10px] font-bold uppercase tracking-[1.4px]"
                    style={{ color: 'var(--text-mute)' }}
                  >
                    {r}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, i) => (
                <tr
                  key={row.resource}
                  className="border-t"
                  style={{ borderColor: 'var(--line-1)', background: i % 2 === 0 ? 'var(--surface-1)' : 'transparent' }}
                >
                  <td className="px-3 py-2.5">
                    <div className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>
                      {row.resource}
                    </div>
                    <div className="mono text-[10px]" style={{ color: 'var(--text-mute)' }}>
                      {row.cat}
                    </div>
                  </td>
                  {roles.map((r) => {
                    const perms = row.perms[r]
                    return (
                      <td key={r} className="px-3 py-2.5 text-center">
                        {perms[0] === '-' ? (
                          <Lock size={11} style={{ color: 'var(--text-mute)' }} className="mx-auto" />
                        ) : (
                          <div className="flex flex-wrap justify-center gap-1">
                            {perms.map((p) => {
                              const c = permColor[p]
                              return (
                                <span
                                  key={p}
                                  className="mono inline-flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold"
                                  style={{ background: c.bg, color: c.color }}
                                >
                                  {c.label}
                                </span>
                              )
                            })}
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <SubHead num="A" title="Princípios" italic="security mindset" />
      <div className="grid grid-cols-3 gap-3 max-[760px]:grid-cols-1">
        {[
          { ic: <Eye size={18} />, title: 'Default · negar', desc: 'Tudo bloqueado a menos que tenha permissão explícita.' },
          { ic: <Check size={18} />, title: 'Front + back', desc: 'Front esconde ações que usuário não pode fazer. Back retorna 403 mesmo assim.' },
          { ic: <X size={18} />, title: 'Sem fallback "admin"', desc: 'Roles têm permissões explícitas. Sem "se admin, pode tudo" hardcoded.' },
        ].map((p) => (
          <div
            key={p.title}
            className="rounded-xl border p-5"
            style={{ background: 'var(--surface-1)', borderColor: 'var(--line-1)' }}
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}
            >
              {p.ic}
            </span>
            <h4 className="serif mt-3 text-[18px] font-normal tracking-tight" style={{ color: 'var(--text)' }}>
              {p.title}
            </h4>
            <p className="mt-1 text-[13px] leading-relaxed" style={{ color: 'var(--text-soft)' }}>
              {p.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

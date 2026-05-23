import { Briefcase, ClipboardCheck, Compass, Crown, Eye, FileText, Hammer, Hand, HardHat, Heart, Layers, Network, Sparkles, Wrench } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { SubHead } from '@/components/docs/Showcase'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

type Density = 'Power' | 'Standard' | 'Guided'

interface Persona {
  initials: string
  name: string
  role: string
  group: 'Liderança' | 'Operação' | 'Externos'
  density: Density
  needs: string
  icon: React.ReactNode
  color: string
}

const personas: Persona[] = [
  // Liderança
  { initials: 'CD', name: 'Diretor criativo', role: 'CEO criativo', group: 'Liderança', density: 'Power', needs: 'Visão de portfólio · margem · pipeline', icon: <Crown size={16} />, color: 'var(--brand)' },
  { initials: 'OP', name: 'Diretor de operações', role: 'COO', group: 'Liderança', density: 'Power', needs: 'KPIs operacionais · alocação de squads · margem', icon: <Compass size={16} />, color: 'var(--purple)' },
  { initials: 'CT', name: 'Controller financeiro', role: 'CFO', group: 'Liderança', density: 'Power', needs: 'P&L · aging · fluxo · auditoria', icon: <FileText size={16} />, color: 'var(--warning)' },

  // Operação
  { initials: 'LS', name: 'Líder de squad', role: 'Arquiteto sênior', group: 'Operação', density: 'Power', needs: 'Kanban do squad · cliente em foco · decisões rápidas', icon: <Layers size={16} />, color: 'var(--purple)' },
  { initials: 'AS', name: 'Arquiteto sênior', role: 'Arquiteto · 5+ anos', group: 'Operação', density: 'Power', needs: 'Briefing · render · planta · spec', icon: <Sparkles size={16} />, color: 'var(--brand)' },
  { initials: 'AJ', name: 'Arquiteto pleno/junior', role: 'Arquiteto · 1-5 anos', group: 'Operação', density: 'Standard', needs: 'Templates · revisão · referências', icon: <Briefcase size={16} />, color: 'var(--success)' },
  { initials: 'DI', name: 'Designer de interiores', role: 'Especialista', group: 'Operação', density: 'Standard', needs: 'Catálogo · paletas · moodboards', icon: <Heart size={16} />, color: 'var(--pink)' },
  { initials: 'GO', name: 'Gestor de obra', role: 'Engenheiro de obra', group: 'Operação', density: 'Standard', needs: 'Gantt · punch list · fotos · prazo', icon: <HardHat size={16} />, color: 'var(--alert)' },
  { initials: 'OC', name: 'Operador de campo', role: 'Vistoriador', group: 'Operação', density: 'Standard', needs: 'App mobile · fotos · checklist · offline', icon: <ClipboardCheck size={16} />, color: 'var(--warning)' },
  { initials: 'AB', name: 'Administrativo / Back-office', role: 'Suporte interno', group: 'Operação', density: 'Standard', needs: 'NFs · documentos · cadastros · agenda', icon: <Hand size={16} />, color: 'var(--text-mute)' },

  // Externos
  { initials: 'CL', name: 'Cliente final', role: 'Pessoa física · contratante', group: 'Externos', density: 'Guided', needs: 'Aprovar · ver render · pagar · conversar', icon: <Eye size={16} />, color: 'var(--brand)' },
  { initials: 'EM', name: 'Empresa contratante', role: 'PJ · CEO', group: 'Externos', density: 'Guided', needs: 'Status alto nível · invoices · contratos', icon: <Network size={16} />, color: 'var(--purple)' },
  { initials: 'FP', name: 'Fornecedor / Parceiro', role: 'Marmoraria, Lúmen, Forn.', group: 'Externos', density: 'Standard', needs: 'Cotações pendentes · prazos · pagamento', icon: <Wrench size={16} />, color: 'var(--success)' },
  { initials: 'DT', name: 'Despachante / Trading', role: 'Logística e impostos', group: 'Externos', density: 'Standard', needs: 'Documentos fiscais · prazos aduaneiros', icon: <Hammer size={16} />, color: 'var(--alert)' },
]

const densityColor: Record<Density, 'brand' | 'success' | 'warning'> = {
  Power: 'brand',
  Standard: 'success',
  Guided: 'warning',
}

export function PersonasPage() {
  const groups = ['Liderança', 'Operação', 'Externos'] as const

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        num="P34"
        category="Documentação · Personas"
        title="14 personas"
        italic="3 níveis de densidade"
        description="Quem usa o TKWS OS. Cada persona tem uma necessidade clara e um nível de densidade visual recomendado (Power · Standard · Guided)."
        tag="usuários do TKWS OS"
      />

      {groups.map((g) => {
        const list = personas.filter((p) => p.group === g)
        return (
          <section key={g} className="mt-2">
            <SubHead num={g.slice(0, 1)} title={g} italic={`${list.length} personas`} />
            <div className="grid grid-cols-3 gap-4 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
              {list.map((p) => (
                <article
                  key={p.initials}
                  className="rounded-xl border p-5"
                  style={{ background: 'var(--surface-1)', borderColor: 'var(--line-1)' }}
                >
                  <div className="flex items-start gap-3">
                    <Avatar size="md" square style={{ background: p.color, color: 'var(--bg)' }}>
                      <AvatarFallback>{p.initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="serif text-[18px] font-normal leading-tight tracking-tight" style={{ color: 'var(--text)' }}>
                        {p.name}
                      </div>
                      <div className="mono mt-0.5 text-[10.5px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                        {p.role}
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-[13px] leading-relaxed" style={{ color: 'var(--text-soft)' }}>
                    {p.needs}
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <span
                      className="inline-flex h-6 w-6 items-center justify-center rounded-md"
                      style={{ background: 'var(--surface-2)', color: 'var(--text-soft)' }}
                    >
                      {p.icon}
                    </span>
                    <Badge tone={densityColor[p.density]}>{p.density}</Badge>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

import { PageHeader } from '@/components/docs/PageHeader'

export function ManifestoPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        num="01"
        category="Manifesto"
        title="Não construímos um ERP."
        italic="Construímos uma ferramenta."
        description="Para arquitetos que conduzem projetos residenciais de alto padrão. Software com o mesmo cuidado estético que Linear, Arc, Cron e Raycast oferecem. O usuário sente que está trabalhando em uma ferramenta pensada para ele, não contra ele."
      />

      <section className="mt-12 grid gap-7">
        <Quote>
          Tipografia editorial nos títulos. Mono nos sinais técnicos. Conteúdo visual em
          primeiro plano — renders, plantas, moodboards. Listas são exceção, não regra.
        </Quote>
        <Quote>
          Disciplina cromática: navy + cyan + 6 cores semânticas. Nada de gradient roxo de
          SaaS B2B genérico. Cores existem para classificar — status, squad, severidade — nunca
          para decorar.
        </Quote>
        <Quote>
          Whitespace generoso. Densidade só onde a operação exige. Motion como linguagem
          (comunica estado), nunca decoração.
        </Quote>
      </section>

      <div
        className="mt-14 rounded-2xl border p-8 text-center"
        style={{
          background:
            'linear-gradient(135deg, var(--brand-soft) 0%, transparent 70%), var(--surface-1)',
          borderColor: 'var(--brand)',
        }}
      >
        <div
          className="mono text-[10px] font-bold uppercase tracking-[2.2px]"
          style={{ color: 'var(--brand)' }}
        >
          Princípio editor de tudo
        </div>
        <p
          className="serif mt-4 text-[clamp(28px,5vw,44px)] font-light leading-[1.05] tracking-tight"
          style={{ color: 'var(--text)' }}
        >
          Para arquitetos.{' '}
          <em className="italic" style={{ color: 'var(--brand)' }}>
            Não para back-office.
          </em>
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-[14px]" style={{ color: 'var(--text-soft)' }}>
          E ao mesmo tempo acessível para todos os 14 perfis do produto — do diretor criativo
          power-user ao cliente final que abre o portal duas vezes por mês.
        </p>
      </div>
    </div>
  )
}

function Quote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote
      className="border-l-2 pl-6 text-[16px] leading-[1.7]"
      style={{ color: 'var(--text-soft)', borderColor: 'var(--brand)' }}
    >
      {children}
    </blockquote>
  )
}

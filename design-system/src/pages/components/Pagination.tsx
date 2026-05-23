import { useState } from 'react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Pagination',
  import: "import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from '@/components/ui/pagination'",
  contexto:
    'Pagination para tabelas e listas onde infinite scroll não cabe (precisamos saber página atual / total). Use search params via TanStack Router para a página estar na URL.',
  quandoUsar: [
    'DataTable de operação · ordem importa, total conhecido',
    'Listas longas onde o usuário precisa lembrar onde estava',
  ],
  props: [],
  antiPatterns: [
    'Pagination em feed infinito — use useInfiniteQuery + IntersectionObserver',
    'Página atual fora da URL — quebra "voltar"',
  ],
  exemplo: `<Pagination>
  <PaginationContent>
    <PaginationItem><PaginationPrevious href="?page=1" /></PaginationItem>
    <PaginationItem><PaginationLink isActive>2</PaginationLink></PaginationItem>
    <PaginationItem><PaginationLink>3</PaginationLink></PaginationItem>
    <PaginationItem><PaginationEllipsis /></PaginationItem>
    <PaginationItem><PaginationNext /></PaginationItem>
  </PaginationContent>
</Pagination>`,
  relacionados: ['DataTable', 'useInfiniteQuery'],
}

export function PaginationPage() {
  const [page, setPage] = useState(2)
  const total = 12
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="08.4"
        category="Navigation · Pagination"
        title="Pagination"
        italic="discreta · numérica"
        description="Use em tabelas onde o usuário precisa controlar página. Para feed infinito, prefira useInfiniteQuery."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Padrão" />
      <Showcase>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => setPage(Math.max(1, page - 1))} />
            </PaginationItem>
            {[1, 2, 3].map((n) => (
              <PaginationItem key={n}>
                <PaginationLink isActive={page === n} onClick={() => setPage(n)}>
                  {n}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink onClick={() => setPage(total)}>{total}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext onClick={() => setPage(Math.min(total, page + 1))} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <div className="mono mt-3 text-center text-[10.5px]" style={{ color: 'var(--text-mute)' }}>
          Página {page} de {total}
        </div>
      </Showcase>
    </div>
  )
}

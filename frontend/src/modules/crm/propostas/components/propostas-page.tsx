import { PipelineView } from '@/modules/crm/atendimento/components/pipeline-view'

/**
 * Propostas · usa o mesmo PipelineView do Atendimento · só muda o módulo.
 * Backend filtra por pipelines.modulo === 'proposta'.
 */
export function PropostasPage() {
  return (
    <PipelineView
      modulo="proposta"
      title="Propostas"
      description="Pipeline de propostas enviadas · do envio ao aceite. Acompanhe valor e prazo de fechamento."
    />
  )
}

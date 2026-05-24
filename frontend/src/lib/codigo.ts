/**
 * Helpers para geração de códigos sequenciais de Configurações.
 *
 * Convenção: PREFIXO-NNN (ex: SET-001, OFE-042, TPR-007).
 * Cada feature define seu próprio prefixo de 3 letras maiúsculas.
 *
 * NOTA: enquanto o backend não emite códigos via sequência própria, geramos
 * no frontend baseado nos itens já existentes. Quando o backend assumir a
 * responsabilidade, ele deve respeitar o mesmo formato.
 */

const PADDING = 3

function pad(n: number) {
  return String(n).padStart(PADDING, '0')
}

/**
 * Retorna o próximo código sequencial dado um prefixo e a lista de códigos
 * já existentes (qualquer formato — só usa os que casam com `<prefix>-<n>`).
 *
 * Exemplos:
 *   nextCodigo('SET', [])                          → 'SET-001'
 *   nextCodigo('SET', ['SET-001', 'SET-002'])      → 'SET-003'
 *   nextCodigo('SET', ['SET-001', 'set-005', 'X']) → 'SET-006'  (case-insensitive)
 */
export function nextCodigo(prefix: string, existingCodes: ReadonlyArray<string | null | undefined>): string {
  const upper = prefix.toUpperCase()
  const re = new RegExp(`^${upper}-(\\d+)$`, 'i')
  let max = 0
  for (const c of existingCodes) {
    if (!c) continue
    const m = c.match(re)
    if (m) {
      const n = Number(m[1])
      if (Number.isFinite(n) && n > max) max = n
    }
  }
  return `${upper}-${pad(max + 1)}`
}

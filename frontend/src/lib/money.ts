/**
 * API TKWS armazena `valor` em reais (BigDecimal scale 2).
 * `MoneyInput` trabalha em centavos (dígitos digitados).
 */
export function reaisToCents(reais: number): number {
  return Math.round(reais * 100)
}

export function centsToReais(cents: number): number {
  return Math.round(cents) / 100
}

/** Garante no máximo 2 casas decimais antes de enviar à API. */
export function roundReais(reais: number): number {
  return Math.round(reais * 100) / 100
}

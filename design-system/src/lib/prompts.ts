/**
 * Registry de prompts para IA / Agentes (Cursor, Claude Code, Copilot, etc.).
 *
 * Estrutura padronizada: cada componente expõe um `AIPrompt` com 5 seções:
 *   - contexto      · o que é, onde se encaixa no TKWS OS
 *   - quandoUsar    · sinais de que esse é o componente certo
 *   - props         · principais props/variantes (não exaustivo, ver tipo)
 *   - antiPatterns  · usos a EVITAR explicitamente
 *   - exemplo       · snippet TSX pronto para colar
 *
 * Cada PromptCard expõe um botão "Copiar" que serializa as 5 seções em
 * markdown puro — pronto para colar no chat de uma IA.
 */

export type AIPrompt = {
  componente: string
  import: string
  contexto: string
  quandoUsar: string[]
  props: { name: string; type: string; description: string }[]
  antiPatterns: string[]
  exemplo: string
  relacionados?: string[]
}

/** Serializa o prompt em markdown · pronto para o clipboard. */
export function promptToMarkdown(p: AIPrompt): string {
  const props = p.props
    .map((prop) => `- \`${prop.name}\` *(${prop.type})* — ${prop.description}`)
    .join('\n')
  const quando = p.quandoUsar.map((q) => `- ${q}`).join('\n')
  const anti = p.antiPatterns.map((a) => `- ✗ ${a}`).join('\n')
  const rel = p.relacionados?.length
    ? `\n## Componentes relacionados\n${p.relacionados.map((r) => `- ${r}`).join('\n')}`
    : ''

  return `# ${p.componente} · TKWS OS

\`\`\`tsx
${p.import}
\`\`\`

## Contexto
${p.contexto}

## Quando usar
${quando}

## Props principais
${props}

## Anti-patterns · NÃO faça
${anti}

## Exemplo
\`\`\`tsx
${p.exemplo}
\`\`\`
${rel}`
}

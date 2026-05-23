/**
 * TEMPLATES · Atomic Design level 4
 *
 * Estruturas de página sem conteúdo final · combinam organisms + molecules
 * em layouts reutilizáveis. Templates definem WHERE coisas vão, pages
 * definem WHAT está nelas.
 *
 * Templates típicos do TKWS OS:
 *  - DocsLayout · sidebar fixa + topbar + content area (para a documentação)
 *  - AppShell · sidebar + header + main + footer (telas do produto)
 *  - DashboardLayout · grid de KPIs + widgets
 *  - FormLayout · TOC sticky + form sectioned
 *
 * Uso: import { DocsLayout } from '@/components/templates'
 */

export { Layout as DocsLayout } from '../docs/Layout'

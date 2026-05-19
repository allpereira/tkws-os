import { setupServer } from 'msw/node';
import { handlers } from './msw-handlers';

/**
 * Servidor MSW que intercepta requests HTTP nos testes.
 * Permite testar fluxos completos sem precisar de backend real.
 */
export const server = setupServer(...handlers);

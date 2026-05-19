import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from './msw-server';

// Sobe MSW antes de todos os testes
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reseta handlers entre testes (isolamento)
afterEach(() => {
  server.resetHandlers();
  cleanup();
});

// Para servidor após todos
afterAll(() => server.close());

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Schemas de validação dos formulários
// ---------------------------------------------------------------------------

export const loginSchema = z.object({
  loginName: z
    .string()
    .min(1, 'Informe seu e-mail ou nome de usuário')
    .max(256, 'Login muito longo'),
  password: z
    .string()
    .min(1, 'Informe sua senha')
    .max(256, 'Senha muito longa'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// ---------------------------------------------------------------------------
// Estado do fluxo de auth (compartilhado via Zustand store)
// ---------------------------------------------------------------------------

export interface LoginFlowState {
  /** ID do auth request do Zitadel (vem na query string ?authRequestId=...) */
  authRequestId: string | null;
  /** Login name (e-mail) do usuário atual */
  loginName: string | null;
  /** ID da sessão criada no Zitadel */
  sessionId: string | null;
  /** Token da sessão (NÃO armazenado em localStorage por segurança) */
  sessionToken: string | null;
  /** Desafios MFA pendentes após autenticação de senha */
  pendingChallenges: string[];
}

export interface LoginFlowActions {
  setAuthRequestId: (id: string) => void;
  setLoginName: (name: string) => void;
  setSession: (id: string, token: string) => void;
  setPendingChallenges: (challenges: string[]) => void;
  reset: () => void;
}

export type LoginFlowStore = LoginFlowState & LoginFlowActions;

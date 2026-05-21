import { create } from 'zustand';
import type { LoginFlowStore } from '@/features/login/types/auth';

const initialState = {
  authRequestId: null,
  loginName: null,
  sessionId: null,
  sessionToken: null,
  pendingChallenges: [] as string[],
};

export const useLoginFlowStore = create<LoginFlowStore>()((set) => ({
  ...initialState,

  setAuthRequestId: (id) => set({ authRequestId: id }),
  setLoginName: (name) => set({ loginName: name }),
  setSession: (id, token) => set({ sessionId: id, sessionToken: token }),
  setPendingChallenges: (challenges) => set({ pendingChallenges: challenges }),
  reset: () => set(initialState),
}));

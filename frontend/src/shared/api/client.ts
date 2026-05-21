import axios, { AxiosError } from 'axios';
import { User } from 'oidc-client-ts';
import { ZITADEL_AUTHORITY, ZITADEL_CLIENT_ID } from '@/features/auth/api/oidc-config';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function getStoredUser(): User | null {
  try {
    const key = `oidc.user:${ZITADEL_AUTHORITY}:${ZITADEL_CLIENT_ID}`;
    const stored = typeof window !== 'undefined' ? window.localStorage?.getItem(key) : null;
    return stored ? User.fromStorageString(stored) : null;
  } catch {
    return null;
  }
}

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30_000,
});

api.interceptors.request.use((config) => {
  const user = getStoredUser();
  if (user?.access_token) {
    config.headers.Authorization = `Bearer ${user.access_token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // NOTE: Do NOT redirect on 401 here. Doing window.location.assign('/') creates
    // an infinite loop: 401 → reload '/' → same token → 401 → ...
    // The route component (route-tree.tsx) handles 401 with a proper error message
    // and lets the user retry or re-authenticate via the OIDC flow.
    return Promise.reject(error);
  }
);

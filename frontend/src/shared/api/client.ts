import axios, { AxiosError } from 'axios';
import { User } from 'oidc-client-ts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const ZITADEL_AUTHORITY = import.meta.env.VITE_ZITADEL_AUTHORITY || 'http://localhost:8088';
const ZITADEL_CLIENT_ID = import.meta.env.VITE_ZITADEL_CLIENT_ID || '';

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
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

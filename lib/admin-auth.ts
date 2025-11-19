import { getToken, isAdmin as checkIsAdmin } from './auth';

export function checkAdminAuth(): boolean {
  return checkIsAdmin();
}

export function getAdminToken(): string | null {
  return getToken();
}

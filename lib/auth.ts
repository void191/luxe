import jwt from 'jsonwebtoken';

export interface JWTPayload {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  is_admin: boolean;
}

/**
 * Verify JWT token from request Authorization header
 * Returns the decoded payload if valid, null otherwise
 */
export function verifyToken(request: Request): JWTPayload | null {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Verify JWT token and check if user has admin privileges
 * Returns the decoded payload if valid admin, null otherwise
 */
export function verifyAdminToken(request: Request): JWTPayload | null {
  const payload = verifyToken(request);
  if (!payload || !payload.is_admin) {
    return null;
  }
  return payload;
}

/**
 * Get token from localStorage (client-side only)
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

/**
 * Set token in localStorage (client-side only)
 */
export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
}

/**
 * Remove token from localStorage (client-side only)
 */
export function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('isAdmin');
}

/**
 * Decode JWT token without verification (client-side only, for UI purposes)
 * WARNING: This is NOT secure. Server must always verify tokens.
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return null;
    return JSON.parse(atob(payloadBase64));
  } catch (error) {
    console.error('Token decode failed:', error);
    return null;
  }
}

/**
 * Check if current user is admin (client-side only, for UI purposes)
 * WARNING: This is NOT secure. Server must always verify tokens.
 */
export function isAdmin(): boolean {
  const token = getToken();
  if (!token) return false;
  const payload = decodeToken(token);
  return payload?.is_admin === true;
}

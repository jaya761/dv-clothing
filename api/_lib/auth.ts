import crypto from 'node:crypto';
import type { VercelRequest } from '@vercel/node';

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'dv_secret_session_production_salt_92813';
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface AdminPayload {
  username: string;
  role: string;
  exp: number;
}

export function generateAdminToken(username: string, role = 'admin'): string {
  const payload: AdminPayload = {
    username,
    role,
    exp: Date.now() + TOKEN_TTL_MS
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadBase64)
    .digest('base64url');

  return `${payloadBase64}.${signature}`;
}

export function verifyAdminToken(token: string): { valid: boolean; payload?: AdminPayload } {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return { valid: false };

    const [payloadBase64, providedSig] = parts;
    const expectedSig = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(payloadBase64)
      .digest('base64url');

    if (providedSig !== expectedSig) {
      return { valid: false };
    }

    const payload: AdminPayload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString('utf-8'));
    if (Date.now() > payload.exp) {
      return { valid: false }; // Expired
    }

    return { valid: true, payload };
  } catch {
    return { valid: false };
  }
}

export function authenticateAdminRequest(req: VercelRequest): { authenticated: boolean; user?: AdminPayload } {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authenticated: false };
  }

  const token = authHeader.substring(7);
  const result = verifyAdminToken(token);
  if (!result.valid || !result.payload) {
    return { authenticated: false };
  }

  return { authenticated: true, user: result.payload };
}

import { API_BASE_URL } from './config';
import type { ApiEnvelope } from './types';
import { shouldSignOutOnUnauthorized } from '../services/sessionAuth';

let onUnauthorized: (() => void) | null = null;

function maybeSignOutOn401(): void {
  if (shouldSignOutOnUnauthorized()) {
    onUnauthorized?.();
  }
}

/** Called from App.tsx — clears auth when API returns 401. */
export function setApiUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

export function apiUrl(path: string): string {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function authHeaders(token: string | null | undefined): HeadersInit {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

/** Turn `uploads/products/...` paths from the API into full URLs for Image. */
export function resolveAssetUrl(path: string | null | undefined): string | null {
  if (!path) {
    return null;
  }
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return apiUrl(path.startsWith('/') ? path : `/${path}`);
}

function isApiEnvelope(body: unknown): body is ApiEnvelope<unknown> {
  return (
    body !== null &&
    typeof body === 'object' &&
    'success' in body &&
    typeof (body as ApiEnvelope<unknown>).success === 'boolean'
  );
}

/** Lexik JWT and other non-envelope JSON from Symfony. */
function throwForNonEnvelopeBody(body: unknown, status: number, signOutOn401: boolean): never {
  if (body && typeof body === 'object') {
    const record = body as Record<string, unknown>;
    if (typeof record.message === 'string' && record.message !== '') {
      if (status === 401 || record.code === 401) {
        if (signOutOn401) {
          maybeSignOutOn401();
        }
        throw new Error('Session expired or invalid. Please sign in again.');
      }
      throw new Error(record.message);
    }
    if (typeof record.detail === 'string' && record.detail !== '') {
      throw new Error(record.detail);
    }
  }

  if (status === 401) {
    if (signOutOn401) {
      maybeSignOutOn401();
    }
    throw new Error('Session expired or invalid. Please sign in again.');
  }

  throw new Error(`Unexpected response from server (${status}).`);
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { token?: string | null; signOutOn401?: boolean } = {},
): Promise<T> {
  const { token, signOutOn401 = true, headers: extraHeaders, ...fetchOptions } = options;

  let response: Response;
  try {
    response = await fetch(apiUrl(path), {
      ...fetchOptions,
      headers: {
        ...(authHeaders(token) as Record<string, string>),
        ...(extraHeaders as Record<string, string> | undefined),
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Network request failed';
    throw new Error(msg);
  }

  const body: unknown = await response.json().catch(() => null);

  if (!isApiEnvelope(body)) {
    throwForNonEnvelopeBody(body, response.status, signOutOn401);
  }

  if (!body.success) {
    if (response.status === 401) {
      if (signOutOn401) {
        maybeSignOutOn401();
      }
      throw new Error('Session expired or invalid. Please sign in again.');
    }
    if (response.status === 403) {
      const forbidden =
        body.errors?.[0]?.message ||
        'This account cannot access the shop. Sign in with a verified customer account.';
      throw new Error(forbidden);
    }
    const message = body.errors?.[0]?.message || `Request failed (${response.status}).`;
    throw new Error(message);
  }

  return body.data as T;
}

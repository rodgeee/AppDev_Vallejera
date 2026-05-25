import { API_BASE_URL } from './config';
import { fetchProfile } from './profile';

/** JWT from POST /api/login — { token } or { success, data: { token } }. */
function extractLoginToken(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') {
    return undefined;
  }
  const record = data as Record<string, unknown>;
  if (typeof record.token === 'string' && record.token.length > 0) {
    return record.token;
  }
  const inner = record.data;
  if (inner && typeof inner === 'object') {
    const nested = (inner as { token?: string }).token;
    if (typeof nested === 'string' && nested.length > 0) {
      return nested;
    }
  }
  return undefined;
}

function loginErrorMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== 'object') {
    return fallback;
  }
  const record = data as Record<string, unknown>;
  const errors = record.errors;
  if (Array.isArray(errors) && errors.length > 0) {
    const first = errors[0];
    if (first && typeof first === 'object' && typeof (first as { message?: string }).message === 'string') {
      return (first as { message: string }).message;
    }
  }
  if (typeof record.message === 'string' && record.message !== '') {
    return record.message;
  }
  return fallback;
}

export async function userLogin({ email, password }: { email: string; password: string }) {
  const url = `${API_BASE_URL}/api/login`;
  const trimmedEmail = email.trim();

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: trimmedEmail, password }),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Network request failed';
    throw new Error(`${msg} Check your internet connection and try again.`);
  }

  const data = await response.json().catch(() => null);

  const envelopeFailed =
    data && typeof data === 'object' && (data as { success?: boolean }).success === false;
  if (!response.ok || envelopeFailed) {
    const serverMessage = loginErrorMessage(data, '');
    const fallback =
      response.status === 401
        ? 'Incorrect email or password.'
        : response.status >= 500
          ? 'Something went wrong on our servers. Please try again in a moment.'
          : 'Could not sign in.';
    throw new Error(serverMessage || fallback);
  }

  const token = extractLoginToken(data);
  if (!token) {
    throw new Error('Login succeeded but no token was returned from the server.');
  }

  try {
    await fetchProfile(token);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'This account cannot use the customer app.';
    if (msg.toLowerCase().includes('customer accounts only')) {
      throw new Error(
        'This email is for staff or admin on the website, not the mobile shop. Sign up with a customer account or use a different email.',
      );
    }
    throw new Error(msg);
  }

  return { success: true, token };
}

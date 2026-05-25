import { API_BASE_URL } from './config';
import { fetchProfile } from './profile';

export type GoogleAuthAction = 'login' | 'signup';

export type GoogleLoginResult =
  | { success: true; token: string }
  | { success: false; pendingVerification: true; message: string };

function parseApiMessage(data: unknown, fallback: string): string {
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

export async function googleLogin({
  idToken,
  action = 'login',
}: {
  idToken: string;
  action?: GoogleAuthAction;
}): Promise<GoogleLoginResult> {
  const url = `${API_BASE_URL}/api/login/google`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken, action }),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Network request failed';
    throw new Error(`${msg} Check your internet connection and try again.`);
  }

  const data = await response.json().catch(() => null);

  const token = data && typeof data === 'object' ? (data as { token?: string }).token : undefined;
  if (response.ok && token && typeof token === 'string') {
    try {
      await fetchProfile(token);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'This account cannot use the customer app.';
      throw new Error(msg);
    }
    return { success: true, token };
  }

  const message = parseApiMessage(
    data,
    response.status === 422
      ? 'This Google account is not registered yet. Use Continue with Google on the sign-up screen first.'
      : 'Google sign-in failed.',
  );

  if (!response.ok) {
    throw new Error(message);
  }

  return {
    success: false,
    pendingVerification: true,
    message,
  };
}

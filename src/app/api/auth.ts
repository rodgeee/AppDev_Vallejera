import { API_BASE_URL } from './config';

const getNetworkErrorHelp = () =>
  'Set your PC IP in src/app/api/config.js (API_BASE_URL) and ensure the backend is running and port 8000 is exposed.';
console.log('API_BASE_URL:', API_BASE_URL);

const looksLikeLoginPage = (html: string) => {
  if (typeof html !== 'string') return false;
  // Heuristic: login pages usually include email/password inputs posting to /login
  return (
    /name=["']email["']/i.test(html) &&
    /name=["']password["']/i.test(html) &&
    /action=["'][^"']*login[^"']*["']/i.test(html)
  );
};

const extractCsrfToken = (html: string) => {
  if (typeof html !== 'string') return null;
  // Looks like: <input type="hidden" name="_csrf_token" value="...">
  const match = html.match(/name=["']_csrf_token["'][^>]*value=["']([^"']+)["']/i);
  return match?.[1] || null;
};

export async function userLogin({ email, password }: { email: string; password: string }) {
  // SRU web login flow:
  // 1) GET /login to receive session cookie + _csrf_token
  // 2) POST /login as x-www-form-urlencoded with email + password + _csrf_token
  const loginPageUrl = API_BASE_URL + '/login';

  let csrfToken = null;
  try {
    const pageRes = await fetch(loginPageUrl, {
      method: 'GET',
      headers: { Accept: 'text/html,application/xhtml+xml' },
      credentials: 'include',
    });
    const pageHtml = await pageRes.text().catch(() => '');
    csrfToken = extractCsrfToken(pageHtml);
    console.log('Login page fetch:', {
      status: pageRes.status,
      ok: pageRes.ok,
      hasCsrfToken: Boolean(csrfToken),
      url: pageRes.url || loginPageUrl,
    });
  } catch (err: any) {
    const msg = err?.message || 'Network request failed';
    throw new Error(msg + '. ' + getNetworkErrorHelp());
  }

  if (!csrfToken) {
    throw new Error(
      'Cannot login: missing CSRF token from backend. Make sure the /login page is reachable.',
    );
  }

  const url = loginPageUrl;
  const formBody = `email=${encodeURIComponent(email)}&password=${encodeURIComponent(
    password,
  )}&_csrf_token=${encodeURIComponent(csrfToken)}`;

  const options: RequestInit = {
    method: 'POST',
    headers: {
      Accept: 'text/vnd.turbo-stream.html, text/html, application/xhtml+xml',
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: formBody,
    // Ensure session cookies are persisted for follow-up verification
    credentials: 'include',
  };

  let response;
  try {
    response = await fetch(url, options);
    console.log('Login response status:', response);
  } catch (err: any) {
    const msg = err?.message || 'Network request failed';
    throw new Error(msg + '. ' + getNetworkErrorHelp());
  }

  const contentType = response.headers?.get?.('content-type') || '';
  const finalUrl = response.url || url;
  console.log('Login response:', {
    status: response.status,
    ok: response.ok,
    redirected: response.redirected,
    url: finalUrl,
    contentType,
  });

  // JSON responses (if any)
  if (contentType.includes('application/json')) {
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        (data &&
          (data.message ||
            data.errors?.password ||
            data.errors?.detail ||
            data.detail)) ||
        'Invalid credentials.';
      throw new Error(message);
    }
    // Verify auth anyway (some backends return 200 JSON errors)
    return data || { success: true };
  }

  // HTML/text responses
  const text = await response.text().catch(() => '');

  if (!response.ok) {
    // Some backends still send HTML for errors
    throw new Error('Invalid credentials.');
  }

  // Many web backends return 200 OK + HTML for both success and failure.
  // Only treat as invalid when the HTML contains a clear invalid-credentials message.
  const hasInvalidText =
    typeof text === 'string' &&
    /invalid credentials|pass the correct auth credentials|incorrect password|wrong password/i.test(
      text,
    );

  if (hasInvalidText) {
    throw new Error('Invalid credentials.');
  }

  // If response body itself looks like the login page, credentials are wrong.
  if (looksLikeLoginPage(text)) {
    throw new Error('Invalid credentials.');
  }

  // Final verification: request a page that requires auth.
  // The SRU web UI refers to /landingpage after login.
  const verifyUrl = API_BASE_URL + '/landingpage';
  try {
    const verifyRes = await fetch(verifyUrl, {
      method: 'GET',
      headers: { Accept: 'text/html,application/xhtml+xml' },
      credentials: 'include',
    });
    const verifyText = await verifyRes.text().catch(() => '');
    const verifyFinalUrl = verifyRes.url || verifyUrl;
    const redirectedToLogin =
      typeof verifyFinalUrl === 'string' &&
      verifyFinalUrl.replace(/\/+$/, '').endsWith('/login');

    console.log('Login verify response:', {
      status: verifyRes.status,
      ok: verifyRes.ok,
      redirected: verifyRes.redirected,
      url: verifyFinalUrl,
    });

    if (!verifyRes.ok || redirectedToLogin || looksLikeLoginPage(verifyText)) {
      throw new Error('Invalid credentials.');
    }
  } catch (e: any) {
    // If verification request fails due to network, report network help;
    // if it fails due to auth, bubble up invalid credentials.
    const msg = e?.message || '';
    if (/network request failed/i.test(msg)) {
      throw new Error('Network request failed. ' + getNetworkErrorHelp());
    }
    throw e;
  }

  return { success: true };
}
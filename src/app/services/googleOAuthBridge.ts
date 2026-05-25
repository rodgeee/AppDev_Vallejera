import { Linking } from 'react-native';
import { API_BASE_URL } from '../api/config';

export const APP_OAUTH_CALLBACK_URL = 'vallejera://auth/callback';

export type GoogleOAuthBridgeResult =
  | { cancelled: true }
  | { success: true; token: string }
  | { pending: true; message: string }
  | { error: string };

type InAppBrowserModule = {
  isAvailable: () => Promise<boolean>;
  openAuth: (
    url: string,
    redirectUrl: string,
    options?: Record<string, unknown>,
  ) => Promise<{ type: string; url?: string }>;
};

let pendingOAuthResolve: ((result: GoogleOAuthBridgeResult) => void) | null = null;
let linkingSubscription: { remove: () => void } | null = null;

function getInAppBrowser(): InAppBrowserModule | null {
  try {
    const mod = require('react-native-inappbrowser-reborn');
    const browser = mod?.InAppBrowser ?? mod?.default ?? mod;
    if (browser && typeof browser.isAvailable === 'function') {
      return browser as InAppBrowserModule;
    }
  } catch {
    // Native module not installed or not linked — use Linking fallback.
  }
  return null;
}

export function buildGoogleOAuthUrl(action: 'login' | 'signup'): string {
  const path = action === 'signup' ? '/signup/google' : '/login/google';
  return `${API_BASE_URL}${path}?platform=app`;
}

export function parseOAuthCallbackUrl(url: string): GoogleOAuthBridgeResult | null {
  if (!url.startsWith(APP_OAUTH_CALLBACK_URL)) {
    return null;
  }

  const query = url.includes('?') ? url.slice(url.indexOf('?') + 1) : '';
  const params = new Map<string, string>();
  query.split('&').forEach((part) => {
    const [key, value] = part.split('=');
    if (key) {
      params.set(key, decodeURIComponent(value ?? ''));
    }
  });

  const token = params.get('token');
  if (token) {
    return { success: true, token };
  }

  if (params.get('status') === 'pending') {
    return {
      pending: true,
      message: params.get('message') || 'Check your email to verify your account.',
    };
  }

  if (params.get('error')) {
    return {
      error: params.get('message') || 'Google sign-in failed.',
    };
  }

  return { error: 'Google sign-in failed.' };
}

/** Call from App root when the app receives a deep link (Linking fallback). */
export function handleOAuthDeepLink(url: string | null | undefined): boolean {
  if (!url || !pendingOAuthResolve) {
    return false;
  }
  const parsed = parseOAuthCallbackUrl(url);
  if (!parsed) {
    return false;
  }
  const resolve = pendingOAuthResolve;
  pendingOAuthResolve = null;
  linkingSubscription?.remove();
  linkingSubscription = null;
  resolve(parsed);
  return true;
}

function waitForOAuthDeepLink(timeoutMs = 180000): Promise<GoogleOAuthBridgeResult> {
  return new Promise((resolve) => {
    pendingOAuthResolve = resolve;

    linkingSubscription?.remove();
    linkingSubscription = Linking.addEventListener('url', ({ url }) => {
      handleOAuthDeepLink(url);
    });

    Linking.getInitialURL().then((url) => {
      handleOAuthDeepLink(url);
    });

    setTimeout(() => {
      if (pendingOAuthResolve !== resolve) {
        return;
      }
      pendingOAuthResolve = null;
      linkingSubscription?.remove();
      linkingSubscription = null;
      resolve({ cancelled: true });
    }, timeoutMs);
  });
}

async function openWithInAppBrowser(
  browser: InAppBrowserModule,
  authUrl: string,
): Promise<GoogleOAuthBridgeResult | null> {
  try {
    const available = await browser.isAvailable();
    if (!available) {
      return null;
    }

    const result = await browser.openAuth(authUrl, APP_OAUTH_CALLBACK_URL, {
      ephemeralWebSession: false,
      showTitle: true,
      enableUrlBarHiding: true,
      enableDefaultShare: false,
    });

    if (result.type === 'cancel' || result.type === 'dismiss') {
      return { cancelled: true };
    }

    if (result.type === 'success' && result.url) {
      return parseOAuthCallbackUrl(result.url) ?? { error: 'Unexpected sign-in response.' };
    }

    return { cancelled: true };
  } catch {
    return null;
  }
}

async function openWithSystemBrowser(authUrl: string): Promise<GoogleOAuthBridgeResult> {
  const deepLinkPromise = waitForOAuthDeepLink();
  const opened = await Linking.openURL(authUrl);
  if (!opened) {
    pendingOAuthResolve = null;
    linkingSubscription?.remove();
    linkingSubscription = null;
    return { error: 'Could not open the sign-in page.' };
  }
  return deepLinkPromise;
}

export async function runGoogleOAuthBridge(
  action: 'login' | 'signup' = 'login',
): Promise<GoogleOAuthBridgeResult> {
  const authUrl = buildGoogleOAuthUrl(action);
  const browser = getInAppBrowser();

  if (browser) {
    const inAppResult = await openWithInAppBrowser(browser, authUrl);
    if (inAppResult !== null) {
      return inAppResult;
    }
  }

  return openWithSystemBrowser(authUrl);
}

export function cancelPendingOAuth(): void {
  if (pendingOAuthResolve) {
    pendingOAuthResolve({ cancelled: true });
    pendingOAuthResolve = null;
  }
  linkingSubscription?.remove();
  linkingSubscription = null;
}

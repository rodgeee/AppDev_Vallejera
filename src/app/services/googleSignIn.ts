import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';
import { GOOGLE_WEB_CLIENT_ID } from '../api/config';

let configured = false;

/** Native Google Sign-In — webClientId = srusystem GOOGLE_CLIENT_ID (Web OAuth client). */
export function configureGoogleSignIn(): void {
  if (configured) {
    return;
  }
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID || undefined,
    offlineAccess: false,
  });
  configured = true;
}

/** In-app Google account picker → Google idToken for POST /api/login/google. */
export async function getGoogleIdToken(): Promise<string> {
  if (!GOOGLE_WEB_CLIENT_ID) {
    throw new Error(
      'Google Sign-In is not configured. Set GOOGLE_WEB_CLIENT_ID in src/app/api/config.ts.',
    );
  }

  configureGoogleSignIn();

  if (Platform.OS === 'android') {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  }

  const response = await GoogleSignin.signIn();
  if (!isSuccessResponse(response)) {
    throw new Error('SIGN_IN_CANCELLED');
  }

  let idToken = response.data.idToken;
  if (!idToken) {
    const tokens = await GoogleSignin.getTokens();
    idToken = tokens.idToken;
  }

  if (!idToken) {
    throw new Error(
      'Google did not return a sign-in token. Check GOOGLE_WEB_CLIENT_ID and the Android OAuth client in Google Cloud.',
    );
  }

  return idToken;
}

export async function signOutGoogle(): Promise<void> {
  try {
    await GoogleSignin.signOut();
  } catch {
    // ignore
  }
}

export function getGoogleSignInErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message === 'SIGN_IN_CANCELLED') {
    return '';
  }

  if (isErrorWithCode(error)) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      return '';
    }
    if (error.code === statusCodes.IN_PROGRESS) {
      return 'Google sign-in is already in progress.';
    }
    if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      return 'Google Play Services is not available on this device.';
    }
  }

  if (error instanceof Error) {
    if (error.message.includes('DEVELOPER_ERROR')) {
      return (
        'Google Cloud is missing the Android OAuth client for this app.\n\n' +
        'In project "shoesrus", create an Android client:\n' +
        '• Package: com.vallejera (all lowercase)\n' +
        '• SHA-1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25\n\n' +
        'It must be in the same project as the Web client ID in google.config.ts. ' +
        'Clients created only in device-streaming-cbff08b3 will not work.\n\n' +
        'See GOOGLE_SIGNIN_CHECKLIST.md, then rebuild the app.'
      );
    }
    return error.message;
  }

  return 'Google sign-in failed.';
}

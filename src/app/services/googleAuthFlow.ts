import { googleLogin, type GoogleAuthAction, type GoogleLoginResult } from '../api/googleAuth';
import { getGoogleIdToken, getGoogleSignInErrorMessage } from './googleSignIn';

export type GoogleAuthFlowResult =
  | { cancelled: true }
  | { success: true; token: string }
  | { pending: true; message: string }
  | { error: string };

/**
 * Native Google account picker → exchange idToken with srusystem for JWT.
 * Does not open the device browser.
 */
export async function performNativeGoogleAuth(
  action: GoogleAuthAction = 'login',
): Promise<GoogleAuthFlowResult> {
  let idToken: string;
  try {
    idToken = await getGoogleIdToken();
  } catch (err: unknown) {
    const message = getGoogleSignInErrorMessage(err);
    if (!message) {
      return { cancelled: true };
    }
    return { error: message };
  }

  try {
    const apiResult = await googleLogin({ idToken, action });
    if (apiResult.success) {
      return { success: true, token: apiResult.token };
    }
    return { pending: true, message: apiResult.message };
  } catch (err: unknown) {
    return {
      error: err instanceof Error ? err.message : 'Google sign-in failed.',
    };
  }
}

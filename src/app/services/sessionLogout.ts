import type { Dispatch } from 'redux';
import { authLogout } from '../sagas/actions';
import { signOutGoogle } from './googleSignIn';
import { clearAuthenticated } from './sessionAuth';

export async function performSessionLogout(dispatch: Dispatch): Promise<void> {
  clearAuthenticated();
  try {
    await signOutGoogle();
  } catch {
    // ignore
  }
  dispatch(authLogout());
}

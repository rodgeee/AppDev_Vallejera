import {
  getGoogleIdToken,
  getGoogleSignInErrorMessage,
} from '../app/services/googleSignIn';
import { signInToFirebaseWithGoogle } from '../app/services/firebaseGoogleAuth';

export type FirebaseGoogleAction = 'login' | 'signup';

type FirebaseGoogleResult = {
  idToken: string;
  userInfo: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  };
};

const signInWithGoogle = async (
  action: FirebaseGoogleAction = 'login',
): Promise<FirebaseGoogleResult> => {
  try {
    const idToken = await getGoogleIdToken();
    const userInfo = await signInToFirebaseWithGoogle(idToken, action);
    return { idToken, userInfo };
  } catch (error: unknown) {
    const message = getGoogleSignInErrorMessage(error);
    throw new Error(message || 'Google sign-in failed.');
  }
};

export default signInWithGoogle;
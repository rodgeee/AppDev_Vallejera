import auth, { type FirebaseAuthTypes } from '@react-native-firebase/auth';
import { firebaseAuth, firebaseFieldValue, firebaseFirestore } from '../firebase';

type FirebaseGoogleUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

function splitDisplayName(displayName: string | null): {
  firstName: string | null;
  lastName: string | null;
} {
  if (!displayName) {
    return { firstName: null, lastName: null };
  }

  const parts = displayName
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return { firstName: null, lastName: null };
  }

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: null };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
}

async function upsertGoogleUserDocument(
  user: FirebaseAuthTypes.User,
  action: 'login' | 'signup',
): Promise<void> {
  const userRef = firebaseFirestore.collection('users').doc(user.uid);
  const existing = await userRef.get();
  const { firstName, lastName } = splitDisplayName(user.displayName ?? null);

  const payload: Record<string, unknown> = {
    uid: user.uid,
    email: user.email ?? null,
    displayName: user.displayName ?? null,
    firstName,
    lastName,
    photoURL: user.photoURL ?? null,
    providerIds: user.providerData.map(item => item.providerId).filter(Boolean),
    lastAuthAction: action,
    lastLoginAt: firebaseFieldValue.serverTimestamp(),
    updatedAt: firebaseFieldValue.serverTimestamp(),
  };

  if (!existing.exists) {
    payload.createdAt = firebaseFieldValue.serverTimestamp();
  }

  await userRef.set(payload, { merge: true });
}

export async function signInToFirebaseWithGoogle(
  idToken: string,
  action: 'login' | 'signup',
): Promise<FirebaseGoogleUser> {
  try {
    const credential = auth.GoogleAuthProvider.credential(idToken);
    const userCredential = await firebaseAuth.signInWithCredential(credential);
    const user = userCredential.user;

    if (!user) {
      throw new Error('Firebase did not return a Google user.');
    }

    try {
      await upsertGoogleUserDocument(user, action);
    } catch (error: unknown) {
      console.warn(
        'FIRESTORE_USER_SYNC_ERROR:',
        error instanceof Error ? error.message : error,
      );
    }

    return {
      uid: user.uid,
      email: user.email ?? null,
      displayName: user.displayName ?? null,
      photoURL: user.photoURL ?? null,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Firebase Google sign-in failed: ${error.message}`);
    }
    throw new Error('Firebase Google sign-in failed.');
  }
}

export async function signOutFirebaseGoogle(): Promise<void> {
  try {
    await firebaseAuth.signOut();
  } catch {
    // ignore
  }
}

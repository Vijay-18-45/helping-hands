import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  type User,
  type UserCredential
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, rtdb } from './firebaseConfig';

export type UserRole = 'donor' | 'volunteer';

export const RTDB_PERMISSION_ERROR = 'rtdb/permission-denied';

function isPermissionDenied(err: any): boolean {
  return (
    err?.message?.toLowerCase().includes('permission') ||
    err?.code === 'PERMISSION_DENIED' ||
    String(err).toLowerCase().includes('permission_denied')
  );
}

export const registerUser = async (
  email: string,
  password: string,
  role: UserRole
): Promise<UserCredential> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  try {
    await set(ref(rtdb, `users/${userCredential.user.uid}`), { email, role });
  } catch (err: any) {
    if (isPermissionDenied(err)) {
      const e = new Error('Firebase Database rules are blocking writes. Please update your Realtime Database rules in the Firebase Console to allow authenticated reads and writes.');
      (e as any).code = RTDB_PERMISSION_ERROR;
      throw e;
    }
    throw err;
  }
  await sendEmailVerification(userCredential.user);
  return userCredential;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async (): Promise<void> => {
  return signOut(auth);
};

export const getUserRole = async (uid: string): Promise<UserRole | null> => {
  try {
    const snap = await get(ref(rtdb, `users/${uid}`));
    if (snap.exists()) {
      return snap.val().role as UserRole;
    }
    return null;
  } catch (err: any) {
    if (isPermissionDenied(err)) {
      console.warn('Firebase RTDB permission denied when reading user role. Check your Realtime Database rules.');
      return null;
    }
    throw err;
  }
};

export const getCurrentUser = (): User | null => auth.currentUser;

export const sendVerificationEmail = async (): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');
  await sendEmailVerification(user);
};

export const sendPasswordReset = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

export const getFirebaseErrorMessage = (errorCode: string): string => {
  const errorMessages: { [key: string]: string } = {
    'auth/email-already-in-use': 'This email is already registered. Please use login instead.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/operation-not-allowed': 'Email/password accounts are not enabled.',
    'auth/weak-password': 'Password should be at least 6 characters long.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/too-many-requests': 'Too many failed attempts. Try again later.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    [RTDB_PERMISSION_ERROR]: 'Firebase Database rules need to be configured. See the setup guide below.',
  };
  return errorMessages[errorCode] || 'An error occurred. Please try again.';
};

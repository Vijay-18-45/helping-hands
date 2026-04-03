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

export const registerUser = async (
  email: string,
  password: string,
  role: UserRole
): Promise<UserCredential> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await set(ref(rtdb, `users/${userCredential.user.uid}`), { email, role });
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
  const snap = await get(ref(rtdb, `users/${uid}`));
  if (snap.exists()) {
    return snap.val().role as UserRole;
  }
  return null;
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
  };
  return errorMessages[errorCode] || 'An error occurred. Please try again.';
};

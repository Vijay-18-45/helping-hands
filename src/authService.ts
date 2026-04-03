import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  type User,
  type UserCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

export type UserRole = 'donor' | 'volunteer';

export interface DonorProfile {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'donor';
  createdAt: any;
}

export interface VolunteerProfile {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  bio?: string;
  days: string[];
  hours: string;
  skills: string[];
  foodService: string;
  role: 'volunteer';
  createdAt: any;
}

export const registerDonor = async (
  email: string,
  password: string,
  profile: Omit<DonorProfile, 'email' | 'role' | 'createdAt'>
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'donors', userCredential.user.uid), {
      ...profile,
      email,
      role: 'donor',
      createdAt: serverTimestamp(),
    });
    return userCredential;
  } catch (error: any) {
    console.error('Error registering donor:', error);
    throw error;
  }
};

export const registerVolunteer = async (
  email: string,
  password: string,
  profile: Omit<VolunteerProfile, 'email' | 'role' | 'createdAt'>
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'volunteers', userCredential.user.uid), {
      ...profile,
      email,
      role: 'volunteer',
      createdAt: serverTimestamp(),
    });
    return userCredential;
  } catch (error: any) {
    console.error('Error registering volunteer:', error);
    throw error;
  }
};

export const loginUser = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error: any) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Error logging out:', error);
    throw error;
  }
};

export const getUserProfile = async (
  uid: string
): Promise<{ data: DonorProfile | VolunteerProfile | null; role: UserRole | null }> => {
  try {
    const donorDoc = await getDoc(doc(db, 'donors', uid));
    if (donorDoc.exists()) {
      return { data: donorDoc.data() as DonorProfile, role: 'donor' };
    }
    const volunteerDoc = await getDoc(doc(db, 'volunteers', uid));
    if (volunteerDoc.exists()) {
      return { data: volunteerDoc.data() as VolunteerProfile, role: 'volunteer' };
    }
    return { data: null, role: null };
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Send email verification
export const sendVerificationEmail = async (): Promise<void> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user logged in');
  }
  
  try {
    await sendEmailVerification(user);
  } catch (error: any) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

// Send password reset email
export const sendPasswordReset = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Check if email is verified
export const isEmailVerified = (): boolean => {
  const user = auth.currentUser;
  return user ? user.emailVerified : false;
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

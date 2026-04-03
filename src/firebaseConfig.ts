// Firebase Configuration
// src/firebaseConfig.ts

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBK0Ujvovr9-mR4O3o5Khfc9EzNhYmtfiQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "helping-hands-7f9b6.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://helping-hands-7f9b6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "helping-hands-7f9b6",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "helping-hands-7f9b6.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "305960373322",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:305960373322:web:5636a826ce7216bacd2ab3",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-JGM2Q07W7E"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

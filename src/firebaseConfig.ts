import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBK0Ujvovr9-mR4O3o5Khfc9EzNhYmtfiQ",
  authDomain: "helping-hands-7f9b6.firebaseapp.com",
  databaseURL: "https://helping-hands-7f9b6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "helping-hands-7f9b6",
  storageBucket: "helping-hands-7f9b6.firebasestorage.app",
  messagingSenderId: "305960373322",
  appId: "1:305960373322:web:5636a826ce7216bacd2ab3",
  measurementId: "G-JGM2Q07W7E"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const rtdb = getDatabase(app);
export default app;

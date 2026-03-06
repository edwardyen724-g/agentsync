import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import admin from 'firebase-admin';

let app;
try {
  app = initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
  });
} catch (error) {
  throw new Error(`Failed to initialize Firebase App: ${error instanceof Error ? error.message : String(error)}`);
}

const firestore = getFirestore(app);
const auth = getAuth(app);

export { firestore, collection, getDocs, auth, signInWithEmailAndPassword };
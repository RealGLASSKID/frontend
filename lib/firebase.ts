import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Reuse the existing app instance in dev (Next.js hot reload) instead of
// re-initializing on every module reload, which Firebase throws on.
const firebaseApp: FirebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const db: Firestore = getFirestore(firebaseApp);
export const storage: FirebaseStorage = getStorage(firebaseApp);

export default firebaseApp;

console.log("Firebase config check:", {
  apiKey: firebaseConfig.apiKey ? "present" : "MISSING",
  authDomain: firebaseConfig.authDomain ? "present" : "MISSING",
  projectId: firebaseConfig.projectId ? "present" : "MISSING",
});
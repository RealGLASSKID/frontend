import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  type AuthError,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

export async function signInWithEmail(
  email: string,
  password: string
): Promise<User> {
  const auth = getFirebaseAuth();
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function signOutAdminSession(): Promise<void> {
  const auth = getFirebaseAuth();
  await signOut(auth);
}

export function getAuthErrorMessage(error: unknown): string {
  const authError = error as AuthError;
  const code = authError?.code || "";

  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-disabled":
      return "This account has been disabled. Contact the school administrator.";
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/invalid-credential":
      return "Invalid email or password. Please try again.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/missing-password":
      return "Password is required.";
    case "auth/invalid-api-key":
      return "Firebase API key is missing or invalid. Check your environment variables.";
    default:
      return authError?.message || "Sign in failed. Please try again.";
  }
}

export function onAdminAuthStateChanged(
  callback: (user: User | null) => void
): () => void {
  try {
    const auth = getFirebaseAuth();
    return onAuthStateChanged(auth, callback);
  } catch {
    // Config missing at build/prerender time
    callback(null);
    return () => {};
  }
}

export function getCurrentUser(): User | null {
  try {
    return getFirebaseAuth().currentUser;
  } catch {
    return null;
  }
}

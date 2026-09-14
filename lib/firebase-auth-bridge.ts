import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  type AuthError,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

/**
 * Sign in with real Firebase Email/Password Auth.
 * Create the admin user in Firebase Console → Authentication → Users
 * (or use createUserWithEmailAndPassword once during setup).
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

/**
 * Sign out of Firebase Auth.
 */
export async function signOutAdminSession(): Promise<void> {
  await signOut(auth);
}

/**
 * Get a human-readable error message from Firebase Auth errors.
 */
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
    default:
      return authError?.message || "Sign in failed. Please try again.";
  }
}

/**
 * Subscribe to auth state changes. Useful for protecting the dashboard.
 */
export function onAdminAuthStateChanged(
  callback: (user: User | null) => void
): () => void {
  return onAuthStateChanged(auth, callback);
}

/**
 * Returns the current Firebase user (or null).
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

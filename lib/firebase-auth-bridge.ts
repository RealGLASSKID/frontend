import { getAuth, signInAnonymously, signOut, type Auth } from "firebase/auth";
import firebaseApp from "@/lib/firebase";

const auth: Auth = getAuth(firebaseApp);

/**
 * Signs into Firebase Auth anonymously. This does NOT verify who the
 * person is — it only gives Firestore/Storage security rules something
 * to check (`request.auth != null`) so writes aren't wide open to every
 * unauthenticated request on the internet.
 *
 * Call this immediately after the hardcoded admin/admin123 check in
 * app/admin/page.tsx succeeds.
 */
export async function signInAdminSession(): Promise<void> {
  await signInAnonymously(auth);
}

/**
 * Ends the Firebase Auth session. Call this from the sign-out handler in
 * app/admin/page.tsx alongside clearing the local session.
 */
export async function signOutAdminSession(): Promise<void> {
  await signOut(auth);
}

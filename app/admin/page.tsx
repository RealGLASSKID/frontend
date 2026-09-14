"use client";

import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import LoginForm from "./components/LoginForm";
import Dashboard from "./dashboard";
import {
  signInWithEmail,
  signOutAdminSession,
  onAdminAuthStateChanged,
  getAuthErrorMessage,
} from "@/lib/firebase-auth-bridge";

const SESSION_EVENT = "cns-admin-session-changed";

export interface AdminSession {
  email: string;
  uid: string;
  displayName: string | null;
  signedInAt: string;
}

export default function AdminPage() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string>("");

  useEffect(() => {
    // Listen to real Firebase Auth state (persists across reloads)
    const unsubscribe = onAdminAuthStateChanged((user: User | null) => {
      if (user) {
        const newSession: AdminSession = {
          email: user.email || "",
          uid: user.uid,
          displayName: user.displayName,
          signedInAt: new Date().toISOString(),
        };
        setSession(newSession);
        window.dispatchEvent(new Event(SESSION_EVENT));
      } else {
        setSession(null);
      }
      setIsCheckingSession(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (email: string, password: string): Promise<void> => {
    setLoginError("");

    try {
      const user = await signInWithEmail(email.trim(), password);

      const newSession: AdminSession = {
        email: user.email || email,
        uid: user.uid,
        displayName: user.displayName,
        signedInAt: new Date().toISOString(),
      };

      setSession(newSession);
      window.dispatchEvent(new Event(SESSION_EVENT));
    } catch (error) {
      setLoginError(getAuthErrorMessage(error));
    }
  };

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOutAdminSession();
    } catch (error) {
      console.error("Sign out error:", error);
    }
    setSession(null);
    window.dispatchEvent(new Event(SESSION_EVENT));
  };

  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center surface-cream">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return (
      <LoginForm
        onLogin={handleLogin}
        errorMessage={loginError}
        onClearError={() => setLoginError("")}
      />
    );
  }

  return <Dashboard session={session} onSignOut={handleSignOut} />;
}

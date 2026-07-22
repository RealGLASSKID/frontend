"use client";

import { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import Dashboard from "./dashboard";
import { signInAdminSession, signOutAdminSession } from "@/lib/firebase-auth-bridge";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";
const SESSION_KEY = "cns_admin_session";
const SESSION_EVENT = "cns-admin-session-changed";

export interface AdminSession {
  username: string;
  signedInAt: string;
}

export default function AdminPage() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string>("");

  useEffect(() => {
    const storedSession = window.localStorage.getItem(SESSION_KEY);

    if (storedSession) {
      try {
        const parsedSession = JSON.parse(storedSession) as AdminSession;
        setSession(parsedSession);
        // Firebase Auth persists anonymous sessions across reloads by
        // default, but calling this again is safe — it resolves with the
        // existing anonymous user instead of creating a new one.
        void signInAdminSession();
      } catch {
        window.localStorage.removeItem(SESSION_KEY);
      }
    }

    setIsCheckingSession(false);
  }, []);

  const handleLogin = async (username: string, password: string): Promise<void> => {
    const isValidUsername = username === ADMIN_USERNAME;
    const isValidPassword = password === ADMIN_PASSWORD;

    if (isValidUsername && isValidPassword) {
      try {
        await signInAdminSession();
      } catch (error) {
        setLoginError(
          `Signed in, but couldn't establish a secure session: ${(error as Error).message}`
        );
        return;
      }

      const newSession: AdminSession = {
        username,
        signedInAt: new Date().toISOString(),
      };

      window.localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
      setSession(newSession);
      setLoginError("");
      window.dispatchEvent(new Event(SESSION_EVENT));
      return;
    }

    setLoginError("Invalid credentials. Please try again.");
  };

  const handleSignOut = (): void => {
    window.localStorage.removeItem(SESSION_KEY);
    setSession(null);
    void signOutAdminSession();
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
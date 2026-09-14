"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

export interface LoginFormProps {
  onLogin: (email: string, password: string) => void | Promise<void>;
  errorMessage: string;
  onClearError: () => void;
}

export default function LoginForm({
  onLogin,
  errorMessage,
  onClearError,
}: LoginFormProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await onLogin(email.trim(), password);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center surface-cream px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-card p-8 shadow-soft sm:p-10">
        <p className="eyebrow text-primary">Staff Portal</p>

        <h1 className="font-display mt-2 text-3xl text-primary sm:text-4xl">
          Sign in to C.N.S
        </h1>

        <p className="mt-3 text-sm text-muted-foreground">
          Restricted to authorised staff. Return to the{" "}
          <Link href="/" className="underline underline-offset-2 hover:text-primary">
            public site
          </Link>
          .
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label
              htmlFor="admin-email"
              className="mb-2 block text-sm font-medium text-primary"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="admin@cherrynoble.sch.ng"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  onClearError();
                }}
                className="w-full rounded-full border border-border/40 bg-background py-3 pl-11 pr-4 text-sm text-primary outline-none transition-all duration-300 focus:border-primary"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="mb-2 block text-sm font-medium text-primary"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  onClearError();
                }}
                className="w-full rounded-full border border-border/40 bg-background py-3 pl-11 pr-4 text-sm text-primary outline-none transition-all duration-300 focus:border-primary"
                required
              />
            </div>
          </div>

          {errorMessage ? (
            <div className="flex items-center gap-2 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 rounded-2xl bg-secondary px-5 py-4">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <ShieldCheck className="h-4 w-4" />
            Firebase Authentication
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Use the email and password of an admin user created in your Firebase
            Console → Authentication → Users.
          </p>
        </div>
      </div>
    </div>
  );
}

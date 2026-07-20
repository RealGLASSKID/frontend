"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard } from "lucide-react";

import logo from "@/assets/cns-logo.png";

const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/academics", label: "Academics" },
  { href: "/admissions", label: "Admissions" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
];

const ADMIN_SESSION_KEY = "cns_admin_session";
const ADMIN_SESSION_EVENT = "cns-admin-session-changed";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isAdminSignedIn, setIsAdminSignedIn] = useState(false);

  useEffect(() => {
    const checkAdminSession = () => {
      const storedSession = window.localStorage.getItem(ADMIN_SESSION_KEY);
      setIsAdminSignedIn(Boolean(storedSession));
    };

    checkAdminSession();

    // Fires when the admin logs in/out in this same tab (page.tsx dispatches
    // this manually, since that login flow never triggers a route change
    // that this pathname-based check would otherwise catch).
    window.addEventListener(ADMIN_SESSION_EVENT, checkAdminSession);
    // Fires when the admin session changes in a different tab.
    window.addEventListener("storage", checkAdminSession);

    return () => {
      window.removeEventListener(ADMIN_SESSION_EVENT, checkAdminSession);
      window.removeEventListener("storage", checkAdminSession);
    };
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="container-page flex h-[72px] items-center justify-between">

        {/* Logo */}

        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <Image
            src={logo}
            alt="Cherry Noble School Logo"
            width={40}
            height={40}
            priority
            className="h-10 w-10 object-contain"
          />

          <div className="leading-tight">
            <h2 className="font-display text-lg text-primary">
              Cherry Noble
            </h2>

            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              School · C.N.S
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-secondary text-primary"
                    : "text-foreground/75 hover:bg-secondary/60 hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {isAdminSignedIn ? (
            <Link
              href="/admin"
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                pathname.startsWith("/admin")
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-primary hover:bg-secondary/80"
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Admin
            </Link>
          ) : null}
        </nav>

        {/* Desktop CTA */}

        <Link
          href="/admissions"
          className="btn-primary hidden px-5 py-2.5 text-sm md:inline-flex"
        >
          Apply Now
        </Link>

        {/* Mobile Button */}

        <button
          aria-label="Toggle Menu"
          onClick={() => setOpen(!open)}
          className="rounded-full p-2 text-primary transition hover:bg-secondary md:hidden"
        >
          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}

      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <div className="container-page flex flex-col gap-1 py-3">

            {nav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-secondary text-primary"
                      : "text-foreground/80 hover:bg-secondary/60"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {isAdminSignedIn ? (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  pathname.startsWith("/admin")
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-primary hover:bg-secondary/80"
                }`}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Admin
              </Link>
            ) : null}

            <Link
              href="/admissions"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2 text-sm"
            >
              Apply Now
            </Link>

          </div>
        </div>
      )}
    </header>
  );
}
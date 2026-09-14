import { LogOut } from "lucide-react";
import type { AdminSession } from "../page";

export interface DashboardHeaderProps {
  session: AdminSession;
  onSignOut: () => void;
}

export default function DashboardHeader({
  session,
  onSignOut,
}: DashboardHeaderProps) {
  const displayEmail = session.email || session.displayName || "Admin";

  return (
    <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="eyebrow text-primary">Admin Dashboard</p>
        <h1 className="font-display mt-2 text-3xl text-primary sm:text-4xl">
          Manage C.N.S content
        </h1>
      </div>

      <div className="flex items-center gap-3 self-start sm:self-auto">
        <span className="text-sm text-muted-foreground">{displayEmail}</span>
        <button
          type="button"
          onClick={onSignOut}
          className="btn-ghost flex items-center gap-2 rounded-full border border-border/40 px-4 py-2 text-sm font-medium text-primary transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </header>
  );
}
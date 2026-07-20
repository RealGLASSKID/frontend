import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="m-4 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/40 px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary">
        <Icon className="h-5 w-5" />
      </div>

      <p className="mt-4 text-sm font-medium text-primary">{title}</p>

      {description ? (
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}

      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="btn-primary mt-5 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
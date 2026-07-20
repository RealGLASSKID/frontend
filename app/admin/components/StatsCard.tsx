import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

export interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  count: number;
  subtitle: string;
  onManage: () => void;
}

export default function StatsCard({
  icon: Icon,
  title,
  count,
  subtitle,
  onManage,
}: StatsCardProps) {
  return (
    <div className="rounded-3xl bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-primary">
        <Icon className="h-5 w-5" />
      </div>

      <p className="font-display mt-4 text-4xl text-primary">{count}</p>

      <p className="mt-2 text-base font-medium text-primary">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>

      <button
        type="button"
        onClick={onManage}
        className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary transition-all duration-300 hover:gap-2.5"
      >
        Manage
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
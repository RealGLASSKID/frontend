import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid,
  Newspaper,
  Users,
  Image as ImageIcon,
  ClipboardList,
  Settings,
} from "lucide-react";
import type { AdminSection } from "./types";

export interface SidebarProps {
  activeSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
}

interface NavItem {
  id: AdminSection;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "news", label: "News", icon: Newspaper },
  { id: "staff", label: "Staff", icon: Users },
  { id: "gallery", label: "Gallery", icon: ImageIcon },
  { id: "admissions", label: "Admissions", icon: ClipboardList },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({
  activeSection,
  onSelectSection,
}: SidebarProps) {
  return (
    <nav className="mt-8 overflow-x-auto rounded-full bg-card p-1.5 shadow-soft">
      <ul className="flex min-w-max items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activeSection;
          const Icon = item.icon;

          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelectSection(item.id)}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-accent hover:text-primary"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
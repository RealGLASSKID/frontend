"use client";

import { useState } from "react";
import type { AdminSession } from "./page";
import type { AdminSection } from "./components/types";
import DashboardHeader from "./components/DashboardHeader";
import Sidebar from "./components/Sidebar";
import Overview from "./components/Overview";
import NewsManager from "./components/NewsManager";
import StaffManager from "./components/StaffManager";
import GalleryManager from "./components/GalleryManager";
import AdmissionsManager from "./components/AdmissionsManager";
import SettingsManager from "./components/SettingsManager";

export interface DashboardProps {
  session: AdminSession;
  onSignOut: () => void;
}

export default function Dashboard({ session, onSignOut }: DashboardProps){
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");

  const renderActiveSection = ()=> {
    switch (activeSection) {
      case "overview":
        return <Overview onNavigate={setActiveSection} />;
      case "news":
        return <NewsManager />;
      case "staff":
        return <StaffManager />;
      case "gallery":
        return <GalleryManager />;
      case "admissions":
        return <AdmissionsManager />;
      case "settings":
        return <SettingsManager />;
      default:
        return <Overview onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen surface-cream">
      <div className="container-page py-10">
        <DashboardHeader session={session} onSignOut={onSignOut} />

        <Sidebar activeSection={activeSection} onSelectSection={setActiveSection} />

        <main className="mt-8">{renderActiveSection()}</main>
      </div>
    </div>
  );
}
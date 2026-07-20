"use client";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Newspaper, Users, Image as ImageIcon, ClipboardList } from "lucide-react";
import StatsCard from "./StatsCard";
import type { AdminSection } from "./types";
import { subscribeToNews } from "@/lib/services/news";
import { subscribeToStaff } from "@/lib/services/staff";
import { subscribeToGallery } from "@/lib/services/gallery";
import { subscribeToAdmissions } from "@/lib/services/admission";

export interface OverviewProps {
  onNavigate: (section: AdminSection) => void;
}

interface StatDefinition {
  section: AdminSection;
  icon: LucideIcon;
  title: string;
  count: number;
  subtitle: string;
}

export default function Overview({ onNavigate }: OverviewProps) {
  const [newsCount, setNewsCount] = useState<number>(0);
  const [publishedNewsCount, setPublishedNewsCount] = useState<number>(0);
  const [staffCount, setStaffCount] = useState<number>(0);
  const [galleryCount, setGalleryCount] = useState<number>(0);
  const [admissionsCount, setAdmissionsCount] = useState<number>(0);

  useEffect(() => {
    const unsubscribeNews = subscribeToNews(
      (posts) => {
        setNewsCount(posts.length);
        setPublishedNewsCount(posts.filter((post) => post.isPublished).length);
      },
      () => {
        // Overview stays at 0 on error; individual sections surface the
        // real error message when the admin navigates into them.
      }
    );

    const unsubscribeStaff = subscribeToStaff(
      (members) => setStaffCount(members.length),
      () => {}
    );

    const unsubscribeGallery = subscribeToGallery(
      (images) => setGalleryCount(images.length),
      () => {}
    );

    const unsubscribeAdmissions = subscribeToAdmissions(
      (applications) => setAdmissionsCount(applications.length),
      () => {}
    );

    return () => {
      unsubscribeNews();
      unsubscribeStaff();
      unsubscribeGallery();
      unsubscribeAdmissions();
    };
  }, []);

  const stats: StatDefinition[] = [
    {
      section: "news",
      icon: Newspaper,
      title: "News posts",
      count: newsCount,
      subtitle: `${publishedNewsCount} published`,
    },
    {
      section: "staff",
      icon: Users,
      title: "Staff profiles",
      count: staffCount,
      subtitle: "Team & leadership",
    },
    {
      section: "gallery",
      icon: ImageIcon,
      title: "Gallery images",
      count: galleryCount,
      subtitle: "Campus moments",
    },
    {
      section: "admissions",
      icon: ClipboardList,
      title: "Admissions",
      count: admissionsCount,
      subtitle: "Applications received",
    },
  ];

  return (
    <section>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard
            key={stat.section}
            icon={stat.icon}
            title={stat.title}
            count={stat.count}
            subtitle={stat.subtitle}
            onManage={() => onNavigate(stat.section)}
          />
        ))}
      </div>
    </section>
  );
}
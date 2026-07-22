"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { subscribeToPublishedNews } from "@/lib/services/news";
import type { NewsPost } from "@/app/admin/components/types";

const ROTATE_INTERVAL_MS = 5000;
const MAX_POSTS_SHOWN = 5;

export default function HeroNewsBadge() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = subscribeToPublishedNews(
      (publishedPosts) => {
        setPosts(publishedPosts.slice(0, MAX_POSTS_SHOWN));
      },
      () => {
        // If this fails to load, the badge just stays hidden — the rest
        // of the hero section doesn't depend on it.
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (posts.length < 2) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((previous) => (previous + 1) % posts.length);
    }, ROTATE_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [posts.length]);

  if (posts.length === 0) {
    return null;
  }

  const activePost = posts[activeIndex % posts.length];

  return (
    <Link
      href="/news"
      className="absolute -bottom-8 -left-6 hidden w-56 rounded-3xl border border-border/60 bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-warm md:block"
    >
      <p className="eyebrow">Today at C.N.S</p>
      <p
        key={activePost.id}
        className="mt-2 font-display text-xl leading-tight text-primary transition-opacity duration-300"
      >
        {activePost.title}
      </p>
    </Link>
  );
}
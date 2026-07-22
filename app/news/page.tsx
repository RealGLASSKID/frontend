"use client";

import { useEffect, useState } from "react";
import { Calendar, ArrowRight } from "lucide-react";
import { subscribeToPublishedNews } from "@/lib/services/news";
import type { NewsPost } from "@/app/admin/components/types";

function formatDisplayDate(isoDate: string): string {
  const parsed = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }
  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function News() {
  const [newsItems, setNewsItems] = useState<NewsPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const unsubscribe = subscribeToPublishedNews(
      (posts) => {
        setNewsItems(posts);
        setIsLoading(false);
      },
      (error) => {
        setErrorMessage(`Couldn't load news: ${error.message}`);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <main className="pt-16">
      <section className="container-page py-16">
        <span className="eyebrow">What's happening</span>
        <h1 className="mt-3 font-display text-5xl text-primary md:text-6xl">
          News &amp; Events
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          What's happening on campus.
        </p>
      </section>

      <section className="container-page pb-24">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : errorMessage ? (
          <p className="text-center text-muted-foreground">{errorMessage}</p>
        ) : newsItems.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No news posts yet. Check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {newsItems.map((item, index) => {
              const isFeatured = index === 0;

              return (
                <article
                  key={item.id}
                  className={`rounded-[2rem] p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-warm ${
                    isFeatured ? "surface-cream md:col-span-2" : "bg-card"
                  }`}
                >
                  <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
                    {item.category}
                  </span>

                  <div className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDisplayDate(item.date)}
                  </div>

                  <h3
                    className={`mt-4 font-display leading-tight text-primary ${
                      isFeatured ? "text-3xl md:text-4xl" : "text-2xl"
                    }`}
                  >
                    {item.title}
                  </h3>

                  <p className="mt-3 text-muted-foreground">{item.summary}</p>

                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-all duration-300 hover:gap-2.5">
                    Read more
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
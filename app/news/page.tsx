"use client";

import { useEffect, useState } from "react";
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
      <section className="container mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold mb-4">News &amp; Events</h1>
        <p className="text-xl text-gray-600">What&apos;s happening on campus.</p>
      </section>

      <section className="container mx-auto px-6 pb-20">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
          </div>
        ) : errorMessage ? (
          <p className="text-center text-gray-500">{errorMessage}</p>
        ) : newsItems.length === 0 ? (
          <p className="text-center text-gray-500">
            No news posts yet. Check back soon.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {newsItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border rounded-3xl p-8 hover:shadow-lg transition"
              >
                <div className="uppercase text-xs tracking-widest text-amber-600 mb-2">
                  {item.category}
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  {formatDisplayDate(item.date)}
                </div>
                <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.summary}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
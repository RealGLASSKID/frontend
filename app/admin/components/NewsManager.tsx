"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Send,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import EmptyState from "./EmptyState";
import type { NewsCategory, NewsPost } from "./types";
import {
  subscribeToNews,
  addNewsPost,
  updateNewsPost,
  deleteNewsPost,
  toggleNewsPublish,
} from "@/lib/services/news";

const NEWS_CATEGORIES: NewsCategory[] = [
  "Announcement",
  "Event",
  "Achievement",
  "Community",
  "Notice",
  "Sports",
  "Admissions",
];

interface NewsFormValues {
  title: string;
  summary: string;
  category: NewsCategory;
  date: string;
}

function getTodayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

const EMPTY_FORM_VALUES: NewsFormValues = {
  title: "",
  summary: "",
  category: "Announcement",
  date: getTodayIsoDate(),
};

export default function NewsManager() {
  const [newsItems, setNewsItems] = useState<NewsPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<NewsCategory | "all">("all");
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<NewsFormValues>(EMPTY_FORM_VALUES);

  useEffect(() => {
    const unsubscribe = subscribeToNews(
      (posts) => {
        setNewsItems(posts);
        setIsLoading(false);
      },
      (error) => {
        setErrorMessage(`Couldn't load news posts: ${error.message}`);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredNews = useMemo<NewsPost[]>(() => {
    return newsItems.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [newsItems, searchQuery, categoryFilter]);

  const openAddForm = (): void => {
    setEditingId(null);
    setFormValues({ ...EMPTY_FORM_VALUES, date: getTodayIsoDate() });
    setIsFormOpen(true);
  };

  const openEditForm = (item: NewsPost): void => {
    setEditingId(item.id);
    setFormValues({
      title: item.title,
      summary: item.summary,
      category: item.category,
      date: item.date,
    });
    setIsFormOpen(true);
  };

  const closeForm = (): void => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormValues(EMPTY_FORM_VALUES);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!formValues.title.trim() || !formValues.summary.trim()) {
      return;
    }

    try {
      if (editingId) {
        await updateNewsPost(editingId, {
          title: formValues.title.trim(),
          summary: formValues.summary.trim(),
          category: formValues.category,
          date: formValues.date,
        });
      } else {
        await addNewsPost({
          title: formValues.title.trim(),
          summary: formValues.summary.trim(),
          category: formValues.category,
          isPublished: false,
          date: formValues.date,
        });
      }
      closeForm();
    } catch (error) {
      setErrorMessage(`Couldn't save the post: ${(error as Error).message}`);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await deleteNewsPost(id);
    } catch (error) {
      setErrorMessage(`Couldn't delete the post: ${(error as Error).message}`);
    }
  };

  const handleTogglePublish = async (item: NewsPost): Promise<void> => {
    try {
      await toggleNewsPublish(item.id, !item.isPublished);
    } catch (error) {
      setErrorMessage(`Couldn't update publish status: ${(error as Error).message}`);
    }
  };

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl text-primary">News posts</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and manage articles shown on the public site.
          </p>
        </div>

        <button
          type="button"
          onClick={() => (isFormOpen ? closeForm() : openAddForm())}
          className="btn-primary flex items-center justify-center gap-2 self-start rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Add news
        </button>
      </div>

      {errorMessage ? (
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      ) : null}

      {isFormOpen ? (
        <form onSubmit={handleSubmit} className="mt-6 rounded-3xl bg-card p-6 shadow-soft">
          <h3 className="text-base font-semibold text-primary">
            {editingId ? "Edit post" : "New post"}
          </h3>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label
                htmlFor="news-title"
                className="mb-2 block text-sm font-medium text-primary"
              >
                Title
              </label>
              <input
                id="news-title"
                type="text"
                value={formValues.title}
                onChange={(event) =>
                  setFormValues((previous) => ({ ...previous, title: event.target.value }))
                }
                placeholder="e.g. Founders' Day Celebration Recap"
                className="w-full rounded-full border border-border/40 bg-background px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary"
                required
              />
            </div>

            <div>
              <label
                htmlFor="news-category"
                className="mb-2 block text-sm font-medium text-primary"
              >
                Category
              </label>
              <select
                id="news-category"
                value={formValues.category}
                onChange={(event) =>
                  setFormValues((previous) => ({
                    ...previous,
                    category: event.target.value as NewsCategory,
                  }))
                }
                className="w-full rounded-full border border-border/40 bg-background px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary"
              >
                {NEWS_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="news-summary"
                className="mb-2 block text-sm font-medium text-primary"
              >
                Summary
              </label>
              <textarea
                id="news-summary"
                value={formValues.summary}
                onChange={(event) =>
                  setFormValues((previous) => ({ ...previous, summary: event.target.value }))
                }
                placeholder="A short summary shown on the public news page (1-3 sentences)."
                rows={3}
                className="w-full rounded-2xl border border-border/40 bg-background px-4 py-3 text-sm text-primary outline-none transition-all duration-300 focus:border-primary"
                required
              />
            </div>

            <div>
              <label
                htmlFor="news-date"
                className="mb-2 block text-sm font-medium text-primary"
              >
                Date
              </label>
              <input
                id="news-date"
                type="date"
                value={formValues.date}
                onChange={(event) =>
                  setFormValues((previous) => ({ ...previous, date: event.target.value }))
                }
                className="w-full rounded-full border border-border/40 bg-background px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary"
                required
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Defaults to today. Change this to backdate a post to when it actually happened.
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              type="submit"
              className="btn-primary rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              {editingId ? "Save changes" : "Save post"}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="btn-ghost rounded-full border border-border/40 px-5 py-2.5 text-sm font-medium text-primary transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search news posts"
            className="w-full rounded-full border border-border/40 bg-card py-2.5 pl-11 pr-4 text-sm text-primary outline-none transition-all duration-300 focus:border-primary"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(event.target.value as NewsCategory | "all")
          }
          className="rounded-full border border-border/40 bg-card px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary sm:w-56"
        >
          <option value="all">All categories</option>
          {NEWS_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl bg-card shadow-soft">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : filteredNews.length === 0 ? (
          <EmptyState
            title="No news posts found"
            description="Try adjusting your search or filter, or add a new post."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Published</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNews.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border/40 transition-all duration-300 last:border-b-0 hover:bg-accent/40"
                  >
                    <td className="px-6 py-4 font-medium text-primary">{item.title}</td>
                    <td className="px-6 py-4 text-muted-foreground">{item.category}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          item.isPublished
                            ? "bg-primary/10 text-primary"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {item.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{item.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(item)}
                          aria-label="Edit"
                          className="rounded-full p-2 text-primary transition-all duration-300 hover:bg-accent"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(item)}
                          aria-label={item.isPublished ? "Unpublish" : "Publish"}
                          className="rounded-full p-2 text-primary transition-all duration-300 hover:bg-accent"
                        >
                          {item.isPublished ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          aria-label="Delete"
                          className="rounded-full p-2 text-destructive transition-all duration-300 hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
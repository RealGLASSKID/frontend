import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  type Unsubscribe,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { NewsPost } from "@/app/admin/components/types";

const NEWS_COLLECTION = "news";

function mapDocToNewsPost(snapshot: QueryDocumentSnapshot<DocumentData>): NewsPost {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    title: data.title as string,
    summary: (data.summary as string) ?? "",
    category: data.category as NewsPost["category"],
    isPublished: data.isPublished as boolean,
    date: data.date as string,
  };
}

/**
 * Admin-only: returns every post (draft and published). Requires an
 * authenticated session per firestore.rules — used by NewsManager.tsx.
 */
export function subscribeToNews(
  onChange: (posts: NewsPost[]) => void,
  onError: (error: Error) => void
): Unsubscribe {
  const newsQuery = query(collection(db, NEWS_COLLECTION), orderBy("date", "desc"));

  return onSnapshot(
    newsQuery,
    (snapshot) => {
      const posts = snapshot.docs.map(mapDocToNewsPost);
      onChange(posts);
    },
    (error) => onError(error)
  );
}

/**
 * Public: returns only published posts. This query filters on
 * `isPublished` directly (rather than relying on the security rule alone)
 * because Firestore requires a list query to filter on the same field the
 * rule checks in order to allow it for unauthenticated visitors — used by
 * the public app/news page.
 *
 * NOTE: the first time this runs, Firestore may show a console error with
 * a link to create a required composite index (isPublished + date). Click
 * that link once and the index builds itself in a minute or two — this is
 * normal, expected, one-time setup, not a bug.
 */
export function subscribeToPublishedNews(
  onChange: (posts: NewsPost[]) => void,
  onError: (error: Error) => void
): Unsubscribe {
  const publishedNewsQuery = query(
    collection(db, NEWS_COLLECTION),
    where("isPublished", "==", true),
    orderBy("date", "desc")
  );

  return onSnapshot(
    publishedNewsQuery,
    (snapshot) => {
      const posts = snapshot.docs.map(mapDocToNewsPost);
      onChange(posts);
    },
    (error) => onError(error)
  );
}

export async function addNewsPost(data: Omit<NewsPost, "id">): Promise<void> {
  await addDoc(collection(db, NEWS_COLLECTION), data);
}

export async function updateNewsPost(
  id: string,
  data: Partial<Omit<NewsPost, "id">>
): Promise<void> {
  await updateDoc(doc(db, NEWS_COLLECTION, id), data);
}

export async function deleteNewsPost(id: string): Promise<void> {
  await deleteDoc(doc(db, NEWS_COLLECTION, id));
}

export async function toggleNewsPublish(id: string, isPublished: boolean): Promise<void> {
  await updateDoc(doc(db, NEWS_COLLECTION, id), { isPublished });
}
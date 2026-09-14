import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  type Unsubscribe,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import type { GalleryImage } from "@/app/admin/components/types";

const GALLERY_COLLECTION = "gallery";

function mapDocToGalleryImage(
  snapshot: QueryDocumentSnapshot<DocumentData>
): GalleryImage {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    url: data.url as string,
    // Reused field: now stores Cloudinary public_id (for reference)
    storagePath: (data.storagePath as string) || (data.publicId as string) || "",
    title: data.title as string,
    caption: data.caption as string,
    uploadedAt: data.uploadedAt as string,
  };
}

export function subscribeToGallery(
  onChange: (images: GalleryImage[]) => void,
  onError: (error: Error) => void
): Unsubscribe {
  const galleryQuery = query(
    collection(db, GALLERY_COLLECTION),
    orderBy("uploadedAt", "desc")
  );

  return onSnapshot(
    galleryQuery,
    (snapshot) => {
      const images = snapshot.docs.map(mapDocToGalleryImage);
      onChange(images);
    },
    (error) => onError(error)
  );
}

/**
 * Upload image to Cloudinary, then save metadata in Firestore.
 */
export function uploadGalleryImage(
  file: File,
  title: string,
  caption: string,
  onProgress: (progress: number) => void,
  onComplete: () => void,
  onError: (error: Error) => void
): void {
  uploadToCloudinary(file, onProgress, { folder: "cherry-noble/gallery" })
    .then(async (result) => {
      await addDoc(collection(db, GALLERY_COLLECTION), {
        url: result.secureUrl,
        storagePath: result.publicId, // Cloudinary public_id
        publicId: result.publicId,
        title: title.trim() || file.name,
        caption: caption.trim(),
        uploadedAt: new Date().toISOString().slice(0, 10),
      });
      onComplete();
    })
    .catch((error) => onError(error as Error));
}

/**
 * Delete Firestore record only.
 * (Cloudinary deletion needs Admin API / signed requests — do that from a server route later if needed.)
 */
export async function deleteGalleryImage(
  id: string,
  _storagePath: string
): Promise<void> {
  await deleteDoc(doc(db, GALLERY_COLLECTION, id));
}

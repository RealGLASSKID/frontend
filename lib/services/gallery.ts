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
  import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
    type UploadTaskSnapshot,
  } from "firebase/storage";
  import { db, storage } from "@/lib/firebase";
  import type { GalleryImage } from "@/app/admin/components/types";
  
  const GALLERY_COLLECTION = "gallery";
  const GALLERY_STORAGE_FOLDER = "gallery";
  
  function mapDocToGalleryImage(snapshot: QueryDocumentSnapshot<DocumentData>): GalleryImage {
    const data = snapshot.data();
  
    return {
      id: snapshot.id,
      url: data.url as string,
      storagePath: data.storagePath as string,
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
  
  export function uploadGalleryImage(
    file: File,
    title: string,
    caption: string,
    onProgress: (progress: number) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): void {
    const storagePath = `${GALLERY_STORAGE_FOLDER}/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    uploadTask.on(
      "state_changed",
      (snapshot: UploadTaskSnapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        onProgress(progress);
      },
      (error) => onError(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((url) =>
            addDoc(collection(db, GALLERY_COLLECTION), {
              url,
              storagePath,
              title: title.trim() || file.name,
              caption: caption.trim(),
              uploadedAt: new Date().toISOString().slice(0, 10),
            })
          )
          .then(() => onComplete())
          .catch((error) => onError(error as Error));
      }
    );
  }
  
  export async function deleteGalleryImage(id: string, storagePath: string): Promise<void> {
    await deleteDoc(doc(db, GALLERY_COLLECTION, id));
    await deleteObject(ref(storage, storagePath)).catch(() => {
      // Firestore record is already gone; a missing storage object shouldn't
      // block the UI from reflecting the deletion.
    });
  }
  
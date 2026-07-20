"use client";

import { useEffect, useState } from "react";
import { Trash2, ImageOff, AlertCircle } from "lucide-react";
import UploadZone from "./UploadZone";
import EmptyState from "./EmptyState";
import type { GalleryImage, UploadingImage } from "./types";
import {
  subscribeToGallery,
  uploadGalleryImage,
  deleteGalleryImage,
} from "@/lib/services/gallery";

export default function GalleryManager() {
  const [galleryItems, setGalleryItems] = useState<GalleryImage[]>([]);
  const [uploadingItems, setUploadingItems] = useState<UploadingImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [caption, setCaption] = useState<string>("");

  useEffect(() => {
    const unsubscribe = subscribeToGallery(
      (images) => {
        setGalleryItems(images);
        setIsLoading(false);
      },
      (error) => {
        setErrorMessage(`Couldn't load gallery: ${error.message}`);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleFilesSelected = (files: FileList): void => {
    Array.from(files).forEach((file) => {
      const uploadId = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      setUploadingItems((previous) => [
        ...previous,
        { id: uploadId, fileName: file.name, progress: 0 },
      ]);

      uploadGalleryImage(
        file,
        title,
        caption,
        (progress) => {
          setUploadingItems((previous) =>
            previous.map((item) =>
              item.id === uploadId ? { ...item, progress } : item
            )
          );
        },
        () => {
          setUploadingItems((previous) => previous.filter((item) => item.id !== uploadId));
        },
        (error) => {
          setUploadingItems((previous) => previous.filter((item) => item.id !== uploadId));
          setErrorMessage(`Couldn't upload ${file.name}: ${error.message}`);
        }
      );
    });

    setTitle("");
    setCaption("");
  };

  const handleDelete = async (image: GalleryImage): Promise<void> => {
    try {
      await deleteGalleryImage(image.id, image.storagePath);
    } catch (error) {
      setErrorMessage(`Couldn't delete image: ${(error as Error).message}`);
    }
  };

  return (
    <section>
      <div>
        <h2 className="font-display text-2xl text-primary">Gallery</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload and curate campus photography for the public site.
        </p>
      </div>

      {errorMessage ? (
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      ) : null}

      <div className="mt-6 rounded-3xl bg-card p-6 shadow-soft">
        <h3 className="text-base font-semibold text-primary">Upload new image</h3>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="gallery-title"
              className="mb-2 block text-sm font-medium text-primary"
            >
              Title (optional)
            </label>
            <input
              id="gallery-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-full border border-border/40 bg-background px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary"
            />
          </div>

          <div>
            <label
              htmlFor="gallery-caption"
              className="mb-2 block text-sm font-medium text-primary"
            >
              Caption (optional)
            </label>
            <input
              id="gallery-caption"
              type="text"
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              className="w-full rounded-full border border-border/40 bg-background px-4 py-2.5 text-sm text-primary outline-none transition-all duration-300 focus:border-primary"
            />
          </div>
        </div>

        <div className="mt-5">
          <UploadZone onFilesSelected={handleFilesSelected} />
        </div>

        {uploadingItems.length > 0 ? (
          <div className="mt-5 space-y-3">
            {uploadingItems.map((item) => (
              <div key={item.id} className="rounded-2xl bg-secondary px-4 py-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate pr-4 text-primary">{item.fileName}</span>
                  <span className="text-muted-foreground">{item.progress}%</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-background">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="flex items-center justify-center rounded-3xl bg-card py-16 shadow-soft">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : galleryItems.length === 0 ? (
          <div className="rounded-3xl bg-card shadow-soft">
            <EmptyState
              title="No images uploaded yet"
              description="Upload your first campus photo to start building the gallery."
              icon={ImageOff}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((image) => (
              <div
                key={image.id}
                className="group overflow-hidden rounded-3xl bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={image.title}
                    className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={() => handleDelete(image)}
                    aria-label="Delete image"
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-destructive opacity-0 shadow-soft transition-all duration-300 group-hover:opacity-100 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="p-4">
                  <p className="truncate text-sm font-medium text-primary">{image.title}</p>
                  {image.caption ? (
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {image.caption}
                    </p>
                  ) : null}
                  <p className="mt-2 text-xs text-muted-foreground">{image.uploadedAt}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

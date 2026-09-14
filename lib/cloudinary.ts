/**
 * Cloudinary unsigned upload helper (browser-side).
 *
 * Required env vars (set in .env.local):
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
 *   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
 *
 * Optional:
 *   NEXT_PUBLIC_CLOUDINARY_FOLDER  (default: "cherry-noble")
 *
 * Create an UNSIGNED upload preset in Cloudinary:
 *   Settings → Upload → Upload presets → Add upload preset
 *   Signing mode: Unsigned
 *   Folder: cherry-noble (or whatever you prefer)
 */

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  secureUrl: string;
}

function getConfig() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const folder = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "cherry-noble";

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local"
    );
  }

  return { cloudName, uploadPreset, folder };
}

/**
 * Upload a file to Cloudinary with progress reporting.
 * Uses unsigned upload preset (safe for client-side with restricted preset).
 */
export function uploadToCloudinary(
  file: File,
  onProgress: (progress: number) => void,
  options?: { folder?: string }
): Promise<CloudinaryUploadResult> {
  const { cloudName, uploadPreset, folder } = getConfig();
  const targetFolder = options?.folder || folder;

  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", targetFolder);

    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
    );

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve({
            url: data.secure_url || data.url,
            publicId: data.public_id,
            secureUrl: data.secure_url || data.url,
          });
        } catch {
          reject(new Error("Failed to parse Cloudinary response"));
        }
      } else {
        try {
          const err = JSON.parse(xhr.responseText);
          reject(new Error(err.error?.message || `Upload failed (${xhr.status})`));
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => reject(new Error("Network error during Cloudinary upload"));
    xhr.send(formData);
  });
}

/**
 * Simple upload without progress (for logo etc.)
 */
export async function uploadToCloudinarySimple(
  file: File,
  options?: { folder?: string }
): Promise<CloudinaryUploadResult> {
  return uploadToCloudinary(file, () => {}, options);
}

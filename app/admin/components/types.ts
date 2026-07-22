export type AdminSection =
  | "overview"
  | "news"
  | "staff"
  | "gallery"
  | "admissions"
  | "settings";

export type NewsCategory =
  | "Announcement"
  | "Event"
  | "Achievement"
  | "Community"
  | "Notice"
  | "Sports"
  | "Admissions";

export interface NewsPost {
  id: string;
  title: string;
  summary: string;
  category: NewsCategory;
  isPublished: boolean;
  date: string;
}

export interface StaffMember {
  id: string;
  name: string;
  department: string;
  position: string;
  phone: string;
  email: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  storagePath: string;
  title: string;
  caption: string;
  uploadedAt: string;
}

export interface UploadingImage {
  id: string;
  fileName: string;
  progress: number;
}

export type AdmissionStatus = "pending" | "approved" | "rejected";

export interface AdmissionApplication {
  id: string;
  applicantName: string;
  gradeAppliedFor: string;
  email: string;
  phone: string;
  submittedDate: string;
  status: AdmissionStatus;
}

export interface SchoolSettings {
  schoolName: string;
  principalName: string;
  phone: string;
  email: string;
  address: string;
  logoUrl: string;
}
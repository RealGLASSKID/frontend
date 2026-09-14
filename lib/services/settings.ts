import {
  doc,
  onSnapshot,
  setDoc,
  type Unsubscribe,
  type DocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadToCloudinarySimple } from "@/lib/cloudinary";
import type { SchoolSettings } from "@/app/admin/components/types";

const SETTINGS_COLLECTION = "settings";
const SETTINGS_DOC_ID = "school-profile";

const DEFAULT_SETTINGS: SchoolSettings = {
  schoolName: "Cherry Noble School",
  principalName: "",
  phone: "",
  email: "",
  address: "",
  logoUrl: "",
};

function mapDocToSchoolSettings(
  snapshot: DocumentSnapshot<DocumentData>
): SchoolSettings {
  if (!snapshot.exists()) {
    return DEFAULT_SETTINGS;
  }

  const data = snapshot.data();

  return {
    schoolName: (data.schoolName as string) ?? DEFAULT_SETTINGS.schoolName,
    principalName: (data.principalName as string) ?? "",
    phone: (data.phone as string) ?? "",
    email: (data.email as string) ?? "",
    address: (data.address as string) ?? "",
    logoUrl: (data.logoUrl as string) ?? "",
  };
}

function getSettingsDocRef() {
  return doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
}

export function subscribeToSettings(
  onChange: (settings: SchoolSettings) => void,
  onError: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    getSettingsDocRef(),
    (snapshot) => onChange(mapDocToSchoolSettings(snapshot)),
    (error) => onError(error)
  );
}

export async function updateSchoolSettings(
  data: Partial<Omit<SchoolSettings, "logoUrl">>
): Promise<void> {
  await setDoc(getSettingsDocRef(), data, { merge: true });
}

/**
 * Upload school logo to Cloudinary and save URL in Firestore settings.
 */
export async function uploadSchoolLogo(file: File): Promise<string> {
  const result = await uploadToCloudinarySimple(file, {
    folder: "cherry-noble/settings",
  });
  const logoUrl = result.secureUrl;
  await setDoc(getSettingsDocRef(), { logoUrl }, { merge: true });
  return logoUrl;
}

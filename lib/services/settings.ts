import {
    doc,
    onSnapshot,
    setDoc,
    type Unsubscribe,
    type DocumentSnapshot,
    type DocumentData,
  } from "firebase/firestore";
  import {
    ref,
    uploadBytes,
    getDownloadURL,
  } from "firebase/storage";
  import { db, storage } from "@/lib/firebase";
  import type { SchoolSettings } from "@/app/admin/components/types";
  
  const SETTINGS_COLLECTION = "settings";
  const SETTINGS_DOC_ID = "school-profile";
  const LOGO_STORAGE_PATH = "settings/logo";
  
  const DEFAULT_SETTINGS: SchoolSettings = {
    schoolName: "Cherry Noble School",
    principalName: "",
    phone: "",
    email: "",
    address: "",
    logoUrl: "",
  };
  
  function mapDocToSchoolSettings(snapshot: DocumentSnapshot<DocumentData>): SchoolSettings {
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
  
  export async function uploadSchoolLogo(file: File): Promise<string> {
    const storageRef = ref(storage, LOGO_STORAGE_PATH);
    await uploadBytes(storageRef, file);
    const logoUrl = await getDownloadURL(storageRef);
    await setDoc(getSettingsDocRef(), { logoUrl }, { merge: true });
    return logoUrl;
  }
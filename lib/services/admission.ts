import {
    collection,
    addDoc,
    updateDoc,
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
  import type { AdmissionApplication, AdmissionStatus } from "@/app/admin/components/types";
  
  const ADMISSIONS_COLLECTION = "admissions";
  
  function mapDocToAdmissionApplication(
    snapshot: QueryDocumentSnapshot<DocumentData>
  ): AdmissionApplication {
    const data = snapshot.data();
  
    return {
      id: snapshot.id,
      applicantName: data.applicantName as string,
      gradeAppliedFor: data.gradeAppliedFor as string,
      email: data.email as string,
      phone: data.phone as string,
      submittedDate: data.submittedDate as string,
      status: data.status as AdmissionStatus,
    };
  }
  
  export function subscribeToAdmissions(
    onChange: (applications: AdmissionApplication[]) => void,
    onError: (error: Error) => void
  ): Unsubscribe {
    const admissionsQuery = query(
      collection(db, ADMISSIONS_COLLECTION),
      orderBy("submittedDate", "desc")
    );
  
    return onSnapshot(
      admissionsQuery,
      (snapshot) => {
        const applications = snapshot.docs.map(mapDocToAdmissionApplication);
        onChange(applications);
      },
      (error) => onError(error)
    );
  }
  
  /**
   * Used by the public admission form (app/admission) to submit a new
   * application. New applications default to "pending" status.
   */
  export async function submitAdmissionApplication(
    data: Omit<AdmissionApplication, "id" | "status" | "submittedDate">
  ): Promise<void> {
    await addDoc(collection(db, ADMISSIONS_COLLECTION), {
      ...data,
      status: "pending" satisfies AdmissionStatus,
      submittedDate: new Date().toISOString().slice(0, 10),
    });
  }
  
  export async function updateAdmissionStatus(
    id: string,
    status: AdmissionStatus
  ): Promise<void> {
    await updateDoc(doc(db, ADMISSIONS_COLLECTION, id), { status });
  }
  
  export async function deleteAdmissionApplication(id: string): Promise<void> {
    await deleteDoc(doc(db, ADMISSIONS_COLLECTION, id));
  }
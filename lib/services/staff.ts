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
  import type { StaffMember } from "@/app/admin/components/types";
  
  const STAFF_COLLECTION = "staff";
  
  function mapDocToStaffMember(snapshot: QueryDocumentSnapshot<DocumentData>): StaffMember {
    const data = snapshot.data();
  
    return {
      id: snapshot.id,
      name: data.name as string,
      department: data.department as string,
      position: data.position as string,
      phone: data.phone as string,
      email: data.email as string,
    };
  }
  
  export function subscribeToStaff(
    onChange: (members: StaffMember[]) => void,
    onError: (error: Error) => void
  ): Unsubscribe {
    const staffQuery = query(collection(db, STAFF_COLLECTION), orderBy("name", "asc"));
  
    return onSnapshot(
      staffQuery,
      (snapshot) => {
        const members = snapshot.docs.map(mapDocToStaffMember);
        onChange(members);
      },
      (error) => onError(error)
    );
  }
  
  export async function addStaffMember(data: Omit<StaffMember, "id">): Promise<void> {
    await addDoc(collection(db, STAFF_COLLECTION), data);
  }
  
  export async function updateStaffMember(
    id: string,
    data: Partial<Omit<StaffMember, "id">>
  ): Promise<void> {
    await updateDoc(doc(db, STAFF_COLLECTION, id), data);
  }
  
  export async function deleteStaffMember(id: string): Promise<void> {
    await deleteDoc(doc(db, STAFF_COLLECTION, id));
  }
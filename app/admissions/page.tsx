import type { Metadata } from "next";
import Admissions from "./admission";

export const metadata: Metadata = {
  title: "Admissions — Cherry Noble School",
  description:
    "Apply to Cherry Noble School. Open admissions for KG through JSS3 for the 2026 session.",
  openGraph: {
    title: "Admissions — Cherry Noble School",
    description: "Apply for the 2026 session — KG through JSS3.",
  },
};

export default function Page() {
  return <Admissions />;
}
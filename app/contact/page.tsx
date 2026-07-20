import type { Metadata } from "next";
import Contact from "./contact";

export const metadata: Metadata = {
  title: "Contact — Cherry Noble School",
  description:
    "Get in touch with Cherry Noble School. Visit our campus in Lagos or send us a message.",
  openGraph: {
    title: "Contact Cherry Noble School",
    description: "Visit, call, or message us.",
  },
};

export default function Page() {
  return <Contact />;
}
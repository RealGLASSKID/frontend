import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Cherry Noble School",
    template: "%s — Cherry Noble School",
  },
  description:
    "Cherry Noble School is a warm, disciplined learning home in Lagos. KG through JSS3.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

import logo from "@/assets/cns-logo.png";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary text-secondary-foreground">
      <div className="container-page grid gap-10 py-16 md:grid-cols-4">

        {/* School Info */}

        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-3">
            <Image
              src={logo}
              alt="Cherry Noble School Logo"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />

            <div>
              <h3 className="font-display text-xl text-primary">
                Cherry Noble School
              </h3>

              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                C.N.S
              </p>
            </div>
          </div>

          <p className="max-w-md text-sm text-muted-foreground">
            Nurturing curious minds and kind hearts from Kindergarten through
            JSS3. A warm, disciplined learning home where every child belongs.
          </p>
        </div>

        {/* Quick Links */}

        <div>
          <h4 className="text-sm font-semibold text-primary">
            Explore
          </h4>

          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link
                href="/about"
                className="transition-colors hover:text-primary"
              >
                About Us
              </Link>
            </li>

            <li>
              <Link
                href="/academics"
                className="transition-colors hover:text-primary"
              >
                Academics
              </Link>
            </li>

            <li>
              <Link
                href="/admissions"
                className="transition-colors hover:text-primary"
              >
                Admissions
              </Link>
            </li>

            <li>
              <Link
                href="/news"
                className="transition-colors hover:text-primary"
              >
                News & Events
              </Link>
            </li>

            <li>
              <Link
                href="/contact"
                className="transition-colors hover:text-primary"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}

        <div>
          <h4 className="text-sm font-semibold text-primary">
            Reach Us
          </h4>

          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">

            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>12 Noble Avenue, Lagos, Nigeria</span>
            </li>

            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>+234 800 000 0000</span>
            </li>

            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>hello@cherrynoble.sch.ng</span>
            </li>

          </ul>
        </div>
      </div>

      {/* Bottom Bar */}

      <div className="border-t border-border/60">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">

          <span>
            © {new Date().getFullYear()} Cherry Noble School. All rights
            reserved.
          </span>

          <span>
            Built with care for KG – JSS3 learners.
          </span>

        </div>
      </div>
    </footer>
  );
}
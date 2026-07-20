"use client"
import Link from "next/link";
import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";

const steps = [
  {
    n: "01",
    t: "Enquire",
    b: "Send us a short note about your child. We'll respond within 2 working days with next steps.",
  },
  {
    n: "02",
    t: "Visit the campus",
    b: "Book a guided tour. Meet our teachers, walk the classrooms, ask anything.",
  },
  {
    n: "03",
    t: "Assessment",
    b: "An age-appropriate, low-pressure conversation and short written exercise (Primary & JSS only).",
  },
  {
    n: "04",
    t: "Offer & Enrolment",
    b: "Receive an offer within one week. Complete enrolment and welcome to C.N.S.",
  },
];

const fees = [
  {
    stage: "Kindergarten",
    tuition: "₦450,000",
    inc: "Books, uniform, meals",
  },
  {
    stage: "Primary 1 – 6",
    tuition: "₦620,000",
    inc: "Books, lab fees, meals",
  },
  {
    stage: "JSS 1 – 3",
    tuition: "₦780,000",
    inc: "Books, lab fees, BECE prep",
  },
];

export default function AdmissionsPage() {
  return (
    <>
      <section className="container-page py-20 md:py-28">
        <span className="eyebrow">Admissions 2026</span>

        <h1 className="mt-3 max-w-3xl font-display text-5xl leading-[1.05] text-primary md:text-7xl">
          Begin a school year your child will love.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          We accept applications for KG through JSS3. Spaces are limited each
          year — we encourage families to start early.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#apply" className="btn-primary">
            Start application
            <ArrowRight className="h-4 w-4" />
          </a>

          <Link href="/contact" className="btn-ghost">
            Book a tour
          </Link>
        </div>
      </section>

      <section className="surface-cream py-24">
        <div className="container-page">
          <span className="eyebrow">How it works</span>

          <h2 className="mt-3 max-w-2xl font-display text-4xl text-primary md:text-5xl">
            Four simple steps, start to finish.
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div
                key={s.n}
                className="rounded-3xl border border-border/40 bg-card p-7 shadow-soft"
              >
                <div className="font-display text-4xl text-accent">
                  {s.n}
                </div>

                <h3 className="mt-3 font-display text-2xl text-primary">
                  {s.t}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  {s.b}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-24">
        <span className="eyebrow">Fees · 2026 session</span>

        <h2 className="mt-3 max-w-2xl font-display text-4xl text-primary md:text-5xl">
          Honest pricing. No surprises.
        </h2>

        <div className="mt-10 overflow-hidden rounded-3xl border border-border/40 shadow-soft">
          <table className="w-full text-left">
            <thead className="bg-secondary">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-primary">
                  Stage
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-primary">
                  Annual Tuition
                </th>

                <th className="hidden px-6 py-4 text-sm font-semibold text-primary md:table-cell">
                  Includes
                </th>
              </tr>
            </thead>

            <tbody className="bg-card">
              {fees.map((f) => (
                <tr
                  key={f.stage}
                  className="border-t border-border/40"
                >
                  <td className="px-6 py-5 font-display text-lg text-primary">
                    {f.stage}
                  </td>

                  <td className="px-6 py-5">{f.tuition}</td>

                  <td className="hidden px-6 py-5 text-muted-foreground md:table-cell">
                    {f.inc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Sibling discount: 10% off second child, 15% off third.
        </p>
      </section>

      <section id="apply" className="container-page pb-24">
        <div className="rounded-[2.5rem] bg-primary p-8 text-primary-foreground md:p-16">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Start application
              </span>

              <h2 className="mt-3 font-display text-4xl">
                Tell us about your child.
              </h2>

              <p className="mt-3 text-primary-foreground/80">
                Complete this short enquiry and our admissions team will be in
                touch within 2 working days.
              </p>

              <ul className="mt-6 space-y-2 text-sm text-primary-foreground/85">
                {[
                  "No application fee for enquiry",
                  "Reply within 2 working days",
                  "Tour included with every application",
                ].map((x) => (
                  <li
                    key={x}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-4 w-4 text-accent" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-7">
              <ApplicationForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ApplicationForm() {
  const [sent, setSent] = useState(false);
  if (sent) {
    return (
      <div className="rounded-3xl bg-primary-foreground/10 border border-primary-foreground/20 p-10 text-center">
        <Check className="mx-auto h-10 w-10 text-accent" />
        <h3 className="mt-4 font-display text-2xl">Thank you!</h3>
        <p className="mt-2 text-primary-foreground/80">We've received your enquiry and will be in touch shortly.</p>
      </div>
    );
  }
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); setSent(true); }}
      className="rounded-3xl bg-primary-foreground/10 border border-primary-foreground/20 p-6 md:p-8 space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Parent / Guardian name" name="parent" />
        <Field label="Phone" name="phone" type="tel" />
      </div>
      <Field label="Email address" name="email" type="email" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Child's name" name="child" />
        <div>
          <label className="block text-xs uppercase tracking-widest mb-2 text-primary-foreground/70">Applying to</label>
          <select name="stage" className="w-full rounded-xl bg-primary-foreground/10 border border-primary-foreground/25 px-4 py-3 text-primary-foreground outline-none focus:border-accent">
            <option className="text-foreground">Kindergarten</option>
            <option className="text-foreground">Primary 1 – 6</option>
            <option className="text-foreground">JSS 1 – 3</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs uppercase tracking-widest mb-2 text-primary-foreground/70">Tell us about your child</label>
        <textarea name="note" rows={4} className="w-full rounded-xl bg-primary-foreground/10 border border-primary-foreground/25 px-4 py-3 text-primary-foreground outline-none focus:border-accent" />
      </div>
      <button type="submit" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-accent-foreground hover:opacity-95">
        Submit enquiry <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest mb-2 text-primary-foreground/70">{label}</label>
      <input required type={type} name={name} className="w-full rounded-xl bg-primary-foreground/10 border border-primary-foreground/25 px-4 py-3 text-primary-foreground outline-none focus:border-accent" />
    </div>
  );
}

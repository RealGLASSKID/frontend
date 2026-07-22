import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  Heart,
  Sparkles,
  Users,
  Trophy,
  GraduationCap,
} from "lucide-react";

import hero from "@/assets/hero-students.jpg";
import playground from "@/assets/playground.jpg";
import reading from "@/assets/student-reading.jpg";
import HeroNewsBadge from "@/components/HeroNewsBadge";

export const metadata: Metadata = {
  title: "Cherry Noble School (C.N.S) — Where Curious Minds Bloom",
  description:
    "Cherry Noble School nurtures children from Kindergarten through JSS3 in a warm, disciplined community in Lagos.",
  openGraph: {
    title: "Cherry Noble School (C.N.S)",
    description: "Where curious minds bloom — KG to JSS3.",
  },
};

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container-page grid items-center gap-12 py-16 md:grid-cols-12 md:py-24">
          <div className="space-y-7 md:col-span-6">
            <span className="eyebrow">KG · Primary · JSS1–3</span>

            <h1 className="font-display text-5xl leading-[1.05] text-primary md:text-7xl">
              Where curious minds <em className="not-italic text-accent">bloom.</em>
            </h1>

            <p className="max-w-xl text-lg text-muted-foreground">
              Cherry Noble School is a warm, disciplined learning home in the
              heart of Lagos. From first steps in Kindergarten to JSS3
              graduation, we raise confident, kind, and capable children.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/admissions" className="btn-primary">
                Begin Admission <ArrowRight className="h-4 w-4" />
              </Link>

              <Link href="/about" className="btn-ghost">
                Our Story
              </Link>
            </div>

            <dl className="grid max-w-md grid-cols-3 gap-6 border-t border-border/60 pt-6">
              <Stat k="1,200+" v="Pupils" />
              <Stat k="60+" v="Educators" />
              <Stat k="22 yrs" v="Of nurture" />
            </dl>
          </div>

          <div className="relative md:col-span-6">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-warm">
              <Image
                src={hero}
                alt="Cherry Noble School pupils smiling in the courtyard"
                fill
                priority
                className="object-cover"
              />
            </div>

            <HeroNewsBadge />

            <div className="absolute -right-4 -top-6 hidden items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground shadow-warm md:flex">
              <Sparkles className="h-4 w-4" />
              Now accepting 2026 entries
            </div>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="surface-cream py-20">
        <div className="container-page">
          <div className="max-w-2xl">
            <span className="eyebrow">What we stand for</span>

            <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">
              A school built on warmth, rigour, and joy.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Pillar
              icon={Heart}
              title="Whole-child care"
              body="We see every pupil — their interests, their pace, their potential. Small classes, attentive teachers."
            />

            <Pillar
              icon={BookOpen}
              title="Strong foundations"
              body="A blended Nigerian and Cambridge-informed curriculum from KG through JSS3 — literacy, numeracy, and inquiry first."
            />

            <Pillar
              icon={Trophy}
              title="Confident graduates"
              body="Our JSS3 leavers earn places at Nigeria's most selective secondary schools, year after year."
            />
          </div>
        </div>
      </section>

      {/* PRINCIPAL */}
      <section className="container-page py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="relative aspect-[4/5]">
            <Image
              src={reading}
              alt="A pupil reading quietly in class"
              fill
              className="rounded-[2rem] object-cover shadow-soft"
            />
          </div>

          <div className="space-y-6">
            <span className="eyebrow">From our Head of School</span>

            <h2 className="font-display text-4xl leading-tight text-primary md:text-5xl">
              "We don't just teach children. We learn them, then teach them well."
            </h2>

            <p className="text-lg text-muted-foreground">
              At Cherry Noble, every classroom is a small community. Our teachers
              know your child by name, by handwriting, and by the questions they
              like to ask. That's how learning becomes real—and lasting.
            </p>

            <p className="font-display text-lg text-primary">
              — Mrs. Adaeze Okonkwo, Principal
            </p>
          </div>
        </div>
      </section>

      {/* STAGES */}
      <section className="rounded-t-[3rem] bg-primary py-24 text-primary-foreground">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Stages of learning
              </span>

              <h2 className="mt-3 font-display text-4xl md:text-5xl">
                From little hands to bold thinkers.
              </h2>
            </div>

            <Link
              href="/academics"
              className="inline-flex items-center gap-2 text-sm font-medium hover:text-accent"
            >
              Explore academics <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Stage
              icon={Sparkles}
              stage="Kindergarten"
              age="Ages 3 – 5"
              body="Play-based literacy, music, and motor-skills."
            />

            <Stage
              icon={Users}
              stage="Primary 1 – 6"
              age="Ages 6 – 11"
              body="Core literacy and numeracy, the sciences, French, ICT, and character development."
            />

            <Stage
              icon={GraduationCap}
              stage="JSS 1 – 3"
              age="Ages 12 – 14"
              body="National curriculum with Cambridge enrichment."
            />
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="container-page py-24">
        <div className="grid gap-6 md:grid-cols-5">
          <div className="relative overflow-hidden rounded-[2rem] md:col-span-3 aspect-[7/5]">
            <Image
              src={playground}
              alt="Pupils laughing at break time"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-between gap-6 rounded-[2rem] bg-secondary p-8 md:col-span-2">
            <div>
              <span className="eyebrow">Life at C.N.S</span>

              <h3 className="mt-3 font-display text-3xl text-primary">
                More than lessons.
              </h3>

              <p className="mt-3 text-muted-foreground">
                Clubs, choir, robotics, football, debate, art, and our famous
                Friday assembly.
              </p>
            </div>

            <Link href="/news" className="btn-ghost self-start">
              See latest events <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-24">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-accent px-8 py-16 text-accent-foreground md:px-16 md:py-20">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em]">
              Admissions 2026
            </span>

            <h2 className="mt-3 font-display text-4xl md:text-5xl">
              Come and see what your child could become.
            </h2>

            <p className="mt-4 text-lg opacity-90">
              Book a campus tour or start an application today—we'd love to meet
              your family.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/admissions" className="btn-primary">
                Start application <ArrowRight className="h-4 w-4" />
              </Link>

              <Link href="/contact" className="btn-ghost">
                Book a tour
              </Link>
            </div>
          </div>

          <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -right-6 -top-10 h-40 w-40 rounded-full bg-cream/40 blur-2xl" />
        </div>
      </section>
    </>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="font-display text-3xl text-primary">{k}</dt>
      <dd className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
        {v}
      </dd>
    </div>
  );
}

function Pillar({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Heart;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-3xl border border-border/40 bg-card p-8 shadow-soft">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="mt-5 font-display text-2xl text-primary">{title}</h3>

      <p className="mt-2 text-muted-foreground">{body}</p>
    </div>
  );
}

function Stage({
  icon: Icon,
  stage,
  age,
  body,
}: {
  icon: typeof Sparkles;
  stage: string;
  age: string;
  body: string;
}) {
  return (
    <div className="rounded-3xl border border-primary-foreground/15 bg-primary-foreground/5 p-7 backdrop-blur-sm">
      <Icon className="h-6 w-6 text-accent" />

      <h3 className="mt-4 font-display text-2xl">{stage}</h3>

      <p className="text-sm text-accent">{age}</p>

      <p className="mt-3 text-primary-foreground/85">{body}</p>
    </div>
  );
}
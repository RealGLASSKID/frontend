import type { Metadata } from "next";
import Image from "next/image";
import {
  BookOpen,
  Beaker,
  Calculator,
  Globe,
  Music,
  Palette,
  Code,
  Trophy,
} from "lucide-react";

import science from "@/assets/science-lab.jpg";

export const metadata: Metadata = {
  title: "Academics — Cherry Noble School",
  description:
    "Curriculum and learning at Cherry Noble School from Kindergarten through JSS3.",
  openGraph: {
    title: "Academics — Cherry Noble School",
    description:
      "KG through JSS3 — curriculum, programmes, and beyond.",
  },
};

const stages = [
  {
    name: "Kindergarten",
    age: "Ages 3 – 5",
    body: "A play-based foundation. Phonics, early numeracy, music & movement, and the social skills that make learning feel like home.",
    subjects: [
      "Phonics & Reading",
      "Early Numbers",
      "Music & Movement",
      "Art & Craft",
      "Social Play",
    ],
  },
  {
    name: "Primary 1 – 6",
    age: "Ages 6 – 11",
    body: "Strong core foundations across literacy, numeracy, the sciences and humanities — with French, ICT and creative arts woven throughout.",
    subjects: [
      "English Language",
      "Mathematics",
      "Basic Science",
      "Social Studies",
      "French",
      "ICT",
      "Creative Arts",
      "Civic Education",
    ],
  },
  {
    name: "JSS 1 – 3",
    age: "Ages 12 – 14",
    body: "Nigerian national curriculum with Cambridge-informed enrichment. Focused BECE preparation and pupil leadership across houses and clubs.",
    subjects: [
      "English & Literature",
      "Mathematics",
      "Basic Science & Technology",
      "Business Studies",
      "Computer Studies",
      "French",
      "Religious Studies",
      "Pre-Vocational Studies",
    ],
  },
];

const enrichment = [
  { icon: Beaker, label: "Science Club" },
  { icon: Code, label: "Coding & Robotics" },
  { icon: Music, label: "Choir & Band" },
  { icon: Palette, label: "Visual Arts" },
  { icon: Trophy, label: "Sports Houses" },
  { icon: Globe, label: "Debate & Model UN" },
  { icon: Calculator, label: "Math Olympiad" },
  { icon: BookOpen, label: "Reading Circle" },
];

export default function AcademicsPage() {
  return (
    <>
      <section className="container-page py-20 md:py-28">
        <span className="eyebrow">Academics</span>

        <h1 className="mt-3 font-display text-5xl text-primary md:text-7xl max-w-3xl leading-[1.05]">
          A curriculum that meets every child where they are.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          We blend Nigeria&apos;s national curriculum with Cambridge-informed
          enrichment — taught in small classes by educators who actually know
          your child.
        </p>
      </section>

      <section className="container-page space-y-6 pb-20">
        {stages.map((s, i) => (
          <div
            key={s.name}
            className="grid gap-8 rounded-[2rem] border border-border/40 bg-card p-8 shadow-soft md:grid-cols-12 md:p-12"
          >
            <div className="md:col-span-4">
              <div className="font-display text-6xl text-primary/15">
                0{i + 1}
              </div>

              <h2 className="mt-2 font-display text-3xl text-primary">
                {s.name}
              </h2>

              <p className="mt-1 text-sm uppercase tracking-widest text-accent">
                {s.age}
              </p>
            </div>

            <div className="md:col-span-8">
              <p className="text-lg text-muted-foreground">{s.body}</p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {s.subjects.map((sub) => (
                  <li
                    key={sub}
                    className="rounded-full bg-secondary px-4 py-1.5 text-sm text-primary"
                  >
                    {sub}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </section>

      <section className="surface-cream py-24">
        <div className="container-page grid items-center gap-12 md:grid-cols-2">
          <Image
            src={science}
            alt="Pupils using microscopes in the science lab"
            width={1400}
            height={1000}
            className="aspect-[7/5] w-full rounded-[2rem] object-cover shadow-warm"
          />

          <div>
            <span className="eyebrow">Beyond the classroom</span>

            <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">
              Clubs, sports, and the things kids remember.
            </h2>

            <p className="mt-4 text-muted-foreground">
              Every pupil belongs to at least one club and one house. We protect
              time for play, art, music, and movement — because well-rounded
              children grow into wholehearted adults.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {enrichment.map((e) => (
                <div
                  key={e.label}
                  className="flex flex-col items-start gap-2 rounded-2xl border border-border/40 bg-card p-4"
                >
                  <e.icon className="h-5 w-5 text-accent" />

                  <span className="text-sm font-medium text-primary">
                    {e.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
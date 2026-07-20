import type { Metadata } from "next";
import Image from "next/image";

import principal from "@/assets/principal.jpg";
import playground from "@/assets/playground.jpg";

export const metadata: Metadata = {
  title: "About — Cherry Noble School",
  description:
    "Our story, mission, and the people behind Cherry Noble School (C.N.S).",
  openGraph: {
    title: "About Cherry Noble School",
    description: "Our story, mission, and people.",
  },
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="container-page py-20 md:py-28">
        <span className="eyebrow">Our Story</span>

        <h1 className="mt-3 max-w-3xl font-display text-5xl leading-[1.05] text-primary md:text-7xl">
          Twenty-two years of raising kind, curious children.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Cherry Noble School began in 2003 with eight pupils in a single
          classroom. Today, more than 1,200 children call our campus home—and
          our promise to each one of them hasn't changed: warmth, rigour, and
          joy.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="surface-cream py-20">
        <div className="container-page grid gap-12 md:grid-cols-2">
          <div>
            <span className="eyebrow">Mission</span>

            <h2 className="mt-3 font-display text-3xl text-primary md:text-4xl">
              To raise confident, kind, and capable young Nigerians ready for
              the world.
            </h2>
          </div>

          <div>
            <span className="eyebrow">Vision</span>

            <h2 className="mt-3 font-display text-3xl text-primary md:text-4xl">
              A school where every child is known, every teacher is trusted, and
              every day is worth showing up for.
            </h2>
          </div>
        </div>
      </section>

      {/* Principal */}
      <section className="container-page py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-warm">
            <Image
              src={principal}
              alt="Principal Mrs. Lawal-Emiabata, A.S."
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-5">
            <span className="eyebrow">Leadership</span>

            <h2 className="font-display text-4xl text-primary">
              Mrs. Lawal-Emiabata, A.S.
            </h2>

            <p className="text-sm uppercase tracking-widest text-muted-foreground">
              Principal · Head of School
            </p>

            <p className="text-muted-foreground">
              With over two decades in basic education,
              Mrs. Lawal-Emiabata, A.S. leads C.N.S with steady warmth. She
              still teaches one literacy lesson a week because, in her words,
              "you cannot lead a school you haven't taught in."
            </p>

            <p className="text-muted-foreground">
              Under her leadership, C.N.S has been recognised three times as a
              top-ten basic school in Lagos State for BECE outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container-page pb-24">
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { k: "2003", v: "Founded" },
            { k: "1,200+", v: "Pupils Today" },
            { k: "60+", v: "Educators" },
            { k: "98%", v: "BECE Pass Rate" },
          ].map((item) => (
            <div
              key={`${item.k}-${item.v}`}
              className="rounded-3xl border border-border/40 bg-card p-7 shadow-soft"
            >
              <div className="font-display text-4xl text-primary">
                {item.k}
              </div>

              <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                {item.v}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Campus */}
      <section className="container-page pb-24">
        <div className="relative aspect-[7/3] overflow-hidden rounded-[2rem]">
          <Image
            src={playground}
            alt="Cherry Noble School playground"
            fill
            className="object-cover"
          />
        </div>
      </section>
    </>
  );
}
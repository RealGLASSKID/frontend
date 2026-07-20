"use client";

import { useState, type FormEvent } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Check,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";


export default function Contact() {
  return (
    <>
      <section className="container-page py-20 md:py-28">
        <span className="eyebrow">
          Get in touch
        </span>

        <h1 className="mt-3 font-display text-5xl text-primary md:text-7xl max-w-3xl leading-[1.05]">
          Come and say hello.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Visit our campus, send a note, or pick up the phone. We'd love to
          meet your family.
        </p>
      </section>


      <section className="container-page pb-24">
        <div className="grid gap-10 md:grid-cols-12">

          <div className="md:col-span-5 space-y-6">

            <InfoCard
              icon={MapPin}
              title="Visit us"
              lines={[
                "12 Noble Avenue",
                "Ikeja GRA, Lagos",
                "Nigeria",
              ]}
            />


            <InfoCard
              icon={Phone}
              title="Call"
              lines={[
                "+234 800 000 0000",
                "+234 800 000 0001",
              ]}
            />


            <InfoCard
              icon={Mail}
              title="Email"
              lines={[
                "hello@cherrynoble.sch.ng",
                "admissions@cherrynoble.sch.ng",
              ]}
            />


            <InfoCard
              icon={Clock}
              title="Office hours"
              lines={[
                "Mon – Fri · 7:30am – 4:00pm",
                "Sat · 9:00am – 12:00pm (tours)",
              ]}
            />

          </div>


          <div className="md:col-span-7">
            <ContactForm />
          </div>


        </div>
      </section>


      <section className="container-page pb-24">

        <div className="overflow-hidden rounded-[2rem] border border-border/40">

          <iframe
            title="Cherry Noble School location"
            src="https://www.openstreetmap.org/export/embed.html?bbox=3.34,6.58,3.36,6.60&layer=mapnik"
            className="h-[400px] w-full"
            loading="lazy"
          />

        </div>

      </section>
    </>
  );
}



type InfoCardProps = {
  icon: LucideIcon;
  title: string;
  lines: string[];
};



function InfoCard({
  icon: Icon,
  title,
  lines,
}: InfoCardProps) {

  return (

    <div className="rounded-3xl bg-card p-6 border border-border/40 shadow-soft flex gap-4">

      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">

        <Icon className="h-5 w-5" />

      </div>


      <div>

        <h3 className="font-display text-xl text-primary">
          {title}
        </h3>


        <div className="mt-1 text-sm text-muted-foreground space-y-0.5">

          {lines.map((line) => (
            <div key={line}>
              {line}
            </div>
          ))}

        </div>

      </div>

    </div>

  );
}




function ContactForm() {

  const [sent, setSent] = useState<boolean>(false);



  function handleSubmit(e: FormEvent<HTMLFormElement>) {

    e.preventDefault();

    setSent(true);

  }



  if (sent) {

    return (

      <div className="rounded-3xl bg-secondary p-10 text-center">

        <Check className="mx-auto h-10 w-10 text-accent" />


        <h3 className="mt-4 font-display text-2xl text-primary">
          Message received
        </h3>


        <p className="mt-2 text-muted-foreground">
          We'll be in touch within 2 working days.
        </p>


      </div>

    );

  }



  return (

    <form
      onSubmit={handleSubmit}
      className="rounded-3xl bg-card p-6 md:p-8 border border-border/40 shadow-soft space-y-4"
    >

      <div className="grid gap-4 sm:grid-cols-2">

        <Field
          label="Full name"
          name="name"
        />


        <Field
          label="Email"
          name="email"
          type="email"
        />

      </div>



      <Field
        label="Subject"
        name="subject"
      />



      <div>

        <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">
          Message
        </label>


        <textarea
          required
          name="message"
          rows={5}
          className="w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:border-accent"
        />

      </div>



      <button
        type="submit"
        className="btn-primary"
      >

        Send message

        <ArrowRight className="h-4 w-4" />

      </button>


    </form>

  );

}




type FieldProps = {
  label: string;
  name: string;
  type?: string;
};



function Field({
  label,
  name,
  type = "text",
}: FieldProps) {

  return (

    <div>

      <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">
        {label}
      </label>


      <input
        required
        type={type}
        name={name}
        className="w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:border-accent"
      />

    </div>

  );

}
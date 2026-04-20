"use client";

import { motion } from "framer-motion";
import { BriefcaseBusiness, Code2, Mail, MapPin, Phone } from "lucide-react";

type ContactContent = {
  contactEmail: string;
  contactPhone: string;
  contactLocation: string;
  linkedinUrl: string;
  githubUrl: string;
};

export default function Contact({ content }: { content: ContactContent }) {
  const contactLinks = [
    {
      href: `mailto:${content.contactEmail}`,
      label: content.contactEmail,
      icon: Mail,
    },
    {
      href: `tel:${content.contactPhone.replace(/\s+/g, "")}`,
      label: content.contactPhone,
      icon: Phone,
    },
    {
      href: "#",
      label: content.contactLocation,
      icon: MapPin,
    },
  ];

  const socialLinks = [
    { href: content.linkedinUrl, label: "LinkedIn", icon: BriefcaseBusiness },
    { href: content.githubUrl, label: "GitHub", icon: Code2 },
    { href: `mailto:${content.contactEmail}`, label: "Email", icon: Mail },
  ];

  return (
    <section id="contact" className="section-anchor">
      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          className="surface-outline glass-panel relative overflow-hidden rounded-[2rem] px-4 py-10 text-center sm:px-6 sm:py-12 md:px-10 md:py-16"
        >
          <div className="absolute inset-x-[18%] top-[-5rem] h-40 rounded-full bg-[radial-gradient(circle,rgba(124,140,255,0.26),transparent_70%)] blur-3xl" />

          <span className="section-kicker">Contact</span>
          <h2 className="section-title mt-5 gradient-text">Let&apos;s Connect!</h2>
          <p className="mx-auto mt-4 max-w-3xl px-2 text-sm leading-7 text-slate-300 sm:mt-5 sm:text-base sm:leading-8 md:text-lg">
            I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
          </p>

          <div className="mx-auto mt-8 flex max-w-4xl flex-wrap items-center justify-center gap-3 sm:mt-10">
            {contactLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                className="inline-flex max-w-full items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-200 transition hover:-translate-y-0.5 hover:border-cyan-300/20 hover:bg-white/[0.06] sm:px-5"
              >
                <Icon size={16} className="text-cyan-300" />
                <span className="break-all text-left sm:break-normal">{label}</span>
              </a>
            ))}
          </div>

          <div className="mt-10 flex justify-center gap-3">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-100 transition hover:-translate-y-0.5 hover:border-indigo-300/20 hover:bg-indigo-400/12"
                aria-label={label}
                title={label}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { Award, Languages, Sparkles, Wrench } from "lucide-react";

const highlights = [
  {
    icon: Sparkles,
    title: "GenAI Systems",
    text: "RAG pipelines, multimodal workflows, and agent orchestration grounded in production realities.",
  },
  {
    icon: Wrench,
    title: "Cloud & DevOps",
    text: "Azure deployments, Dockerized services, and automation that cut manual setup and friction.",
  },
  {
    icon: Award,
    title: "Hackathon Wins",
    text: "Multiple award-winning prototypes across healthcare and AEC, built under real-world constraints.",
  },
  {
    icon: Languages,
    title: "Cross-cultural Delivery",
    text: "Comfortable working across research teams and multilingual environments in Germany and India.",
  },
];

type AboutContent = {
  aboutTitle: string;
  aboutParagraphs: string[];
  profileImageUrl: string;
};

export default function About({ content }: { content: AboutContent }) {
  return (
    <section id="about" className="section-anchor">
      <div className="section-shell">
        <div className="mb-14 text-center">
          <span className="section-kicker">About Me</span>
          <h2 className="section-title mt-5 gradient-text">A research mindset with an engineer&apos;s delivery discipline</h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.45fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, x: -26 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            className="relative mx-auto w-full max-w-[28rem] lg:mx-0"
          >
            <div className="floating-orb left-1/2 top-10 h-28 w-48 -translate-x-1/2 bg-[radial-gradient(circle,rgba(124,140,255,0.34),transparent_72%)]" />
            <div className="surface-outline glass-panel relative overflow-hidden rounded-[2rem] p-3">
              <div className="relative overflow-hidden rounded-[1.5rem] border border-white/12 bg-slate-950/45">
                <img
                  src={content.profileImageUrl}
                  alt="Ajay Chodankar portrait"
                  className="aspect-[4/5] h-auto w-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 26 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            className="surface-outline glass-panel rounded-[2rem] p-7 md:p-10"
          >
            <h3 className="mb-5 text-2xl font-semibold text-white">{content.aboutTitle}</h3>
            <div className="mb-9 space-y-5">
              {content.aboutParagraphs.map((paragraph) => (
                <p key={paragraph} className="text-lg leading-8 text-slate-300">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {highlights.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
                >
                  <Icon size={20} className="mb-3 text-cyan-300" />
                  <h3 className="mb-2 text-base font-semibold text-white">{title}</h3>
                  <p className="text-sm leading-7 text-slate-400">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

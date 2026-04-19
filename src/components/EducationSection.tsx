"use client";

import { motion } from "framer-motion";
import { GraduationCap, ImageIcon, ScrollText } from "lucide-react";
import { useState } from "react";
import ImageLightbox from "./ImageLightbox";

type Education = {
  id: string;
  degree: string;
  university: string;
  dates: string;
  results: string;
  imageUrl?: string | null;
};

function parseResultLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function EducationSection({ education }: { education: Education[] }) {
  const [selectedEducation, setSelectedEducation] = useState<Education | null>(null);

  if (education.length === 0) return null;

  return (
    <section id="education" className="section-anchor">
      <div className="section-shell">
        <div className="mb-14 text-center">
          <span className="section-kicker">Education</span>
          <h2 className="section-title mt-5 gradient-text">Academic grounding behind the applied work</h2>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {education.map((item, idx) => {
            const hasImage = Boolean(item.imageUrl);
            const Wrapper = hasImage ? motion.button : motion.article;

            return (
              <Wrapper
                key={item.id}
                initial={{ opacity: 0, scale: 0.97, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: idx * 0.06 }}
                {...(hasImage
                  ? {
                      type: "button" as const,
                      onClick: () => setSelectedEducation(item),
                    }
                  : {})}
                className={`surface-outline glass-panel relative overflow-hidden rounded-[1.8rem] p-7 text-left ${
                  hasImage
                    ? "cursor-pointer transition hover:-translate-y-1.5 hover:[box-shadow:0_28px_90px_rgba(3,8,20,0.55),0_0_40px_rgba(124,140,255,0.18)]"
                    : ""
                }`}
              >
                <div className="absolute right-5 top-5 rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-300">
                  {idx === 0 ? <GraduationCap size={22} /> : <ScrollText size={22} />}
                </div>
                <p className="mb-4 font-mono text-sm text-cyan-300">{item.dates}</p>
                <h3 className="mb-2 max-w-[85%] text-2xl font-semibold text-white">{item.degree}</h3>
                <p className="mb-6 text-lg text-slate-300">{item.university}</p>

                <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-slate-300">
                  <div className="space-y-2">
                    {parseResultLines(item.results).map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>

                {hasImage ? (
                  <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/8 px-3 py-1.5 text-xs font-medium text-cyan-100/90">
                    <ImageIcon size={14} className="text-cyan-300" />
                    Certificate attached
                  </div>
                ) : null}
              </Wrapper>
            );
          })}
        </div>
      </div>

      {selectedEducation?.imageUrl ? (
        <ImageLightbox
          imageUrl={selectedEducation.imageUrl}
          title={`${selectedEducation.degree} certificate`}
          onClose={() => setSelectedEducation(null)}
        />
      ) : null}
    </section>
  );
}

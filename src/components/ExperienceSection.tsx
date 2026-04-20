"use client";

import { motion } from "framer-motion";
import { Building2, MapPin } from "lucide-react";

type Experience = {
  id: string;
  role: string;
  company: string;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  description: string;
};

function parseList(description: string) {
  try {
    const parsed = JSON.parse(description);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    }
  } catch {
    // Fall back to plain text parsing below.
  }

  return description
    .split("\n")
    .map((line) => line.replace(/^[\-\u2022]\s*/, "").trim())
    .filter(Boolean);
}

export default function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  return (
    <section id="experience" className="section-anchor">
      <div className="section-shell">
        <div className="mb-10 text-center sm:mb-16">
          <span className="section-kicker">Experience</span>
          <h2 className="section-title mt-5 gradient-text">Research, engineering, and shipping under constraints</h2>
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="absolute bottom-0 left-4 top-0 hidden w-px bg-[linear-gradient(180deg,rgba(124,140,255,0.2),rgba(65,214,255,0.45),rgba(124,140,255,0.18))] lg:left-1/2 lg:block" />

          <div className="space-y-8 lg:space-y-12">
            {experiences.map((exp, idx) => {
              const items = parseList(exp.description);

              return (
                <motion.article
                  key={exp.id}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: idx * 0.06 }}
                  className={`relative lg:grid lg:grid-cols-2 ${idx % 2 === 1 ? "lg:[&>*:first-child]:col-start-2" : ""}`}
                >
                  <div className="relative">
                    <div className="surface-outline glass-panel rounded-[1.8rem] p-5 sm:p-6 md:p-8 lg:mx-7">
                      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="mb-3 font-mono text-sm text-cyan-300">
                            {exp.startDate} - {exp.endDate || "Present"}
                          </p>
                          <h3 className="text-xl font-semibold text-white sm:text-2xl">{exp.role}</h3>
                          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-400 sm:gap-4">
                            <span className="inline-flex items-center gap-2">
                              <Building2 size={15} className="text-indigo-300" />
                              {exp.company}
                            </span>
                            {exp.location ? (
                              <span className="inline-flex items-center gap-2">
                                <MapPin size={15} className="text-indigo-300" />
                                {exp.location}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <ul className="space-y-3">
                        {items.map((item) => (
                          <li key={item} className="flex gap-3 text-sm leading-6 text-slate-300 md:text-[0.97rem] md:leading-7">
                            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.7)]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="absolute left-[-0.1rem] top-8 hidden h-4 w-4 rounded-full border-4 border-[#08101d] bg-[#8b5cf6] shadow-[0_0_0_5px_rgba(124,140,255,0.15)] lg:left-[calc(100%-0.5rem)] lg:block" />
                    {idx % 2 === 1 ? (
                      <div className="absolute left-[-0.5rem] top-8 hidden h-4 w-4 rounded-full border-4 border-[#08101d] bg-[#8b5cf6] shadow-[0_0_0_5px_rgba(124,140,255,0.15)] lg:block" />
                    ) : null}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

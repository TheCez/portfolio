"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Cloud, Code2, Lightbulb, Server, Users } from "lucide-react";
import { defaultSkillGroups } from "@/lib/default-skills";

type SkillRecord = {
  id: string;
  category: string;
  tags: string;
};

const iconMap: Record<string, typeof BrainCircuit> = {
  "AI & Generative AI": BrainCircuit,
  "Frameworks & Libraries": Code2,
  "Backend & Engineering": Server,
  "Cloud & DevOps": Cloud,
  "Domain Knowledge": Lightbulb,
  Strengths: Users,
};

function normalizeSkills(skills: SkillRecord[]) {
  if (skills.length === 0) {
    return defaultSkillGroups.map((skill) => ({
      category: skill.category,
      tags: skill.tags,
    }));
  }

  return skills.map((skill) => ({
    category: skill.category,
    tags: skill.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
  }));
}

export default function SkillsSection({ skills }: { skills: SkillRecord[] }) {
  const groups = normalizeSkills(skills);

  return (
    <section id="skills" className="section-anchor">
      <div className="section-shell">
        <div className="mb-14 text-center">
          <span className="section-kicker">Skills</span>
          <h2 className="section-title mt-5 gradient-text">The stack behind the ideas</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-400">
            The original site&apos;s skill matrix worked because it made the portfolio feel multidimensional. I kept that rhythm and made it dynamic-friendly.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((group, idx) => {
            const Icon = iconMap[group.category] ?? BrainCircuit;

            return (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: idx * 0.05 }}
                className="surface-outline glass-panel rounded-[1.8rem] p-6 transition hover:-translate-y-1.5 hover:[box-shadow:0_28px_90px_rgba(3,8,20,0.55),0_0_40px_rgba(124,140,255,0.18)]"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                    <Icon size={19} className="text-cyan-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{group.category}</h3>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {group.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1.5 text-sm text-indigo-100/90 transition hover:scale-[1.03] hover:border-cyan-300/25 hover:bg-cyan-400/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

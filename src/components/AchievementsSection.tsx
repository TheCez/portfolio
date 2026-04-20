"use client";

import { motion } from "framer-motion";
import { Award, BadgeCheck, BookOpen, Expand, FlaskConical, ImageIcon, Trophy } from "lucide-react";
import { useState } from "react";
import ImageLightbox from "./ImageLightbox";

type Achievement = {
  id: string;
  title: string;
  event: string;
  icon?: string | null;
  imageUrl?: string | null;
};

function getAchievementVisual(type?: string | null) {
  switch (type) {
    case "workshop":
      return { Icon: BookOpen, accent: "text-cyan-300" };
    case "certification":
      return { Icon: BadgeCheck, accent: "text-emerald-300" };
    case "research":
      return { Icon: FlaskConical, accent: "text-fuchsia-300" };
    case "competition":
      return { Icon: Trophy, accent: "text-amber-300" };
    default:
      return { Icon: Award, accent: "text-indigo-300" };
  }
}

export default function AchievementsSection({ achievements }: { achievements: Achievement[] }) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  if (achievements.length === 0) return null;

  return (
    <section id="achievements" className="section-anchor">
      <div className="section-shell">
        <div className="mb-10 text-center sm:mb-14">
          <span className="section-kicker">Achievements</span>
          <h2 className="section-title mt-5 gradient-text">Achievements &amp; Certifications</h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {achievements.map((achievement, idx) => {
            const hasImage = Boolean(achievement.imageUrl);
            const Wrapper = hasImage ? motion.button : motion.article;
            const { Icon, accent } = getAchievementVisual(achievement.icon);

            return (
              <Wrapper
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: idx * 0.04 }}
                {...(hasImage
                  ? {
                      type: "button" as const,
                      onClick: () => setSelectedAchievement(achievement),
                    }
                  : {})}
                className={`surface-outline glass-panel rounded-[1.6rem] p-5 text-left transition sm:p-6 ${
                  hasImage
                    ? "cursor-pointer hover:-translate-y-1.5 hover:[box-shadow:0_28px_90px_rgba(3,8,20,0.55),0_0_40px_rgba(124,140,255,0.18)]"
                    : ""
                }`}
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_12px_24px_rgba(0,0,0,0.16)] ${accent}`}>
                    <Icon size={24} />
                  </div>
                  {hasImage ? (
                    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/8 px-3 py-1.5 text-xs font-medium text-cyan-100/90">
                      <ImageIcon size={14} className="text-cyan-300" />
                      Certificate attached
                    </div>
                  ) : null}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white sm:text-xl">{achievement.title}</h3>
                <p className="whitespace-pre-line text-sm leading-7 text-slate-400">{achievement.event}</p>
                {hasImage ? (
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200">
                    Open attachment
                    <Expand size={15} />
                  </div>
                ) : null}
              </Wrapper>
            );
          })}
        </div>
      </div>

      {selectedAchievement?.imageUrl ? (
        <ImageLightbox
          imageUrl={selectedAchievement.imageUrl}
          title={selectedAchievement.title}
          onClose={() => setSelectedAchievement(null)}
        />
      ) : null}
    </section>
  );
}

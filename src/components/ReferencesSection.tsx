"use client";

import { motion } from "framer-motion";
import { BriefcaseBusiness, ExternalLink, Mail, MessageSquareQuote, Star, UserCircle2 } from "lucide-react";

type Reference = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company?: string | null;
  dateLabel?: string | null;
  photoUrl?: string | null;
  source?: string | null;
  sourceUrl?: string | null;
  isFeatured?: boolean;
};

function getSourceMeta(source?: string | null) {
  switch (source) {
    case "linkedin":
      return { label: "From LinkedIn recommendation", Icon: BriefcaseBusiness };
    case "email":
      return { label: "Shared by email/message", Icon: Mail };
    case "manual":
      return { label: "Manual reference", Icon: MessageSquareQuote };
    default:
      return null;
  }
}

export default function ReferencesSection({ references }: { references: Reference[] }) {
  if (references.length === 0) return null;

  return (
    <section id="references" className="section-anchor">
      <div className="section-shell">
        <div className="mb-10 text-center sm:mb-14">
          <span className="section-kicker">References</span>
          <h2 className="section-title mt-5 gradient-text">What collaborators said about the work</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {references.map((reference, idx) => {
            const sourceMeta = getSourceMeta(reference.source);
            const subtitle = [reference.role, reference.company].filter(Boolean).join(", ");

            return (
              <motion.article
                key={reference.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: idx * 0.06 }}
                className={`surface-outline glass-panel rounded-[1.8rem] p-5 sm:p-7 ${reference.isFeatured ? "ring-1 ring-cyan-300/20" : ""}`}
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="inline-flex rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-cyan-300">
                    <MessageSquareQuote size={22} />
                  </div>
                  {reference.isFeatured ? (
                    <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1.5 text-xs font-medium text-amber-100">
                      <Star size={14} />
                      Featured
                    </div>
                  ) : null}
                </div>

                {sourceMeta ? (
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/8 px-3 py-1.5 text-xs font-medium text-cyan-100/90">
                    <sourceMeta.Icon size={14} className="text-cyan-300" />
                    {sourceMeta.label}
                  </div>
                ) : null}

                <p className="mb-6 whitespace-pre-line text-base leading-7 text-slate-100/92 sm:text-lg sm:leading-8">"{reference.quote}"</p>

                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/[0.04] text-slate-300">
                    {reference.photoUrl ? (
                      <img src={reference.photoUrl} alt={reference.name} className="h-full w-full object-cover" />
                    ) : (
                      <UserCircle2 size={28} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-white">{reference.name}</h3>
                    <p className="truncate text-sm text-slate-400">{subtitle}</p>
                    {reference.dateLabel ? (
                      <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">{reference.dateLabel}</p>
                    ) : null}
                  </div>
                  {reference.sourceUrl ? (
                    <a
                      href={reference.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/[0.08]"
                    >
                      View
                      <ExternalLink size={13} />
                    </a>
                  ) : null}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

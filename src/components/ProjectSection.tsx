"use client";

import { motion } from "framer-motion";
import { Code2, ExternalLink, PlayCircle, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Project = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  repoUrl?: string | null;
  videoUrl?: string | null;
  techTags: string;
  highlights: string;
};

function getProjectImage(project: Project) {
  if (project.imageUrl) return project.imageUrl;

  const normalized = project.title.toLowerCase();
  if (normalized.includes("medical")) return "/assets/images/medical_dashboard.png";
  if (normalized.includes("bim")) return "/assets/images/bim_interface.png";
  return "/assets/images/example.png";
}

function parseHighlights(value: string) {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    }
  } catch {
    // Fall back to newline parsing below.
  }

  return value
    .split("\n")
    .map((line) => line.replace(/^[\-\u2022]\s*/, "").trim())
    .filter(Boolean);
}

function isDirectVideo(url?: string | null) {
  if (!url) return false;
  return /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(url) || url.includes("/api/media/");
}

export default function ProjectSection({ projects }: { projects: Project[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedId) ?? null,
    [projects, selectedId],
  );

  useEffect(() => {
    if (!selectedProject) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [selectedProject]);

  return (
    <section id="projects" className="section-anchor">
      <div className="section-shell">
        <div className="mb-10 text-center sm:mb-16">
          <span className="section-kicker">Projects</span>
          <h2 className="section-title mt-5 gradient-text">The same bold project storytelling, now fully data-driven</h2>
          <p className="mx-auto mt-4 max-w-3xl px-2 text-sm leading-7 text-slate-400 sm:mt-5 sm:text-base sm:leading-8">
            Click any project for a better case-study view with media, highlights, and clean formatting from the admin panel.
          </p>
        </div>

        <div className="grid gap-5 sm:gap-7 lg:grid-cols-3">
          {projects.map((project, idx) => {
            const techTags = project.techTags.split(",").map((tag) => tag.trim()).filter(Boolean);
            const highlights = parseHighlights(project.highlights);

            return (
              <motion.button
                type="button"
                key={project.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedId(project.id)}
                className="surface-outline glass-panel group flex h-full flex-col overflow-hidden rounded-[1.8rem] text-left transition hover:-translate-y-2 hover:[box-shadow:0_28px_90px_rgba(3,8,20,0.55),0_0_40px_rgba(124,140,255,0.18)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden border-b border-white/10">
                  <img
                    src={getProjectImage(project)}
                    alt={`${project.title} preview`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09111f] via-transparent to-transparent" />
                  <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5 text-xs text-slate-200 backdrop-blur-xl">
                    <PlayCircle size={14} className="text-cyan-300" />
                    {project.videoUrl ? "Media attached" : "Case study"}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="mb-3 text-xl font-semibold text-white transition group-hover:text-cyan-200 sm:text-2xl">
                    {project.title}
                  </h3>
                  <p className="mb-5 text-sm leading-7 text-slate-300">{project.description}</p>

                  <div className="mb-5 flex flex-wrap gap-2.5">
                    {techTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-cyan-300/15 bg-cyan-300/8 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.08em] text-cyan-100/90"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <ul className="mb-5 space-y-3">
                    {highlights.slice(0, 3).map((highlight) => (
                      <li key={highlight} className="flex gap-3 text-sm leading-7 text-slate-300">
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-indigo-300 shadow-[0_0_14px_rgba(196,181,253,0.55)]" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-cyan-200">
                    Open project details
                    <ExternalLink size={15} />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {selectedProject ? (
        <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/75 px-3 pb-4 pt-24 backdrop-blur-md sm:items-center sm:px-4 sm:py-4">
          <div className="surface-outline glass-panel relative w-full max-w-5xl overflow-hidden rounded-[1.6rem] sm:max-h-[92vh] sm:overflow-y-auto sm:rounded-[2rem]">
            <div className="sticky top-0 z-20 flex justify-end border-b border-white/10 bg-[#0c1526]/92 px-4 py-3 backdrop-blur-xl sm:hidden">
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
                aria-label="Close project details"
              >
                <X size={18} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="absolute right-4 top-4 z-20 hidden h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 sm:inline-flex"
              aria-label="Close project details"
            >
              <X size={18} />
            </button>

            <div className="grid gap-7 p-4 sm:p-5 md:grid-cols-[1.05fr_0.95fr] md:p-7 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-5">
                <div className="relative overflow-hidden rounded-[1.4rem] border border-white/10 bg-slate-950/70">
                  <img
                    src={getProjectImage(selectedProject)}
                    alt={`${selectedProject.title} preview`}
                    className="h-auto w-full object-cover"
                  />
                </div>

                {selectedProject.videoUrl ? (
                  isDirectVideo(selectedProject.videoUrl) ? (
                    <video
                      controls
                      className="w-full rounded-[1.4rem] border border-white/10 bg-black"
                      src={selectedProject.videoUrl}
                    />
                  ) : (
                    <Link
                      href={selectedProject.videoUrl}
                      target="_blank"
                      className="inline-flex items-center gap-2 rounded-full bg-[#8b5cf6] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#7c3aed]"
                    >
                      <PlayCircle size={16} />
                      Open Demo Link
                    </Link>
                  )
                ) : null}
              </div>

              <div className="flex flex-col">
                <h3 className="mb-3 text-2xl font-semibold text-white sm:text-3xl">{selectedProject.title}</h3>
                <p className="mb-5 text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">{selectedProject.description}</p>

                <div className="mb-6 flex flex-wrap gap-2.5">
                  {selectedProject.techTags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean)
                    .map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-cyan-300/15 bg-cyan-300/8 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.08em] text-cyan-100/90"
                      >
                        {tag}
                      </span>
                    ))}
                </div>

                <div className="mb-7 rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-5">
                  <h4 className="mb-4 text-lg font-semibold text-white">Project Highlights</h4>
                  <ul className="space-y-3">
                    {parseHighlights(selectedProject.highlights).map((highlight) => (
                      <li key={highlight} className="flex gap-3 text-sm leading-7 text-slate-300">
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.7)]" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto flex flex-wrap gap-3">
                  {selectedProject.repoUrl ? (
                    <Link
                      href={selectedProject.repoUrl}
                      target="_blank"
                      className="inline-flex items-center gap-2 rounded-full bg-[#8b5cf6] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#7c3aed]"
                    >
                      <Code2 size={16} />
                      View Repository
                    </Link>
                  ) : null}
                  {selectedProject.videoUrl && !isDirectVideo(selectedProject.videoUrl) ? (
                    <Link
                      href={selectedProject.videoUrl}
                      target="_blank"
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-200"
                    >
                      <ExternalLink size={16} />
                      External media
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

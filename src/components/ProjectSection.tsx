"use client";

import { motion } from "framer-motion";
import { Code2, ExternalLink, PlayCircle, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ImageLightbox from "./ImageLightbox";
import MarkdownContent from "./MarkdownContent";

type Project = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  galleryUrls?: string | null;
  repoUrl?: string | null;
  videoUrl?: string | null;
  techTags: string;
  displayTags?: string | null;
  highlights: string;
};

function getProjectImage(project: Project) {
  if (project.imageUrl) return project.imageUrl;

  const normalized = project.title.toLowerCase();
  if (normalized.includes("medical")) return "/assets/images/medical_dashboard.png";
  if (normalized.includes("bim")) return "/assets/images/bim_interface.png";
  return "/assets/images/example.png";
}

function getProjectCover(project: Project) {
  const gallery = parseGalleryUrls(project.galleryUrls);
  if (project.imageUrl) {
    return {
      imageUrl: project.imageUrl,
      isLogoOnly: true,
    };
  }

  return {
    imageUrl: gallery[0] ?? getProjectImage(project),
    isLogoOnly: false,
  };
}

function parseGalleryUrls(value?: string | null) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    }
  } catch {
    // Fall back to loose text parsing below.
  }

  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
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

function parseTags(value?: string | null) {
  return (value ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function isDirectVideo(url?: string | null) {
  if (!url) return false;
  return /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(url) || url.includes("/api/media/");
}

function getYoutubeEmbedUrl(url?: string | null) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, "").toLowerCase();

    if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      const videoId = parsed.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (hostname === "youtu.be") {
      const videoId = parsed.pathname.split("/").filter(Boolean)[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (hostname === "youtube-nocookie.com") {
      const segments = parsed.pathname.split("/").filter(Boolean);
      const embedIndex = segments.indexOf("embed");
      const videoId = embedIndex >= 0 ? segments[embedIndex + 1] : null;
      return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : null;
    }
  } catch {
    return null;
  }

  return null;
}

export default function ProjectSection({ projects }: { projects: Project[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedId) ?? null,
    [projects, selectedId],
  );
  const selectedProjectYoutubeEmbed = useMemo(
    () => getYoutubeEmbedUrl(selectedProject?.videoUrl),
    [selectedProject?.videoUrl],
  );
  const selectedProjectGallery = useMemo(
    () => parseGalleryUrls(selectedProject?.galleryUrls),
    [selectedProject?.galleryUrls],
  );
  const selectedProjectImages = useMemo(() => {
    return Array.from(new Set(selectedProjectGallery));
  }, [selectedProjectGallery]);
  const activeProjectImage = selectedProjectImages[selectedMediaIndex] ?? selectedProjectImages[0] ?? null;
  const selectedProjectLogo = selectedProject?.imageUrl ?? null;

  useEffect(() => {
    if (!selectedProject) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [selectedProject]);

  function openProject(projectId: string) {
    setSelectedMediaIndex(0);
    setLightboxImage(null);
    setSelectedId(projectId);
  }

  function closeProject() {
    setLightboxImage(null);
    setSelectedId(null);
    setSelectedMediaIndex(0);
  }

  if (projects.length === 0) return null;

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
            const cardTags = parseTags(project.displayTags || project.techTags);
            const visibleCardTags = cardTags.slice(0, 5);
            const hiddenCardTagCount = Math.max(cardTags.length - visibleCardTags.length, 0);
            const highlights = parseHighlights(project.highlights);
            const cover = getProjectCover(project);

            return (
              <motion.button
                type="button"
                key={project.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => openProject(project.id)}
                className="surface-outline glass-panel group flex h-full flex-col overflow-hidden rounded-[1.8rem] text-left transition hover:-translate-y-2 hover:[box-shadow:0_28px_90px_rgba(3,8,20,0.55),0_0_40px_rgba(124,140,255,0.18)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden border-b border-white/10">
                  <img
                    src={cover.imageUrl}
                    alt={`${project.title} preview`}
                    className={`h-full w-full transition duration-500 group-hover:scale-[1.03] ${
                      cover.isLogoOnly ? "bg-slate-950/70 object-contain p-6 sm:p-8" : "object-cover"
                    }`}
                  />
                  {!cover.isLogoOnly ? (
                    <div className="absolute inset-0 bg-gradient-to-t from-[#09111f] via-transparent to-transparent" />
                  ) : null}
                  <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5 text-xs text-slate-200 backdrop-blur-xl">
                    <PlayCircle size={14} className="text-cyan-300" />
                    {project.videoUrl ? "Media attached" : "Case study"}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="mb-3 text-xl font-semibold text-white transition group-hover:text-cyan-200 sm:text-2xl">
                    {project.title}
                  </h3>
                  <div className="mb-5 flex flex-wrap gap-2.5">
                    {visibleCardTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-cyan-300/15 bg-cyan-300/8 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.08em] text-cyan-100/90"
                      >
                        {tag}
                      </span>
                    ))}
                    {hiddenCardTagCount > 0 ? (
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.08em] text-slate-300">
                        +{hiddenCardTagCount} more
                      </span>
                    ) : null}
                  </div>

                  <ul className="mb-5 space-y-3">
                    {highlights.slice(0, 4).map((highlight) => (
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
        <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/75 px-3 pb-4 pt-24 backdrop-blur-md sm:px-4 sm:pb-6 sm:pt-28">
          <div className="surface-outline glass-panel relative w-full max-w-[min(92rem,calc(100vw-2rem))] overflow-hidden rounded-[1.6rem] sm:max-h-[calc(100vh-8.5rem)] sm:overflow-y-auto sm:rounded-[2rem]">
            <div className="sticky top-0 z-20 flex justify-end border-b border-white/10 bg-[#0c1526]/92 px-4 py-3 backdrop-blur-xl sm:hidden">
              <button
                type="button"
                onClick={closeProject}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
                aria-label="Close project details"
              >
                <X size={18} />
              </button>
            </div>

            <button
              type="button"
              onClick={closeProject}
              className="absolute right-4 top-4 z-20 hidden h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 sm:inline-flex"
              aria-label="Close project details"
            >
              <X size={18} />
            </button>

            <div className="grid gap-7 p-4 sm:p-5 md:p-7 lg:grid-cols-[minmax(0,1.18fr)_minmax(25rem,0.82fr)] xl:gap-9 xl:p-8">
              <div className="space-y-5">
                {activeProjectImage ? (
                  <div className="grid gap-3 lg:grid-cols-[5rem_minmax(0,1fr)]">
                    {selectedProjectImages.length > 1 ? (
                      <div className="order-2 flex gap-2 overflow-x-auto pb-1 lg:order-1 lg:max-h-[34rem] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0 lg:pr-1">
                        {selectedProjectImages.map((imageUrl, index) => (
                          <button
                            key={`${imageUrl}-${index}`}
                            type="button"
                            onClick={() => setSelectedMediaIndex(index)}
                            className={`h-16 w-20 shrink-0 overflow-hidden rounded-xl border bg-slate-950/70 p-1 transition lg:h-20 lg:w-20 ${
                              index === selectedMediaIndex
                                ? "border-cyan-300 shadow-[0_0_24px_rgba(103,232,249,0.25)]"
                                : "border-white/10 hover:border-white/30"
                            }`}
                            aria-label={`Show ${selectedProject.title} image ${index + 1}`}
                          >
                            <img
                              src={imageUrl}
                              alt={`${selectedProject.title} thumbnail ${index + 1}`}
                              className="h-full w-full rounded-lg object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => setLightboxImage(activeProjectImage)}
                      className="order-1 relative overflow-hidden rounded-[1.4rem] border border-white/10 bg-slate-950/70 transition hover:border-cyan-300/40 lg:order-2"
                      aria-label={`Expand ${selectedProject.title} image`}
                    >
                      <img
                        src={activeProjectImage}
                        alt={`${selectedProject.title} preview`}
                        className="aspect-[16/10] h-full w-full object-contain"
                      />
                      <span className="absolute bottom-4 right-4 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5 text-xs font-medium text-slate-100 backdrop-blur-xl">
                        Click to expand
                      </span>
                    </button>
                  </div>
                ) : selectedProjectLogo ? (
                  <button
                    type="button"
                    onClick={() => setLightboxImage(selectedProjectLogo)}
                    className="group/logo relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-[1.4rem] border border-white/10 bg-slate-950/70 p-3 transition hover:border-cyan-300/40"
                    aria-label={`Expand ${selectedProject.title} logo`}
                  >
                    <img
                      src={selectedProjectLogo}
                      alt={`${selectedProject.title} logo`}
                      className="h-full w-full object-contain transition group-hover/logo:scale-[1.02]"
                    />
                  </button>
                ) : null}

                {selectedProject.videoUrl ? (
                  isDirectVideo(selectedProject.videoUrl) ? (
                    <video
                      controls
                      className="w-full rounded-[1.4rem] border border-white/10 bg-black"
                      src={selectedProject.videoUrl}
                    />
                  ) : selectedProjectYoutubeEmbed ? (
                    <div className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-black">
                      <iframe
                        src={selectedProjectYoutubeEmbed}
                        title={`${selectedProject.title} video demo`}
                        className="aspect-video w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
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

                {selectedProjectImages.length > 1 ? (
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    {selectedMediaIndex + 1} / {selectedProjectImages.length} project images
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col">
                <h3 className="mb-3 text-2xl font-semibold text-white sm:text-3xl">{selectedProject.title}</h3>
                <div className="mb-5">
                  <MarkdownContent value={selectedProject.description} />
                </div>

                <div className="mb-6 flex flex-wrap gap-2.5">
                  {parseTags(selectedProject.techTags).map((tag) => (
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
                  {selectedProject.videoUrl && !isDirectVideo(selectedProject.videoUrl) && !selectedProjectYoutubeEmbed ? (
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

          {lightboxImage ? (
            <ImageLightbox
              mediaUrl={lightboxImage}
              title={`${selectedProject.title} image`}
              onClose={() => setLightboxImage(null)}
            />
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

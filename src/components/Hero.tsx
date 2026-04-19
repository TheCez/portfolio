"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useCallback } from "react";

type HeroContent = {
  heroTitle: string;
  heroRole: string;
  heroSpecialties: string;
};

export default function Hero({ content }: { content: HeroContent }) {
  const scrollToAbout = useCallback(() => {
    const target = document.getElementById("about");
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: "smooth" });
    window.history.replaceState(null, "", "#about");
  }, []);

  return (
    <section id="home" className="section-anchor relative flex min-h-screen items-center overflow-hidden">
      <div className="mx-auto flex w-[min(1180px,calc(100%-2rem))] flex-col items-center justify-center px-2 pb-16 pt-32 text-center md:pt-36">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-5xl"
        >
          <div className="absolute left-1/2 top-10 h-40 w-full max-w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(124,140,255,0.32),rgba(65,214,255,0.12),transparent_72%)] blur-3xl" />

          <h1 className="mb-4 text-[clamp(3.4rem,11vw,7rem)] font-bold leading-none tracking-[-0.06em] text-white [text-shadow:0_0_20px_rgba(155,107,255,0.22),0_0_44px_rgba(124,140,255,0.14)]">
            {content.heroTitle}
          </h1>

          <p className="mb-4 text-[clamp(1.15rem,2.7vw,1.8rem)] font-medium text-slate-100/92">
            {content.heroRole}
          </p>

          <p className="mx-auto mb-10 max-w-3xl text-balance text-base leading-8 text-slate-300 md:text-lg">
            {content.heroSpecialties}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-full bg-[#8b5cf6] px-8 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#7c3aed] hover:shadow-[0_14px_36px_rgba(139,92,246,0.42)]"
            >
              View My Work
              <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-transparent px-8 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/6"
            >
              Get In Touch
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <button
            type="button"
            onClick={scrollToAbout}
            className="inline-flex animate-bounce flex-col items-center gap-2 text-slate-400 transition hover:text-white"
          >
            <span className="text-xs uppercase tracking-[0.24em]">Scroll</span>
            <ArrowDown size={22} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

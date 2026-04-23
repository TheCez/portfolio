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
    <section id="home" className="section-anchor relative flex min-h-[100svh] items-center overflow-hidden">
      <div className="mx-auto flex w-[min(1180px,calc(100%-1rem))] flex-col items-center justify-center px-1 pb-16 pt-24 text-center sm:w-[min(1180px,calc(100%-1.5rem))] sm:px-2 sm:pt-28 md:pt-36">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto w-full max-w-5xl"
        >
          <div className="absolute left-1/2 top-10 h-40 w-full max-w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(124,140,255,0.32),rgba(65,214,255,0.12),transparent_72%)] blur-3xl" />

          <h1 className="mb-3 text-[clamp(2.75rem,13vw,7rem)] font-bold leading-[0.96] tracking-[-0.06em] text-white [text-shadow:0_0_20px_rgba(155,107,255,0.22),0_0_44px_rgba(124,140,255,0.14)] sm:mb-4">
            {content.heroTitle}
          </h1>

          <p className="mb-3 text-[clamp(1rem,4.8vw,1.8rem)] font-medium text-slate-100/92 sm:mb-4">
            {content.heroRole}
          </p>

          <p className="mx-auto mb-8 max-w-[22rem] text-balance text-sm leading-7 text-slate-300 sm:mb-10 sm:max-w-3xl sm:text-base md:text-lg">
            {content.heroSpecialties}
          </p>

          <div className="mx-auto flex w-full max-w-sm flex-col items-center justify-center gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-6">
            <a
              href="#projects"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#8b5cf6] px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#7c3aed] hover:shadow-[0_14px_36px_rgba(139,92,246,0.42)] sm:w-auto sm:px-8 sm:py-4"
            >
              View My Work
              <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
            </a>
            <a
              href="#contact"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/40 bg-transparent px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/6 sm:w-auto sm:px-8 sm:py-4"
            >
              Get In Touch
            </a>
          </div>

          <div className="mt-4 flex justify-center sm:mt-5">
            <a
              href="/assets/docs/Resume_Ajay_Chodankar.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-300/8 px-6 py-3 text-sm font-semibold text-cyan-100 transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-cyan-300/12 hover:text-white sm:px-7"
            >
              View / Download Resume
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 sm:bottom-8"
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

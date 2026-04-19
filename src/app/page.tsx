import { prisma } from "@/lib/prisma";
import Hero from "@/components/Hero";
import About from "@/components/About";
import SkillsSection from "@/components/SkillsSection";
import ExperienceSection from "@/components/ExperienceSection";
import ProjectSection from "@/components/ProjectSection";
import EducationSection from "@/components/EducationSection";
import AchievementsSection from "@/components/AchievementsSection";
import ReferencesSection from "@/components/ReferencesSection";
import Contact from "@/components/Contact";
import { getSiteSettings, getDefaultSiteSettings, parseParagraphs } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default async function Home() {
  const adminCount = await prisma.user.count();

  if (adminCount === 0) {
    return (
      <section className="relative flex min-h-screen items-center justify-center px-6">
        <div className="surface-outline glass-panel relative z-10 w-full max-w-2xl rounded-[2rem] p-8 text-center md:p-12">
          <span className="section-kicker">Setup Required</span>
          <h1 className="mt-6 text-4xl font-bold tracking-[-0.04em] text-white md:text-5xl">
            Please sign up here first.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-slate-300">
            The portfolio stays locked until the first admin account is created. Finish the initial signup and then the full website will become available.
          </p>
          <div className="mt-8">
            <a
              href="/setup"
              className="inline-flex items-center justify-center rounded-full bg-[#8b5cf6] px-8 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#7c3aed]"
            >
              Go To Setup
            </a>
          </div>
        </div>
      </section>
    );
  }

  const [experiences, projects, education, achievements, skills, references, settings] = await Promise.all([
    prisma.experience.findMany({ orderBy: { order: "asc" } }),
    prisma.project.findMany({ orderBy: { order: "asc" } }),
    prisma.education.findMany({ orderBy: { order: "asc" } }),
    prisma.achievement.findMany({ orderBy: { order: "asc" } }),
    prisma.skill.findMany({ orderBy: { order: "asc" } }),
    prisma.reference.findMany({ orderBy: { order: "asc" } }),
    getSiteSettings(),
  ]);

  const defaults = getDefaultSiteSettings();
  const siteContent = {
    heroTitle: settings.heroTitle || defaults.heroTitle,
    heroRole: settings.heroRole || defaults.heroRole,
    heroSpecialties: settings.heroSpecialties || defaults.heroSpecialties,
    aboutTitle: settings.aboutTitle || defaults.aboutTitle,
    aboutParagraphs: parseParagraphs(settings.aboutParagraphs),
    profileImageUrl: settings.profileImageUrl || defaults.profileImageUrl,
    contactEmail: settings.contactEmail || defaults.contactEmail,
    contactPhone: settings.contactPhone || defaults.contactPhone,
    contactLocation: settings.contactLocation || defaults.contactLocation,
    linkedinUrl: settings.linkedinUrl || defaults.linkedinUrl,
    githubUrl: settings.githubUrl || defaults.githubUrl,
  };

  return (
    <>
      <Hero content={siteContent} />
      <About content={siteContent} />
      <SkillsSection skills={skills} />
      <ExperienceSection experiences={experiences} />
      <ProjectSection projects={projects} />
      <EducationSection education={education} />
      <AchievementsSection achievements={achievements} />
      <ReferencesSection references={references} />
      <Contact content={siteContent} />
    </>
  );
}

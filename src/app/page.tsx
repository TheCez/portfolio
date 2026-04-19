import { prisma } from "@/lib/prisma";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ExperienceSection from "@/components/ExperienceSection";
import ProjectSection from "@/components/ProjectSection";
import EducationSection from "@/components/EducationSection";
import AchievementsSection from "@/components/AchievementsSection";
import Contact from "@/components/Contact";

export default async function Home() {
  const experiences = await prisma.experience.findMany({
    orderBy: { order: "asc" },
  });
  
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
  });

  const education = await prisma.education.findMany({
    orderBy: { order: "asc" },
  });

  const achievements = await prisma.achievement.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <>
      <Hero />
      <About />
      <ExperienceSection experiences={experiences} />
      <ProjectSection projects={projects} />
      <EducationSection education={education} />
      <AchievementsSection achievements={achievements} />
      <Contact />
    </>
  );
}

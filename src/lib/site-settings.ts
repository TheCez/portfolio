import { prisma } from "@/lib/prisma";

const defaultAboutParagraphs = [
  "I am a Data Science Master's Graduate (TU Braunschweig) with robust experience across AI/ML, Cloud Computing, and DevOps, integrating academic research with professional practice.",
  "Specializing in GenAI, I architect Agentic systems and RAG pipelines using Microsoft AI Foundry and Google Gemini. My award-winning AI applications, such as medical data simplifiers and Image-to-BIM pipelines, leverage multi-agent frameworks to achieve high-quality results.",
  "My AI work is backed by Cloud & DevOps expertise. Deploying scalable services on Microsoft Azure, orchestrating with Docker, and utilizing Ansible (IaC), I focus on shipping systems that are reliable after the prototype stage.",
  "With strong intercultural communication skills, I am eager to apply this engineering blend to drive digital transformation in industrial AI, IoT, and smart manufacturing.",
];

export function getDefaultSiteSettings() {
  return {
    heroTitle: "Ajay Chodankar",
    heroRole: "AI Researcher & Software Engineer",
    heroSpecialties: "Agentic AI Systems, Computer Vision, and Cloud Technologies",
    aboutTitle: "AI/ML Engineer & Data Scientist",
    aboutParagraphs: defaultAboutParagraphs,
    profileImageUrl: "/assets/images/profile.png",
    contactEmail: "ajaychodankar15@gmail.com",
    contactPhone: "+49 176 764 66955",
    contactLocation: "Braunschweig, Germany",
    linkedinUrl: "https://linkedin.com/in/ajay-chodankar",
    githubUrl: "https://github.com/TheCez",
  };
}

export function parseParagraphs(value?: string | null) {
  if (!value) return getDefaultSiteSettings().aboutParagraphs;

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
      const filtered = parsed.filter((item) => item.trim().length > 0);
      return filtered.length > 0 ? filtered : getDefaultSiteSettings().aboutParagraphs;
    }
  } catch {
    // Fall through to newline parsing.
  }

  const lines = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.length > 0 ? lines : getDefaultSiteSettings().aboutParagraphs;
}

export async function getSiteSettings() {
  let settings = await prisma.settings.findFirst();

  if (!settings) {
    settings = await prisma.settings.create({
      data: {
        isSeeded: true,
      },
    });
  }

  return settings;
}

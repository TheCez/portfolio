import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { defaultSkillGroups } from "../src/lib/default-skills";

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const settings = await prisma.settings.findFirst();
  const hasExistingContent =
    (await prisma.experience.count()) > 0 ||
    (await prisma.project.count()) > 0 ||
    (await prisma.education.count()) > 0 ||
    (await prisma.achievement.count()) > 0 ||
    (await prisma.skill.count()) > 0 ||
    (await prisma.reference.count()) > 0;

  if (settings?.isSeeded || hasExistingContent) {
    if (settings && !settings.isSeeded) {
      await prisma.settings.update({
        where: { id: settings.id },
        data: { isSeeded: true },
      });
    }
    console.log("Database is already seeded. Skipping.");
    return;
  }

  console.log("Seeding database with initial data...");

  await prisma.experience.createMany({
    data: [
      {
        role: "Wissenschaftliche Hilfskraft - AI Researcher",
        company: "IKE - Institut fur Konstruktives Entwerfen",
        location: "Braunschweig, Germany",
        startDate: "06.2024",
        endDate: "Present",
        description: JSON.stringify([
          "Developed Python-based backends and scalable RAG pipelines on Microsoft Azure, integrating vector embeddings to serve proprietary data to AI models",
          "Engineered Agentic, multimodal AI systems using CrewAI/LangChain, orchestrating autonomous agents to execute complex workflows with minimal human intervention",
          "Built Multimodal AI solutions leveraging Vision Language Models (VLM) for automated object identification and analysis",
          "Implemented real-time Audio Processing pipelines using OpenAI Whisper and TTS models",
          "Applied advanced Prompt Engineering techniques to optimize LLM outputs",
        ]),
        isEnabled: true,
        order: 1,
      },
      {
        role: "Wissenschaftliche Hilfskraft - System Administrator",
        company: "IFAS - Institut fur Flugantriebe und Stromungsmaschinen",
        location: "Braunschweig, Germany",
        startDate: "04.2024",
        endDate: "Present",
        description: JSON.stringify([
          "Developed complex Python scripts to automate critical system administration tasks",
          "Implemented Infrastructure as Code (IaC) using Ansible to automate system setup",
          "Managed and maintained Linux-based infrastructure, ensuring high availability",
        ]),
        isEnabled: true,
        order: 2,
      },
      {
        role: "Autonomous Driving Subsystem Member",
        company: "VCET Solecthon (Autonomous Solar Vehicle R&D)",
        location: "Mumbai, India",
        startDate: "01.2019",
        endDate: "05.2022",
        description: JSON.stringify([
          "Pioneered the development of a modular Autonomous Driving System",
          "Implemented real-time Computer Vision pipelines using YOLO to detect objects",
          "Programmed and optimized low-latency algorithms on Nvidia Jetson and Raspberry Pi",
        ]),
        isEnabled: true,
        order: 3,
      },
    ],
  });

  await prisma.project.createMany({
    data: [
      {
        title: "Agentic AI for Medical Data Simplification",
        description: "AI-powered patient report generation that simplifies and summarizes medical conditions and prescriptions in clear, concise terms.",
        galleryUrls: "[]",
        repoUrl: "https://github.com/TheCez/medical-ai",
        videoUrl: "/assets/videos/medical_demo_placeholder.mp4",
        techTags: "RAG,CrewAI,Google Gemini API,Multi-Agent System",
        displayTags: "RAG, CrewAI, Healthcare AI",
        highlights: JSON.stringify([
          "Architected robust RAG system ensuring facts are grounded in original source data",
          "Engineered multi-agent AI system to autonomously manage summarization workflows",
          "Won Best LLM Idea at Healthcare Hackathon 2024 (Berlin) and HealthHack 2024 Winner",
        ]),
        isEnabled: true,
        order: 1,
      },
      {
        title: "Image-to-BIM Generative AI Pipeline",
        description: "End-to-end Generative AI pipeline that transforms 2D architectural images into 3D CAD-ready models using Multimodal LLMs.",
        galleryUrls: "[]",
        repoUrl: "https://github.com/TheCez/image-to-bim",
        videoUrl: "/assets/videos/bim_demo_placeholder.mp4",
        techTags: "Multimodal LLM,Three.js,FastAPI,IFC,BIM",
        displayTags: "Multimodal AI, BIM, Three.js",
        highlights: JSON.stringify([
          "Architected end-to-end pipeline transforming 2D images into 3D CAD-ready models",
          "Engineered Agentic AI workflow to autonomously interpret structural features",
          "Won 'Solves a BIG AEC Problem' at AEC Hackathon Munich 2024",
        ]),
        isEnabled: true,
        order: 2,
      },
      {
        title: "Autonomous Solar Vehicle System",
        description: "Modular autonomous driving system with real-time computer vision for solar-powered vehicles.",
        galleryUrls: "[]",
        repoUrl: "https://github.com/TheCez/solar-vehicle",
        videoUrl: "/assets/videos/solar_demo_placeholder.mp4",
        techTags: "YOLO,OpenCV,Nvidia Jetson,Raspberry Pi,Deep Learning",
        displayTags: "YOLO, OpenCV, Robotics",
        highlights: JSON.stringify([
          "Designed plug-and-play modular architecture for rapid sensor integration",
          "Implemented real-time object detection using YOLO",
          "All India Rank 2 at SAUR URJA VEHICLE CHALLENGE 2022",
        ]),
        isEnabled: true,
        order: 3,
      },
    ],
  });

  await prisma.education.createMany({
    data: [
      {
        degree: "Master of Science in Data Science",
        university: "TU Braunschweig, Germany",
        dates: "10.2022 - 10.2025",
        results: "Final Grade: 1.9\nMaster Thesis: Computation and Validation of Occupancy Grids for Solving Traffic Conflicts in Multi-vehicle Trajectory Planning",
        imageUrl: null,
        isEnabled: true,
        order: 1,
      },
      {
        degree: "Bachelor of Engineering in Computer Engineering",
        university: "University of Mumbai, India",
        dates: "05.2018 - 03.2022",
        results: "Final Grade: 1.6 (Excellent)",
        imageUrl: null,
        isEnabled: true,
        order: 2,
      },
    ],
  });

  await prisma.achievement.createMany({
    data: [
      {
        title: "Solves a BIG AEC Problem",
        event: "AEC Hackathon Munich 2024",
        icon: "competition",
        imageUrl: null,
        isEnabled: true,
        order: 1,
      },
      {
        title: "Best LLM Idea",
        event: "Healthcare Hackathon 2024\nBerlin (UKSH)",
        icon: "competition",
        imageUrl: null,
        isEnabled: true,
        order: 2,
      },
      {
        title: "Winner Rank 1",
        event: "HealthHack 2024\nBraunschweig",
        icon: "competition",
        imageUrl: null,
        isEnabled: true,
        order: 3,
      },
      {
        title: "All India Rank 2",
        event: "SAUR URJA VEHICLE CHALLENGE 2022\nIndia",
        icon: "competition",
        imageUrl: null,
        isEnabled: true,
        order: 4,
      },
      {
        title: "AZ-900 Certified",
        event: "Microsoft Azure Fundamentals\nMicrosoft Certification",
        icon: "certification",
        imageUrl: null,
        isEnabled: true,
        order: 5,
      },
      {
        title: "Published Research",
        event: "ICOEI 2022\nFacial Recognition Security System",
        icon: "research",
        imageUrl: null,
        isEnabled: true,
        order: 6,
      },
    ],
  });

  await prisma.skill.createMany({
    data: defaultSkillGroups.map((skill, index) => ({
      category: skill.category,
      icon: skill.icon,
      tags: skill.tags.join(", "),
      isEnabled: true,
      order: index,
    })),
  });

  await prisma.reference.createMany({
    data: [
      {
        quote: "Ajay is an exceptional AI engineer. His work on the medical dashboard was groundbreaking.",
        name: "Dr. Sarah Weber",
        role: "Project Lead, HealthHack",
        company: null,
        dateLabel: null,
        photoUrl: null,
        source: null,
        sourceUrl: null,
        isFeatured: true,
        isEnabled: true,
        order: 1,
      },
      {
        quote: "Excellent understanding of BIM workflows and generative AI. A true innovator.",
        name: "Markus Schmidt",
        role: "Architect, AEC Hackathon",
        company: null,
        dateLabel: null,
        photoUrl: null,
        source: null,
        sourceUrl: null,
        isFeatured: false,
        isEnabled: true,
        order: 2,
      },
    ],
  });

  await prisma.settings.upsert({
    where: { id: settings?.id ?? "seed-settings" },
    update: { isSeeded: true },
    create: { id: settings?.id ?? "seed-settings", isSeeded: true },
  });

  console.log("Database seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

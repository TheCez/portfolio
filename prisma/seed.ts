import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Check if DB is already seeded by checking if any User or Project exists
  const isSeeded = await prisma.user.count() > 0;
  
  if (isSeeded) {
    console.log('Database is already seeded. Skipping.');
    return;
  }
  
  console.log('Seeding database with initial data...');

  // Create Experiences
  await prisma.experience.createMany({
    data: [
      {
        role: 'Wissenschaftliche Hilfskraft - AI Researcher',
        company: 'IKE - Institut für Konstruktives Entwerfen',
        location: 'Braunschweig, Germany',
        startDate: '06.2024',
        endDate: 'Present',
        description: JSON.stringify([
          "Developed Python-based backends and scalable RAG pipelines on Microsoft Azure, integrating vector embeddings to serve proprietary data to AI models",
          "Engineered Agentic, multimodal AI systems using CrewAI/LangChain, orchestrating autonomous agents to execute complex workflows with minimal human intervention",
          "Built Multimodal AI solutions leveraging Vision Language Models (VLM) for automated object identification and analysis",
          "Implemented real-time Audio Processing pipelines using OpenAI Whisper and TTS models",
          "Applied advanced Prompt Engineering techniques to optimize LLM outputs"
        ]),
        order: 1
      },
      {
        role: 'Wissenschaftliche Hilfskraft - System Administrator',
        company: 'IFAS - Institut für Flugantriebe und Strömungsmaschinen',
        location: 'Braunschweig, Germany',
        startDate: '04.2024',
        endDate: 'Present',
        description: JSON.stringify([
          "Developed complex Python scripts to automate critical system administration tasks",
          "Implemented Infrastructure as Code (IaC) using Ansible to automate system setup",
          "Managed and maintained Linux-based infrastructure, ensuring high availability"
        ]),
        order: 2
      },
      {
        role: 'Autonomous Driving Subsystem Member',
        company: 'VCET Solecthon (Autonomous Solar Vehicle R&D)',
        location: 'Mumbai, India',
        startDate: '01.2019',
        endDate: '05.2022',
        description: JSON.stringify([
          "Pioneered the development of a modular Autonomous Driving System",
          "Implemented real-time Computer Vision pipelines using YOLO to detect objects",
          "Programmed and optimized low-latency algorithms on Nvidia Jetson and Raspberry Pi"
        ]),
        order: 3
      }
    ]
  });

  // Create Projects
  await prisma.project.createMany({
    data: [
      {
        title: 'Agentic AI for Medical Data Simplification',
        description: 'AI-powered patient report generation that simplifies and summarizes medical conditions and prescriptions in clear, concise terms.',
        repoUrl: 'https://github.com/TheCez/medical-ai',
        videoUrl: '/assets/videos/medical_demo_placeholder.mp4',
        techTags: 'RAG,CrewAI,Google Gemini API,Multi-Agent System',
        highlights: JSON.stringify([
          "Architected robust RAG system ensuring facts are grounded in original source data",
          "Engineered multi-agent AI system to autonomously manage summarization workflows",
          "Won Best LLM Idea at Healthcare Hackathon 2024 (Berlin) & HealthHack 2024 Winner"
        ]),
        order: 1
      },
      {
        title: 'Image-to-BIM Generative AI Pipeline',
        description: 'End-to-end Generative AI pipeline that transforms 2D architectural images into 3D CAD-ready models using Multimodal LLMs.',
        repoUrl: 'https://github.com/TheCez/image-to-bim',
        videoUrl: '/assets/videos/bim_demo_placeholder.mp4',
        techTags: 'Multimodal LLM,Three.js,FastAPI,IFC,BIM',
        highlights: JSON.stringify([
          "Architected end-to-end pipeline transforming 2D images into 3D CAD-ready models",
          "Engineered Agentic AI workflow to autonomously interpret structural features",
          "Won 'Solves a BIG AEC Problem' at AEC Hackathon Munich 2024"
        ]),
        order: 2
      },
      {
        title: 'Autonomous Solar Vehicle System',
        description: 'Modular autonomous driving system with real-time computer vision for solar-powered vehicles.',
        repoUrl: 'https://github.com/TheCez/solar-vehicle',
        videoUrl: '/assets/videos/solar_demo_placeholder.mp4',
        techTags: 'YOLO,OpenCV,Nvidia Jetson,Raspberry Pi,Deep Learning',
        highlights: JSON.stringify([
          "Designed plug-and-play modular architecture for rapid sensor integration",
          "Implemented real-time object detection using YOLO",
          "All India Rank 2 at SAUR URJA VEHICLE CHALLENGE 2022"
        ]),
        order: 3
      }
    ]
  });

  // Create Education
  await prisma.education.createMany({
    data: [
      {
        degree: 'Master of Science in Data Science',
        university: 'TU Braunschweig, Germany',
        dates: '10.2022 – 10.2025',
        results: 'Final Grade: 1.9',
        order: 1
      },
      {
        degree: 'Bachelor of Engineering in Computer Engineering',
        university: 'University of Mumbai, India',
        dates: '05.2018 – 03.2022',
        results: 'Final Grade: 1.6 (Excellent)',
        order: 2
      }
    ]
  });

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

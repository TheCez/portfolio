export type DefaultSkillGroup = {
  category: string;
  icon: string;
  tags: string[];
};

export const defaultSkillGroups: DefaultSkillGroup[] = [
  {
    category: "AI & Generative AI",
    icon: "brain",
    tags: [
      "Agentic AI Systems",
      "LLMs (GPT-4, Gemini)",
      "RAG Pipelines",
      "Vector Embeddings",
      "Multimodality",
      "VLM (Vision Language Models)",
      "Prompt Engineering",
      "Chain-of-Thought",
    ],
  },
  {
    category: "Frameworks & Libraries",
    icon: "code",
    tags: ["PyTorch", "OpenCV", "Pandas", "NumPy", "YOLO", "CrewAI", "LangChain", "FastAPI"],
  },
  {
    category: "Backend & Engineering",
    icon: "server",
    tags: ["Python (Expert)", "RESTful API Design", "Microservices", "Clean Code Principles", "Unit Testing", "Three.js"],
  },
  {
    category: "Cloud & DevOps",
    icon: "cloud",
    tags: ["Microsoft Azure", "Docker", "Git & CI/CD", "Ansible", "SQL", "Linux Administration"],
  },
  {
    category: "Domain Knowledge",
    icon: "lightbulb",
    tags: ["3D Environment Analysis", "Computer Vision", "CAD/IFC", "Autonomous Driving", "Audio Processing (STT/TTS)"],
  },
  {
    category: "Strengths",
    icon: "users",
    tags: ["Analytical Thinking", "Adaptability", "Eye for Detail", "Academic Research", "Coordination"],
  },
];

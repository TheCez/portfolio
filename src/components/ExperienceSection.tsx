"use client";
import { motion } from "framer-motion";

export default function ExperienceSection({ experiences }: { experiences: any[] }) {
  return (
    <section id="experience" className="py-20">
      <div className="container mx-auto px-6 max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Professional Experience
        </h2>
        <div className="relative border-l border-gray-800 ml-4 md:ml-0 md:space-y-12 space-y-8">
          {experiences.map((exp, idx) => (
            <motion.div 
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative pl-8 md:pl-12"
            >
              <div className="absolute w-4 h-4 bg-indigo-600 rounded-full -left-[9px] top-1 border-4 border-black"></div>
              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 md:p-8 hover:border-gray-700 transition-colors">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6 gap-2">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{exp.role}</h3>
                    <p className="text-indigo-400 font-medium text-lg">{exp.company}</p>
                  </div>
                  <div className="text-gray-500 font-mono bg-gray-900 px-3 py-1 rounded inline-block w-fit">
                    {exp.startDate} - {exp.endDate || "Present"} <br className="hidden lg:block"/> {exp.location && ` | ${exp.location}`}
                  </div>
                </div>
                <ul className="list-disc list-inside text-gray-300 space-y-3 leading-relaxed">
                  {JSON.parse(exp.description || "[]").map((desc: string, i: number) => (
                    <li key={i} className="pl-2 relative">
                      <span className="hidden leading-7">{desc}</span>
                      {desc}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";
import { motion } from "framer-motion";

export default function EducationSection({ education }: { education: any[] }) {
  if (!education || education.length === 0) return null;

  return (
    <section id="education" className="py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Education
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {education.map((edu, idx) => (
            <motion.div 
              key={edu.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-8 rounded-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl">🎓</div>
              <h3 className="text-2xl font-bold text-white mb-2">{edu.degree}</h3>
              <p className="text-indigo-400 font-medium mb-6 text-lg">{edu.university}</p>
              <div className="text-gray-400 text-sm space-y-2 flex justify-between items-end">
                <p className="bg-gray-800/50 px-3 py-1 rounded w-fit font-mono">{edu.dates}</p>
                <p className="font-semibold text-gray-300 text-right">{edu.results}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

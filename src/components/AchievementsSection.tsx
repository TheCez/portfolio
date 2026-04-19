"use client";
import { motion } from "framer-motion";

export default function AchievementsSection({ achievements }: { achievements: any[] }) {
  if (!achievements || achievements.length === 0) return null;

  return (
    <section id="achievements" className="py-20 bg-black/40">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Achievements
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {achievements.map((ach, idx) => (
            <motion.div 
              key={ach.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-gray-900/50 border border-gray-800 p-8 rounded-2xl hover:bg-gray-800 transition-colors flex items-start gap-4"
            >
              <div className="text-4xl">{ach.icon || "🏆"}</div>
              <div>
                <h3 className="text-white font-bold mb-1 text-lg">{ach.title}</h3>
                <p className="text-gray-400 text-sm">{ach.event}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

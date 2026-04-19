"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ProjectSection({ projects }: { projects: any[] }) {
  return (
    <section id="projects" className="py-20 bg-black/40">
      <div className="container mx-auto px-6 max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Featured Projects
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((proj, idx) => (
            <motion.div 
              key={proj.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-gray-900/50 flex flex-col border border-gray-800 rounded-2xl overflow-hidden group hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.1)] transition-all duration-300"
            >
              <div className="aspect-video bg-gray-800 relative overflow-hidden">
                 <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-800">
                   {proj.videoUrl ? 'Video Preview' : 'No Video'}
                 </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">{proj.title}</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed flex-grow">{proj.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {proj.techTags.split(',').map((t: string) => (
                    <span key={t} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs rounded-full">
                      {t.trim()}
                    </span>
                  ))}
                </div>
                {proj.repoUrl && (
                  <Link href={proj.repoUrl} target="_blank" className="inline-flex w-fit items-center text-white bg-white/5 px-4 py-2 rounded-lg hover:bg-white/10 text-sm font-medium transition-colors">
                    View Repository &rarr;
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20">
      <div className="container mx-auto px-6 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
        >
          Ajay Chodankar
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-300 font-medium mb-4"
        >
          AI Researcher & Software Engineer
        </motion.p>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 max-w-2xl mx-auto mb-10"
        >
          Agentic AI Systems, Computer Vision, and Cloud Technologies
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-x-4 flex items-center justify-center gap-4 flex-wrap"
        >
          <Link href="#projects" className="px-8 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors">
            View My Work
          </Link>
          <Link href="#contact" className="px-8 py-3 rounded-full border border-indigo-600 text-indigo-400 hover:bg-indigo-600/10 font-medium transition-colors">
            Get In Touch
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

"use client";
import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="py-20 bg-black/40">
      <div className="container mx-auto px-6 max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">About Me</h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden border border-gray-800 p-2 bg-gradient-to-br from-gray-900 to-black relative aspect-square max-w-md mx-auto w-full"
          >
            <div className="w-full h-full bg-gray-800/50 rounded-xl flex items-center justify-center text-gray-500">
               Photo
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 text-gray-300 text-lg leading-relaxed"
          >
            <h3 className="text-2xl font-semibold text-white">AI/ML Engineer & Data Scientist</h3>
            <p>I am a <span className="text-indigo-400 font-medium">Data Science Master's Graduate</span> (TU Braunschweig) with robust experience across AI/ML, Cloud Computing, and DevOps.</p>
            <p>Specializing in GenAI, I architect Agentic systems and RAG pipelines using Microsoft AI Foundry and Google Gemini. My award-winning AI applications leverage multi-agent frameworks to achieve top-tier accuracy.</p>
            <p>My AI work is backed by Cloud & DevOps expertise, deploying scalable services on Microsoft Azure with Docker and Ansible.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

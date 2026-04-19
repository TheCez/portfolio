"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md shadow-lg py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="#home" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
          AC
        </Link>
        <ul className="hidden md:flex space-x-8 text-sm font-medium text-gray-300">
          <li><Link href="#about" className="hover:text-white transition-colors">About</Link></li>
          <li><Link href="#skills" className="hover:text-white transition-colors">Skills</Link></li>
          <li><Link href="#experience" className="hover:text-white transition-colors">Experience</Link></li>
          <li><Link href="#projects" className="hover:text-white transition-colors">Projects</Link></li>
          <li><Link href="#education" className="hover:text-white transition-colors">Education</Link></li>
          <li><Link href="#achievements" className="hover:text-white transition-colors">Achievements</Link></li>
          <li><Link href="#contact" className="hover:text-white transition-colors">Contact</Link></li>
        </ul>
      </div>
    </motion.nav>
  );
}

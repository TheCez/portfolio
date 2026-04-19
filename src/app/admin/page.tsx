import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Briefcase, Code, GraduationCap, Trophy, Settings, BrainCircuit, MessageSquareQuote } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [expCount, projectCount, eduCount, achCount, skillCount, referenceCount] = await Promise.all([
    prisma.experience.count(),
    prisma.project.count(),
    prisma.education.count(),
    prisma.achievement.count(),
    prisma.skill.count(),
    prisma.reference.count(),
  ]);

  const stats = [
    { title: "Experiences", count: expCount, icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10", link: "/admin/experience" },
    { title: "Projects", count: projectCount, icon: Code, color: "text-purple-500", bg: "bg-purple-500/10", link: "/admin/projects" },
    { title: "Skills", count: skillCount, icon: BrainCircuit, color: "text-cyan-500", bg: "bg-cyan-500/10", link: "/admin/skills" },
    { title: "Education", count: eduCount, icon: GraduationCap, color: "text-green-500", bg: "bg-green-500/10", link: "/admin/education" },
    { title: "Achievements", count: achCount, icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-500/10", link: "/admin/achievements" },
    { title: "References", count: referenceCount, icon: MessageSquareQuote, color: "text-pink-500", bg: "bg-pink-500/10", link: "/admin/references" },
    { title: "Site Settings", count: 1, icon: Settings, color: "text-indigo-500", bg: "bg-indigo-500/10", link: "/admin/settings" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-6 mb-12">
        {stats.map((s, i) => (
          <Link href={s.link} key={i}>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{s.title}</p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors">{s.count}</h3>
                </div>
                <div className={`p-3 rounded-lg ${s.bg} ${s.color}`}>
                  <s.icon size={24} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl p-6">
        <h2 className="text-xl font-bold text-indigo-900 dark:text-indigo-100 mb-2">Welcome to your Admin Panel!</h2>
        <p className="text-indigo-700 dark:text-indigo-300">
          From here, you can manage all dynamic content on your portfolio. Select a section from the sidebar or the cards above to add, edit, or remove entries.
        </p>
      </div>
    </div>
  );
}

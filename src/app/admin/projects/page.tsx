import { prisma } from "@/lib/prisma";
import { addProject, deleteProject } from "../actions";

export default async function AdminProjects() {
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" }
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Manage Projects</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* ADD NEW PROJECT FORM */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 h-fit">
          <h2 className="text-xl font-bold mb-4">Add New Project</h2>
          <form action={addProject} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
              <input name="title" required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-transparent dark:text-white" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea name="description" required rows={2} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-transparent dark:text-white"></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tech Tags (comma separated)</label>
              <input name="techTags" required placeholder="React, Node, Tailwind" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-transparent dark:text-white" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Repo URL (optional)</label>
              <input name="repoUrl" type="url" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-transparent dark:text-white" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Video/Media URL (optional)</label>
              <input name="videoUrl" placeholder="/assets/videos/demo.mp4 or https://youtube..." className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-transparent dark:text-white" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Highlights (one per line)</label>
              <textarea name="highlights" rows={3} placeholder="- Built full stack app&#10;- Integrated AI..." className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-transparent dark:text-white"></textarea>
            </div>
            
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-md transition-colors">
              Save Project
            </button>
          </form>
        </div>

        {/* LIST EXISTING PROJECTS */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Existing Projects ({projects.length})</h2>
          {projects.map(proj => (
            <div key={proj.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-xl flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">{proj.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-1 mt-1">{proj.description}</p>
                <div className="mt-2 flex gap-2">
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-600 dark:text-gray-300 break-all w-fit max-w-[200px] line-clamp-1">{proj.techTags}</span>
                </div>
              </div>
              <form action={async () => {
                "use server";
                await deleteProject(proj.id);
              }}>
                <button type="submit" className="text-red-500 hover:text-red-600 text-sm font-medium border border-red-500/20 px-3 py-1 rounded">Delete</button>
              </form>
            </div>
          ))}
          {projects.length === 0 && (
            <p className="text-gray-500 italic">No projects added yet.</p>
          )}
        </div>

      </div>
    </div>
  );
}

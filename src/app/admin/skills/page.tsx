import { prisma } from "@/lib/prisma";
import AdminSortableList from "@/components/admin/AdminSortableList";
import { addSkill, deleteSkill, importDefaultSkills, reorderSkills, updateSkill } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const skills = await prisma.skill.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Manage Skills</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Skill groups now come from the database. If this section was empty before, you can import the original portfolio skills once and then edit them freely.
        </p>
      </div>

      {skills.length === 0 ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-500/20 dark:bg-amber-900/10">
          <h2 className="text-lg font-bold text-amber-900 dark:text-amber-100">No skill groups in the database yet</h2>
          <p className="mt-2 text-sm text-amber-800 dark:text-amber-200">
            The homepage was showing the original fallback skill matrix. Import those original groups here so admin and website stay in sync.
          </p>
          <form action={importDefaultSkills} className="mt-4">
            <button type="submit" className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600">
              Import Original Skill Groups
            </button>
          </form>
        </div>
      ) : null}

      <AdminSortableList
        label="Skill Order"
        items={skills.map((entry) => ({
          id: entry.id,
          title: entry.category,
          subtitle: entry.tags,
        }))}
        emptyMessage="Import the original skill groups first, then drag them into the order you want."
        reorderAction={reorderSkills}
      />

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.25fr]">
        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Add Skill Group</h2>
          <form action={addSkill} className="space-y-4">
            <input name="category" required placeholder="AI & Generative AI" className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
            <div className="grid gap-4 md:grid-cols-2">
              <input name="icon" placeholder="brain / cloud / code" className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
              <input name="order" type="number" min="0" placeholder="Order (optional)" className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
            </div>
            <textarea name="tags" rows={4} placeholder="Agentic AI Systems, RAG Pipelines, LLMs" className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
            <button type="submit" className="w-full rounded-md bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700">Save Skill Group</button>
          </form>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Existing Groups ({skills.length})</h2>
          {skills.map((entry) => (
            <details key={entry.id} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{entry.category}</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{entry.tags} · Order {entry.order}</p>
                </div>
                <span className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">Edit</span>
              </summary>

              <div className="mt-5 space-y-4 border-t border-gray-200 pt-5 dark:border-gray-800">
                <form
                  action={async (formData) => {
                    "use server";
                    await updateSkill(entry.id, formData);
                  }}
                  className="space-y-4"
                >
                  <input name="category" defaultValue={entry.category} className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
                  <div className="grid gap-4 md:grid-cols-2">
                    <input name="icon" defaultValue={entry.icon} className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
                    <input name="order" type="number" min="0" defaultValue={entry.order} className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
                  </div>
                  <textarea name="tags" rows={4} defaultValue={entry.tags} className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
                  <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700">Update Skill Group</button>
                </form>
                <form
                  action={async () => {
                    "use server";
                    await deleteSkill(entry.id);
                  }}
                >
                  <button type="submit" className="rounded-md border border-red-500/20 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">Delete</button>
                </form>
              </div>
            </details>
          ))}
        </section>
      </div>
    </div>
  );
}

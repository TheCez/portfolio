import { prisma } from "@/lib/prisma";
import AdminSortableList from "@/components/admin/AdminSortableList";
import { addExperience, deleteExperience, reorderExperiences, updateExperience } from "../actions";

export const dynamic = "force-dynamic";

function formatList(value: string) {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.join("\n");
  } catch {
    // Fall back below.
  }
  return value;
}

export default async function AdminExperiencePage() {
  const experiences = await prisma.experience.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Manage Experience</h1>
        <p className="text-gray-500 dark:text-gray-400">Keep the timeline clean and ordered for the homepage layout.</p>
      </div>

      <AdminSortableList
        label="Experience Order"
        items={experiences.map((experience) => ({
          id: experience.id,
          title: experience.role,
          subtitle: experience.company,
        }))}
        reorderAction={reorderExperiences}
      />

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.25fr]">
        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Add Experience</h2>
          <form action={addExperience} className="space-y-4">
            <input name="role" required placeholder="Role" className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
            <input name="company" required placeholder="Company" className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
            <div className="grid gap-4 md:grid-cols-2">
              <input name="location" placeholder="Location" className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
              <input name="order" type="number" min="0" placeholder="Order" className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input name="startDate" required placeholder="06.2024" className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
              <input name="endDate" placeholder="Present" className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
            </div>
            <textarea name="description" required rows={6} placeholder="One bullet point per line" className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
            <button type="submit" className="w-full rounded-md bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700">Save Experience</button>
          </form>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Existing Entries ({experiences.length})</h2>
          {experiences.map((experience) => (
            <details key={experience.id} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{experience.role}</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{experience.company} · Order {experience.order}</p>
                </div>
                <span className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">Edit</span>
              </summary>

              <div className="mt-5 space-y-4 border-t border-gray-200 pt-5 dark:border-gray-800">
                <form action={async (formData) => {
                  "use server";
                  await updateExperience(experience.id, formData);
                }} className="space-y-4">
                  <input name="role" defaultValue={experience.role} className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
                  <input name="company" defaultValue={experience.company} className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
                  <div className="grid gap-4 md:grid-cols-2">
                    <input name="location" defaultValue={experience.location ?? ""} className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
                    <input name="order" type="number" min="0" defaultValue={experience.order} className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <input name="startDate" defaultValue={experience.startDate} className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
                    <input name="endDate" defaultValue={experience.endDate ?? ""} className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
                  </div>
                  <textarea name="description" rows={6} defaultValue={formatList(experience.description)} className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
                  <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700">Update Experience</button>
                </form>
                <form action={async () => {
                  "use server";
                  await deleteExperience(experience.id);
                }}>
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

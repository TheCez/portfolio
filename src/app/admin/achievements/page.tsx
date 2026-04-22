import { prisma } from "@/lib/prisma";
import AdminFileDropInput from "@/components/admin/AdminFileDropInput";
import AdminSortableList from "@/components/admin/AdminSortableList";
import AdminManagedActionForm from "@/components/admin/AdminManagedActionForm";
import AdminSubmitButton from "@/components/admin/AdminSubmitButton";
import { isStorageConfigured } from "@/lib/storage";
import { addAchievement, deleteAchievement, reorderAchievements, updateAchievement } from "../actions";

export const dynamic = "force-dynamic";

const achievementTypes = [
  { value: "competition", label: "Hackathon / Competition", hint: "Trophy-style awards, rankings, wins" },
  { value: "certification", label: "Certification", hint: "Cloud, platform, or formal certifications" },
  { value: "workshop", label: "Workshop / Bootcamp", hint: "Training, cohort, workshops, bootcamps" },
  { value: "research", label: "Research / Publication", hint: "Publications, papers, research recognitions" },
];

function normalizeType(value?: string | null) {
  const match = achievementTypes.find((item) => item.value === value);
  return match?.value ?? "competition";
}

export default async function AdminAchievementsPage() {
  const [achievements, storageReady] = await Promise.all([
    prisma.achievement.findMany({ orderBy: { order: "asc" } }),
    Promise.resolve(isStorageConfigured()),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Manage Achievements</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Keep the old static achievements dynamic, and attach optional certificates or award images when available.
        </p>
      </div>

      <div
        className={`rounded-xl border p-4 text-sm ${
          storageReady
            ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-900/10 dark:text-emerald-300"
            : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-900/10 dark:text-amber-300"
        }`}
      >
        {storageReady
          ? "Storage is configured. You can upload achievement certificate images or PDFs here, or paste a direct attachment URL. Uploads replace the saved URL, and leaving the URL blank with no upload clears it."
          : "Storage is not configured. URL fields still work, but uploads need the MinIO/S3 env vars enabled."}
      </div>

      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-800 dark:border-indigo-500/20 dark:bg-indigo-900/10 dark:text-indigo-200">
        Achievement type now uses predefined icons instead of manual emoji entry, so it stays clean and consistent.
      </div>

      <AdminSortableList
        label="Achievement Order"
        items={achievements.map((entry) => ({
          id: entry.id,
          title: entry.title,
          subtitle: entry.event.replace(/\n/g, " · "),
        }))}
        reorderAction={reorderAchievements}
      />

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.25fr]">
        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Add Achievement</h2>
          <AdminManagedActionForm
            action={addAchievement}
            className="space-y-4"
            mediaFieldNames={["imageUrl"]}
            refreshOnSuccess
            resetOnSuccess
          >
            <input
              name="title"
              required
              placeholder="Best LLM Idea"
              className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
            />
            <textarea
              name="event"
              required
              rows={3}
              placeholder={"Healthcare Hackathon 2024\nBerlin (UKSH)"}
              className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
            />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                <select
                  name="icon"
                  defaultValue="competition"
                  className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
                >
                  {achievementTypes.map((type) => (
                    <option key={type.value} value={type.value} className="text-black">
                      {type.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400">Choose the card icon style and category.</p>
              </div>
              <input
                name="order"
                type="number"
                min="0"
                placeholder="Order"
                className="w-full self-end rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="imageUrl"
                placeholder="Certificate image or PDF URL (optional)"
                className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
              />
              <AdminFileDropInput name="imageFile" accept="image/*,.pdf,application/pdf" label="Upload Achievement Attachment" helperText="Drop a certificate image, badge, award image, or PDF here." />
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-800">
              <input id="achievement-enabled" name="isEnabled" type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
              <label htmlFor="achievement-enabled" className="text-sm text-gray-700 dark:text-gray-300">Show this card on the website</label>
            </div>
            <AdminSubmitButton
              idleLabel="Save Achievement"
              pendingLabel="Uploading image..."
              className="w-full rounded-md bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            />
          </AdminManagedActionForm>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Existing Entries ({achievements.length})</h2>
          {achievements.map((entry) => {
            const selectedType = normalizeType(entry.icon);

            return (
              <details key={entry.id} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{entry.title}</h3>
                    <p className="mt-1 whitespace-pre-line text-sm text-gray-500 dark:text-gray-400">
                      {entry.event} · Order {entry.order}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full border px-3 py-1 text-xs ${entry.isEnabled ? "border-emerald-300/30 text-emerald-500 dark:text-emerald-300" : "border-amber-300/30 text-amber-500 dark:text-amber-300"}`}>
                      {entry.isEnabled ? "Live" : "Hidden"}
                    </span>
                    <span className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                      Edit
                    </span>
                  </div>
                </summary>

                <div className="mt-5 space-y-4 border-t border-gray-200 pt-5 dark:border-gray-800">
                  <AdminManagedActionForm
                    action={updateAchievement.bind(null, entry.id)}
                    className="space-y-4"
                    mediaFieldNames={["imageUrl"]}
                  >
                    <input
                      name="title"
                      defaultValue={entry.title}
                      className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
                    />
                    <textarea
                      name="event"
                      rows={3}
                      defaultValue={entry.event}
                      className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
                    />
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                        <select
                          name="icon"
                          defaultValue={selectedType}
                          className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
                        >
                          {achievementTypes.map((type) => (
                            <option key={type.value} value={type.value} className="text-black">
                              {type.label}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {achievementTypes.find((type) => type.value === selectedType)?.hint}
                        </p>
                      </div>
                      <input
                        name="order"
                        type="number"
                        min="0"
                        defaultValue={entry.order}
                        className="w-full self-end rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
                      />
                    </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      name="imageUrl"
                      defaultValue={entry.imageUrl ?? ""}
                      placeholder="Certificate image or PDF URL (optional)"
                      className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
                    />
                    <AdminFileDropInput name="imageFile" accept="image/*,.pdf,application/pdf" label="Upload New Achievement Attachment" helperText="Drop a replacement image or PDF here or click to browse." />
                  </div>
                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-800">
                      <input id={`achievement-enabled-${entry.id}`} name="isEnabled" type="checkbox" defaultChecked={entry.isEnabled} className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
                      <label htmlFor={`achievement-enabled-${entry.id}`} className="text-sm text-gray-700 dark:text-gray-300">Show this card on the website</label>
                    </div>
                    <AdminSubmitButton
                      idleLabel="Update Achievement"
                      pendingLabel="Uploading image..."
                      className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                    />
                  </AdminManagedActionForm>
                  <form
                    action={async () => {
                      "use server";
                      await deleteAchievement(entry.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="rounded-md border border-red-500/20 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </details>
            );
          })}
        </section>
      </div>
    </div>
  );
}

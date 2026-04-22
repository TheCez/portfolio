import { prisma } from "@/lib/prisma";
import AdminFileDropInput from "@/components/admin/AdminFileDropInput";
import AdminSortableList from "@/components/admin/AdminSortableList";
import AdminManagedActionForm from "@/components/admin/AdminManagedActionForm";
import AdminSubmitButton from "@/components/admin/AdminSubmitButton";
import { isStorageConfigured } from "@/lib/storage";
import { addEducation, deleteEducation, reorderEducation, updateEducation } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminEducationPage() {
  const [education, storageReady] = await Promise.all([
    prisma.education.findMany({ orderBy: { order: "asc" } }),
    Promise.resolve(isStorageConfigured()),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Manage Education</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Keep education cards polished, ordered, and optionally linked to uploaded certificates.
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
          ? "Storage is configured. You can upload certificate images here or paste a direct image URL. Uploads replace the saved URL, and leaving the URL blank with no upload clears it."
          : "Storage is not configured. URL fields still work, but uploads need the MinIO/S3 env vars enabled."}
      </div>

      <AdminSortableList
        label="Education Order"
        items={education.map((entry) => ({
          id: entry.id,
          title: entry.degree,
          subtitle: entry.university,
        }))}
        reorderAction={reorderEducation}
      />

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.25fr]">
        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Add Education</h2>
          <AdminManagedActionForm
            action={addEducation}
            className="space-y-4"
            mediaFieldNames={["imageUrl"]}
            refreshOnSuccess
            resetOnSuccess
          >
            <input
              name="degree"
              required
              placeholder="Master of Science in Data Science"
              className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
            />
            <input
              name="university"
              required
              placeholder="TU Braunschweig, Germany"
              className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
            />
            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="dates"
                required
                placeholder="10.2022 - 10.2025"
                className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
              />
              <input
                name="order"
                type="number"
                min="0"
                placeholder="Order"
                className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
              />
            </div>
            <textarea
              name="results"
              required
              rows={4}
              placeholder={"Final Grade: 1.9\nMaster Thesis: Computation and Validation of Occupancy Grids..."}
              className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
            />
            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="imageUrl"
                placeholder="Certificate image URL (optional)"
                className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
              />
              <AdminFileDropInput name="imageFile" accept="image/*" label="Upload Certificate" helperText="Drop a certificate image here or click to browse." />
            </div>
            <AdminSubmitButton
              idleLabel="Save Education"
              pendingLabel="Uploading certificate..."
              className="w-full rounded-md bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            />
          </AdminManagedActionForm>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Existing Entries ({education.length})</h2>
          {education.map((entry) => (
            <details key={entry.id} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{entry.degree}</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {entry.university} · Order {entry.order}
                  </p>
                </div>
                <span className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  Edit
                </span>
              </summary>

              <div className="mt-5 space-y-4 border-t border-gray-200 pt-5 dark:border-gray-800">
                <AdminManagedActionForm
                  action={updateEducation.bind(null, entry.id)}
                  className="space-y-4"
                  mediaFieldNames={["imageUrl"]}
                >
                  <input
                    name="degree"
                    defaultValue={entry.degree}
                    className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
                  />
                  <input
                    name="university"
                    defaultValue={entry.university}
                    className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      name="dates"
                      defaultValue={entry.dates}
                      className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
                    />
                    <input
                      name="order"
                      type="number"
                      min="0"
                      defaultValue={entry.order}
                      className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
                    />
                  </div>
                  <textarea
                    name="results"
                    rows={4}
                    defaultValue={entry.results}
                    className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      name="imageUrl"
                      defaultValue={entry.imageUrl ?? ""}
                      placeholder="Certificate image URL (optional)"
                      className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
                    />
                    <AdminFileDropInput name="imageFile" accept="image/*" label="Upload New Certificate" helperText="Drop a replacement certificate here or click to browse." />
                  </div>
                  <AdminSubmitButton
                    idleLabel="Update Education"
                    pendingLabel="Uploading certificate..."
                    className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                  />
                </AdminManagedActionForm>
                <form
                  action={async () => {
                    "use server";
                    await deleteEducation(entry.id);
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
          ))}
        </section>
      </div>
    </div>
  );
}

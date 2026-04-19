import { prisma } from "@/lib/prisma";
import AdminFileDropInput from "@/components/admin/AdminFileDropInput";
import AdminSortableList from "@/components/admin/AdminSortableList";
import { isStorageConfigured } from "@/lib/storage";
import { addReference, deleteReference, reorderReferences, updateReference } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminReferencesPage() {
  const [references, storageReady] = await Promise.all([
    prisma.reference.findMany({ orderBy: { order: "asc" } }),
    Promise.resolve(isStorageConfigured()),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Manage References</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Add manual references or LinkedIn recommendations with optional photo, company, date, and source link.
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
          ? "Storage is configured. You can upload recommender photos directly from this page."
          : "Storage is not configured. Photo URL fields still work, but uploads need the MinIO/S3 env vars enabled."}
      </div>

      <AdminSortableList
        label="Reference Order"
        items={references.map((entry) => ({
          id: entry.id,
          title: entry.name,
          subtitle: [entry.role, entry.company].filter(Boolean).join(" · "),
        }))}
        reorderAction={reorderReferences}
      />

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.25fr]">
        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Add Reference</h2>
          <form action={addReference} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Quote</label>
              <textarea
                name="quote"
                required
                rows={6}
                placeholder="Ajay is an exceptional AI engineer..."
                className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Keep the quote readable. Long recommendations can still be stored fully; the public card can be improved later with excerpt behavior if needed.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="name"
                required
                placeholder="Lukas Adrian Jurk"
                className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
              />
              <input
                name="role"
                required
                placeholder="CEO & co-founder"
                className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="company"
                placeholder="TANGILITY"
                className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
              />
              <input
                name="dateLabel"
                placeholder="December 19, 2025"
                className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <select name="source" defaultValue="" className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white">
                <option value="" className="text-black">No source badge</option>
                <option value="linkedin" className="text-black">LinkedIn recommendation</option>
                <option value="manual" className="text-black">Manual reference</option>
                <option value="email" className="text-black">Email / message</option>
              </select>
              <input
                name="sourceUrl"
                type="url"
                placeholder="Optional source URL"
                className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="photoUrl"
                placeholder="Optional photo URL"
                className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
              />
              <AdminFileDropInput name="photoFile" accept="image/*" label="Upload Photo" helperText="Drop a recommender photo here or click to browse." />
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-800">
              <input id="isFeatured" name="isFeatured" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
              <label htmlFor="isFeatured" className="text-sm text-gray-700 dark:text-gray-300">Feature this reference more prominently</label>
            </div>
            <input
              name="order"
              type="number"
              min="0"
              placeholder="Order (optional)"
              className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
            />
            <button type="submit" className="w-full rounded-md bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700">
              Save Reference
            </button>
          </form>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Existing Entries ({references.length})</h2>
          {references.map((entry) => (
            <details key={entry.id} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{entry.name}</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {[entry.role, entry.company].filter(Boolean).join(" · ")} · Order {entry.order}
                  </p>
                </div>
                <span className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  Edit
                </span>
              </summary>

              <div className="mt-5 space-y-4 border-t border-gray-200 pt-5 dark:border-gray-800">
                <form
                  action={async (formData) => {
                    "use server";
                    await updateReference(entry.id, formData);
                  }}
                  className="space-y-4"
                >
                  <textarea
                    name="quote"
                    rows={6}
                    defaultValue={entry.quote}
                    className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      name="name"
                      defaultValue={entry.name}
                      className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
                    />
                    <input
                      name="role"
                      defaultValue={entry.role}
                      className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      name="company"
                      defaultValue={entry.company ?? ""}
                      placeholder="Company"
                      className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
                    />
                    <input
                      name="dateLabel"
                      defaultValue={entry.dateLabel ?? ""}
                      placeholder="Date label"
                      className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <select name="source" defaultValue={entry.source ?? ""} className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white">
                      <option value="" className="text-black">No source badge</option>
                      <option value="linkedin" className="text-black">LinkedIn recommendation</option>
                      <option value="manual" className="text-black">Manual reference</option>
                      <option value="email" className="text-black">Email / message</option>
                    </select>
                    <input
                      name="sourceUrl"
                      type="url"
                      defaultValue={entry.sourceUrl ?? ""}
                      placeholder="Optional source URL"
                      className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      name="photoUrl"
                      defaultValue={entry.photoUrl ?? ""}
                      placeholder="Optional photo URL"
                      className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
                    />
                    <AdminFileDropInput name="photoFile" accept="image/*" label="Upload New Photo" helperText="Drop a replacement photo here or click to browse." />
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-800">
                    <input id={`featured-${entry.id}`} name="isFeatured" type="checkbox" defaultChecked={entry.isFeatured} className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
                    <label htmlFor={`featured-${entry.id}`} className="text-sm text-gray-700 dark:text-gray-300">Feature this reference</label>
                  </div>
                  <input
                    name="order"
                    type="number"
                    min="0"
                    defaultValue={entry.order}
                    className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
                  />
                  <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700">
                    Update Reference
                  </button>
                </form>
                <form
                  action={async () => {
                    "use server";
                    await deleteReference(entry.id);
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

import { prisma } from "@/lib/prisma";
import AdminFileDropInput from "@/components/admin/AdminFileDropInput";
import AdminSortableList from "@/components/admin/AdminSortableList";
import AdminManagedActionForm from "@/components/admin/AdminManagedActionForm";
import AdminSubmitButton from "@/components/admin/AdminSubmitButton";
import { addProject, deleteProject, reorderProjects, updateProject } from "../actions";
import { isStorageConfigured } from "@/lib/storage";

export const dynamic = "force-dynamic";

function formatHighlights(value: string) {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.join("\n");
    }
  } catch {
    // Fall back below.
  }

  return value;
}

export default async function AdminProjects() {
  const [projects, storageReady] = await Promise.all([
    prisma.project.findMany({
      orderBy: { order: "asc" },
    }),
    Promise.resolve(isStorageConfigured()),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Manage Projects</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Add or update projects with either direct links or uploaded media. Uploaded files are stored in MinIO / S3-compatible storage.
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
          ? "Storage is configured. You can upload project images and demo videos from this page. Uploads replace saved URLs, and leaving a media URL blank with no upload clears it."
          : "Storage is not configured. URL fields still work, but uploads need the MinIO/S3 env vars enabled."}
      </div>

      <AdminSortableList
        label="Project Order"
        items={projects.map((project) => ({
          id: project.id,
          title: project.title,
          subtitle: project.techTags,
        }))}
        reorderAction={reorderProjects}
      />

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.25fr]">
        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Add New Project</h2>
          <AdminManagedActionForm
            action={addProject}
            className="space-y-4"
            mediaFieldNames={["imageUrl", "videoUrl"]}
            refreshOnSuccess
            resetOnSuccess
          >
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
              <input name="title" required className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea name="description" required rows={3} className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Order</label>
                <input name="order" type="number" min="0" placeholder="Auto" className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Repo URL</label>
                <input name="repoUrl" type="url" className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Tech Tags (comma separated)</label>
              <input name="techTags" required placeholder="React, Next.js, Prisma" className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
                <input name="imageUrl" placeholder="https://... or /api/media/..." className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
              </div>
              <AdminFileDropInput name="imageFile" accept="image/*" label="Upload Image" helperText="Drop a project image here or click to browse." />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Video / Demo URL</label>
                <input name="videoUrl" placeholder="https://... or /api/media/..." className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
              </div>
              <AdminFileDropInput name="videoFile" accept="video/*" label="Upload Video" helperText="Drop a video file here or click to browse." />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Highlights (one per line)</label>
              <textarea name="highlights" rows={5} className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-800">
              <input id="project-enabled" name="isEnabled" type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
              <label htmlFor="project-enabled" className="text-sm text-gray-700 dark:text-gray-300">Show this card on the website</label>
            </div>

            <AdminSubmitButton
              idleLabel="Save Project"
              pendingLabel="Uploading media..."
              className="w-full rounded-md bg-indigo-600 py-2 font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            />
          </AdminManagedActionForm>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Existing Projects ({projects.length})</h2>
          {projects.map((project) => (
            <details key={project.id} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{project.title}</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Order {project.order} · {project.techTags}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full border px-3 py-1 text-xs ${project.isEnabled ? "border-emerald-300/30 text-emerald-500 dark:text-emerald-300" : "border-amber-300/30 text-amber-500 dark:text-amber-300"}`}>
                    {project.isEnabled ? "Live" : "Hidden"}
                  </span>
                  <span className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                    Edit
                  </span>
                </div>
              </summary>

              <div className="mt-5 space-y-4 border-t border-gray-200 pt-5 dark:border-gray-800">
                <AdminManagedActionForm
                  action={updateProject.bind(null, project.id)}
                  className="space-y-4"
                  mediaFieldNames={["imageUrl", "videoUrl"]}
                >
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                    <input name="title" defaultValue={project.title} required className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                    <textarea name="description" defaultValue={project.description} rows={3} className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Order</label>
                      <input name="order" type="number" min="0" defaultValue={project.order} className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Repo URL</label>
                      <input name="repoUrl" type="url" defaultValue={project.repoUrl ?? ""} className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Tech Tags</label>
                    <input name="techTags" defaultValue={project.techTags} className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
                      <input name="imageUrl" defaultValue={project.imageUrl ?? ""} className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
                    </div>
                    <AdminFileDropInput name="imageFile" accept="image/*" label="Upload New Image" helperText="Drag a replacement image here or click to browse." />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Video / Demo URL</label>
                      <input name="videoUrl" defaultValue={project.videoUrl ?? ""} className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
                    </div>
                    <AdminFileDropInput name="videoFile" accept="video/*" label="Upload New Video" helperText="Drag a replacement video here or click to browse." />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Highlights</label>
                    <textarea name="highlights" rows={5} defaultValue={formatHighlights(project.highlights)} className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
                  </div>

                  <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-800">
                    <input id={`project-enabled-${project.id}`} name="isEnabled" type="checkbox" defaultChecked={project.isEnabled} className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
                    <label htmlFor={`project-enabled-${project.id}`} className="text-sm text-gray-700 dark:text-gray-300">Show this card on the website</label>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <AdminSubmitButton
                      idleLabel="Update Project"
                      pendingLabel="Uploading media..."
                      className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                    />
                  </div>
                </AdminManagedActionForm>

                <form
                  action={async () => {
                    "use server";
                    await deleteProject(project.id);
                  }}
                >
                  <button type="submit" className="rounded-md border border-red-500/20 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-900/20">
                    Delete Project
                  </button>
                </form>
              </div>
            </details>
          ))}

          {projects.length === 0 ? <p className="italic text-gray-500">No projects added yet.</p> : null}
        </section>
      </div>
    </div>
  );
}

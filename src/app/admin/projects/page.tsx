import { prisma } from "@/lib/prisma";
import AdminFileDropInput from "@/components/admin/AdminFileDropInput";
import ProjectMarkdownEditor from "@/components/admin/ProjectMarkdownEditor";
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

function formatGalleryUrls(value?: string | null) {
  if (!value) return "";

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0).join("\n");
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
          ? "Storage is configured. You can upload project logos, gallery screenshots, and demo videos from this page. Uploads replace saved URLs, and leaving a media URL blank with no upload clears it."
          : "Storage is not configured. URL fields still work, but uploads need the MinIO/S3 env vars enabled."}
      </div>

      <AdminSortableList
        label="Project Order"
        items={projects.map((project) => ({
          id: project.id,
          title: project.title,
          subtitle: project.displayTags || project.techTags,
        }))}
        reorderAction={reorderProjects}
      />

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.25fr]">
        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Add New Project</h2>
          <AdminManagedActionForm
            action={addProject}
            className="space-y-4"
            mediaFieldNames={["imageUrl", "galleryUrls", "videoUrl"]}
            refreshOnSuccess
            resetOnSuccess
          >
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
              <input name="title" required className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
            </div>

            <ProjectMarkdownEditor
              name="description"
              label="Full Project Details"
              rows={8}
              placeholder={"AI-assisted learning platform for nursing education...\n\n- Built the core web platform with onboarding and course management.\n- Implemented RAG-based study features using Qdrant.\n- Added voice and avatar interaction."}
            />

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
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Homepage Tags (short, comma separated)</label>
              <input name="displayTags" placeholder="RAG, Healthcare AI, CrewAI" className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Shown on the project card. Keep this to 3-5 high-signal tags so the homepage stays clean.</p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Full Tech Stack (comma separated)</label>
              <input name="techTags" required placeholder="React, Next.js, Prisma, PostgreSQL" className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Full technical inventory. This appears in the expanded project detail view.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Logo URL</label>
                <input name="imageUrl" placeholder="https://... or /api/media/projects/images/..." className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Optional project logo or cover fallback. Use gallery images below for screenshots shown in the carousel.</p>
              </div>
              <AdminFileDropInput name="imageFile" accept="image/*" label="Upload Logo" helperText="Drop a project logo here or click to browse." />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Carousel Screenshot URLs</label>
                <textarea
                  name="galleryUrls"
                  rows={4}
                  placeholder={"https://.../screenshot-1.png\n/api/media/projects/gallery/..."}
                  className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Optional. Add one screenshot URL per line. These images power the project detail carousel.</p>
              </div>
              <AdminFileDropInput name="galleryFiles" accept="image/*" multiple label="Upload Carousel Screenshots" helperText="Drop one or more project screenshots here." />
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
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Order {project.order} · {project.displayTags || project.techTags}</p>
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
                  mediaFieldNames={["imageUrl", "galleryUrls", "videoUrl"]}
                >
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                    <input name="title" defaultValue={project.title} required className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
                  </div>

                  <ProjectMarkdownEditor
                    name="description"
                    label="Full Project Details"
                    defaultValue={project.description}
                    rows={8}
                  />

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
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Homepage Tags</label>
                    <input name="displayTags" defaultValue={project.displayTags} placeholder="RAG, Healthcare AI, CrewAI" className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Shown on homepage cards. Leave blank to fall back to the full tech stack.</p>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Full Tech Stack</label>
                    <input name="techTags" defaultValue={project.techTags} className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Logo URL</label>
                      <input name="imageUrl" defaultValue={project.imageUrl ?? ""} className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white" />
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Optional logo or cover fallback. Screenshots should go in the carousel field below.</p>
                    </div>
                    <AdminFileDropInput name="imageFile" accept="image/*" label="Upload New Logo" helperText="Drag a replacement logo here or click to browse." />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Carousel Screenshot URLs</label>
                      <textarea
                        name="galleryUrls"
                        rows={4}
                        defaultValue={formatGalleryUrls(project.galleryUrls)}
                        className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
                      />
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">One screenshot URL per line. Clear this field with no upload to remove carousel images.</p>
                    </div>
                    <AdminFileDropInput name="galleryFiles" accept="image/*" multiple label="Upload New Carousel Screenshots" helperText="Drag one or more screenshots here or click to browse." />
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

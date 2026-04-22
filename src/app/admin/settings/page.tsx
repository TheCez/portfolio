import { updateSiteSettings } from "../actions";
import AdminFileDropInput from "@/components/admin/AdminFileDropInput";
import { getDefaultSiteSettings, getSiteSettings, parseParagraphs } from "@/lib/site-settings";
import { isStorageConfigured } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();
  const defaults = getDefaultSiteSettings();
  const aboutParagraphs = parseParagraphs(settings.aboutParagraphs).join("\n\n");
  const storageReady = isStorageConfigured();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Site Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage homepage copy, contact details, and the profile image from one place.
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
          ? "MinIO / S3-compatible storage is configured. You can upload files directly from this panel. Uploads replace saved URLs, and leaving the image URL blank with no upload clears it."
          : "Storage is not configured yet. URL fields will work, but file uploads will be disabled until the storage env vars are present."}
      </div>

      <form action={updateSiteSettings} className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Hero</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Hero Title</label>
                <input
                  name="heroTitle"
                  defaultValue={settings.heroTitle ?? defaults.heroTitle}
                  className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Hero Role</label>
                <input
                  name="heroRole"
                  defaultValue={settings.heroRole ?? defaults.heroRole}
                  className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Hero Specialties</label>
                <input
                  name="heroSpecialties"
                  defaultValue={settings.heroSpecialties ?? defaults.heroSpecialties}
                  className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">About Section</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">About Title</label>
                <input
                  name="aboutTitle"
                  defaultValue={settings.aboutTitle ?? defaults.aboutTitle}
                  className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">About Paragraphs</label>
                <textarea
                  name="aboutParagraphs"
                  rows={10}
                  defaultValue={aboutParagraphs}
                  className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
                />
                <p className="mt-2 text-xs text-gray-500">Use blank lines between paragraphs.</p>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Profile Image</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Current / External Image URL</label>
                <input
                  name="profileImageUrl"
                  defaultValue={settings.profileImageUrl ?? ""}
                  className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
                />
              </div>
              <div>
                <AdminFileDropInput name="profileImageFile" accept="image/*" label="Upload New Profile Image" helperText="Drop a profile image here or click to browse." />
              </div>
              <div className="rounded-lg border border-gray-200 p-3 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
                Uploading a file replaces the saved URL. If you leave the URL blank and do not upload a file, the saved profile image is cleared and the site falls back to the default placeholder image.
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Contact Details</h2>
            <div className="space-y-4">
              {[
                ["contactEmail", "Email", settings.contactEmail ?? defaults.contactEmail],
                ["contactPhone", "Phone", settings.contactPhone ?? defaults.contactPhone],
                ["contactLocation", "Location", settings.contactLocation ?? defaults.contactLocation],
                ["linkedinUrl", "LinkedIn URL", settings.linkedinUrl ?? defaults.linkedinUrl],
                ["githubUrl", "GitHub URL", settings.githubUrl ?? defaults.githubUrl],
              ].map(([name, label, value]) => (
                <div key={String(name)}>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
                  <input
                    name={String(name)}
                    defaultValue={String(value ?? "")}
                    className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700 dark:text-white"
                  />
                </div>
              ))}
            </div>
          </section>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            Save Site Settings
          </button>
        </div>
      </form>
    </div>
  );
}

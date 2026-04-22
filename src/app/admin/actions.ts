"use server";

import { execFile } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { promisify } from "node:util";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import type { AdminActionState } from "./action-state";
import { getSiteSettings } from "@/lib/site-settings";
import { isStorageConfigured, uploadFileToStorage } from "@/lib/storage";
import { defaultSkillGroups } from "@/lib/default-skills";
import { revalidatePath } from "next/cache";

const execFileAsync = promisify(execFile);

function normalizeText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeOptionalUrl(value: string) {
  return value.length > 0 ? value : null;
}

function normalizeCheckbox(value: FormDataEntryValue | null) {
  return value === "on";
}

function normalizeCsv(value: string) {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .join(", ");
}

function normalizeList(value: string) {
  const entries = value
    .split("\n")
    .map((line) => line.replace(/^[\-\u2022]\s*/, "").trim())
    .filter(Boolean);

  return JSON.stringify(entries);
}

function normalizeAchievementType(value: string) {
  const normalized = value.trim().toLowerCase();

  if (normalized === "workshop" || normalized === "certification" || normalized === "competition" || normalized === "research") {
    return normalized;
  }

  return "competition";
}

function normalizeReferenceSource(value: string) {
  const normalized = value.trim().toLowerCase();

  if (normalized.length === 0) {
    return null;
  }

  if (normalized.includes("linkedin")) {
    return "linkedin";
  }

  if (normalized.includes("email") || normalized.includes("message")) {
    return "email";
  }

  if (normalized.includes("manual")) {
    return "manual";
  }

  return null;
}

function getDatabaseBackupDir() {
  return process.env.DB_BACKUP_DIR || path.join(process.cwd(), "db_backups");
}

function createBackupFileName() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `portfolio_db_manual_${timestamp}.sql`;
}

async function reorderEntities(
  model: "project" | "experience" | "education" | "achievement" | "reference" | "skill",
  ids: string[],
) {
  await prisma.$transaction(
    ids.map((id, index) =>
      prisma[model].update({
        where: { id },
        data: { order: index },
      }),
    ),
  );
}

async function resolveMediaField(
  formData: FormData,
  fileField: string,
  urlField: string,
  folder: string,
) {
  const url = normalizeText(formData.get(urlField));
  const file = formData.get(fileField);

  if (file instanceof File && file.size > 0) {
    if (!isStorageConfigured()) {
      throw new Error("Storage is not configured. Add MinIO/S3 environment variables before uploading files.");
    }
    return uploadFileToStorage(file, folder);
  }

  if (url.length > 0) {
    return url;
  }

  return null;
}

export async function addProject(_previousState: AdminActionState, formData: FormData): Promise<AdminActionState> {
  try {
    const title = normalizeText(formData.get("title"));
    const description = normalizeText(formData.get("description"));
    const techTags = normalizeCsv(normalizeText(formData.get("techTags")));
    const repoUrl = normalizeOptionalUrl(normalizeText(formData.get("repoUrl")));
    const highlights = normalizeList(normalizeText(formData.get("highlights")));
    const orderValue = Number(normalizeText(formData.get("order")));

    const imageUrl = await resolveMediaField(formData, "imageFile", "imageUrl", "projects/images");
    const videoUrl = await resolveMediaField(formData, "videoFile", "videoUrl", "projects/videos");

    const maxOrder = await prisma.project.aggregate({ _max: { order: true } });

    await prisma.project.create({
      data: {
        title,
        description,
        techTags,
        repoUrl,
        imageUrl,
        videoUrl,
        highlights,
        isEnabled: normalizeCheckbox(formData.get("isEnabled")),
        order: Number.isFinite(orderValue) ? orderValue : (maxOrder._max.order ?? -1) + 1,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/projects");

    return {
      ok: true,
      message: "Project saved.",
      media: {
        imageUrl: imageUrl ?? "",
        videoUrl: videoUrl ?? "",
      },
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to save project.",
    };
  }
}

export async function updateProject(id: string, _previousState: AdminActionState, formData: FormData): Promise<AdminActionState> {
  try {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return { ok: false, message: "Project not found." };
    }

    const imageUrl = await resolveMediaField(formData, "imageFile", "imageUrl", "projects/images");
    const videoUrl = await resolveMediaField(formData, "videoFile", "videoUrl", "projects/videos");
    const orderValue = Number(normalizeText(formData.get("order")));

    await prisma.project.update({
      where: { id },
      data: {
        title: normalizeText(formData.get("title")),
        description: normalizeText(formData.get("description")),
        techTags: normalizeCsv(normalizeText(formData.get("techTags"))),
        repoUrl: normalizeOptionalUrl(normalizeText(formData.get("repoUrl"))),
        imageUrl,
        videoUrl,
        highlights: normalizeList(normalizeText(formData.get("highlights"))),
        isEnabled: normalizeCheckbox(formData.get("isEnabled")),
        order: Number.isFinite(orderValue) ? orderValue : existing.order,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/projects");

    return {
      ok: true,
      message: "Project updated.",
      media: {
        imageUrl: imageUrl ?? "",
        videoUrl: videoUrl ?? "",
      },
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update project.",
    };
  }
}

export async function deleteProject(id: string) {
  await prisma.project.delete({
    where: { id },
  });
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
}

export async function reorderProjects(ids: string[]) {
  await reorderEntities("project", ids);
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
}

export async function updateSiteSettings(_previousState: AdminActionState, formData: FormData): Promise<AdminActionState> {
  try {
    const settings = await getSiteSettings();

    const profileImageUrl = await resolveMediaField(
      formData,
      "profileImageFile",
      "profileImageUrl",
      "site/profile",
    );

    const paragraphs = normalizeText(formData.get("aboutParagraphs"));

    await prisma.settings.update({
      where: { id: settings.id },
      data: {
        heroTitle: normalizeText(formData.get("heroTitle")),
        heroRole: normalizeText(formData.get("heroRole")),
        heroSpecialties: normalizeText(formData.get("heroSpecialties")),
        aboutTitle: normalizeText(formData.get("aboutTitle")),
        aboutParagraphs: JSON.stringify(
          paragraphs
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean),
        ),
        profileImageUrl,
        contactEmail: normalizeText(formData.get("contactEmail")),
        contactPhone: normalizeText(formData.get("contactPhone")),
        contactLocation: normalizeText(formData.get("contactLocation")),
        linkedinUrl: normalizeText(formData.get("linkedinUrl")),
        githubUrl: normalizeText(formData.get("githubUrl")),
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/settings");

    return {
      ok: true,
      message: "Settings updated.",
      media: {
        profileImageUrl: profileImageUrl ?? "",
      },
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update settings.",
    };
  }
}

export async function addExperience(formData: FormData) {
  const maxOrder = await prisma.experience.aggregate({ _max: { order: true } });
  const orderValue = Number(normalizeText(formData.get("order")));

  await prisma.experience.create({
    data: {
      role: normalizeText(formData.get("role")),
      company: normalizeText(formData.get("company")),
      location: normalizeOptionalUrl(normalizeText(formData.get("location"))),
      startDate: normalizeText(formData.get("startDate")),
      endDate: normalizeOptionalUrl(normalizeText(formData.get("endDate"))),
      description: normalizeList(normalizeText(formData.get("description"))),
      isEnabled: normalizeCheckbox(formData.get("isEnabled")),
      order: Number.isFinite(orderValue) ? orderValue : (maxOrder._max.order ?? -1) + 1,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/experience");
}

export async function updateExperience(id: string, formData: FormData) {
  const existing = await prisma.experience.findUnique({ where: { id } });
  if (!existing) throw new Error("Experience not found.");

  const orderValue = Number(normalizeText(formData.get("order")));

  await prisma.experience.update({
    where: { id },
    data: {
      role: normalizeText(formData.get("role")),
      company: normalizeText(formData.get("company")),
      location: normalizeOptionalUrl(normalizeText(formData.get("location"))),
      startDate: normalizeText(formData.get("startDate")),
      endDate: normalizeOptionalUrl(normalizeText(formData.get("endDate"))),
      description: normalizeList(normalizeText(formData.get("description"))),
      isEnabled: normalizeCheckbox(formData.get("isEnabled")),
      order: Number.isFinite(orderValue) ? orderValue : existing.order,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/experience");
}

export async function deleteExperience(id: string) {
  await prisma.experience.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/experience");
}

export async function reorderExperiences(ids: string[]) {
  await reorderEntities("experience", ids);
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/experience");
}

export async function addEducation(_previousState: AdminActionState, formData: FormData): Promise<AdminActionState> {
  try {
    const maxOrder = await prisma.education.aggregate({ _max: { order: true } });
    const orderValue = Number(normalizeText(formData.get("order")));
    const imageUrl = await resolveMediaField(formData, "imageFile", "imageUrl", "education/certificates");

    await prisma.education.create({
      data: {
        degree: normalizeText(formData.get("degree")),
        university: normalizeText(formData.get("university")),
        dates: normalizeText(formData.get("dates")),
        results: normalizeText(formData.get("results")),
        imageUrl,
        isEnabled: normalizeCheckbox(formData.get("isEnabled")),
        order: Number.isFinite(orderValue) ? orderValue : (maxOrder._max.order ?? -1) + 1,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/education");

    return {
      ok: true,
      message: "Education saved.",
      media: {
        imageUrl: imageUrl ?? "",
      },
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to save education entry.",
    };
  }
}

export async function updateEducation(id: string, _previousState: AdminActionState, formData: FormData): Promise<AdminActionState> {
  try {
    const existing = await prisma.education.findUnique({ where: { id } });
    if (!existing) {
      return { ok: false, message: "Education entry not found." };
    }

    const orderValue = Number(normalizeText(formData.get("order")));
    const imageUrl = await resolveMediaField(
      formData,
      "imageFile",
      "imageUrl",
      "education/certificates",
    );

    await prisma.education.update({
      where: { id },
      data: {
        degree: normalizeText(formData.get("degree")),
        university: normalizeText(formData.get("university")),
        dates: normalizeText(formData.get("dates")),
        results: normalizeText(formData.get("results")),
        imageUrl,
        isEnabled: normalizeCheckbox(formData.get("isEnabled")),
        order: Number.isFinite(orderValue) ? orderValue : existing.order,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/education");

    return {
      ok: true,
      message: "Education updated.",
      media: {
        imageUrl: imageUrl ?? "",
      },
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update education entry.",
    };
  }
}

export async function deleteEducation(id: string) {
  await prisma.education.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/education");
}

export async function reorderEducation(ids: string[]) {
  await reorderEntities("education", ids);
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/education");
}

export async function addAchievement(_previousState: AdminActionState, formData: FormData): Promise<AdminActionState> {
  try {
    const maxOrder = await prisma.achievement.aggregate({ _max: { order: true } });
    const orderValue = Number(normalizeText(formData.get("order")));
    const imageUrl = await resolveMediaField(formData, "imageFile", "imageUrl", "achievements/certificates");

    await prisma.achievement.create({
      data: {
        title: normalizeText(formData.get("title")),
        event: normalizeText(formData.get("event")),
        icon: normalizeAchievementType(normalizeText(formData.get("icon"))),
        imageUrl,
        isEnabled: normalizeCheckbox(formData.get("isEnabled")),
        order: Number.isFinite(orderValue) ? orderValue : (maxOrder._max.order ?? -1) + 1,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/achievements");

    return {
      ok: true,
      message: "Achievement saved.",
      media: {
        imageUrl: imageUrl ?? "",
      },
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to save achievement.",
    };
  }
}

export async function updateAchievement(id: string, _previousState: AdminActionState, formData: FormData): Promise<AdminActionState> {
  try {
    const existing = await prisma.achievement.findUnique({ where: { id } });
    if (!existing) {
      return { ok: false, message: "Achievement not found." };
    }

    const orderValue = Number(normalizeText(formData.get("order")));
    const imageUrl = await resolveMediaField(
      formData,
      "imageFile",
      "imageUrl",
      "achievements/certificates",
    );

    await prisma.achievement.update({
      where: { id },
      data: {
        title: normalizeText(formData.get("title")),
        event: normalizeText(formData.get("event")),
        icon: normalizeAchievementType(normalizeText(formData.get("icon")) || existing.icon),
        imageUrl,
        isEnabled: normalizeCheckbox(formData.get("isEnabled")),
        order: Number.isFinite(orderValue) ? orderValue : existing.order,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/achievements");

    return {
      ok: true,
      message: "Achievement updated.",
      media: {
        imageUrl: imageUrl ?? "",
      },
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update achievement.",
    };
  }
}

export async function deleteAchievement(id: string) {
  await prisma.achievement.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/achievements");
}

export async function reorderAchievements(ids: string[]) {
  await reorderEntities("achievement", ids);
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/achievements");
}

export async function addReference(_previousState: AdminActionState, formData: FormData): Promise<AdminActionState> {
  try {
    const maxOrder = await prisma.reference.aggregate({ _max: { order: true } });
    const orderValue = Number(normalizeText(formData.get("order")));
    const photoUrl = await resolveMediaField(formData, "photoFile", "photoUrl", "references/photos");

    await prisma.reference.create({
      data: {
        quote: normalizeText(formData.get("quote")),
        name: normalizeText(formData.get("name")),
        role: normalizeText(formData.get("role")),
        company: normalizeOptionalUrl(normalizeText(formData.get("company"))),
        dateLabel: normalizeOptionalUrl(normalizeText(formData.get("dateLabel"))),
        photoUrl,
        source: normalizeReferenceSource(normalizeText(formData.get("source"))),
        sourceUrl: normalizeOptionalUrl(normalizeText(formData.get("sourceUrl"))),
        isFeatured: normalizeText(formData.get("isFeatured")) === "on",
        isEnabled: normalizeCheckbox(formData.get("isEnabled")),
        order: Number.isFinite(orderValue) ? orderValue : (maxOrder._max.order ?? -1) + 1,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/references");

    return {
      ok: true,
      message: "Reference saved.",
      media: {
        photoUrl: photoUrl ?? "",
      },
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to save reference.",
    };
  }
}

export async function updateReference(id: string, _previousState: AdminActionState, formData: FormData): Promise<AdminActionState> {
  try {
    const existing = await prisma.reference.findUnique({ where: { id } });
    if (!existing) {
      return { ok: false, message: "Reference not found." };
    }

    const orderValue = Number(normalizeText(formData.get("order")));
    const photoUrl = await resolveMediaField(
      formData,
      "photoFile",
      "photoUrl",
      "references/photos",
    );
    const source = normalizeReferenceSource(normalizeText(formData.get("source"))) ?? existing.source ?? null;

    await prisma.reference.update({
      where: { id },
      data: {
        quote: normalizeText(formData.get("quote")),
        name: normalizeText(formData.get("name")),
        role: normalizeText(formData.get("role")),
        company: normalizeOptionalUrl(normalizeText(formData.get("company"))),
        dateLabel: normalizeOptionalUrl(normalizeText(formData.get("dateLabel"))),
        photoUrl,
        source,
        sourceUrl: normalizeOptionalUrl(normalizeText(formData.get("sourceUrl"))),
        isFeatured: normalizeText(formData.get("isFeatured")) === "on",
        isEnabled: normalizeCheckbox(formData.get("isEnabled")),
        order: Number.isFinite(orderValue) ? orderValue : existing.order,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/references");

    return {
      ok: true,
      message: "Reference updated.",
      media: {
        photoUrl: photoUrl ?? "",
      },
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update reference.",
    };
  }
}

export async function deleteReference(id: string) {
  await prisma.reference.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/references");
}

export async function reorderReferences(ids: string[]) {
  await reorderEntities("reference", ids);
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/references");
}

export async function addSkill(formData: FormData) {
  const maxOrder = await prisma.skill.aggregate({ _max: { order: true } });
  const orderValue = Number(normalizeText(formData.get("order")));

  await prisma.skill.create({
    data: {
      category: normalizeText(formData.get("category")),
      icon: normalizeText(formData.get("icon")) || "sparkles",
      tags: normalizeCsv(normalizeText(formData.get("tags"))),
      isEnabled: normalizeCheckbox(formData.get("isEnabled")),
      order: Number.isFinite(orderValue) ? orderValue : (maxOrder._max.order ?? -1) + 1,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/skills");
}

export async function updateSkill(id: string, formData: FormData) {
  const existing = await prisma.skill.findUnique({ where: { id } });
  if (!existing) throw new Error("Skill group not found.");

  const orderValue = Number(normalizeText(formData.get("order")));

  await prisma.skill.update({
    where: { id },
    data: {
      category: normalizeText(formData.get("category")),
      icon: normalizeText(formData.get("icon")) || existing.icon,
      tags: normalizeCsv(normalizeText(formData.get("tags"))),
      isEnabled: normalizeCheckbox(formData.get("isEnabled")),
      order: Number.isFinite(orderValue) ? orderValue : existing.order,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/skills");
}

export async function deleteSkill(id: string) {
  await prisma.skill.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/skills");
}

export async function reorderSkills(ids: string[]) {
  await reorderEntities("skill", ids);
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/skills");
}

export async function importDefaultSkills() {
  const count = await prisma.skill.count();
  if (count > 0) {
    return;
  }

  await prisma.skill.createMany({
    data: defaultSkillGroups.map((skill, index) => ({
      category: skill.category,
      icon: skill.icon,
      tags: skill.tags.join(", "),
      isEnabled: true,
      order: index,
    })),
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/skills");
}

export async function createDatabaseBackup(_previousState: AdminActionState, _formData: FormData): Promise<AdminActionState> {
  try {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      return { ok: false, message: "DATABASE_URL is not configured, so the backup could not start." };
    }

    const parsedUrl = new URL(databaseUrl);
    const outputDir = getDatabaseBackupDir();
    const outputFile = path.join(outputDir, createBackupFileName());

    await mkdir(outputDir, { recursive: true });

    const args = [
      "--clean",
      "--if-exists",
      "--no-owner",
      "--no-privileges",
      "-h",
      parsedUrl.hostname,
      "-p",
      parsedUrl.port || "5432",
      "-U",
      decodeURIComponent(parsedUrl.username),
      "-d",
      parsedUrl.pathname.replace(/^\//, ""),
      "-f",
      outputFile,
    ];

    await execFileAsync("pg_dump", args, {
      env: {
        ...process.env,
        PGPASSWORD: decodeURIComponent(parsedUrl.password),
      },
    });

    revalidatePath("/admin");

    return {
      ok: true,
      message: `Database backup created: ${path.basename(outputFile)}`,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to create database backup.",
    };
  }
}

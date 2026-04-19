"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addProject(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const techTags = formData.get("techTags") as string;
  const repoUrl = formData.get("repoUrl") as string;
  const videoUrl = formData.get("videoUrl") as string;
  const highlights = formData.get("highlights") as string; // comma separated or simple JSON string

  // Simple string to JSON array converter for highlights
  let parsedHighlights = "[]";
  try {
    const list = highlights.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    parsedHighlights = JSON.stringify(list);
  } catch (e) {
    parsedHighlights = "[]";
  }

  await prisma.project.create({
    data: {
      title,
      description,
      techTags,
      repoUrl: repoUrl || null,
      videoUrl: videoUrl || null,
      highlights: parsedHighlights,
    }
  });

  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function deleteProject(id: string) {
  await prisma.project.delete({
    where: { id }
  });
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getDefaultSiteSettings } from "@/lib/site-settings";

export async function setupAdmin(formData: FormData) {
  // Prevent any creation if a user already exists (Security)
  const count = await prisma.user.count();
  if (count > 0) {
    throw new Error("Admin user already exists.");
  }

  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!username || !email || !password) {
    throw new Error("Missing required fields");
  }

  await prisma.user.create({
    data: {
      username,
      email,
      password, // In a robust prod environment, hash this using bcrypt
      name: name || "Admin",
    }
  });

  const settings = await prisma.settings.findFirst();
  const defaults = getDefaultSiteSettings();
  const displayName = name?.trim() || username.trim();

  if (settings) {
    await prisma.settings.update({
      where: { id: settings.id },
      data: {
        heroTitle: settings.heroTitle || displayName,
        heroRole: settings.heroRole || defaults.heroRole,
        heroSpecialties: settings.heroSpecialties || defaults.heroSpecialties,
      },
    });
  } else {
    await prisma.settings.create({
      data: {
        isSeeded: true,
        heroTitle: displayName,
        heroRole: defaults.heroRole,
        heroSpecialties: defaults.heroSpecialties,
      },
    });
  }

  // Redirect to the sign-in page and return to admin after login.
  redirect("/api/auth/signin?callbackUrl=/admin");
}

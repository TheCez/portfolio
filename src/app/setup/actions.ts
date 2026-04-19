"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

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

  // Redirect to the sign in page so they can log in
  redirect("/api/auth/signin");
}

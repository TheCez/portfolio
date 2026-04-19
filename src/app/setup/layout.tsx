import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

// Server component layout guards the page — redirects if admin already exists
export default async function SetupLayout({ children }: { children: React.ReactNode }) {
  const count = await prisma.user.count();
  if (count > 0) {
    redirect("/admin");
  }
  return <>{children}</>;
}

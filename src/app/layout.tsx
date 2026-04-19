import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import AppShellFrame from "@/components/AppShellFrame";
import { prisma } from "@/lib/prisma";
import { getDefaultSiteSettings, getSiteSettings } from "@/lib/site-settings";
import { getInitials } from "@/lib/branding";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Ajay Chodankar | AI Researcher & Software Engineer",
  description:
    "AI Researcher and software engineer building agentic AI systems, computer vision products, and cloud-native platforms.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const defaultSettings = getDefaultSiteSettings();
  let adminCount = 0;
  let heroTitle = defaultSettings.heroTitle;

  try {
    const [resolvedAdminCount, settings] = await Promise.all([prisma.user.count(), getSiteSettings()]);
    adminCount = resolvedAdminCount;
    heroTitle = settings.heroTitle || defaultSettings.heroTitle;
  } catch {
    // During image builds the database may not be reachable yet.
  }

  const badge = adminCount > 0 ? getInitials(heroTitle) : "PP";

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <AppShellFrame badge={badge} siteEnabled={adminCount > 0}>
          {children}
        </AppShellFrame>
      </body>
    </html>
  );
}

"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ParticleBackground from "@/components/ParticleBackground";

type AppShellFrameProps = {
  badge: string;
  siteEnabled: boolean;
  children: React.ReactNode;
};

export default function AppShellFrame({ badge, siteEnabled, children }: AppShellFrameProps) {
  const pathname = usePathname();
  const hideSiteChrome = !siteEnabled || pathname.startsWith("/admin") || pathname.startsWith("/setup");

  return (
    <div className="app-shell min-h-screen">
      {!hideSiteChrome ? <ParticleBackground /> : null}
      {!hideSiteChrome ? <Navbar badge={badge} /> : null}
      <main className={`min-h-screen ${hideSiteChrome ? "" : "relative z-10"}`}>{children}</main>
      {!hideSiteChrome ? <Footer /> : null}
    </div>
  );
}

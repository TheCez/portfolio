import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";
import { getDefaultSiteSettings, getSiteSettings } from "@/lib/site-settings";
import { getInitials } from "@/lib/branding";

export const dynamic = "force-dynamic";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default async function Icon() {
  const adminCount = await prisma.user.count();
  const defaultSettings = getDefaultSiteSettings();
  const settings = adminCount > 0 ? await getSiteSettings() : null;
  const initials = adminCount > 0 ? getInitials(settings?.heroTitle || defaultSettings.heroTitle) : "PP";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #101b30 0%, #172743 100%)",
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.2)",
          color: "#e8eeff",
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: "0.2em",
        }}
      >
        {initials}
      </div>
    ),
    size,
  );
}

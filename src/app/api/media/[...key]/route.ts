import { getMediaObject, isStorageConfigured } from "@/lib/storage";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = {
  params: Promise<{ key: string[] }>;
};

export async function GET(_: Request, { params }: Params) {
  if (!isStorageConfigured()) {
    return NextResponse.json({ error: "Storage is not configured." }, { status: 500 });
  }

  const { key } = await params;
  const joinedKey = key.join("/");

  try {
    const object = await getMediaObject(joinedKey);
    const stream = object.Body?.transformToWebStream();

    if (!stream) {
      return NextResponse.json({ error: "Media not found." }, { status: 404 });
    }

    return new NextResponse(stream as ReadableStream, {
      headers: {
        "Content-Type": object.ContentType || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Media not found." }, { status: 404 });
  }
}

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref");
  const maxwidth = req.nextUrl.searchParams.get("maxwidth") ?? "400";
  if (!ref) return new NextResponse("Missing ref", { status: 400 });

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const url = `https://places.googleapis.com/v1/${ref}/media?maxWidthPx=${maxwidth}&key=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) return new NextResponse("Photo fetch failed", { status: 502 });

  const blob = await res.blob();
  return new NextResponse(blob, {
    headers: {
      "Content-Type": res.headers.get("Content-Type") ?? "image/jpeg",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
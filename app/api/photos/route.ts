import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("placeId");
  if (!raw) {
    return NextResponse.json({ error: "placeId required" }, { status: 400 });
  }

  // Jaga-jaga kalau placeId sudah berformat "places/xxx"
  const placeId = raw.replace(/^places\//, "");
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  const res = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
    {
      headers: {
        "X-Goog-Api-Key": apiKey!,
        "X-Goog-FieldMask": "photos.name",
      },
      next: { revalidate: 86400 }, // cache 24 jam
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 502 });
  }

  const data = await res.json();
  const photos: string[] = (data.photos ?? []).map((p: { name: string }) => p.name);

  return NextResponse.json({ photos });
}
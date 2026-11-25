import { NextRequest, NextResponse } from "next/server";
import { parseTagsFromReviews } from "@/lib/tagParser";
import { haversineDistance } from "@/lib/utils";
import { Cafe } from "@/lib/types";

interface GoogleMoney {
  currencyCode?: string;
  units?: string; // int64 dikirim Google sebagai string
  nanos?: number;
}

interface GooglePriceRange {
  startPrice?: GoogleMoney;
  endPrice?: GoogleMoney;
}

const toNum = (m?: GoogleMoney): number | null =>
  m?.units ? Number(m.units) : null;

const PLACES_NEW_BASE = "https://places.googleapis.com/v1";

async function getReviews(placeId: string, apiKey: string): Promise<string[]> {
  try {
    const url = `${PLACES_NEW_BASE}/${placeId}?languageCode=id`;
    const res = await fetch(url, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "reviews.text.text",
      },
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    const reviews: { text?: { text: string } }[] = data.reviews ?? [];
    return reviews
      .map((r) => r.text?.text)
      .filter((t): t is string => Boolean(t));
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const radius = searchParams.get("radius") ?? "2000";

  if (!lat || !lng) {
    return NextResponse.json({ error: "lat and lng required" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const nearbyRes = await fetch(`${PLACES_NEW_BASE}/places:searchNearby`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": [
        "places.id",
        "places.displayName",
        "places.formattedAddress",
        "places.location",
        "places.rating",
        "places.userRatingCount",
        "places.priceLevel",
        "places.priceRange",
        "places.photos",
        "places.currentOpeningHours.openNow",
      ].join(","),
    },
    body: JSON.stringify({
      includedTypes: ["cafe"],
      maxResultCount: 20,
      languageCode: "id",
      locationRestriction: {
        circle: {
          center: {
            latitude: parseFloat(lat),
            longitude: parseFloat(lng),
          },
          radius: parseFloat(radius),
        },
      },
    }),
    next: { revalidate: 300 },
  });

  const nearbyData = await nearbyRes.json();

  if (!nearbyRes.ok) {
    return NextResponse.json(
      { error: nearbyData.error?.message ?? "Places API error" },
      { status: 502 }
    );
  }

  const places = (nearbyData.places ?? []) as Record<string, unknown>[];

  const cafes: Cafe[] = await Promise.all(
    places.map(async (p) => {
      const placeId = p.id as string;
      const location = p.location as { latitude: number; longitude: number };
      const placeLat = location.latitude;
      const placeLng = location.longitude;
      const displayName = p.displayName as { text: string };
      const photos = p.photos as { name: string }[] | undefined;
      const photoRef = photos?.[0]?.name;
      const hours = p.currentOpeningHours as { openNow?: boolean } | undefined;

      const priceLevelMap: Record<string, 0 | 1 | 2 | 3 | 4> = {
        PRICE_LEVEL_FREE: 0,
        PRICE_LEVEL_INEXPENSIVE: 1,
        PRICE_LEVEL_MODERATE: 2,
        PRICE_LEVEL_EXPENSIVE: 3,
        PRICE_LEVEL_VERY_EXPENSIVE: 4,
      };
      const priceLevel = priceLevelMap[p.priceLevel as string] ?? null;

      const priceRange = p.priceRange as GooglePriceRange | undefined;

      const reviews = await getReviews(`places/${placeId}`, apiKey);
      const tags = parseTagsFromReviews(reviews);
      
      return {
        placeId,
        name: displayName?.text ?? "Tanpa nama",
        vicinity: (p.formattedAddress as string) ?? "",
        lat: placeLat,
        lng: placeLng,
        rating: (p.rating as number) ?? 0,
        userRatingsTotal: (p.userRatingCount as number) ?? 0,
        priceLevel,
        priceMin: toNum(priceRange?.startPrice),
        priceMax: toNum(priceRange?.endPrice),
        distance: haversineDistance(parseFloat(lat), parseFloat(lng), placeLat, placeLng),
        photoReference: photoRef,
        openNow: hours?.openNow,
        tags,
      };
    })
  );

  cafes.sort((a, b) => a.distance - b.distance);

  return NextResponse.json({ cafes });
}
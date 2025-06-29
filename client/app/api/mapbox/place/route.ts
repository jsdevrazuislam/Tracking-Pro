import { NextRequest, NextResponse } from "next/server";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

if (!MAPBOX_ACCESS_TOKEN) {
  throw new Error("MAPBOX_ACCESS_TOKEN is not set in .env");
}

export async function POST(req: NextRequest, res: NextResponse) {
  const { latitude, longitude } = await req.json();

  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return Response.json({ message: "Invalid coordinates" });
  }

  const apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_ACCESS_TOKEN}&country=bd&limit=1`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data?.features?.length > 0) {
      return Response.json({ place_name: data.features[0].place_name });
    } else {
      return Response.json({ message: "No place name found" });
    }
  } catch (error: any) {
    console.error("Mapbox Geocoding Error:", error);
    return Response.json({ message: "Internal Server Error" });
  }
}

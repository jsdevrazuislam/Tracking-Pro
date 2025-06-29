import { NextRequest, NextResponse } from "next/server";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

if (!MAPBOX_ACCESS_TOKEN) {
  throw new Error("MAPBOX_ACCESS_TOKEN is not set");
}

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("q");

  if (!search || search.trim().length === 0) {
    return Response.json({ message: "Missing or invalid query" });
  }

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    search
  )}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=5&country=bd`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data?.features) {
      return Response.json({ message: "No results found" });
    }

    return Response.json(data.features);
  } catch (err) {
    console.error("Autocomplete Error:", err);
    return Response.json({ message: "Internal Server Error" });
  }
}

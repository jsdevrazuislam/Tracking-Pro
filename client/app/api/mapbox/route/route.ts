import { NextRequest, NextResponse } from "next/server";


const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

if (!accessToken) {
  throw new Error('MAPBOX_ACCESS_TOKEN not set in environment');
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { coordinates } = await req.json();

    if (!Array.isArray(coordinates) || coordinates.length < 2) {
      return Response.json({ message: 'Invalid coordinates array' });
    }

    const coordsString = coordinates.map((c: [number, number]) => c.join(',')).join(';');

    const url = `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordsString}?geometries=geojson&overview=full&access_token=${accessToken}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.trips || data.trips.length === 0) {
      return Response.json({ message: 'No route found' });
    }

    return Response.json({
      route: data.trips[0].geometry.coordinates,
      waypoints: data.waypoints,
    });

  } catch (error) {
    console.error("Mapbox route error:", error);
    return Response.json({ message: 'Internal Server Error' });
  }
}

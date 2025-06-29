const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;


export const getOptimizedRoute = async (coordinates: [number, number][]) => {

  const coordsString = coordinates.map((c) => c.join(",")).join(";");

  const url = `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordsString}?geometries=geojson&overview=full&access_token=${accessToken}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.trips || data.trips.length === 0) {
    throw new Error("No route found");
  }

  return {
    route: data.trips[0].geometry.coordinates,
    waypoints: data.waypoints,
  };
};
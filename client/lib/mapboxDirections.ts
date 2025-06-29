import axios from "axios";

export const getOptimizedRoute = async (coordinates: [number, number][]) => {
  try {
    const { data } = await axios.post("/api/mapbox/route", { coordinates });
    return data;
  } catch (err) {
    throw new Error("Failed to fetch optimized route");
  }
};

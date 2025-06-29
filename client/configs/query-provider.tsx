"use client";

import { useAuthStore } from "@/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getPlaceNameFromCoordinates } from "@/components/pages/signup-form"


export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const { initialLoading, user, setCurrentLocation } = useAuthStore()

  useEffect(() => {
    initialLoading()
  }, [])

  useEffect(() => {
    (async () => {
      if (user?.role === 'agent') {
        if (!navigator.geolocation) {
          return;
        }
        try {
          const position: GeolocationPosition = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0
            });
          });

          const { latitude, longitude } = position.coords;
          setCurrentLocation({
            latitude,
            longitude,
            place_name: await getPlaceNameFromCoordinates(latitude, longitude)
          })
        } catch (error) {
          console.log("Geolocation error:", error);
        }
      }
    })()
  }, [user])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
'use client'

import Map, { Marker, Source, Layer } from 'react-map-gl/mapbox'
import { useEffect, useState, useMemo } from 'react'
import { getOptimizedRoute } from '@/lib/mapboxDirections'
import { AlertTriangle } from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'

export default function RouteOptimizerMap({ parcels }: { parcels: ParcelsEntity[] }) {
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([])
  const { t } = useTranslation()

  const stops = useMemo(() => {
    return parcels
      .filter(p => ['assigned', 'picked', 'in_transit'].includes(p.status?.toLowerCase()))
      .map(p => {
        const lat = p?.receiver_address?.lat
        const lng = p?.receiver_address?.long
        if (lat && lng) return [lng, lat] as [number, number]
        return null
      })
      .filter(Boolean) as [number, number][]
  }, [parcels])

  useEffect(() => {
    const loadRoute = async () => {
      if (!stops.length) return
      try {
        const { route } = await getOptimizedRoute(stops)
        setRouteCoords(route)
      } catch (err) {
        console.error('Error loading optimized route:', err)
      }
    }

    loadRoute()
  }, [stops])

  const routeGeoJson: GeoJSON.Feature<GeoJSON.LineString> = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: routeCoords,
    },
  }

  if (!stops.length) {
    return (
      <div className="w-full h-[300px] rounded-xl border border-gray-200 flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-2">
          <AlertTriangle className="h-6 w-6 mx-auto text-yellow-500" />
          <p className="text-gray-700 font-medium">{t('noParcelsForOptimization')}</p>
          <p className="text-sm text-gray-500">{t('routingStatusInfo')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-[300px] rounded-xl shadow-md overflow-hidden">
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        initialViewState={{
          latitude: stops[0]?.[1] ?? 23.8103,
          longitude: stops[0]?.[0] ?? 90.4125,
          zoom: 11,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        {stops.map(([lng, lat], idx) => (
          <Marker key={idx} longitude={lng} latitude={lat} anchor="bottom">
            <div className="w-6 h-6 bg-blue-600 rounded-full text-white flex items-center justify-center text-xs shadow">
              {idx + 1}
            </div>
          </Marker>
        ))}

        {routeCoords?.length > 0 && (
          <Source id="route" type="geojson" data={routeGeoJson}>
            <Layer
              id="route-line"
              type="line"
              paint={{
                'line-color': '#1d4ed8',
                'line-width': 4,
              }}
            />
          </Source>
        )}
      </Map>
    </div>
  )
}

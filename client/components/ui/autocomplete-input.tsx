'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useRef, useState } from "react"
import { debounce } from "lodash"
import { ControllerRenderProps } from "react-hook-form"
import { cn } from "@/lib/utils"

interface MapboxFeature {
  place_name: string
  center: [number, number]
  geometry: {
    coordinates: number[]
  }
}

interface Props {
  field: ControllerRenderProps<any, any>
  label: string
  error?: string
  query:string
  setQuery: React.Dispatch<string>

}

export default function MapboxAddressInput({ field, label, error, setQuery, query }: Props) {
  const [results, setResults] = useState<MapboxFeature[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(false)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchLocations = debounce(async (search: string) => {
    if (!search) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(search)}.json?access_token=${token}&limit=5`
      )
      const data = await res.json()
      setResults(data.features || [])
    } catch (err) {
      console.error("Mapbox API error", err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, 300)

  useEffect(() => {
    fetchLocations(query)
  }, [query])

  return (
    <div className="space-y-2" ref={wrapperRef}>
      <Label>{label}</Label>
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => {
            const value = e.target.value
            setQuery(value)
            field.onChange(value)
            setShowDropdown(true)
          }}
          placeholder="Search for a location"
          onFocus={() => {
            if (results.length > 0) setShowDropdown(true)
          }}
        />

        {showDropdown && (
          <div className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow-sm max-h-60 overflow-auto">
            {loading ? (
              <div className="p-3 text-sm text-muted-foreground">Searching...</div>
            ) : results.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground">No results found</div>
            ) : (
              results.map((place, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setQuery(place.place_name)
                    field.onChange({
                        place_name: place.place_name,
                        lat: place?.geometry.coordinates[1],
                        long: place?.geometry.coordinates[0],
                    })
                    setShowDropdown(false)
                  }}
                  className={cn(
                    "px-4 py-2 cursor-pointer hover:bg-muted text-sm",
                    query === place.place_name && "bg-muted"
                  )}
                >
                  {place.place_name}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

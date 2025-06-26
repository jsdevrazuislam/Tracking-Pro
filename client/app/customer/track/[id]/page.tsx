"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Package, Truck, CheckCircle, Clock, Phone, User } from "lucide-react"
import { CustomerLayout } from "@/components/customer-layout"
import { useParams } from "next/navigation"
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useQuery } from "@tanstack/react-query"
import { trackParcel } from "@/lib/apis/parcel"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN


// Mock tracking data
const mockTrackingData = {
  PKG001: {
    id: "PKG001",
    status: "delivered",
    currentLocation: "Brooklyn, NY",
    estimatedDelivery: "2024-01-16",
    agent: {
      name: "John Smith",
      phone: "+1 (555) 123-4567",
      vehicle: "VAN-001",
    },
    timeline: [
      {
        status: "Parcel Booked",
        location: "New York, NY",
        timestamp: "2024-01-15 09:00 AM",
        description: "Your parcel has been booked and is ready for pickup",
      },
      {
        status: "Picked Up",
        location: "123 Main St, New York, NY",
        timestamp: "2024-01-15 02:30 PM",
        description: "Parcel picked up from sender",
      },
      {
        status: "In Transit",
        location: "Distribution Center, NY",
        timestamp: "2024-01-15 06:45 PM",
        description: "Parcel is being processed at distribution center",
      },
      {
        status: "Out for Delivery",
        location: "Brooklyn, NY",
        timestamp: "2024-01-16 08:00 AM",
        description: "Parcel is out for delivery",
      },
      {
        status: "Delivered",
        location: "456 Oak Ave, Brooklyn, NY",
        timestamp: "2024-01-16 11:30 AM",
        description: "Parcel delivered successfully to recipient",
      },
    ],
  },
  PKG002: {
    id: "PKG002",
    status: "in-transit",
    currentLocation: "Distribution Center, NY",
    estimatedDelivery: "2024-01-17",
    agent: {
      name: "Mike Johnson",
      phone: "+1 (555) 987-6543",
      vehicle: "TRUCK-002",
    },
    timeline: [
      {
        status: "Parcel Booked",
        location: "New York, NY",
        timestamp: "2024-01-16 10:15 AM",
        description: "Your parcel has been booked and is ready for pickup",
      },
      {
        status: "Picked Up",
        location: "789 Pine St, Manhattan, NY",
        timestamp: "2024-01-16 03:20 PM",
        description: "Parcel picked up from sender",
      },
      {
        status: "In Transit",
        location: "Distribution Center, NY",
        timestamp: "2024-01-16 07:15 PM",
        description: "Parcel is being processed at distribution center",
      },
    ],
  },
}


export default function TrackParcel() {
  const params = useParams()
  const trackingId = params.id as string
  const [trackingData, setTrackingData] = useState<any>(null)
  // const { data, isLoading } = useQuery({
  //   queryKey: ['track_parcel', trackingId],
  //   queryFn: () => trackParcel(trackingId),
  //   enabled: !!trackingId
  // })

  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const [agentMarker, setAgentMarker] = useState<mapboxgl.Marker | null>(null)

  useEffect(() => {
    if (mapRef.current) return

    const initMap = () => {
      if (!mapContainerRef.current) return

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [90.4125, 23.8103],
        zoom: 12
      })

      // Add pickup and destination markers
      new mapboxgl.Marker({ color: 'green' }).setLngLat([90.4125, 23.8103]).addTo(map)
      new mapboxgl.Marker({ color: 'red' }).setLngLat([91.7832, 22.3569]).addTo(map)

      const marker = new mapboxgl.Marker({ color: 'blue' })
        .setLngLat([90.4125, 23.8103])
        .addTo(map)

      setAgentMarker(marker)
      mapRef.current = map
    }

    // Ensure map container DOM is available
    requestAnimationFrame(initMap)

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])


  // Update agent marker in real-time
  useEffect(() => {
    if (agentMarker) {
      agentMarker.setLngLat([90.4125, 23.8103])
    }
  }, [agentMarker])

  useEffect(() => {
    // In a real app, this would be an API call
    const data = mockTrackingData[trackingId as keyof typeof mockTrackingData]
    setTrackingData(data)
  }, [trackingId])

  if (!trackingData) {
    return (
      <CustomerLayout>
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Tracking ID not found</h2>
          <p className="text-gray-600">Please check your tracking ID and try again.</p>
        </div>
      </CustomerLayout>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "in-transit":
      case "out for delivery":
        return "bg-blue-100 text-blue-800"
      case "picked up":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <CustomerLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Track Parcel</h1>
          <p className="text-gray-600">Real-time tracking for {trackingId}</p>
        </div>


        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Current Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Current Status</span>
                  <Badge className={getStatusColor(trackingData.status)}>
                    {trackingData.status.replace("-", " ").toUpperCase()}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Last updated: {trackingData.timeline[trackingData.timeline.length - 1]?.timestamp}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <MapPin className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="font-medium">Current Location</div>
                    <div className="text-gray-600">{trackingData.currentLocation}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      Estimated delivery: {trackingData.estimatedDelivery}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Map Simulation */}
            <Card>
              <CardHeader>
                <CardTitle>Live Tracking Map</CardTitle>
                <CardDescription>Real-time location of your parcel</CardDescription>
              </CardHeader>
              <CardContent>
                <div ref={mapContainerRef} className="w-full h-64 rounded-xl shadow-md" />
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Tracking Timeline</CardTitle>
                <CardDescription>Complete journey of your parcel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackingData.timeline.map((event: any, index: number) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        {event.status === "Delivered" ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : event.status === "In Transit" || event.status === "Out for Delivery" ? (
                          <Clock className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Package className="h-5 w-5 text-orange-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{event.status}</div>
                          <div className="text-sm text-gray-500">{event.timestamp}</div>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{event.location}</div>
                        <div className="text-sm text-gray-500 mt-1">{event.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Delivery Agent Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Delivery Agent
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-medium">{trackingData.agent.name}</div>
                  <div className="text-sm text-gray-600">Assigned Agent</div>
                </div>
                <div>
                  <div className="font-medium">{trackingData.agent.vehicle}</div>
                  <div className="text-sm text-gray-600">Vehicle ID</div>
                </div>
                <Button variant="outline" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Agent
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">Tracking ID</div>
                  <div className="font-medium">{trackingData.id}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Estimated Delivery</div>
                  <div className="font-medium">{trackingData.estimatedDelivery}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Service Type</div>
                  <div className="font-medium">Standard Delivery</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CustomerLayout>
  )
}

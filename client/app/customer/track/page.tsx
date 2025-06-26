"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, Package, MapPin, Clock, CheckCircle, AlertCircle, Truck, Navigation } from "lucide-react"
import { CustomerLayout } from "@/components/customer-layout"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { trackParcel } from "@/lib/apis/parcel"


export default function TrackParcel() {
  const [trackingId, setTrackingId] = useState("")
  const [trackingData, setTrackingData] = useState<any>(null)
  // const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  const { mutate, isPending} = useMutation({
    mutationFn: trackParcel,
    onSuccess: (data) =>{
      console.log("data", data)
      // router.push(`/customer/track/${trackingId.toUpperCase()}`)
      // setTrackingData(data)
    },
    onError: (error) =>{
      toast.error(error?.message)
    }
  })


  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "in-transit":
      case "out for delivery":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "picked up":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleSearch = () =>{
    mutate(trackingId)
  }

  return (
    <CustomerLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Track Your Parcel 📦
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter your tracking ID to get real-time updates on your parcel's journey
          </p>
        </div>

        {/* Search Section */}
        <Card className="border-0 bg-gradient-to-br from-white to-blue-50/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <Search className="h-6 w-6 text-blue-600" />
              Enter Tracking ID
            </CardTitle>
            <CardDescription className="text-base">
              Track your parcel with the ID provided during booking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="trackingId" className="text-sm font-medium">
                Tracking ID
              </Label>
              <div className="flex gap-3">
                <Input
                  id="trackingId"
                  placeholder="Enter tracking ID (e.g., PKG001)"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="h-12 text-lg font-mono"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button
                  onClick={handleSearch}
                  disabled={!trackingId || isPending}
                  className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Searching...
                    </div>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Track
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* No Results */}
        {trackingData === undefined && trackingId && !isPending && (
          <Card className="border-0 bg-gradient-to-br from-red-50 to-red-100/50">
            <CardContent className="text-center py-12">
              <AlertCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
              <h3 className="text-xl font-semibold text-red-800 mb-2">Tracking ID Not Found</h3>
              <p className="text-red-600 mb-4">
                We couldn't find any parcel with tracking ID "{trackingId}". Please check your ID and try again.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setTrackingId("")
                  setTrackingData(null)
                }}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Tracking Results */}
        {trackingData && (
          <div className="space-y-6 animate-in">
            {/* Status Overview */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl font-bold">{trackingData.id}</CardTitle>
                    <CardDescription className="text-base">
                      Last updated: {trackingData.timeline[trackingData.timeline.length - 1]?.timestamp}
                    </CardDescription>
                  </div>
                  <Badge className={`${getStatusColor(trackingData.status)} text-sm px-4 py-2`}>
                    {trackingData.status.replace("-", " ").toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-6 w-6 text-blue-600" />
                      <div>
                        <div className="font-semibold">Current Location</div>
                        <div className="text-gray-600">{trackingData.currentLocation}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-6 w-6 text-green-600" />
                      <div>
                        <div className="font-semibold">Estimated Delivery</div>
                        <div className="text-gray-600">{trackingData.estimatedDelivery}</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Truck className="h-6 w-6 text-purple-600" />
                      <div>
                        <div className="font-semibold">Delivery Agent</div>
                        <div className="text-gray-600">{trackingData.agent.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Navigation className="h-6 w-6 text-orange-600" />
                      <div>
                        <div className="font-semibold">Vehicle</div>
                        <div className="text-gray-600">{trackingData.agent.vehicle}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Delivery Progress</span>
                    <span>{trackingData.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${trackingData.progress}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interactive Map Simulation */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Live Tracking Map</CardTitle>
                <CardDescription>Real-time location of your parcel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gradient-to-br from-blue-100 via-green-100 to-blue-200 rounded-2xl h-80 overflow-hidden">
                  {/* Map Background */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="grid grid-cols-8 grid-rows-6 h-full">
                      {Array.from({ length: 48 }).map((_, i) => (
                        <div key={i} className="border border-gray-300"></div>
                      ))}
                    </div>
                  </div>

                  {/* Location Labels */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md">
                    <div className="text-sm font-semibold text-gray-800">New York City</div>
                    <div className="text-xs text-gray-600">Live Tracking Active</div>
                  </div>

                  {/* Route Path */}
                  <svg className="absolute inset-0 w-full h-full">
                    <defs>
                      <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="50%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#10B981" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 80 200 Q 200 150 320 180 Q 450 210 580 160"
                      stroke="url(#routeGradient)"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray="8,4"
                      className="animate-pulse-slow"
                    />
                  </svg>

                  {/* Start Point */}
                  <div className="absolute top-48 left-16 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium shadow-md">
                      Pickup
                    </div>
                  </div>

                  {/* Current Position */}
                  <div className="absolute top-44 left-80 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse">
                        <Truck className="h-4 w-4 text-white absolute top-0.5 left-0.5" />
                      </div>
                      <div className="absolute -top-2 -left-2 w-10 h-10 bg-blue-500/20 rounded-full animate-ping"></div>
                    </div>
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-medium shadow-lg">
                      Current Location
                    </div>
                  </div>

                  {/* End Point */}
                  <div className="absolute top-36 right-16 transform translate-x-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium shadow-md">
                      Delivery
                    </div>
                  </div>

                  {/* Distance Info */}
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md">
                    <div className="text-sm font-semibold text-gray-800">Route Info</div>
                    <div className="text-xs text-gray-600">Distance: 15.2 km</div>
                    <div className="text-xs text-gray-600">ETA: 45 minutes</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Tracking Timeline</CardTitle>
                <CardDescription>Complete journey of your parcel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {trackingData.timeline.map((event: any, index: number) => (
                    <div key={index} className="flex items-start space-x-4 relative">
                      {/* Timeline Line */}
                      {index < trackingData.timeline.length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-16 bg-gradient-to-b from-blue-200 to-gray-200"></div>
                      )}

                      {/* Status Icon */}
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                          event.completed
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-gray-100 border-gray-300 text-gray-400"
                        }`}
                      >
                        {event.status === "Delivered" ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : event.status.includes("Transit") || event.status.includes("Delivery") ? (
                          <Truck className="h-6 w-6" />
                        ) : (
                          <Package className="h-6 w-6" />
                        )}
                      </div>

                      {/* Event Details */}
                      <div className="flex-1 min-w-0">
                        <div
                          className={`p-4 rounded-xl border ${
                            event.completed ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                            <div className={`font-bold text-lg ${event.completed ? "text-blue-900" : "text-gray-600"}`}>
                              {event.status}
                            </div>
                            <div className={`text-sm ${event.completed ? "text-blue-600" : "text-gray-500"}`}>
                              {event.timestamp}
                            </div>
                          </div>
                          <div className={`text-sm mb-2 ${event.completed ? "text-blue-700" : "text-gray-600"}`}>
                            <MapPin className="h-4 w-4 inline mr-1" />
                            {event.location}
                          </div>
                          <div className={`text-sm ${event.completed ? "text-blue-600" : "text-gray-500"}`}>
                            {event.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Agent Contact */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Contact Delivery Agent</CardTitle>
                <CardDescription>Get in touch with your assigned delivery agent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <Truck className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-lg text-gray-900">{trackingData.agent.name}</div>
                      <div className="text-sm text-gray-600">Vehicle: {trackingData.agent.vehicle}</div>
                    </div>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <span className="mr-2">📞</span>
                    Call Agent
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Help Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100">
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-600 mb-4">
              Can't find your tracking ID or having issues? Our support team is here to help.
            </p>
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  )
}

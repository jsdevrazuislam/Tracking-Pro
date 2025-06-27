"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Package, CheckCircle, Clock, Phone, User } from "lucide-react"
import { CustomerLayout } from "@/components/customer-layout"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { trackParcel } from "@/lib/apis/parcel"
import { TrackingSkeleton } from "@/components/loading-skeleton"
import { addDays, format } from "date-fns"
import Link from "next/link"
import LiveTrackingMap from "@/components/live-tracking-map"

function getDisplayStatus(systemStatus: string): string {
  switch (systemStatus) {
    case 'pending':
      return 'Parcel Booked';
    case 'assigned':
      return 'Assigned to Rider';
    case 'picked':
      return 'Picked Up';
    case 'in_transit':
      return 'In Transit';
    case 'out_for_delivery':
      return 'Out for Delivery';
    case 'delivered':
      return 'Delivered';
    case 'cancelled':
      return 'Cancelled';
    default:
      return systemStatus.replace(/_/g, ' ').replace(/\b\w/g, s => s.toUpperCase());
  }
}

export default function TrackParcel() {
  const params = useParams()
  const trackingId = params.id as string
  const { data, isLoading } = useQuery({
    queryKey: ['track_parcel', trackingId],
    queryFn: () => trackParcel(trackingId),
    enabled: !!trackingId
  })

  const trackingData = data?.data

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

  if (isLoading) return <TrackingSkeleton />

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
                  Last updated: {
                    trackingData?.timeline &&
                    trackingData.timeline.length > 0 &&
                    format(trackingData.timeline[trackingData.timeline.length - 1]?.timestamp, 'yyyy-MM-dd')
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <MapPin className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="font-medium">Current Location</div>
                    <div className="text-gray-600">{trackingData?.current_location}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      Estimated delivery: {format(addDays(new Date(trackingData?.createdAt), 2), 'yyyy-MM-dd')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Map Simulation */}
            <LiveTrackingMap trackingData={trackingData} />

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Tracking Timeline</CardTitle>
                <CardDescription>Complete journey of your parcel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackingData?.timeline?.map((event) => (
                    <div key={event.id} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        {event.status === "delivered" ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : event.status === "in_transit" || event.status === "cancelled" ? (
                          <Clock className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Package className="h-5 w-5 text-orange-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{getDisplayStatus(event?.status)}</div>
                          <div className="text-sm text-gray-500">{format(new Date(event?.timestamp), 'yyyy-MM-dd hh:mm a')}</div>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{event?.location?.place_name}</div>
                        <div className="text-sm text-gray-500 mt-1">{event.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

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
                  <div className="font-medium">{trackingData?.agent?.full_name}</div>
                  <div className="text-sm text-gray-600">Assigned Agent</div>
                </div>
                <Link href={`tel:${trackingData?.agent?.phone}`}>
                  <Button variant="outline" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Agent
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">Tracking ID</div>
                  <div className="font-medium">{trackingData?.tracking_code}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Estimated Delivery</div>
                  <div className="font-medium">{format(addDays(new Date(trackingData?.createdAt), 2), 'yyyy-MM-dd')}</div>
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

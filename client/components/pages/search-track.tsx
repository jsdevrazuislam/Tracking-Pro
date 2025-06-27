"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, AlertCircle, Phone, User, CheckCircle, Clock, Package, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { trackParcel } from "@/lib/apis/parcel"
import { addDays, format } from "date-fns"
import Link from "next/link"
import LiveTrackingMap from "@/components/live-tracking-map"
import { Badge } from "@/components/ui/badge"

const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
        case "delivered":
            return "bg-green-100 text-green-800"
        case "in_transit":
        case "out for delivery":
            return "bg-blue-100 text-blue-800"
        case "picked":
            return "bg-orange-100 text-orange-800"
        default:
            return "bg-gray-100 text-gray-800"
    }
}

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
    const [trackingId, setTrackingId] = useState("")
    const [trackingData, setTrackingData] = useState<TrackParcelData | null>(null)
    const router = useRouter()

    const { mutate, isPending } = useMutation({
        mutationFn: trackParcel,
        onSuccess: (data) => {
            setTrackingData(data?.data)
        },
        onError: (error) => {
            toast.error(error?.message)
        }
    })

    const handleSearch = () => {
        mutate(trackingId)
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Track Your Parcel 📦
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Enter your tracking ID to get real-time updates on your parcel's journey
                </p>
            </div>

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

            {
                trackingData && <div className="max-w-4xl mx-auto space-y-6">
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
                                            <div className="text-gray-600">{trackingData?.current_location?.place_name}</div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                Estimated delivery: {format(addDays(new Date(trackingData?.createdAt ?? ''), 2), 'yyyy-MM-dd')}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <LiveTrackingMap trackingData={trackingData} />

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
            }
        </div>
    )
}

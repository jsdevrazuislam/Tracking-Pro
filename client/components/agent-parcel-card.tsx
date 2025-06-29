"use client"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SocketEventEnum } from "@/constants"
import { useTranslation } from "@/hooks/use-translation"
import { useSocketStore } from "@/store/socket-store"
import { Package, MapPin, Clock, CheckCircle, AlertCircle, Phone } from "lucide-react"
import React, { useEffect } from 'react'


const getStatusIcon = (status: string) => {
    switch (status) {
        case "delivered":
            return <CheckCircle className="h-4 w-4 text-green-600" />
        case "in-transit":
            return <Clock className="h-4 w-4 text-blue-600" />
        case "picked-up":
            return <Package className="h-4 w-4 text-orange-600" />
        case "assigned":
            return <AlertCircle className="h-4 w-4 text-yellow-600" />
        default:
            return <Package className="h-4 w-4 text-gray-600" />
    }
}

const getStatusColor = (status: string) => {
    switch (status) {
        case "delivered":
            return "bg-green-100 text-green-800"
        case "in-transit":
            return "bg-blue-100 text-blue-800"
        case "picked-up":
            return "bg-orange-100 text-orange-800"
        case "assigned":
            return "bg-yellow-100 text-yellow-800"
        default:
            return "bg-gray-100 text-gray-800"
    }
}


const AgentParcelCard = ({ parcel, handleValue }: { parcel: ParcelsEntity, handleValue: (id: string, status: string) => void }) => {

    const { t } = useTranslation()
    const { socket } = useSocketStore()

    useEffect(() => {
        if (!socket) return
        const interval = setInterval(() => {
            navigator.geolocation.getCurrentPosition((pos) => {
                const coords: [number, number] = [
                    pos.coords.longitude,
                    pos.coords.latitude,
                ]

                socket.emit(SocketEventEnum.PARCEL_LOCATION, {
                    trackingId: parcel.id,
                    coords,
                })
            })
        }, 5000)

        return () => clearInterval(interval)
    }, [socket, parcel])



    return (
        <>
            <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {getStatusIcon(parcel.status)}
                        <div>
                            <div className="font-medium">{parcel.id}</div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(parcel.status)}>
                            {parcel.status.replace("-", " ").toUpperCase()}
                        </Badge>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <div className="text-sm font-medium text-green-600 mb-1">{t('pickupAddress')}</div>
                        <div className="text-sm text-gray-600 flex items-start">
                            <MapPin className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0" />
                            {parcel?.pickup_address?.place_name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            <Phone className="h-3 w-3 inline mr-1" />
                            {parcel?.sender?.phone}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-blue-600 mb-1">{t('deliveryAddress')}</div>
                        <div className="text-sm text-gray-600 flex items-start">
                            <MapPin className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0" />
                            {parcel?.receiver_address?.place_name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            <Phone className="h-3 w-3 inline mr-1" />
                            {parcel?.sender?.phone}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-4">
                        <div className="text-sm">
                            <span className="text-gray-600">{t('payment')}:</span>
                            <span className="font-medium ml-1">
                                {parcel?.payment_type?.toUpperCase()} - ${parcel.amount}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Select value={parcel.status} onValueChange={(value) => handleValue(parcel.id, value)}>
                            <SelectTrigger className="w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem disabled value="assigned">Assigned</SelectItem>
                                <SelectItem value="picked">Picked Up</SelectItem>
                                <SelectItem value="in_transit">In Transit</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Failed Delivery</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AgentParcelCard
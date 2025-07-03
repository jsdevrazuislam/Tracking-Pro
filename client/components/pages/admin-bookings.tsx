"use client"
import React from 'react'
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
    Package,
    Search,
    Filter,
} from "lucide-react"
import { useQuery } from '@tanstack/react-query'
import { getAllBookings } from '@/lib/apis/admin'
import { format } from 'date-fns';
import { TrackingSkeleton } from '@/components/loading-skeleton'
import { useTranslation } from '@/hooks/use-translation'
import { NoSearchResultsEmptyState } from '../empty-states'



const getStatusColor = (status: string) => {
    switch (status) {
        case "delivered":
            return "bg-green-100 text-green-800 border-green-200"
        case "in-transit":
            return "bg-blue-100 text-blue-800 border-blue-200"
        case "pending":
            return "bg-yellow-100 text-yellow-800 border-yellow-200"
        case "failed":
            return "bg-red-100 text-red-800 border-red-200"
        default:
            return "bg-gray-100 text-gray-800 border-gray-200"
    }
}

const AdminBookingList = () => {

    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const { isLoading, data} = useQuery({
        queryKey: ['getAllBookings'],
        queryFn: () => getAllBookings({ page: 1, limit: 10})
    })
    const { t } =  useTranslation()

    const bookings = data?.data?.bookings ?? []

    const filteredBookings = bookings?.filter((booking) => {
        const matchesSearch =
            booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.sender?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || booking.status === statusFilter
        return matchesSearch && matchesStatus
    })

    return (
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                <CardHeader>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl font-bold">{t('recentBookings')}</CardTitle>
                            <CardDescription className="text-base">{t('latestParcelBookings')}</CardDescription>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <Search className="h-4 w-4 z-10 absolute left-3 top-3 text-gray-400" />
                                <Input
                                    placeholder="Search bookings..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-full sm:w-64"
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full sm:w-40">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="in_transit">In Transit</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                    <SelectItem value="failed">Failed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {isLoading ? <TrackingSkeleton /> : filteredBookings.length === 0  ? <NoSearchResultsEmptyState onClearFilters={() => {
                            setSearchTerm('')
                            setStatusFilter('all')
                        }} className=' bg-transparent shadow-none' searchTerm={statusFilter ?? searchTerm} /> : filteredBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="group p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300 bg-white"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex space-x-4 flex-1">
                                        <div className="p-2 w-fit h-fit bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
                                            <Package className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                                <div className="font-bold text-lg text-gray-900">{booking?.tracking_code}</div>
                                                <div className="flex items-center gap-2">
                                                    <Badge className={getStatusColor(booking.status)}>
                                                        {booking.status.replace("-", " ").toUpperCase()}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="space-y-1 text-sm text-gray-600">
                                                <div>
                                                    {t('customer')}: <span className="font-medium">{booking?.sender?.full_name}</span>
                                                </div>
                                                <div>
                                                    {t('agent')}: <span className="font-medium">{booking?.agent?.full_name ?? 'Unassigned'}</span>
                                                </div>
                                                <div className="text-xs text-gray-500">{(format(new Date(booking?.createdAt), 'yyyy-MM-dd hh:mm a'))}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between lg:justify-end gap-4">
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-gray-900">${booking?.amount}</div>
                                            <div className="text-sm text-gray-500 uppercase font-medium">{booking?.payment_type}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        
                    </div>
                </CardContent>
            </Card>
    )
}

export default AdminBookingList
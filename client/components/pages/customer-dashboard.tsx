"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Package, Plus, MapPin, Clock, CheckCircle, AlertCircle, TrendingUp, Calendar } from "lucide-react"
import Link from "next/link"
import { CustomerLayout } from "@/components/customer-layout"
import { useAuthStore } from "@/store/store"
import { useQueries } from "@tanstack/react-query"
import { getParcels, getStats } from "@/lib/apis/parcel"
import { format, addDays } from 'date-fns';
import { NoParcelEmptyState } from "@/components/empty-states"


const getStatusIcon = (status: string) => {
    switch (status) {
        case "delivered":
            return <CheckCircle className="h-5 w-5 text-green-600" />
        case "in-transit":
            return <Clock className="h-5 w-5 text-blue-600" />
        case "picked-up":
            return <Package className="h-5 w-5 text-orange-600" />
        default:
            return <AlertCircle className="h-5 w-5 text-gray-600" />
    }
}

const getStatusColor = (status: string) => {
    switch (status) {
        case "delivered":
            return "bg-green-100 text-green-800 border-green-200"
        case "in-transit":
            return "bg-blue-100 text-blue-800 border-blue-200"
        case "picked-up":
            return "bg-orange-100 text-orange-800 border-orange-200"
        default:
            return "bg-gray-100 text-gray-800 border-gray-200"
    }
}

export default function CustomerDashboard() {
    const { user } = useAuthStore()
    const results = useQueries({
        queries: [
            {
                queryKey: ['customerStats'],
                queryFn: getStats,
            },
            {
                queryKey: ['customerParcels'],
                queryFn: () => getParcels({ page: 1, limit: 5 })
            },
        ],
    });

    const [statsQuery, parcelsQuery] = results;
    const isLoading = statsQuery.isLoading || parcelsQuery.isLoading;
    const isError = statsQuery.isError || parcelsQuery.isError;
    const error = statsQuery.error || parcelsQuery.error;

    const stats = statsQuery.data;
    const parcels = parcelsQuery.data?.data?.parcels ?? [];


    if (isLoading) {
        return (
            <CustomerLayout>
                <div className="flex justify-center items-center h-full">Loading dashboard data...</div>
            </CustomerLayout>
        );
    }

    if (isError) {
        return (
            <CustomerLayout>
                <div className="text-red-500">Error loading dashboard data: {error?.message}</div>
            </CustomerLayout>
        );
    }

    return (
        <CustomerLayout>
            <div className="space-y-8">
                {/* Welcome Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            Welcome back, {user?.full_name}! 👋
                        </h1>
                        <p className="text-lg text-gray-600">Manage your parcels and track deliveries in real-time</p>
                    </div>
                    <Link href="/customer/book-parcel">
                        <Button
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Book New Parcel
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  gap-6">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-700">Total Parcels</CardTitle>
                            <Package className="h-5 w-5 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-900">{stats?.data?.total}</div>
                            <p className="text-xs text-blue-600 mt-1">All time</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-green-700">Delivered</CardTitle>
                            <CheckCircle className="h-5 w-5 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-900">{stats?.data?.delivered}</div>
                            <p className="text-xs text-green-600 mt-1">Successfully completed</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-orange-700">In Transit</CardTitle>
                            <Clock className="h-5 w-5 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-orange-900">{stats?.data?.inTransit}</div>
                            <p className="text-xs text-orange-600 mt-1">On the way</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-purple-700">Pending</CardTitle>
                            <AlertCircle className="h-5 w-5 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-purple-900">{stats?.data?.pending}</div>
                            <p className="text-xs text-purple-600 mt-1">Awaiting pickup</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
                        <CardHeader>
                            <CardTitle className="flex items-center text-lg">
                                <Package className="h-5 w-5 mr-2 text-blue-600" />
                                Quick Book
                            </CardTitle>
                            <CardDescription>Book a parcel for immediate pickup</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href="/customer/book-parcel">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700">Book Now</Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
                        <CardHeader>
                            <CardTitle className="flex items-center text-lg">
                                <MapPin className="h-5 w-5 mr-2 text-green-600" />
                                Track Parcel
                            </CardTitle>
                            <CardDescription>Enter tracking ID to track your parcel</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href="/customer/track">
                                <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50">
                                    Track Now
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
                        <CardHeader>
                            <CardTitle className="flex items-center text-lg">
                                <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                                Schedule Pickup
                            </CardTitle>
                            <CardDescription>Schedule a pickup for later</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50">
                                Schedule
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Parcels */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <CardTitle className="text-2xl font-bold">Recent Parcels</CardTitle>
                                <CardDescription className="text-base">Your latest parcel bookings and their status</CardDescription>
                            </div>
                            <Link href="/customer/history">
                                <Button variant="outline" className="flex items-center">
                                    View All
                                    <TrendingUp className="h-4 w-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {parcels.length === 0  ? <NoParcelEmptyState className="shadow-none bg-transparent" /> : parcels?.map((parcel) => (
                                <div
                                    key={parcel.id}
                                    className="group p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300 bg-white"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div className="flex items-start space-x-4 flex-1">
                                            <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
                                                {getStatusIcon(parcel.status)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                                                    <div className="font-bold text-lg text-gray-900">{parcel?.tracking_code}</div>
                                                    <Badge className={`${getStatusColor(parcel.status)} font-medium px-3 py-1`}>
                                                        {parcel.status.replace("-", " ").toUpperCase()}
                                                    </Badge>
                                                </div>

                                                <div className="space-y-2 text-sm text-gray-600">
                                                    <div className="flex items-start">
                                                        <MapPin className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0 text-green-600" />
                                                        <div>
                                                            <div className="font-medium">From: {parcel?.pickup_address?.place_name}</div>
                                                            <div className="font-medium">To: {parcel?.receiver_address?.place_name}</div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 pt-2">
                                                        <div className="flex items-center">
                                                            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                                            <span>Created: {format(new Date(parcel.createdAt), 'yyyy-MM-dd')}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Clock className="h-4 w-4 mr-1 text-gray-400" />
                                                            <span>Est. Delivery: {format(addDays(new Date(parcel.createdAt), 2), 'yyyy-MM-dd')}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="mt-4">
                                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                        <span>Progress</span>
                                                        <span>{parcel.progress}%</span>
                                                    </div>
                                                    <Progress value={parcel.progress} className="h-2" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-gray-900">${parcel?.amount}</div>
                                                <div className="text-sm text-gray-500 uppercase font-medium">{parcel?.payment_type}</div>
                                            </div>
                                            <Link href={`/customer/track/${parcel?.tracking_code}`}>
                                                <Button
                                                    size="sm"
                                                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                                                >
                                                    <MapPin className="h-4 w-4 mr-1" />
                                                    Track
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </CustomerLayout>
    )
}

"use client"

import type React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton";


export function DashboardSkeleton() {
    return (
        <div className="space-y-8 animate-in max-w-7xl mx-auto py-7">
            {/* Header Skeleton */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-80" />
                    <Skeleton className="h-6 w-96" />
                </div>
                <Skeleton className="h-12 w-40" />
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-5 w-5 rounded" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16 mb-1" />
                            <Skeleton className="h-3 w-24" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <Skeleton className="h-5 w-5 rounded" />
                                <Skeleton className="h-6 w-24" />
                            </div>
                            <Skeleton className="h-4 w-40" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-10 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Parcels Skeleton */}
            <Card className="animate-pulse">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <Skeleton className="h-7 w-40 mb-2" />
                            <Skeleton className="h-4 w-60" />
                        </div>
                        <Skeleton className="h-10 w-24" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="p-6 border border-gray-200 rounded-xl">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex items-start space-x-4 flex-1">
                                        <Skeleton className="h-12 w-12 rounded-lg" />
                                        <div className="flex-1 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <Skeleton className="h-6 w-20" />
                                                <Skeleton className="h-6 w-24 rounded-full" />
                                            </div>
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-4 w-3/4" />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <Skeleton className="h-3 w-32" />
                                                <Skeleton className="h-3 w-20" />
                                            </div>
                                            <Skeleton className="h-2 w-full rounded-full" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right space-y-1">
                                            <Skeleton className="h-8 w-16" />
                                            <Skeleton className="h-4 w-12" />
                                        </div>
                                        <Skeleton className="h-8 w-20" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
    return (
        <Card className="animate-pulse">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                    <div className="flex space-x-2">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {Array.from({ length: rows }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4 flex-1">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                {Array.from({ length: columns - 1 }).map((_, j) => (
                                    <Skeleton key={j} className="h-6 w-16 rounded-full" />
                                ))}
                                <Skeleton className="h-8 w-8 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export function FormSkeleton() {
    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in">
            <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-5 w-96" />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader>
                                <div className="flex items-center space-x-2">
                                    <Skeleton className="h-5 w-5 rounded" />
                                    <Skeleton className="h-6 w-32" />
                                </div>
                                <Skeleton className="h-4 w-48" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-20 w-full" />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-16" />
                                            <Skeleton className="h-10 w-full" />
                                        </div>
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-20" />
                                            <Skeleton className="h-10 w-full" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-28" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="space-y-6">
                    <Card className="animate-pulse">
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <Skeleton className="h-5 w-5 rounded" />
                                <Skeleton className="h-6 w-32" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Skeleton className="h-4 w-24 mb-2" />
                                <Skeleton className="h-12 w-16" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <Skeleton className="h-12 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export function TrackingSkeleton() {
    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in">
            {/* Header */}
            <div className="text-center space-y-4">
                <Skeleton className="h-10 w-64 mx-auto" />
                <Skeleton className="h-6 w-96 mx-auto" />
            </div>

            {/* Search Section */}
            <Card className="animate-pulse">
                <CardHeader className="text-center pb-6">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                        <Skeleton className="h-6 w-6 rounded" />
                        <Skeleton className="h-7 w-40" />
                    </div>
                    <Skeleton className="h-5 w-64 mx-auto" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <div className="flex gap-3">
                            <Skeleton className="h-12 flex-1" />
                            <Skeleton className="h-12 w-24" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-32" />
                        <div className="flex flex-wrap gap-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-8 w-16" />
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tracking Results Skeleton */}
            <div className="space-y-6">
                <Card className="animate-pulse">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <Skeleton className="h-7 w-24 mb-2" />
                                <Skeleton className="h-4 w-48" />
                            </div>
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <Skeleton className="h-6 w-6 rounded" />
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-4 w-40" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <Skeleton className="h-6 w-6 rounded" />
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-28" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-3 w-8" />
                            </div>
                            <Skeleton className="h-3 w-full rounded-full" />
                        </div>
                    </CardContent>
                </Card>

                {/* Map Skeleton */}
                <Card className="animate-pulse">
                    <CardHeader>
                        <Skeleton className="h-6 w-32 mb-1" />
                        <Skeleton className="h-4 w-48" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-80 w-full rounded-2xl" />
                    </CardContent>
                </Card>

                {/* Timeline Skeleton */}
                <Card className="animate-pulse">
                    <CardHeader>
                        <Skeleton className="h-6 w-32 mb-1" />
                        <Skeleton className="h-4 w-48" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex items-start space-x-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <div className="flex justify-between items-center">
                                            <Skeleton className="h-5 w-32" />
                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                        <Skeleton className="h-4 w-48" />
                                        <Skeleton className="h-3 w-64" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export function AgentDashboardSkeleton() {
    return (
        <div className="space-y-6 animate-in">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-5 w-48" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-4 rounded" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-8" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Route Map */}
            <Card className="animate-pulse">
                <CardHeader>
                    <Skeleton className="h-6 w-48 mb-1" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-64 w-full rounded-lg" />
                </CardContent>
            </Card>

            {/* Assigned Parcels */}
            <Card className="animate-pulse">
                <CardHeader>
                    <Skeleton className="h-6 w-32 mb-1" />
                    <Skeleton className="h-4 w-56" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="border rounded-lg p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Skeleton className="h-5 w-5 rounded" />
                                        <div>
                                            <Skeleton className="h-4 w-16 mb-1" />
                                            <Skeleton className="h-3 w-24" />
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Skeleton className="h-6 w-16 rounded-full" />
                                        <Skeleton className="h-6 w-20 rounded-full" />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-28" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t">
                                    <Skeleton className="h-4 w-32" />
                                    <div className="flex space-x-2">
                                        <Skeleton className="h-8 w-24" />
                                        <Skeleton className="h-8 w-20" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export function AdminDashboardSkeleton() {
    return (
        <div className="space-y-8 animate-in">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <Skeleton className="h-10 w-64 mb-2" />
                    <Skeleton className="h-6 w-80" />
                </div>
                <div className="flex space-x-3">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-5 w-5 rounded" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-12 mb-1" />
                            <Skeleton className="h-3 w-24" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 animate-pulse">
                    <CardHeader>
                        <Skeleton className="h-6 w-40 mb-1" />
                        <Skeleton className="h-4 w-64" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="text-center p-4 rounded-xl border">
                                    <Skeleton className="h-8 w-8 mx-auto mb-2 rounded" />
                                    <Skeleton className="h-6 w-8 mx-auto mb-1" />
                                    <Skeleton className="h-3 w-16 mx-auto" />
                                </div>
                            ))}
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-12" />
                            </div>
                            <Skeleton className="h-3 w-full rounded-full" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="animate-pulse">
                    <CardHeader>
                        <Skeleton className="h-6 w-32 mb-1" />
                        <Skeleton className="h-4 w-40" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex justify-between">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-4 w-12" />
                                </div>
                            ))}
                        </div>
                        <div className="pt-4 space-y-2">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Bookings */}
            <Card className="animate-pulse">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <Skeleton className="h-7 w-32 mb-2" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                        <div className="flex space-x-3">
                            <Skeleton className="h-10 w-48" />
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="p-6 border rounded-xl">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-4 flex-1">
                                        <Skeleton className="h-12 w-12 rounded-lg" />
                                        <div className="flex-1 space-y-2">
                                            <div className="flex justify-between">
                                                <Skeleton className="h-5 w-20" />
                                                <div className="flex space-x-2">
                                                    <Skeleton className="h-5 w-16 rounded-full" />
                                                    <Skeleton className="h-5 w-20 rounded-full" />
                                                </div>
                                            </div>
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-3 w-40" />
                                        </div>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <Skeleton className="h-6 w-12" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

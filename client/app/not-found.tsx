
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, Search, Package, MapPin, Compass } from 'lucide-react'
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
    title: 'Tracking Pro - 404 Error',
    description: 'Test Description'
}

export default function NotFound() {

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center">
                <div className="relative mb-8">
                    <div className="text-[12rem] font-bold text-blue-100 leading-none select-none">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                            <div className="absolute -top-8 -left-8 animate-bounce delay-100">
                                <Package className="h-8 w-8 text-blue-400" />
                            </div>
                            <div className="absolute -top-4 -right-8 animate-bounce delay-300">
                                <Package className="h-6 w-6 text-purple-400" />
                            </div>
                            <div className="absolute -bottom-4 -left-4 animate-bounce delay-500">
                                <Package className="h-7 w-7 text-indigo-400" />
                            </div>

                            <div className="bg-white rounded-full p-6 shadow-lg border-4 border-blue-200">
                                <Compass className="h-16 w-16 text-blue-600 animate-spin" style={{ animationDuration: '8s' }} />
                            </div>
                        </div>
                    </div>
                </div>

                <Card className="border-0 shadow-none bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-8">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Oops! Package Not Found
                                </h1>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    Looks like this page got lost in transit! Don't worry, our delivery team is on it.
                                </p>
                                <p className="text-sm text-gray-500">
                                    The page you're looking for might have been moved, deleted, or doesn't exist.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6">
                                <div className="flex flex-col items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                                    <Home className="h-8 w-8 text-blue-600 mb-2" />
                                    <span className="text-sm font-medium text-blue-800">Go Home</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                                    <Search className="h-8 w-8 text-purple-600 mb-2" />
                                    <span className="text-sm font-medium text-purple-800">Search</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                                    <MapPin className="h-8 w-8 text-green-600 mb-2" />
                                    <span className="text-sm font-medium text-green-800">Track Parcel</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                <Link href="/">
                                    <Button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white">
                                        <Home className="h-4 w-4" />
                                        Back to Home
                                    </Button>
                                </Link>
                            </div>

                            <div className="pt-6 border-t border-gray-200">
                                <p className="text-sm text-gray-600 mb-3">
                                    Need help? Try these popular pages:
                                </p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-blue-600 hover:bg-blue-50"
                                    >
                                        Contact Support
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        Error Code: 404 | CourierTrack Pro - Professional Logistics System
                    </p>
                </div>
            </div>
        </div>
    )
}

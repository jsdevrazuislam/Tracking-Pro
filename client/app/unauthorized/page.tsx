import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Lock, Home, UserX, AlertTriangle, Key } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"


export const metadata: Metadata = {
    title: 'Tracking pro - Unauthorized',
    description:'Test Description'
}

export default function Unauthorized() {

    return (
        <div className="bg-gradient-to-br py-12 from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center">
                <div className="relative mb-8">
                    <div className="text-[8rem] font-bold text-red-100 leading-none select-none">401</div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                            <div className="absolute -top-8 -left-8 animate-pulse delay-100">
                                <Lock className="h-8 w-8 text-red-400" />
                            </div>
                            <div className="absolute -top-4 -right-8 animate-pulse delay-300">
                                <Key className="h-6 w-6 text-orange-400" />
                            </div>
                            <div className="absolute -bottom-4 -left-4 animate-pulse delay-500">
                                <UserX className="h-7 w-7 text-red-500" />
                            </div>

                            <div className="bg-white rounded-full p-6 shadow-lg border-4 border-red-200">
                                <Shield className="h-16 w-16 text-red-600" />
                            </div>

                            <div className="absolute -top-2 -right-2 bg-orange-500 rounded-full p-1">
                                <AlertTriangle className="h-4 w-4 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                <Card className="border-0 shadow-none bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-8">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <h1 className="text-3xl font-bold text-gray-900">Access Denied</h1>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    You don't have permission to access this area of CourierTrack Pro.
                                </p>
                                <p className="text-sm text-gray-500">
                                    This page requires special authorization or you may need to log in with appropriate credentials.
                                </p>
                            </div>

                            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                    <div className="text-left">
                                        <h3 className="font-semibold text-red-800 mb-1">Security Notice</h3>
                                        <p className="text-sm text-red-700">
                                            This area is restricted to authorized personnel only. If you believe you should have access,
                                            please contact your administrator or try logging in with the correct credentials.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6">
                                <div className="flex flex-col items-center p-4 bg-blue-50 rounded-xl">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                                        <span className="text-blue-600 font-bold">C</span>
                                    </div>
                                    <span className="text-sm font-medium text-blue-800">Customer</span>
                                    <span className="text-xs text-blue-600">Basic Access</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-green-50 rounded-xl">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                                        <span className="text-green-600 font-bold">A</span>
                                    </div>
                                    <span className="text-sm font-medium text-green-800">Agent</span>
                                    <span className="text-xs text-green-600">Delivery Access</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-purple-50 rounded-xl">
                                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                                        <span className="text-purple-600 font-bold">A</span>
                                    </div>
                                    <span className="text-sm font-medium text-purple-800">Admin</span>
                                    <span className="text-xs text-purple-600">Full Access</span>
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
                                <p className="text-sm text-gray-600 mb-3">Need different access? Contact support:</p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-blue-600 hover:bg-blue-50"
                                    >
                                        Email Admin
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-blue-600 hover:bg-blue-50"
                                    >
                                        Call Support
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-blue-600 hover:bg-blue-50"
                                    >
                                        Live Chat
                                    </Button>
                                    <Link href="/help">
                                        <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                                            Help Center
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 text-left">
                                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                    <Lock className="h-4 w-4" />
                                    Security Tips
                                </h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Make sure you're logged in with the correct account</li>
                                    <li>• Check if your account has the required permissions</li>
                                    <li>• Contact your administrator if you need access</li>
                                    <li>• Clear your browser cache and try again</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">Error Code: 401 | CourierTrack Pro - Secure Logistics Platform</p>
                </div>
            </div>
        </div>
    )
}

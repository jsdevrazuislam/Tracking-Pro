"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Truck, Home, LogOut, Menu, Bell, Package, Users, BarChart3, MapPin, ScanBarcode } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/store/store"
import { useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "@/hooks/use-translation"
import { LanguageSwitcher } from "@/components/language-switcher"

interface DashboardLayoutProps {
    children: React.ReactNode
}

type NavItem = {
    name: string
    href: string
    icon: React.ElementType
    badge?: string | null
}



export function DashboardLayout({ children }: DashboardLayoutProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { user, logout } = useAuthStore()
    const queryClient = useQueryClient()
    const { t, language } = useTranslation()

    const handleLogout = () => {
        logout()
        queryClient.clear()
        router.push("/")
    }

    const navByRole: Record<string, NavItem[]> = {
        admin: [
            { name: t('dashboard'), href: "/admin/dashboard", icon: Home },
            { name: t('assignParcels'), href: "/admin/assign-parcels", icon: Package },
            { name: t('manageUsers'), href: "/admin/manage-users", icon: Users },
            { name: t('viewBookings'), href: "/admin/bookings", icon: BarChart3 },
        ],
        agent: [
            { name: t('dashboard'), href: "/agent/dashboard", icon: Home },
            { name: t('scan'), href: "/agent/scan", icon: ScanBarcode },
        ],
        customer: [
            { name: t('dashboard'), href: "/customer/dashboard", icon: Home },
            { name: t('bookParcel'), href: "/customer/book-parcel", icon: Package },
            { name: t('trackParcel'), href: "/customer/track", icon: MapPin },
        ],
    }

    const navigation = useMemo(() => {
        const role = user?.role || "agent"
        return navByRole[role] || []
    }, [user, language])


    const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
        <nav className={`space-y-2 ${mobile ? "px-4" : ""}`}>
            {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => mobile && setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? "bg-blue-600 text-white shadow-lg" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            }`}
                    >
                        <div className="flex items-center">
                            <item.icon className="h-5 w-5 mr-3" />
                            {item.name}
                        </div>
                        {item.badge && <Badge className="bg-red-500 text-white text-xs px-2 py-1">{item.badge}</Badge>}
                    </Link>
                )
            })}
        </nav>
    )
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            {/* Mobile menu button */}
                            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="sm" className="lg:hidden">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-80 p-0">
                                    <div className="flex flex-col h-full">
                                        <div className="p-6 border-b">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-blue-600 rounded-xl">
                                                    <Truck className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <h2 className="font-bold text-lg capitalize">{user?.role} {t('portal')}</h2>
                                                    <p className="text-sm text-gray-600">{t('parcelManagement')}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 py-6">
                                            <NavItems mobile />
                                        </div>
                                        <div className="p-6 border-t">
                                            <Button
                                                variant="outline"
                                                onClick={handleLogout}
                                                className="w-fit justify-start text-red-600 border-red-200 hover:bg-red-50"
                                            >
                                                <LogOut className="h-4 w-4 mr-2" />
                                                {t('logout')}
                                            </Button>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>

                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-600 rounded-xl">
                                    <Truck className="h-6 w-6 text-white" />
                                </div>
                                <div className="hidden sm:block">
                                    <h1 className="text-xl font-bold text-gray-900 capitalize">{user?.role} {t('portal')}</h1>
                                    <p className="text-xs text-gray-600">{t('parcelManagement')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center sm:space-x-4">
                            <LanguageSwitcher />
                            <Button variant="outline" size="sm" onClick={handleLogout} className="hidden sm:flex">
                                <LogOut className="h-4 w-4 mr-2" />
                                {t('logout')}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-8">
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="sticky top-24 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                            <div className="mb-6">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Truck className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">{user?.full_name}</div>
                                        <div className="text-sm text-gray-600">
                                            {
                                                user?.role === 'customer' ? 'Customer' : user?.role === 'agent' ? 'Delivery Agent' : 'System Administrator'
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 w-fit rounded-full">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs font-medium text-green-700">Online</span>
                                </div>
                            </div>
                            <NavItems />
                        </div>
                    </aside>
                    <main className="flex-1 min-w-0">{children}</main>
                </div>
            </div>
        </div>
    )
}

"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Truck, Home, Package, Navigation, User, LogOut, Menu, Bell, Settings, MapPin } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/store/store"
import { useQueryClient } from "@tanstack/react-query"

interface AgentLayoutProps {
  children: React.ReactNode
}

export function AgentLayout({ children }: AgentLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const queryClient = useQueryClient()

  const handleLogout = () => {
    logout()
    queryClient.clear()
    router.push("/")
  }

  const navigation = [
    { name: "Dashboard", href: "/agent/dashboard", icon: Home, badge: null },
    { name: "My Deliveries", href: "/agent/deliveries", icon: Package, badge: "5" },
    { name: "Route Planner", href: "/agent/routes", icon: Navigation, badge: null },
    { name: "Profile", href: "/agent/profile", icon: User, badge: null },
  ]

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className={`space-y-2 ${mobile ? "px-4" : ""}`}>
      {navigation.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => mobile && setIsMobileMenuOpen(false)}
            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive ? "bg-blue-600 text-white shadow-lg" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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
            <div className="flex items-center space-x-4">
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
                          <h2 className="font-bold text-lg">Agent Portal</h2>
                          <p className="text-sm text-gray-600">Delivery Management</p>
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
                        className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
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
                  <h1 className="text-xl font-bold text-gray-900">Agent Portal</h1>
                  <p className="text-xs text-gray-600">Delivery Management</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-700">Online</span>
              </div>

              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0">
                  2
                </Badge>
              </Button>

              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium text-gray-900">{user?.full_name}</div>
                  <div className="text-xs text-gray-600">Delivery Agent</div>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Truck className="h-4 w-4 text-blue-600" />
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={handleLogout} className="hidden sm:flex">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Truck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{user?.full_name}</div>
                    <div className="text-sm text-gray-600">Agent ID: AG001</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-700">Manhattan, NY</span>
                </div>
              </div>
              <NavItems />
              <div className="mt-8 pt-6 border-t border-gray-200">
                <Button variant="ghost" size="sm" className="w-full justify-start text-gray-600 hover:text-gray-900">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}

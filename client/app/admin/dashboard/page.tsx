"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Package,
  Users,
  Truck,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Download,
  Search,
  Filter,
  Activity,
  Clock,
  CheckCircle,
} from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"
import Link from "next/link"

// Mock dashboard data
const mockDashboardData = {
  stats: {
    totalParcels: 1247,
    dailyBookings: 89,
    activeAgents: 24,
    codAmount: 12450.75,
    deliveredToday: 67,
    failedDeliveries: 8,
    revenue: 45230.5,
    growthRate: 18.2,
  },
  recentBookings: [
    {
      id: "PKG001",
      customer: "John Doe",
      agent: "Mike Smith",
      status: "delivered",
      amount: 25.0,
      paymentMode: "prepaid",
      createdAt: "2024-01-17 10:30 AM",
      priority: "high",
    },
    {
      id: "PKG002",
      customer: "Jane Wilson",
      agent: "Sarah Johnson",
      status: "in-transit",
      amount: 45.0,
      paymentMode: "cod",
      createdAt: "2024-01-17 09:15 AM",
      priority: "medium",
    },
    {
      id: "PKG003",
      customer: "Bob Brown",
      agent: "Unassigned",
      status: "pending",
      amount: 35.0,
      paymentMode: "prepaid",
      createdAt: "2024-01-17 08:45 AM",
      priority: "low",
    },
  ],
  agents: [
    {
      id: 1,
      name: "Mike Smith",
      status: "active",
      assignedParcels: 8,
      completedToday: 5,
      location: "Manhattan, NY",
      efficiency: 95,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      status: "active",
      assignedParcels: 6,
      completedToday: 4,
      location: "Brooklyn, NY",
      efficiency: 88,
    },
    {
      id: 3,
      name: "Tom Wilson",
      status: "offline",
      assignedParcels: 0,
      completedToday: 3,
      location: "Queens, NY",
      efficiency: 92,
    },
  ],
}

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

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800"
    case "medium":
      return "bg-yellow-100 text-yellow-800"
    case "low":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(mockDashboardData)
  const [user, setUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      setUser(JSON.parse(currentUser))
    }
  }, [])

  const exportReport = (type: string) => {
    alert(`Exporting ${type} report...`)
  }

  const filteredBookings = dashboardData.recentBookings.filter((booking) => {
    const matchesSearch =
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Admin Dashboard 📊
            </h1>
            <p className="text-lg text-gray-600">Overview of courier operations and system metrics</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={() => exportReport("CSV")} className="bg-white hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => exportReport("PDF")} className="bg-white hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Daily Bookings</CardTitle>
              <Package className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{dashboardData.stats.dailyBookings}</div>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Active Agents</CardTitle>
              <Truck className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">{dashboardData.stats.activeAgents}</div>
              <p className="text-xs text-green-600 mt-1">
                {dashboardData.agents.filter((a) => a.status === "active").length} online now
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">COD Amount</CardTitle>
              <DollarSign className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">
                ${dashboardData.stats.codAmount.toLocaleString()}
              </div>
              <p className="text-xs text-purple-600 mt-1">Pending collection</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Failed Deliveries</CardTitle>
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-900">{dashboardData.stats.failedDeliveries}</div>
              <p className="text-xs text-red-600 mt-1">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-600" />
                Today's Performance
              </CardTitle>
              <CardDescription>Real-time delivery metrics and performance indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold text-green-900">{dashboardData.stats.deliveredToday}</div>
                  <div className="text-sm text-green-600">Delivered</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-900">15</div>
                  <div className="text-sm text-blue-600">In Transit</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <Package className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <div className="text-2xl font-bold text-orange-900">7</div>
                  <div className="text-sm text-orange-600">Pending</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Delivery Success Rate</span>
                  <span className="text-sm font-bold text-green-600">94.2%</span>
                </div>
                <Progress value={94.2} className="h-3" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Revenue Overview</CardTitle>
              <CardDescription>Financial performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Today</span>
                  <span className="font-bold text-lg">$2,340</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className="font-bold text-lg">${dashboardData.stats.revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Growth Rate</span>
                  <span className="font-bold text-lg text-green-600">+{dashboardData.stats.growthRate}%</span>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <Link href="/admin/assign-parcels">
                  <Button variant="outline" className="w-full justify-start hover:bg-blue-50">
                    <Package className="h-4 w-4 mr-2" />
                    Assign Parcels
                  </Button>
                </Link>
                <Link href="/admin/manage-users">
                  <Button variant="outline" className="w-full justify-start hover:bg-green-50">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold">Recent Bookings</CardTitle>
                <CardDescription className="text-base">Latest parcel bookings and their current status</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
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
                    <SelectItem value="in-transit">In Transit</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="group p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300 bg-white"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
                        <Package className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <div className="font-bold text-lg text-gray-900">{booking.id}</div>
                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(booking.priority)}>
                              {booking.priority.toUpperCase()}
                            </Badge>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status.replace("-", " ").toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div>
                            Customer: <span className="font-medium">{booking.customer}</span>
                          </div>
                          <div>
                            Agent: <span className="font-medium">{booking.agent}</span>
                          </div>
                          <div className="text-xs text-gray-500">{booking.createdAt}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between lg:justify-end gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">${booking.amount}</div>
                        <div className="text-sm text-gray-500 uppercase font-medium">{booking.paymentMode}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Agents */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Active Delivery Agents</CardTitle>
            <CardDescription className="text-base">Current status and performance of delivery agents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {dashboardData.agents.map((agent) => (
                <div
                  key={agent.id}
                  className="p-6 border border-gray-200 rounded-xl bg-white hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-bold text-lg text-gray-900">{agent.name}</div>
                    <Badge
                      className={
                        agent.status === "active"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-gray-100 text-gray-800 border-gray-200"
                      }
                    >
                      {agent.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location</span>
                      <span className="font-medium">{agent.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Assigned</span>
                      <span className="font-medium">{agent.assignedParcels} parcels</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed Today</span>
                      <span className="font-medium">{agent.completedToday}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Efficiency</span>
                        <span className="font-medium text-blue-600">{agent.efficiency}%</span>
                      </div>
                      <Progress value={agent.efficiency} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

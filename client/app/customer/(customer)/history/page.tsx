"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  Package,
  Download,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
} from "lucide-react"
import Link from "next/link"

// Mock historical data
const mockHistoryData = [
  {
    id: "PKG001",
    pickupAddress: "123 Main St, New York, NY",
    deliveryAddress: "456 Oak Ave, Brooklyn, NY",
    status: "delivered",
    type: "document",
    paymentMode: "prepaid",
    amount: 25.0,
    createdAt: "2024-01-15",
    deliveredAt: "2024-01-16",
    estimatedDelivery: "2024-01-16",
    progress: 100,
    rating: 5,
    agent: "John Smith",
  },
  {
    id: "PKG002",
    pickupAddress: "789 Pine St, Manhattan, NY",
    deliveryAddress: "321 Elm St, Queens, NY",
    status: "in-transit",
    type: "package",
    paymentMode: "cod",
    amount: 45.0,
    createdAt: "2024-01-16",
    deliveredAt: null,
    estimatedDelivery: "2024-01-17",
    progress: 75,
    rating: null,
    agent: "Mike Johnson",
  },
  {
    id: "PKG003",
    pickupAddress: "555 Broadway, New York, NY",
    deliveryAddress: "777 Park Ave, Bronx, NY",
    status: "picked-up",
    type: "fragile",
    paymentMode: "prepaid",
    amount: 35.0,
    createdAt: "2024-01-17",
    deliveredAt: null,
    estimatedDelivery: "2024-01-18",
    progress: 50,
    rating: null,
    agent: "Sarah Wilson",
  },
  {
    id: "PKG004",
    pickupAddress: "111 Wall St, New York, NY",
    deliveryAddress: "222 Central Park West, NY",
    status: "delivered",
    type: "electronics",
    paymentMode: "prepaid",
    amount: 65.0,
    createdAt: "2024-01-10",
    deliveredAt: "2024-01-11",
    estimatedDelivery: "2024-01-11",
    progress: 100,
    rating: 4,
    agent: "Tom Wilson",
  },
  {
    id: "PKG005",
    pickupAddress: "333 5th Ave, New York, NY",
    deliveryAddress: "444 Madison Ave, NY",
    status: "failed",
    type: "package",
    paymentMode: "cod",
    amount: 30.0,
    createdAt: "2024-01-12",
    deliveredAt: null,
    estimatedDelivery: "2024-01-13",
    progress: 90,
    rating: null,
    agent: "Lisa Brown",
  },
  {
    id: "PKG006",
    pickupAddress: "666 Lexington Ave, NY",
    deliveryAddress: "777 Park Ave, Bronx, NY",
    status: "delivered",
    type: "clothing",
    paymentMode: "prepaid",
    amount: 20.0,
    createdAt: "2024-01-08",
    deliveredAt: "2024-01-09",
    estimatedDelivery: "2024-01-09",
    progress: 100,
    rating: 5,
    agent: "David Lee",
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return <CheckCircle className="h-5 w-5 text-green-600" />
    case "in-transit":
      return <Clock className="h-5 w-5 text-blue-600" />
    case "picked-up":
      return <Package className="h-5 w-5 text-orange-600" />
    case "failed":
      return <AlertCircle className="h-5 w-5 text-red-600" />
    default:
      return <Package className="h-5 w-5 text-gray-600" />
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
    case "failed":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}


export default function CustomerHistory() {
  const [parcels, setParcels] = useState(mockHistoryData)
  const [filteredParcels, setFilteredParcels] = useState(mockHistoryData)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      setUser(JSON.parse(currentUser))
    }
  }, [])

  useEffect(() => {
    let filtered = parcels

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (parcel) =>
          parcel.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          parcel.pickupAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
          parcel.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((parcel) => parcel.status === statusFilter)
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date()
      const filterDate = new Date()

      switch (dateFilter) {
        case "week":
          filterDate.setDate(now.getDate() - 7)
          break
        case "month":
          filterDate.setMonth(now.getMonth() - 1)
          break
        case "3months":
          filterDate.setMonth(now.getMonth() - 3)
          break
      }

      filtered = filtered.filter((parcel) => new Date(parcel.createdAt) >= filterDate)
    }

    setFilteredParcels(filtered)
  }, [searchTerm, statusFilter, dateFilter, parcels])

  const stats = {
    total: parcels.length,
    delivered: parcels.filter((p) => p.status === "delivered").length,
    inTransit: parcels.filter((p) => p.status === "in-transit").length,
    failed: parcels.filter((p) => p.status === "failed").length,
    totalSpent: parcels.reduce((sum, p) => sum + p.amount, 0),
    avgRating: parcels.filter((p) => p.rating).reduce((sum, p, _, arr) => sum + (p.rating || 0) / arr.length, 0),
  }

  const exportData = () => {
    alert("Exporting parcel history...")
  }

  return (
      <div className="space-y-8 animate-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Parcel History 📋
            </h1>
            <p className="text-lg text-gray-600">View and manage all your past and current parcel bookings</p>
          </div>
          <Button onClick={exportData} variant="outline" className="bg-white hover:bg-gray-50 border-gray-300">
            <Download className="h-4 w-4 mr-2" />
            Export History
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total Parcels</CardTitle>
              <Package className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{stats.total}</div>
              <p className="text-xs text-blue-600 mt-1">All time</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Delivered</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">{stats.delivered}</div>
              <p className="text-xs text-green-600 mt-1">Successfully completed</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">In Transit</CardTitle>
              <Clock className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900">{stats.inTransit}</div>
              <p className="text-xs text-orange-600 mt-1">Currently active</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Failed</CardTitle>
              <AlertCircle className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-900">{stats.failed}</div>
              <p className="text-xs text-red-600 mt-1">Delivery issues</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Filter & Search</CardTitle>
            <CardDescription>Find specific parcels using filters and search</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Input
                  placeholder="Search by ID, address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="picked-up">Picked Up</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setDateFilter("all")
                }}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredParcels.length}</span> of{" "}
            <span className="font-semibold">{parcels.length}</span> parcels
          </p>
        </div>

        <div className="space-y-6">
          {filteredParcels.map((parcel) => (
            <Card
              key={parcel.id}
              className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-all duration-300 card-hover"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0 p-3 bg-gray-100 rounded-xl hover:bg-blue-100 transition-colors duration-300">
                      {getStatusIcon(parcel.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                        <div className="font-bold text-xl text-gray-900">{parcel.id}</div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-gray-100 text-gray-800 border-gray-200 text-xs px-2 py-1">
                            {parcel.type.toUpperCase()}
                          </Badge>
                          <Badge className={`${getStatusColor(parcel.status)} text-sm px-3 py-1`}>
                            {parcel.status.replace("-", " ").toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="text-sm text-gray-600">
                            <MapPin className="h-4 w-4 inline mr-1 text-green-600" />
                            <span className="font-medium">From:</span> {parcel.pickupAddress}
                          </div>
                          <div className="text-sm text-gray-600">
                            <MapPin className="h-4 w-4 inline mr-1 text-red-600" />
                            <span className="font-medium">To:</span> {parcel.deliveryAddress}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm text-gray-600">
                            <Calendar className="h-4 w-4 inline mr-1" />
                            <span className="font-medium">Created:</span> {parcel.createdAt}
                          </div>
                          {parcel.deliveredAt ? (
                            <div className="text-sm text-green-600">
                              <CheckCircle className="h-4 w-4 inline mr-1" />
                              <span className="font-medium">Delivered:</span> {parcel.deliveredAt}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-600">
                              <Clock className="h-4 w-4 inline mr-1" />
                              <span className="font-medium">Est. Delivery:</span> {parcel.estimatedDelivery}
                            </div>
                          )}
                        </div>
                      </div>

                      {parcel.status !== "delivered" && parcel.status !== "failed" && (
                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{parcel.progress}%</span>
                          </div>
                          <Progress value={parcel.progress} className="h-2" />
                        </div>
                      )}

                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Agent:</span> {parcel.agent}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900">${parcel.amount}</div>
                      <div className="text-sm text-gray-500 uppercase font-medium">{parcel.paymentMode}</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link href={`/customer/track/${parcel.id}`}>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </Link>
                      {parcel.status === "delivered" && !parcel.rating && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-yellow-300 text-yellow-700 hover:bg-yellow-50 w-full sm:w-auto"
                        >
                          Rate Service
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredParcels.length === 0 && (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100">
            <CardContent className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Parcels Found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "You haven't booked any parcels yet."}
              </p>
              {!searchTerm && statusFilter === "all" && dateFilter === "all" && (
                <Link href="/customer/book-parcel">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Package className="h-4 w-4 mr-2" />
                    Book Your First Parcel
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
  )
}

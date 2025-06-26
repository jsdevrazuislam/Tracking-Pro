"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, MapPin, Clock, CheckCircle, AlertCircle, Navigation, Phone } from "lucide-react"
import { AgentLayout } from "@/components/agent-layout"

// Mock assigned parcels
const mockAssignedParcels = [
  {
    id: "PKG002",
    pickupAddress: "789 Pine St, Manhattan, NY",
    deliveryAddress: "321 Elm St, Queens, NY",
    status: "assigned",
    priority: "high",
    customerPhone: "+1 (555) 123-4567",
    recipientPhone: "+1 (555) 987-6543",
    paymentMode: "cod",
    amount: 45.0,
    estimatedTime: "2 hours",
    distance: "12.5 km",
  },
  {
    id: "PKG003",
    pickupAddress: "555 Broadway, New York, NY",
    deliveryAddress: "777 Park Ave, Bronx, NY",
    status: "picked-up",
    priority: "medium",
    customerPhone: "+1 (555) 234-5678",
    recipientPhone: "+1 (555) 876-5432",
    paymentMode: "prepaid",
    amount: 35.0,
    estimatedTime: "1.5 hours",
    distance: "8.2 km",
  },
  {
    id: "PKG004",
    pickupAddress: "123 Wall St, New York, NY",
    deliveryAddress: "456 Central Park West, NY",
    status: "in-transit",
    priority: "low",
    customerPhone: "+1 (555) 345-6789",
    recipientPhone: "+1 (555) 765-4321",
    paymentMode: "prepaid",
    amount: 25.0,
    estimatedTime: "45 minutes",
    distance: "5.1 km",
  },
]

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

export default function AgentDashboard() {
  const [parcels, setParcels] = useState(mockAssignedParcels)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      setUser(JSON.parse(currentUser))
    }
  }, [])

  const updateParcelStatus = (parcelId: string, newStatus: string) => {
    setParcels((prev) => prev.map((parcel) => (parcel.id === parcelId ? { ...parcel, status: newStatus } : parcel)))
  }

  const stats = {
    assigned: parcels.filter((p) => p.status === "assigned").length,
    pickedUp: parcels.filter((p) => p.status === "picked-up").length,
    inTransit: parcels.filter((p) => p.status === "in-transit").length,
    delivered: parcels.filter((p) => p.status === "delivered").length,
  }

  return (
    <AgentLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="text-gray-600">Manage your assigned deliveries</p>
          </div>
          <Button>
            <Navigation className="h-4 w-4 mr-2" />
            Optimize Route
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.assigned}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Picked Up</CardTitle>
              <Package className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pickedUp}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Transit</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.inTransit}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
            </CardContent>
          </Card>
        </div>

        {/* Route Optimization Map */}
        <Card>
          <CardHeader>
            <CardTitle>Optimized Delivery Route</CardTitle>
            <CardDescription>Your planned route for today's deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center relative overflow-hidden">
              {/* Simulated map with route */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100"></div>
              <div className="absolute top-4 left-4 bg-white p-2 rounded shadow">
                <div className="text-xs font-medium">Optimized Route - 26.8 km</div>
                <div className="text-xs text-gray-600">Est. Time: 4 hours 15 minutes</div>
              </div>

              {/* Route points */}
              <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="absolute top-1/3 left-1/2 w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-orange-500 rounded-full"></div>
              <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-red-500 rounded-full"></div>

              {/* Route lines */}
              <svg className="absolute inset-0 w-full h-full">
                <path
                  d="M 25% 25% Q 50% 20% 50% 33% Q 60% 40% 66% 50% Q 70% 60% 75% 66%"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5,5"
                />
              </svg>

              <div className="text-center">
                <Navigation className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Route Optimized</p>
                <p className="text-xs text-gray-600">4 stops planned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assigned Parcels */}
        <Card>
          <CardHeader>
            <CardTitle>Assigned Parcels</CardTitle>
            <CardDescription>Parcels assigned to you for pickup and delivery</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {parcels.map((parcel) => (
                <div key={parcel.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(parcel.status)}
                      <div>
                        <div className="font-medium">{parcel.id}</div>
                        <div className="text-sm text-gray-600">
                          {parcel.distance} • {parcel.estimatedTime}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(parcel.priority)}>{parcel.priority.toUpperCase()}</Badge>
                      <Badge className={getStatusColor(parcel.status)}>
                        {parcel.status.replace("-", " ").toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-green-600 mb-1">Pickup Address</div>
                      <div className="text-sm text-gray-600 flex items-start">
                        <MapPin className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0" />
                        {parcel.pickupAddress}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        <Phone className="h-3 w-3 inline mr-1" />
                        {parcel.customerPhone}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-blue-600 mb-1">Delivery Address</div>
                      <div className="text-sm text-gray-600 flex items-start">
                        <MapPin className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0" />
                        {parcel.deliveryAddress}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        <Phone className="h-3 w-3 inline mr-1" />
                        {parcel.recipientPhone}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm">
                        <span className="text-gray-600">Payment:</span>
                        <span className="font-medium ml-1">
                          {parcel.paymentMode.toUpperCase()} - ${parcel.amount}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Select value={parcel.status} onValueChange={(value) => updateParcelStatus(parcel.id, value)}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="assigned">Assigned</SelectItem>
                          <SelectItem value="picked-up">Picked Up</SelectItem>
                          <SelectItem value="in-transit">In Transit</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="failed">Failed Delivery</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm">
                        <Navigation className="h-4 w-4 mr-1" />
                        Navigate
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AgentLayout>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, Clock, Search } from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"

// Mock unassigned parcels
const mockUnassignedParcels = [
  {
    id: "PKG005",
    customer: "Alice Johnson",
    pickupAddress: "123 Broadway, NYC",
    deliveryAddress: "456 5th Ave, NYC",
    priority: "high",
    weight: "2.5 kg",
    paymentMode: "cod",
    amount: 55.0,
    createdAt: "2024-01-17 11:30 AM",
  },
  {
    id: "PKG006",
    customer: "Bob Smith",
    pickupAddress: "789 Wall St, NYC",
    deliveryAddress: "321 Park Ave, NYC",
    priority: "medium",
    weight: "1.2 kg",
    paymentMode: "prepaid",
    amount: 35.0,
    createdAt: "2024-01-17 10:15 AM",
  },
  {
    id: "PKG007",
    customer: "Carol Davis",
    pickupAddress: "555 Madison Ave, NYC",
    deliveryAddress: "777 Lexington Ave, NYC",
    priority: "low",
    weight: "0.8 kg",
    paymentMode: "prepaid",
    amount: 25.0,
    createdAt: "2024-01-17 09:45 AM",
  },
]

// Mock available agents
const mockAgents = [
  {
    id: 1,
    name: "Mike Smith",
    currentLoad: 3,
    maxCapacity: 8,
    location: "Manhattan",
    status: "active",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    currentLoad: 2,
    maxCapacity: 6,
    location: "Brooklyn",
    status: "active",
  },
  {
    id: 3,
    name: "Tom Wilson",
    currentLoad: 0,
    maxCapacity: 10,
    location: "Queens",
    status: "active",
  },
]

export default function AssignParcels() {
  const [parcels, setParcels] = useState(mockUnassignedParcels)
  const [agents, setAgents] = useState(mockAgents)
  const [selectedParcels, setSelectedParcels] = useState<string[]>([])
  const [selectedAgent, setSelectedAgent] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const handleParcelSelect = (parcelId: string, checked: boolean) => {
    if (checked) {
      setSelectedParcels([...selectedParcels, parcelId])
    } else {
      setSelectedParcels(selectedParcels.filter((id) => id !== parcelId))
    }
  }

  const handleBulkAssign = () => {
    if (selectedParcels.length === 0 || !selectedAgent) {
      alert("Please select parcels and an agent")
      return
    }

    const agent = agents.find((a) => a.id.toString() === selectedAgent)
    if (!agent) return

    // Update agent's current load
    setAgents((prev) =>
      prev.map((a) =>
        a.id.toString() === selectedAgent ? { ...a, currentLoad: a.currentLoad + selectedParcels.length } : a,
      ),
    )

    // Remove assigned parcels from the list
    setParcels((prev) => prev.filter((p) => !selectedParcels.includes(p.id)))

    setSelectedParcels([])
    setSelectedAgent("")

    alert(`Successfully assigned ${selectedParcels.length} parcels to ${agent.name}`)
  }

  const filteredParcels = parcels.filter(
    (parcel) =>
      parcel.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.customer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Assign Parcels</h1>
          <p className="text-gray-600">Assign unassigned parcels to available delivery agents</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Unassigned Parcels */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Unassigned Parcels ({filteredParcels.length})</CardTitle>
                    <CardDescription>Select parcels to assign to agents</CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Search parcels..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredParcels.map((parcel) => (
                    <div key={parcel.id} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <Checkbox
                          checked={selectedParcels.includes(parcel.id)}
                          onCheckedChange={(checked) => handleParcelSelect(parcel.id, checked as boolean)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">{parcel.id}</div>
                            <div className="flex items-center space-x-2">
                              <Badge className={getPriorityColor(parcel.priority)}>
                                {parcel.priority.toUpperCase()}
                              </Badge>
                              <Badge variant="outline">{parcel.paymentMode.toUpperCase()}</Badge>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>Customer: {parcel.customer}</div>
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {parcel.pickupAddress} → {parcel.deliveryAddress}
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Weight: {parcel.weight}</span>
                              <span className="font-medium">${parcel.amount}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              Created: {parcel.createdAt}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Assignment Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Bulk Assignment</CardTitle>
                <CardDescription>Assign selected parcels to an agent</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-2">Selected Parcels</div>
                  <div className="text-2xl font-bold text-blue-600">{selectedParcels.length}</div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Assign to Agent</label>
                  <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id.toString()}>
                          {agent.name} ({agent.currentLoad}/{agent.maxCapacity})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleBulkAssign}
                  className="w-full"
                  disabled={selectedParcels.length === 0 || !selectedAgent}
                >
                  Assign {selectedParcels.length} Parcel{selectedParcels.length !== 1 ? "s" : ""}
                </Button>
              </CardContent>
            </Card>

            {/* Available Agents */}
            <Card>
              <CardHeader>
                <CardTitle>Available Agents</CardTitle>
                <CardDescription>Current agent capacity and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agents.map((agent) => (
                    <div key={agent.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{agent.name}</div>
                        <Badge className="bg-green-100 text-green-800">{agent.status.toUpperCase()}</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location</span>
                          <span>{agent.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Capacity</span>
                          <span>
                            {agent.currentLoad}/{agent.maxCapacity}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(agent.currentLoad / agent.maxCapacity) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

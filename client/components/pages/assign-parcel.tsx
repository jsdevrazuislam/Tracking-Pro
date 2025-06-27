"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, Clock, Search } from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"
import { useQuery } from "@tanstack/react-query"
import { unAssignParcels } from "@/lib/apis/admin"
import { format } from 'date-fns';
import { IndividualAssignmentModal } from "@/components/individual-assignment-modal"
import { TableSkeleton } from "@/components/loading-skeleton"
import { EmptyState } from "../empty-states"


export default function AssignParcels() {
  const [parcels, setParcels] = useState<ParcelsEntity[]>([])
  const [selectedParcels, setSelectedParcels] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const { isLoading, data } = useQuery({
    queryKey: ['unAssignParcels'],
    queryFn: () => unAssignParcels({ page: 1, limit: 10 })
  })

  const handleParcelSelect = (parcelId: string, checked: boolean) => {
    if (checked) {
      setSelectedParcels([...selectedParcels, parcelId])
    } else {
      setSelectedParcels(selectedParcels.filter((id) => id !== parcelId))
    }
  }

  const filteredParcels = parcels.filter(
    (parcel) =>
      parcel?.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel?.sender?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )




  useEffect(() => {
    setParcels(data?.data?.parcels ?? [])
  }, [data])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Assign Parcels</h1>
          <p className="text-gray-600">Assign unassigned parcels to available delivery agents</p>
        </div>
        <div className="w-full space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Unassigned Parcels ({filteredParcels.length})</CardTitle>
                  <CardDescription>Select parcels to assign to agents</CardDescription>
                </div>
                <div className="relative">
                  <Search className="h-4 w-4 absolute z-10 left-3 top-3 text-gray-400" />
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
                {isLoading ? <TableSkeleton rows={5} columns={5} /> : filteredParcels?.length > 0 ? filteredParcels?.map((parcel) => (
                  <div key={parcel.id} className="border rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      <Checkbox
                        checked={selectedParcels.includes(parcel.id)}
                        onCheckedChange={(checked) => handleParcelSelect(parcel.id, checked as boolean)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{parcel.tracking_code}</div>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>Customer: {parcel?.sender?.full_name}</div>
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {parcel?.pickup_address?.place_name} → {parcel?.receiver_address?.place_name}
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Weight: {parcel?.parcel_size} Kg</span>
                            <span className="font-medium">${parcel.amount}</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            Created: {format(new Date(parcel.createdAt), 'yyyy-MM-dd')}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t flex justify-end">
                      <IndividualAssignmentModal
                        parcel={parcel}
                      />
                    </div>
                  </div>
                )) : <EmptyState type='no-assignments' className=" shadow-none bg-transparent" actionHref="/admin/bookings" />}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

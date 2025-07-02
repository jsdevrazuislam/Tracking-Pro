"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, Clock, Search } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { unAssignParcels } from "@/lib/apis/admin"
import { format } from 'date-fns';
import { IndividualAssignmentModal } from "@/components/individual-assignment-modal"
import { TableSkeleton } from "@/components/loading-skeleton"
import { EmptyState } from "../empty-states"
import { useTranslation } from "@/hooks/use-translation"
import api from "@/lib/api"
import { saveAs } from 'file-saver'
import { toast } from "sonner"
import ApiStrings from "@/lib/api-strings"
import { Button } from "@/components/ui/button"



export default function AssignParcels() {
  const [parcels, setParcels] = useState<ParcelsEntity[]>([])
  const [selectedParcels, setSelectedParcels] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const { isLoading, data } = useQuery({
    queryKey: ['unAssignParcels'],
    queryFn: () => unAssignParcels({ page: 1, limit: 10 })
  })
  const { t } = useTranslation()

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

  const handlePrintLabel = async (parcelId:string) => {
    try {
      setLoading(true)
      const response = await api.get(`${ApiStrings.GENERATE_LABEL}/${parcelId}`, {
        responseType: 'blob',
      })
      const blob = new Blob([response.data], { type: "application/pdf" });
      saveAs(blob, `barcode_label.pdf`)
    } catch (error) {
      toast.error('Export failed. Please try again.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setParcels(data?.data?.parcels ?? [])
  }, [data])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('assignParcels')}</h1>
        <p className="text-gray-600">{t('parcelsForPickupDelivery')}</p>
      </div>
      <div className="w-full space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col-reverse gap-6 md:gap-0 md:flex-row md:justify-between md:items-center">
              <div>
                <CardTitle>{t('unassignedParcels')} ({filteredParcels.length})</CardTitle>
                <CardDescription>{t('selectParcelsToAssign')}</CardDescription>
              </div>
              <div className="relative">
                <Search className="h-4 w-4 absolute z-10 left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search parcels..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full md:w-64"
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
                        <div>{t('customer')}: {parcel?.sender?.full_name}</div>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {parcel?.pickup_address?.place_name} → {parcel?.receiver_address?.place_name}
                        </div>
                        <div className="flex items-center justify-between">
                          <span>{t("weight")}: {parcel?.parcel_size} {t('kg')}</span>
                          <span className="font-medium">${parcel.amount}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {t('created')}: {format(new Date(parcel.createdAt), 'yyyy-MM-dd')}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t flex gap-4 justify-end">
                    <Button size='sm' isLoading={isLoading} onClick={() => handlePrintLabel(parcel.id)}>
                      {t('printLabel')}
                    </Button>
                    <IndividualAssignmentModal
                      parcel={parcel}
                    />
                  </div>
                </div>
              )) : <EmptyState type='no-assignments' className="shadow-none bg-transparent" actionHref="/admin/bookings" />}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

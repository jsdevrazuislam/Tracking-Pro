"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, MapPin, Clock, CheckCircle, AlertCircle, Phone } from "lucide-react"
import { useAuthStore } from "@/store/store"
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query"
import { getAgentAssignedParcels, getAgentStats, updateStatus } from "@/lib/apis/parcel"
import { DashboardSkeleton } from "@/components/loading-skeleton"
import RouteOptimizerMap from "@/components/optimize-route-map"
import { toast } from "sonner"
import Pagination from "@/components/pagination"
import { useTranslation } from "@/hooks/use-translation"

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


export default function AgentDashboard() {
  const { user, currentLocation } = useAuthStore()
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { t } = useTranslation()
  const results = useQueries({
    queries: [
      {
        queryKey: ['getAgentStats'],
        queryFn: getAgentStats,
      },
      {
        queryKey: ['getAgentAssignedParcels'],
        queryFn: () => getAgentAssignedParcels({ page, limit })
      },
    ],
  });

  const [statsQuery, parcelsQuery] = results;
  const isLoading = statsQuery.isLoading || parcelsQuery.isLoading;
  const isError = statsQuery.isError || parcelsQuery.isError;
  const error = statsQuery.error || parcelsQuery.error;

  const stats = statsQuery?.data?.data;
  const parcels = parcelsQuery.data?.data?.parcels ?? [];
  const totalPages = parcelsQuery.data?.data?.pagination?.totalPages ?? 0
  const totalItems = parcelsQuery.data?.data?.pagination?.totalItems ?? 0
  const queryClient = useQueryClient()
  

  const { mutate } = useMutation({
    mutationFn: updateStatus,
    onError: (error) => [
      toast.error(error?.message)
    ]
  })

  const handleValue = (id: string, status: string) => {

    if(!currentLocation) return toast.error('Please enable your location permission')
    queryClient.setQueryData(['getAgentAssignedParcels'], (oldData: ParcelResponse) => {
      if (!oldData || !oldData.data || !oldData.data.parcels) {
        return oldData;
      }
      const updatedParcels = oldData.data.parcels.map((parcel) =>
        parcel.id === id
          ? { ...parcel, status }
          : parcel
      );

      return {
        ...oldData,
        data: {
          ...oldData.data,
          parcels: updatedParcels,
        },
      };
    });
    mutate({ id, status, current_location: currentLocation })
  }

  useEffect(() => {
    parcelsQuery.refetch();
  }, [page, limit]);

  if (isLoading) {
    return (
      <DashboardSkeleton />
    )
  }

  if (isError) {
    return (
      <div className="text-red-500">Error loading dashboard data: {error?.message}</div>
    );
  }


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('welcomeBack')}, {user?.full_name}!</h1>
        <p className="text-gray-600">{t('manageAssignedDeliveries')}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('assigned')}</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats?.assigned}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('pickedUp')}</CardTitle>
            <Package className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats?.picked}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("inTransit")}</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.in_transit}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('delivered')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.delivered}</div>
          </CardContent>
        </Card>
      </div>

      {/* Route Optimization Map */}
      <Card>
        <CardHeader>
          <CardTitle>{t('optimizedDeliveryRoute')}</CardTitle>
          <CardDescription>{t('plannedRouteToday')}</CardDescription>
        </CardHeader>
        <CardContent>
          <RouteOptimizerMap parcels={parcels} />
        </CardContent>
      </Card>

      {/* Assigned Parcels */}
      <Card>
        <CardHeader>
          <CardTitle>{t('assignedParcels')}</CardTitle>
          <CardDescription>{t('parcelsForPickupDelivery')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {parcels?.map((parcel) => (
              <div key={parcel.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(parcel.status)}
                    <div>
                      <div className="font-medium">{parcel.id}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(parcel.status)}>
                      {parcel.status.replace("-", " ").toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-green-600 mb-1">{t('pickupAddress')}</div>
                    <div className="text-sm text-gray-600 flex items-start">
                      <MapPin className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0" />
                      {parcel?.pickup_address?.place_name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      <Phone className="h-3 w-3 inline mr-1" />
                      {parcel?.sender?.phone}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-blue-600 mb-1">{t('deliveryAddress')}</div>
                    <div className="text-sm text-gray-600 flex items-start">
                      <MapPin className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0" />
                      {parcel?.receiver_address?.place_name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      <Phone className="h-3 w-3 inline mr-1" />
                      {parcel?.sender?.phone}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm">
                      <span className="text-gray-600">{t('payment')}:</span>
                      <span className="font-medium ml-1">
                        {parcel?.payment_type?.toUpperCase()} - ${parcel.amount}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select value={parcel.status} onValueChange={(value) => handleValue(parcel.id, value)}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem disabled value="assigned">Assigned</SelectItem>
                        <SelectItem value="picked">Picked Up</SelectItem>
                        <SelectItem value="in_transit">In Transit</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Failed Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
            {
              parcels.length > 0 &&
              <Pagination
                currentPage={page}
                totalItems={totalItems}
                totalPages={totalPages}
                onPageChange={(value) => setPage(value)}
                onLimitChange={(value) => setLimit(value)}
              />
            }
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

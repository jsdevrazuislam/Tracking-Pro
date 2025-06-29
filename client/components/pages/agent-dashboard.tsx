"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { useAuthStore } from "@/store/store"
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query"
import { getAgentAssignedParcels, getAgentStats, updateStatus } from "@/lib/apis/parcel"
import { DashboardSkeleton } from "@/components/loading-skeleton"
import RouteOptimizerMap from "@/components/optimize-route-map"
import { toast } from "sonner"
import Pagination from "@/components/pagination"
import { useTranslation } from "@/hooks/use-translation"
import { EmptyState } from "@/components/empty-states"
import AgentParcelCard from "../agent-parcel-card"



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

    if (!currentLocation) return toast.error('Please enable your location permission')
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
            {parcels?.length > 0 ? parcels?.map((parcel) => (
              <AgentParcelCard parcel={parcel} handleValue={handleValue} />
            )) : <EmptyState type="no-deliveries" className="shadow-none bg-transparent" />}
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

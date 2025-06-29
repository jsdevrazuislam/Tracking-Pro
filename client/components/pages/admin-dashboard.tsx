"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Package,
  Users,
  Truck,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Download,
  Activity,
  Clock,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { adminStats } from "@/lib/apis/admin"
import api from "@/lib/api"
import ApiStrings from "@/lib/api-strings"
import { saveAs } from 'file-saver'
import { toast } from "sonner"
import { DashboardSkeleton } from "@/components/loading-skeleton"
import { useTranslation } from "@/hooks/use-translation"


export default function AdminDashboard() {
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

  const { isPending, data } = useQuery({
    queryKey: ['adminStats'],
    queryFn: adminStats
  })

  const dashboardData = data?.data?.stats
  const exportReport = async (type: 'csv' | 'pdf') => {
    try {
      setLoading(true)
      const response = await api.get(ApiStrings.REPORT_EXPORT, {
        params: { format: type },
        responseType: 'blob', 
      })
      const blob = new Blob([response.data], { type: type === "csv" ? "text/csv" : "application/pdf" });
      saveAs(blob, `report.${type.toLowerCase()}`)
    } catch (error) {
      toast.error('Export failed. Please try again.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if(isPending) return <DashboardSkeleton />

  return (
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {t('adminDashboard')}
            </h1>
            <p className="text-lg text-gray-600">{t('overviewCourierOperations')}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" isLoading={loading} onClick={() => exportReport("csv")} className="bg-white hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" isLoading={loading} onClick={() => exportReport("pdf")} className="bg-white hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">{t('dailyBookings')}</CardTitle>
              <Package className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{dashboardData?.dailyBookings}</div>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {t('dailyBookingsIncrease')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">{t('activeAgents')}</CardTitle>
              <Truck className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">{dashboardData?.activeAgents}</div>
              <p className="text-xs text-green-600 mt-1">
                 {t('onlineNow')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">{t('codAmount')}</CardTitle>
              <DollarSign className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">
                ${dashboardData?.codAmount.toLocaleString()}
              </div>
              <p className="text-xs text-purple-600 mt-1">{t('pendingCollection')}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">{t('failedDeliveries')}</CardTitle>
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-900">{dashboardData?.failedDeliveries}</div>
              <p className="text-xs text-red-600 mt-1">{t('requiresAttention')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-600" />
                {t('todayPerformance')}
              </CardTitle>
              <CardDescription>{t('realtimeDeliveryMetrics')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold text-green-900">{dashboardData?.deliveredToday}</div>
                  <div className="text-sm text-green-600">{t('delivered')}</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-900">{dashboardData?.transitToday}</div>
                  <div className="text-sm text-blue-600">{t('inTransit')}</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <Package className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <div className="text-2xl font-bold text-orange-900">{dashboardData?.pendingToday}</div>
                  <div className="text-sm text-orange-600">{t('pending')}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{t('deliverySuccessRate')}</span>
                  <span className="text-sm font-bold text-green-600">94.2%</span>
                </div>
                <Progress value={94.2} className="h-3" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <CardTitle className="text-xl font-bold">{t('revenueOverview')}</CardTitle>
              <CardDescription>{t('financialPerformanceMetrics')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('today')}</span>
                  <span className="font-bold text-lg">${dashboardData?.todayRevenue}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('thisMonth')}</span>
                  <span className="font-bold text-lg">${dashboardData?.revenueThisMonth?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('growthRate')}</span>
                  <span className="font-bold text-lg text-green-600">+{dashboardData?.growthRate}%</span>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <Link href="/admin/assign-parcels">
                  <Button variant="outline" className="w-full justify-start hover:bg-blue-50 mb-2">
                    <Package className="h-4 w-4 mr-2" />
                    {t('assignParcels')}
                  </Button>
                </Link>
                <Link href="/admin/manage-users">
                  <Button variant="outline" className="w-full justify-start hover:bg-green-50">
                    <Users className="h-4 w-4 mr-2" />
                    {t('manageUsers')}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
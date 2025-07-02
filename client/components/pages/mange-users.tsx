"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Search, Edit, Trash2, Mail } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { changeUserStatus, getAllUsers } from "@/lib/apis/admin"
import { format } from "date-fns"
import { DashboardSkeleton } from "@/components/loading-skeleton"
import { toast } from "sonner"
import { useTranslation } from "@/hooks/use-translation"
import { EmptyState } from "@/components/empty-states"


export default function ManageUsers() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const { isLoading, data } = useQuery({
    queryKey: ['getAllUsers'],
    queryFn: () => getAllUsers({ page: 1, limit: 10 })
  })

  const users = data?.data?.users ?? []

  const { isPending, mutate } = useMutation({
    mutationFn: changeUserStatus,
    onSuccess: (_, userId) => {
      queryClient.setQueryData<UsersResponse>(['getAllUsers'], (oldData) => {
        if (!oldData || !oldData.data || !oldData.data.users) {
          return oldData;
        }
        const updatedUsers = oldData.data.users.map((user) =>
          user.id === userId
            ? { ...user, status: user.status === "active" ? "deactivated" : "active" }
            : user
        );

        return {
          ...oldData,
          data: {
            ...oldData.data,
            users: updatedUsers,
          },
        };
      });

    },
    onError: (error) => {
      toast.error(error?.message)
    }
  })

  const { isPending: isDeleting, mutate: muFunc } = useMutation({
    mutationFn: changeUserStatus,
    onSuccess: (_, userId) => {
      queryClient.setQueryData<UsersResponse>(['getAllUsers'], (oldData) => {
        if (!oldData || !oldData.data || !oldData.data.users) {
          return oldData;
        }
        const updatedUsers = oldData.data.users?.filter((u) => u.id !== userId)

        return {
          ...oldData,
          data: {
            ...oldData.data,
            users: updatedUsers,
          },
        };
      });

    },
    onError: (error) => {
      toast.error(error?.message)
    }
  })


  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const toggleUserStatus = (userId: string) => {
    mutate(userId)
  }

  const deleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      muFunc(userId)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800"
      case "agent":
        return "bg-blue-100 text-blue-800"
      case "customer":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  const stats = {
    total: users.length,
    customers: users.filter((u) => u.role === "customer").length,
    agents: users.filter((u) => u.role === "agent").length,
    active: users.filter((u) => u.status === "active").length,
  }

  if (isLoading) return (
    <DashboardSkeleton />
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('manageUsers')}</h1>
          <p className="text-gray-600">{t('manageUsersAccountsPermissions')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalUsers')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('customers')}</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.customers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('agents')}</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.agents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('activeUsers')}</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.active}</div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col-reverse md:flex-row justify-between items-center">
            <div>
              <CardTitle>{t('allUsers')}</CardTitle>
              <CardDescription>{t('manageUserAccounts')}</CardDescription>
            </div>
            <div className="flex flex-col md:flex-row mb-4 md:mb-0 w-full md:w-fit gap-2 space-x-2">
              <div className="relative">
                <Search className="h-4 w-4 z-10 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers?.length > 0 ? (
              filteredUsers?.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4 sm:gap-0"
                >
                  <div className="flex items-start space-x-4 w-full sm:w-auto">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{user?.full_name}</div>
                      <div className="text-sm text-gray-600 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
                        <span className="flex items-center">
                          <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Joined: {format(new Date(user.createdAt), 'yyyy-MM-dd')}
                        {user.role === "customer" && ` • ${user?.totalOrders} orders`}
                        {user.role === "agent" && ` • ${user?.completedDeliveries} deliveries`}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col xs:flex-row items-start xs:items-center space-y-2 xs:space-y-0 xs:space-x-3 w-full sm:w-auto">
                    <div className="flex space-x-2">
                      <Badge className={getRoleColor(user.role)}>{user.role.toUpperCase()}</Badge>
                      <Badge className={getStatusColor(user.status)}>{user.status.toUpperCase()}</Badge>
                    </div>
                    <div className="flex space-x-2 self-stretch">
                      <Button
                        isLoading={isPending}
                        variant="outline"
                        size="sm"
                        onClick={() => toggleUserStatus(user.id)}
                        className="flex-1 xs:flex-none"
                      >
                        {user.status === "active" ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-700 flex-1 xs:flex-none"
                        isLoading={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState type="no-users" className="shadow-none bg-transparent" />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

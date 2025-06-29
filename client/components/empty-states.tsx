"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"
import { Package, Search, History, Users, Truck, BarChart3, MapPin, RefreshCw, AlertCircle, CheckCircle, Settings, Bell} from 'lucide-react'
import Link from "next/link"
import { useRouter } from "next/navigation"

interface EmptyStateProps {
  type: string
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  showSecondaryAction?: boolean
  secondaryActionLabel?: string
  onSecondaryAction?: () => void
  className?: string
}

export function EmptyState({
  type,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  showSecondaryAction = false,
  secondaryActionLabel,
  onSecondaryAction,
  className = "",
}: EmptyStateProps) {

  const { t } = useTranslation()

  const getEmptyStateConfig = (type: string) => {
    switch (type) {
      case "no-parcels":
        return {
          icon: Package,
          title: title || t('noParcelsFound'),
          description: description ||t('bookYourFirstParcel'),
          actionLabel: actionLabel || t('bookNewParcel'),
          actionHref: actionHref || "/customer/book-parcel",
          gradient: "from-blue-50 to-purple-50",
          iconColor: "text-blue-500",
          iconBg: "bg-blue-100",
        }

      case "no-search-results":
        return {
          icon: Search,
          title: title || "No Results Found",
          description:
            description || "We couldn't find any parcels matching your search criteria. Try adjusting your filters.",
          actionLabel: actionLabel || "Clear Filters",
          gradient: "from-gray-50 to-gray-100",
          iconColor: "text-gray-500",
          iconBg: "bg-gray-100",
        }

      case "no-history":
        return {
          icon: History,
          title: title || "No Delivery History",
          description:
            description || "Your delivery history is empty. Once you book and complete deliveries, they'll appear here.",
          actionLabel: actionLabel || "Book First Parcel",
          actionHref: actionHref || "/customer/book-parcel",
          gradient: "from-purple-50 to-pink-50",
          iconColor: "text-purple-500",
          iconBg: "bg-purple-100",
        }

      case "no-tracking":
        return {
          icon: MapPin,
          title: title || "Tracking ID Not Found",
          description:
            description ||
            "We couldn't find any parcel with this tracking ID. Please check your ID and try again.",
          actionLabel: actionLabel || "Try Again",
          gradient: "from-red-50 to-orange-50",
          iconColor: "text-red-500",
          iconBg: "bg-red-100",
        }

      case "no-users":
        return {
          icon: Users,
          title: title || "No Users Found",
          description: description || "No users match your current filters. Try adjusting your search criteria.",
          actionLabel: actionLabel || "Add New User",
          gradient: "from-green-50 to-teal-50",
          iconColor: "text-green-500",
          iconBg: "bg-green-100",
        }

      case "no-agents":
        return {
          icon: Truck,
          title: title || "No Delivery Agents",
          description:
            description || "No delivery agents are currently available. Please add agents to start assigning parcels.",
          actionLabel: actionLabel || "Add Agent",
          gradient: "from-blue-50 to-cyan-50",
          iconColor: "text-blue-500",
          iconBg: "bg-blue-100",
        }

      case "no-assignments":
        return {
          icon: Package,
          title: title || t('noUnassignedParcels'),
          description:
            description || t('allParcelsAssigned'),
          actionLabel: actionLabel || t('viewAllParcels'),
          gradient: "from-green-50 to-emerald-50",
          iconColor: "text-green-500",
          iconBg: "bg-green-100",
        }

      case "no-analytics":
        return {
          icon: BarChart3,
          title: title || "No Data Available",
          description:
            description || "There's no data to display analytics yet. Start booking parcels to see insights here.",
          actionLabel: actionLabel || "View Dashboard",
          actionHref: actionHref || "/admin/dashboard",
          gradient: "from-indigo-50 to-purple-50",
          iconColor: "text-indigo-500",
          iconBg: "bg-indigo-100",
        }

      case "no-deliveries":
        return {
          icon: Truck,
          title: title || t('noAssignedDeliveries'),
          description:
            description || t('checkBackOrContactSupervisor'),
          actionLabel: actionLabel || t('refresh'),
          gradient: "from-orange-50 to-yellow-50",
          iconColor: "text-orange-500",
          iconBg: "bg-orange-100",
        }

      case "no-notifications":
        return {
          icon: Bell,
          title: title || "No Notifications",
          description: description || "You're all caught up! No new notifications at the moment.",
          actionLabel: actionLabel || "Go to Dashboard",
          gradient: "from-teal-50 to-cyan-50",
          iconColor: "text-teal-500",
          iconBg: "bg-teal-100",
        }

      case "error-state":
        return {
          icon: AlertCircle,
          title: title || "Something Went Wrong",
          description:
            description || "We encountered an error while loading your data. Please try again or contact support.",
          actionLabel: actionLabel || "Try Again",
          gradient: "from-red-50 to-pink-50",
          iconColor: "text-red-500",
          iconBg: "bg-red-100",
        }

      case "loading-state":
        return {
          icon: RefreshCw,
          title: title || "Loading...",
          description: description || "Please wait while we fetch your data.",
          actionLabel: actionLabel || "",
          gradient: "from-blue-50 to-indigo-50",
          iconColor: "text-blue-500",
          iconBg: "bg-blue-100",
        }

      case "success-state":
        return {
          icon: CheckCircle,
          title: title || "All Done!",
          description: description || "Everything is up to date and working perfectly.",
          actionLabel: actionLabel || "Continue",
          gradient: "from-green-50 to-emerald-50",
          iconColor: "text-green-500",
          iconBg: "bg-green-100",
        }

      case "maintenance":
        return {
          icon: Settings,
          title: title || "Under Maintenance",
          description:
            description || "This feature is currently under maintenance. We'll be back shortly with improvements!",
          actionLabel: actionLabel || "Go Back",
          gradient: "from-yellow-50 to-orange-50",
          iconColor: "text-yellow-500",
          iconBg: "bg-yellow-100",
        }

      default:
        return {
          icon: Package,
          title: title || "Nothing Here Yet",
          description: description || "This section is empty. Start by adding some content!",
          actionLabel: actionLabel || "Get Started",
          gradient: "from-gray-50 to-gray-100",
          iconColor: "text-gray-500",
          iconBg: "bg-gray-100",
        }
    }
  }

  const config = getEmptyStateConfig(type)
  const IconComponent = config.icon

  return (
    <Card className={`border-0 shadow-lg bg-gradient-to-br ${config.gradient} ${className}`}>
      <CardContent className="text-center py-16 px-8">
        <div className="max-w-md mx-auto space-y-6">
          {/* Animated Icon */}
          <div className="relative">
            <div
              className={`w-24 h-24 ${config.iconBg} rounded-full flex items-center justify-center mx-auto mb-6 animate-in`}
            >
              <IconComponent className={`h-12 w-12 ${config.iconColor}`} />
            </div>
            {type === "loading-state" && (
              <div className="absolute inset-0 w-24 h-24 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-gray-900">{config.title}</h3>
            <p className="text-gray-600 leading-relaxed">{config.description}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            {config.actionLabel && (
              <>
                {actionHref ? (
                  <Link href={actionHref}>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg">
                      {config.actionLabel}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    onClick={onAction}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg"
                  >
                    {config.actionLabel}
                  </Button>
                )}
              </>
            )}

            {showSecondaryAction && secondaryActionLabel && (
              <Button
                variant="outline"
                onClick={onSecondaryAction}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-xl font-medium transition-all duration-300"
              >
                {secondaryActionLabel}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function NoParcelEmptyState({ className }: { className?: string }) {
  
  const router = useRouter()

  return (
    <EmptyState
      type="no-parcels"
      className={className}
      showSecondaryAction={true}
      actionHref="/customer/book-parcel"
      secondaryActionLabel="Track Existing"
      onSecondaryAction={() => router.push('/track')}
    />
  )
}

export function NoSearchResultsEmptyState({
  searchTerm,
  onClearFilters,
  className,
}: {
  searchTerm?: string
  onClearFilters?: () => void
  className?: string
}) {
  return (
    <EmptyState
      type="no-search-results"
      description={
        searchTerm
          ? `No results found for "${searchTerm}". Try different keywords or clear your filters.`
          : "No results match your current filters. Try adjusting your search criteria."
      }
      onAction={onClearFilters}
      className={className}
      showSecondaryAction={true}
      secondaryActionLabel="Contact Support"
      onSecondaryAction={() => alert("Contact support feature coming soon!")}
    />
  )
}

export function NoTrackingEmptyState({
  trackingId,
  onTryAgain,
  className,
}: {
  trackingId?: string
  onTryAgain?: () => void
  className?: string
}) {
  return (
    <EmptyState
      type="no-tracking"
      title="Tracking ID Not Found"
      description={
        trackingId
          ? `We couldn't find any parcel with tracking ID "${trackingId}". Please verify the ID and try again.`
          : "Please enter a valid tracking ID to track your parcel."
      }
      actionLabel="Try Again"
      onAction={onTryAgain}
      className={className}
      showSecondaryAction={true}
      secondaryActionLabel="Contact Support"
      onSecondaryAction={() => alert("Contact support: +1 (555) 123-4567")}
    />
  )
}

export function NoDeliveriesEmptyState({ className }: { className?: string }) {
  return (
    <EmptyState
      type="no-deliveries"
      title="No Deliveries Assigned"
      description="You don't have any deliveries assigned at the moment. New assignments will appear here when available."
      actionLabel="Refresh"
      onAction={() => window.location.reload()}
      className={className}
      showSecondaryAction={true}
      secondaryActionLabel="View Profile"
      onSecondaryAction={() => (window.location.href = "/agent/profile")}
    />
  )
}

export function NoUsersEmptyState({ onAddUser, className }: { onAddUser?: () => void; className?: string }) {
  return (
    <EmptyState
      type="no-users"
      title="No Users Found"
      description="No users match your current search criteria. Try adjusting your filters or add a new user."
      actionLabel="Add New User"
      onAction={onAddUser}
      className={className}
      showSecondaryAction={true}
      secondaryActionLabel="Clear Filters"
      onSecondaryAction={() => window.location.reload()}
    />
  )
}

export function NoAssignmentsEmptyState({ className }: { className?: string }) {
  return (
    <EmptyState
      type="no-assignments"
      title="All Parcels Assigned! 🎉"
      description="Excellent work! All parcels have been assigned to delivery agents. The system is running smoothly."
      actionLabel="View Dashboard"
      actionHref="/admin/dashboard"
      className={className}
      showSecondaryAction={true}
      secondaryActionLabel="View All Parcels"
      onSecondaryAction={() => alert("Redirecting to all parcels view...")}
    />
  )
}

export function LoadingEmptyState({ message, className }: { message?: string; className?: string }) {
  return (
    <EmptyState
      type="loading-state"
      title="Loading..."
      description={message || "Please wait while we fetch your data."}
      className={className}
    />
  )
}

export function ErrorEmptyState({
  title,
  message,
  onRetry,
  className,
}: {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}) {
  return (
    <EmptyState
      type="error-state"
      title={title || "Oops! Something went wrong"}
      description={message || "We encountered an error while loading your data. Please try again."}
      actionLabel="Try Again"
      onAction={onRetry}
      className={className}
      showSecondaryAction={true}
      secondaryActionLabel="Contact Support"
      onSecondaryAction={() => alert("Support: support@couriertrack.com")}
    />
  )
}

// Animated illustrations for empty states
export function EmptyStateIllustration({ type }: { type: string }) {
  const getIllustration = (type: string) => {
    switch (type) {
      case "no-parcels":
        return (
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 bg-blue-100 rounded-2xl transform rotate-6 animate-pulse"></div>
            <div className="absolute inset-0 bg-blue-200 rounded-2xl transform -rotate-3 animate-pulse delay-75"></div>
            <div className="relative bg-blue-300 rounded-2xl h-full flex items-center justify-center">
              <Package className="h-16 w-16 text-blue-600" />
            </div>
          </div>
        )

      case "no-tracking":
        return (
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 bg-red-100 rounded-full animate-ping"></div>
            <div className="relative bg-red-200 rounded-full h-full flex items-center justify-center">
              <Search className="h-16 w-16 text-red-600" />
            </div>
          </div>
        )

      case "success":
        return (
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse"></div>
            <div className="relative bg-green-200 rounded-full h-full flex items-center justify-center">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>
        )

      default:
        return (
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 bg-gray-100 rounded-2xl transform rotate-12 animate-pulse"></div>
            <div className="relative bg-gray-200 rounded-2xl h-full flex items-center justify-center">
              <Package className="h-16 w-16 text-gray-600" />
            </div>
          </div>
        )
    }
  }

  return <div className="animate-in">{getIllustration(type)}</div>
}

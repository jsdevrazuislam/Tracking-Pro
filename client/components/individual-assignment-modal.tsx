"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, User, MapPin, Package } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { assignParcel, getActiveAgents } from "@/lib/apis/admin"
import { toast } from "sonner"
import { TableSkeleton } from "@/components/loading-skeleton"
import { useTranslation } from "@/hooks/use-translation"


interface IndividualAssignmentModalProps {
    parcel: ParcelsEntity
}

export function IndividualAssignmentModal({ parcel }: IndividualAssignmentModalProps) {
    const [selectedAgent, setSelectedAgent] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const queryClient = useQueryClient()
    const { t } = useTranslation()
    const { isLoading, data } = useQuery({
        queryKey: ['getActiveAgents'],
        queryFn: () => getActiveAgents({ page: 1, limit: 10 })
    })

    const { mutate, isPending } = useMutation({
        mutationFn: assignParcel,
        onSuccess: (_, variable) => {
            queryClient.setQueryData(['unAssignParcels'], (oldData: ParcelResponse | undefined) => {
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    data: {
                        ...oldData.data,
                        parcels: oldData?.data?.parcels?.filter((p) => p.id !== variable.parcelId),
                    },
                };
            });

            toast.success(`Successfully assigned parcel`)
            setSelectedAgent("")
            setSearchTerm("")
            setIsOpen(false)
        },
        onError: (error) => {
            toast.error(error?.message)
        }
    })

    const agents = data?.data?.agents ?? []

    const availableAgents = agents?.filter((agent) => agent.full_name.toLowerCase().includes(searchTerm.toLowerCase()))

    const handleAssign = () => {
        if (selectedAgent) {
            mutate({
                parcelId: parcel.id,
                agentId: selectedAgent
            })
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

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger className=" cursor-pointer" asChild>
                <Button size="sm" variant="outline" className="text-xs">
                    {t('quickAssign')}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto ">
                <DialogHeader>
                    <DialogTitle>{t('assignParcelToAgent')}</DialogTitle>
                    <DialogDescription>{t('selectAvailableAgent')}</DialogDescription>
                </DialogHeader>

                <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-lg">{parcel?.tracking_code}</div>
                        <Badge className={getPriorityColor(parcel?.status)}>{parcel?.status?.toUpperCase()}</Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                        <div>{t('customer')}: {parcel?.sender?.full_name}</div>
                        <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {parcel?.pickup_address?.place_name} → {parcel?.receiver_address?.place_name}
                        </div>
                        <div className="flex justify-between">
                            <span>{t('weight')}: {parcel?.parcel_size} {t('kg')}</span>
                            <span className="font-medium">${parcel?.amount}</span>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <Search className="h-4 w-4 z-10 absolute left-3 top-3 text-gray-400" />
                    <Input
                        placeholder="Search agents by name or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                    {isLoading ? <TableSkeleton rows={5} columns={5} /> : availableAgents.map((agent) => (
                        <div
                            key={agent.id}
                            className={`border rounded-lg p-3 cursor-pointer transition-all ${selectedAgent === agent.id.toString()
                                ? "border-blue-500 bg-blue-50"
                                : "hover:border-gray-300 hover:bg-gray-50"
                                }`}
                            onClick={() => setSelectedAgent(agent.id.toString())}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <div className="font-medium">{agent?.full_name}</div>
                                    <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="text-gray-600">{t('email')}</div>
                                    <div className="font-medium">
                                        {agent?.email}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-600">{t('phone')}</div>
                                    <div className="font-medium">
                                        {agent?.phone}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-600">{t('successfullyCompleted')}</div>
                                    <div className="font-medium">{agent?.completedDeliveries}</div>
                                </div>
                            </div>
                        </div>
                    )
                    )}
                </div>

                {availableAgents.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <div className="text-sm">No available agents found</div>
                        <div className="text-xs text-gray-400">Try adjusting your search criteria</div>
                    </div>
                )}

                <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button isLoading={isPending} variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button isLoading={isPending} onClick={handleAssign} disabled={!selectedAgent} className="min-w-24">
                        Assign Parcel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

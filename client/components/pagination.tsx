'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useMemo } from "react"

interface PaginationProps {
    currentPage: number
    totalPages: number
    totalItems: number
    limit?: number
    onLimitChange?: (limit: number) => void
    onPageChange: (page: number) => void
}

export default function Pagination({
    currentPage,
    totalPages,
    totalItems,
    limit = 10,
    onLimitChange,
    onPageChange,
}: PaginationProps) {
    const pages = useMemo(() => {
        const range = []
        for (let i = 1; i <= totalPages; i++) {
            range.push(i)
        }
        return range
    }, [totalPages])

    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
            <div className="text-sm text-gray-600 flex items-center gap-4">
                <span>
                    Showing <strong>{(currentPage - 1) * limit + 1}</strong> to{" "}
                    <strong>
                        {Math.min(currentPage * limit, totalItems)}
                    </strong>{" "}
                    of <strong>{totalItems}</strong> items
                </span>

                {onLimitChange && (
                    <div className="flex items-center gap-2">
                        <span>Per page:</span>
                        <Select value={String(limit)} onValueChange={(val) => onLimitChange(Number(val))}>
                            <SelectTrigger className="w-[80px] h-8">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[5, 10, 20, 50].map((num) => (
                                    <SelectItem key={num} value={String(num)}>
                                        {num}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {pages.map((page) => (
                    <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </Button>
                ))}

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

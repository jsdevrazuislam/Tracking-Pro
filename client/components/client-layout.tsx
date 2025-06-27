"use client"

import type React from "react"
import { GlobalLoader } from "@/components/global-loader"
import { useState, useEffect } from "react"


export default function ClientLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    if (isLoading) {
        return <GlobalLoader isLoading={isLoading} />
    }

    return children
}

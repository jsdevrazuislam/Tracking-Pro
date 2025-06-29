"use client"

import type React from "react"
import { GlobalLoader } from "@/components/global-loader"
import { useState, useEffect } from "react"
import { useSocketStore } from "@/store/socket-store"


export default function ClientLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isLoading, setIsLoading] = useState(true)
    const { initializeSocket, disconnectSocket } = useSocketStore();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        initializeSocket();
        return () => {
            disconnectSocket();
        };
    }, []);;

    if (isLoading) {
        return <GlobalLoader isLoading={isLoading} />
    }

    return children
}

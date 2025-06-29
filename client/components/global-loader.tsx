"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Package, Truck, Shield } from "lucide-react"

interface GlobalLoaderProps {
  isLoading?: boolean
  message?: string
}

export function GlobalLoader({ isLoading = true, message = "Loading..." }: GlobalLoaderProps) {
  const [progress, setProgress] = useState(0)
  const [currentMessage, setCurrentMessage] = useState(message)

  const loadingMessages = [
    "Initializing CourierTrack Pro...",
    "Loading your dashboard...",
    "Fetching latest data...",
    "Almost ready...",
  ]

  useEffect(() => {
    if (!isLoading) return

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        return prev + Math.random() * 15
      })
    }, 100)

    const messageInterval = setInterval(() => {
      setCurrentMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)])
    }, 500)

    return () => {
      clearInterval(progressInterval)
      clearInterval(messageInterval)
    }
  }, [isLoading])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-8 grid-rows-6 h-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="border border-gray-200"></div>
          ))}
        </div>
      </div>

      <div className="relative text-center space-y-8 max-w-md mx-auto px-6">
        {/* Logo Animation */}
        <div className="relative">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="relative">
              <div className="p-4 bg-blue-600 rounded-2xl animate-pulse">
                <Package className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                <Truck className="h-3 w-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CourierTrack Pro</h1>
              <p className="text-sm text-gray-600">Logistics Management System</p>
            </div>
          </div>

          {/* Animated Icons */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className="animate-bounce delay-0">
              <Package className="h-6 w-6 text-blue-500" />
            </div>
            <div className="animate-bounce delay-150">
              <Truck className="h-6 w-6 text-green-500" />
            </div>
            <div className="animate-bounce delay-300">
              <Shield className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-600">{Math.min(Math.round(progress), 100)}%</div>
        </div>

        {/* Loading Message */}
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900 animate-pulse">{currentMessage}</p>
          <p className="text-sm text-gray-500">Please wait while we prepare everything for you</p>
        </div>

        {/* Floating Dots */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  )
}
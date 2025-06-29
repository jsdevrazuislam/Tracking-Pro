'use client'

import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Camera, CheckCircle2, RotateCw, AlertTriangle, Package, PackageCheck } from 'lucide-react'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { updateStatus } from '@/lib/apis/parcel'
import { useAuthStore } from '@/store/store'
import { useTranslation } from '@/hooks/use-translation'

export default function ScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { currentLocation } = useAuthStore()
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [scannedData, setScannedData] = useState<string | null>(null)
  const [scanning, setScanning] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<'pickup' | 'delivery'>('pickup')
  const beepAudio = useRef<HTMLAudioElement>(new Audio('/sounds/beep.mp3'))
  const { t } = useTranslation()
  
  const { mutate } = useMutation({
    mutationFn: updateStatus,
    onError: (error) => {
      toast.error(error?.message)
    },
    onSuccess: () => {
      toast.success(
        activeTab === 'pickup' 
          ? 'Pickup confirmed successfully!' 
          : 'Delivery confirmed successfully!'
      )
      handleReset()
    }
  })

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader()

    const startScanner = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          toast.error('Camera not supported on this device/browser')
          return
        }
        
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        })
        setHasPermission(true)

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }

        codeReader.decodeFromVideoDevice(undefined, videoRef.current!, (result, error) => {
          if (result) {
            beepAudio.current.play()
            setScannedData(result.getText())
            setScanning(false)
            const stream = videoRef.current?.srcObject as MediaStream
            stream?.getTracks().forEach((track) => track.stop())
          }
        })
      } catch (err) {
        console.error('Camera error:', err)
        setHasPermission(false)
      }
    }

    if (scanning) startScanner()

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [scanning])

  const handleReset = () => {
    setScannedData(null)
    setScanning(true)
  }

  const handleStatus = (id: string) => {
    if (!currentLocation) {
      toast.error('Please enable your location permission')
      return
    }
    mutate({ 
      id, 
      status: activeTab === 'pickup' ? 'picked' : 'delivered',
      current_location: currentLocation 
    })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md shadow-lg border border-gray-200 dark:border-gray-700">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[18px] md:text-2xl flex items-center gap-2 text-primary">
              <Camera className="w-5 h-5" />
              {t('parcelScanner')}
            </CardTitle>
            <Badge variant="outline" className="text-[12px] md:text-sm">
              {activeTab === 'pickup' ? t('pickupMode') : t('deliveryMode')}
            </Badge>
          </div>
          <CardDescription>
            {activeTab === 'pickup' 
              ? t('scanBarcodeConfirmPickup')
              : t('scanBarcodeConfirmDelivery')}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Permission denied state */}
          {hasPermission === false && (
            <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center rounded-lg bg-gray-50 dark:bg-gray-800">
              <AlertTriangle className="w-10 h-10 text-red-500" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('cameraAccessRequired')}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('enableCameraPermissions')}
                </p>
              </div>
              <Button variant="default" onClick={() => setScanning(true)}>
                {t('retryPermission')}
              </Button>
            </div>
          )}

          {/* Scanner view */}
          {hasPermission && scanning && (
            <div className="relative">
              <video 
                ref={videoRef} 
                className="w-full h-64 rounded-lg object-cover border border-gray-300 dark:border-gray-600"
              />
              {/* Scanner frame overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="border-4 border-primary rounded-lg w-3/4 h-1/2 relative">
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs px-2 py-1 rounded">
                    {t('alignBarcodeHere')}
                  </div>
                </div>
              </div>
              <div className="mt-2 text-center text-sm text-muted-foreground">
                {t('pointCameraAtBarcode')}
              </div>
            </div>
          )}

          {/* Loading state */}
          {hasPermission === null && (
            <div className="flex flex-col items-center justify-center p-10 space-y-4">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-10 w-10"></div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('requestingCameraAccess')}
              </p>
            </div>
          )}

          {/* Scanned result */}
          {scannedData && (
            <div className="space-y-6">
              <div className="flex flex-col items-center space-y-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
                <div className="text-center">
                  <p className="font-medium">{t('barcodeScannedSuccessfully')}!</p>
                  <Badge className="mt-2 text-base px-3 py-1.5 font-mono">
                    {scannedData}
                  </Badge>
                </div>
              </div>

              {/* Action tabs */}
              <div className="flex border rounded-lg overflow-hidden">
                <button
                  className={`flex-1 py-2 text-center font-medium flex items-center justify-center gap-2 ${
                    activeTab === 'pickup' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                  onClick={() => setActiveTab('pickup')}
                >
                  <Package className="w-4 h-4" />
                  {t('pickup')}
                </button>
                <button
                  className={`flex-1 py-2 text-center font-medium flex items-center justify-center gap-2 ${
                    activeTab === 'delivery' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                  onClick={() => setActiveTab('delivery')}
                >
                  <PackageCheck className="w-4 h-4" />
                  {t('delivery')}
                </button>
              </div>

              {/* Confirm button */}
              <Button 
                size="lg" 
                className="w-full" 
                onClick={() => handleStatus(scannedData)}
              >
                {activeTab === 'pickup' ? (
                  <>
                    <Package className="w-4 h-4 mr-2" />
                    {t('confirmPickup')}
                  </>
                ) : (
                  <>
                    <PackageCheck className="w-4 h-4 mr-2" />
                    {t('confirmDelivery')}
                  </>
                )}
              </Button>

              {/* Scan again button */}
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleReset}
              >
                <RotateCw className="w-4 h-4 mr-2" />
                {t('scanAnotherParcel')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
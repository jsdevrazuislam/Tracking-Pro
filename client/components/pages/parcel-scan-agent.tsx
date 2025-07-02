'use client'

import React, { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader, Result } from '@zxing/library'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/store'
import { updateStatus } from '@/lib/apis/parcel'
import { useTranslation } from '@/hooks/use-translation'
import { useRouter } from 'next/navigation'


const BarcodeScanner: React.FC = () => {
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [videoDevice, setVideoDevice] = useState<MediaDeviceInfo | null>(null)
  const { currentLocation } = useAuthStore()

  const beepAudio = useRef<HTMLAudioElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const { t } = useTranslation()
  const router = useRouter()

  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: updateStatus,
    onSuccess: () =>{
      toast.success("Updated Parcel Status Successfully")
      router.push('/agent/dashboard')
    },
    onError: (error) => toast.error(error?.message)
  })

  const handleValue = (id: string, status: string) => {
    if (!currentLocation) {
      toast.error('Please enable your location permission')
      return
    }

    queryClient.setQueryData(['getAgentAssignedParcels'], (oldData: any) => {
      if (!oldData?.data?.parcels) return oldData

      const updatedParcels = oldData.data.parcels.map((parcel: any) =>
        parcel.id === id ? { ...parcel, status } : parcel
      )

      return {
        ...oldData,
        data: { ...oldData.data, parcels: updatedParcels }
      }
    })

    mutate({ id, status, current_location: currentLocation })
  }

  useEffect(() => {
    beepAudio.current = new Audio('/sounds/beep.mp3')
    beepAudio.current.load()
  }, [])

  useEffect(() => {
    const reader = new BrowserMultiFormatReader()

    const initDevices = async () => {
      try {
        const devices = await reader.listVideoInputDevices()
        if (devices.length > 0) setVideoDevice(devices[1])
        else setError('No video input devices found')
      } catch (err) {
        console.error('Error listing devices', err)
        setError('Could not access video devices')
      }
    }

    initDevices()
  }, [])

  useEffect(() => {
    if (!scanning || !videoDevice) return

    const reader = new BrowserMultiFormatReader()
    let controls: any

    reader
      .decodeFromVideoDevice(videoDevice.deviceId, 'video', async (result: Result | undefined) => {
        if (result) {
          await beepAudio.current?.play().catch(console.error)
          setResult(result.getText())
          setScanning(false)
          controls?.stop()
        }
      })
      .then((ctrl) => (controls = ctrl))
      .catch((err) => {
        console.error('Decode error:', err)
        toast.error('Failed to start camera')
        setError('Camera access denied or unavailable')
        setScanning(false)
      })

    return () => {
      controls?.stop()
    }
  }, [scanning, videoDevice])

  return (
    <div className="max-w-xl mx-auto p-4 border rounded-lg bg-background shadow-md">
      <h2 className="text-lg font-semibold mb-4">{t('scanBarcodeConfirmPickup')}</h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="w-5 h-5" />
          <AlertTitle>{t('cameraAccessRequired')}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Alert variant="default" className="mb-4">
          <CheckCircle className="w-5 h-5" />
          <AlertTitle>{t('barcodeScannedSuccessfully')}</AlertTitle>
          <AlertDescription>Tracking ID: {result}</AlertDescription>
        </Alert>
      )}

      <div className="relative border bg-black rounded overflow-hidden">
        <video
          id="video"
          ref={videoRef}
          className={cn('w-full h-64 object-cover', !scanning && 'hidden')}
        />
        {!scanning && (
          <div className="absolute inset-0 flex items-center justify-center text-white bg-black/70 text-sm">
            {t('cameraAccessRequired')}
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <Button onClick={() => setScanning(true)} disabled={scanning}>
          {scanning ? 'Scanning...' : 'Start Scan'}
        </Button>
        <Button variant="outline" onClick={() => setScanning(false)} disabled={!scanning}>
          {t('stop')}
        </Button>
      </div>

      {result && (
        <div className="mt-4 flex flex-wrap md:flex-nowrap gap-2">
          <Button isLoading={isPending} className='bg-green-500 w-full' onClick={() => handleValue(result, 'picked')}>
            {t('confirmPickup')}
          </Button>
          <Button isLoading={isPending} variant="default" className='w-full' onClick={() => handleValue(result, 'delivered')}>
            {t('confirmDelivery')}
          </Button>
        </div>
      )}

      <audio ref={beepAudio} src="/sounds/beep.mp3" hidden preload="auto" />
    </div>
  )
}

export default BarcodeScanner

import { useEffect } from 'react'

export function useRequestPermissions() {
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                stream.getTracks().forEach(track => track.stop())
                console.log('Camera & mic access granted')
            })
            .catch((err) => {
                console.warn('Camera or mic permission denied:', err)
            })

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('Location access granted:', position)
                },
                (err) => {
                    console.warn('Location access denied:', err)
                }
            )
        } else {
            console.warn('Geolocation not supported')
        }
    }, [])
}

import { useEffect } from 'react';

export function useRequestPermissions() {
    useEffect(() => {
        const requestMediaPermissions = async () => {
            if (!navigator?.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                console.warn('MediaDevices API not supported.');
                return;
            }

            try {
                const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });

                if (permissionStatus.state === 'granted') {
                    console.log('Camera permission already granted.');
                } else if (permissionStatus.state === 'denied') {
                    console.warn('Camera permission previously denied by user.');
                } else {
                    console.log('Prompting for camera and mic permission...');
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                    stream.getTracks().forEach(track => track.stop());
                    console.log('Camera & mic access granted.');
                }
            } catch (err) {
                console.warn('Camera or mic permission denied/error:', err);
            }
        };

        const requestGeolocationPermissions = async () => {
            if (!('geolocation' in navigator)) {
                console.warn('Geolocation not supported by this browser.');
                return;
            }

            try {
                const permissionStatus = await navigator.permissions.query({ name: 'geolocation' as PermissionName });

                if (permissionStatus.state === 'granted') {
                    console.log('Location permission already granted.');
                    navigator.geolocation.getCurrentPosition(
                        (position) => console.log('Location access granted (no prompt needed):', position),
                        (err) => console.warn('Location access error (after granted):', err)
                    );
                } else if (permissionStatus.state === 'denied') {
                    console.warn('Location permission previously denied by user.');
                } else {
                    console.log('Prompting for location permission...');
                    navigator.geolocation.getCurrentPosition(
                        (position) => console.log('Location access granted:', position),
                        (err) => console.warn('Location access denied:', err)
                    );
                }
            } catch (err) {
                console.warn('Geolocation permission error:', err);
            }
        };

        requestMediaPermissions();
        requestGeolocationPermissions();

    }, []);
}
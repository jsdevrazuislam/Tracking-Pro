'use client'
import { useEffect, useState } from 'react';
import { Map, Marker, Source, Layer } from 'react-map-gl/mapbox';
import { Truck, MapPin } from 'lucide-react';
import { useSocketStore } from '@/store/socket-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SocketEventEnum } from '@/constants';
import { useTranslation } from '@/hooks/use-translation';



interface LiveLocation {
    latitude: number;
    longitude: number;
    timestamp: string;
}

export default function LiveTrackingMap({ trackingData }: { trackingData: TrackParcelData }) {
    const [liveLocation, setLiveLocation] = useState<LiveLocation | null>(null);
    const [distance, setDistance] = useState<number | null>(null);
    const { socket } = useSocketStore()
    const { t } = useTranslation()

    useEffect(() => {

        if (!socket) return
        socket.emit(SocketEventEnum.JOIN_CLIENT_PARCEL, trackingData.id);
        socket.on(SocketEventEnum.PARCEL_LOCATION, (data: LiveLocation) => {
            setLiveLocation(data);
            calculateDistance(data);
        });

        return () => {
            socket.off(SocketEventEnum.JOIN_CLIENT_PARCEL);
            socket.off(SocketEventEnum.PARCEL_LOCATION);
        };
    }, [socket, trackingData]);

    const calculateDistance = (location: LiveLocation) => {
        if (!trackingData.receiver_address) return;

        const R = 6371;
        const dLat = (location.latitude - trackingData.receiver_address.lat) * Math.PI / 180;
        const dLon = (location.longitude - trackingData.receiver_address.long) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(trackingData.receiver_address.lat * Math.PI / 180) *
            Math.cos(location.latitude * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        setDistance(distance);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('liveTrackingMap')}</CardTitle>
                <CardDescription>
                    {distance ? (
                        `${t('approximately')} ${distance.toFixed(1)} ${t('kmFromDestination')}`
                    ) : (
                        t('connectingToLiveTracking')
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Map
                    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                    initialViewState={{
                        latitude: trackingData.pickup_address.lat,
                        longitude: trackingData.pickup_address.long,
                        zoom: 11,
                    }}
                    style={{ width: '100%', height: 400, borderRadius: 10 }}
                    mapStyle="mapbox://styles/mapbox/streets-v11"
                >
                    <Source
                        id="route"
                        type="geojson"
                        data={{
                            type: 'Feature',
                            properties: {},
                            geometry: {
                                type: 'LineString',
                                coordinates: [
                                    [trackingData.pickup_address.long, trackingData.pickup_address.lat],
                                    [trackingData.receiver_address.long, trackingData.receiver_address.lat],
                                ],
                            },
                        }}
                    >
                        <Layer
                            id="route-line"
                            type="line"
                            paint={{
                                'line-color': '#165dfb',
                                'line-width': 4,
                            }}
                        />
                    </Source>

                    {/* Pickup Marker */}
                    <Marker
                        latitude={trackingData.pickup_address.lat}
                        longitude={trackingData.pickup_address.long}
                        anchor="bottom"
                    >
                        <div className="relative group">
                            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white shadow-md">
                                <MapPin className="w-3 h-3" />
                            </div>
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs opacity-0 group-hover:opacity-100 transition">
                                Pickup: {trackingData.pickup_address.place_name}
                            </div>
                        </div>
                    </Marker>

                    {/* Delivery Marker */}
                    <Marker
                        latitude={trackingData.receiver_address.lat}
                        longitude={trackingData.receiver_address.long}
                        anchor="bottom"
                    >
                        <div className="relative group">
                            <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white shadow-md">
                                <MapPin className="w-3 h-3" />
                            </div>
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs opacity-0 group-hover:opacity-100 transition">
                                Delivery: {trackingData.receiver_address.place_name}
                            </div>
                        </div>
                    </Marker>

                    {/* Live Agent Marker */}
                    {(liveLocation || trackingData.agent?.location) && (
                        <Marker
                            latitude={liveLocation?.latitude || trackingData.agent?.location.latitude}
                            longitude={liveLocation?.longitude || trackingData.agent?.location.longitude}
                            anchor="bottom"
                        >
                            <div className="relative group">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md animate-pulse">
                                    <Truck className="w-4 h-4" />
                                </div>
                                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs opacity-0 group-hover:opacity-100 transition">
                                    {liveLocation ? (
                                        `Last update: ${new Date(liveLocation.timestamp).toLocaleTimeString()}`
                                    ) : (
                                        'Agent location'
                                    )}
                                </div>
                            </div>
                        </Marker>
                    )}
                </Map>
            </CardContent>
        </Card>
    );
}
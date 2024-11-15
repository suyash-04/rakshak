'use client'

import { scaleToRangeForAccident } from '../utils/normalizeFrequency'
import { FC, useEffect, useState } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import 'leaflet.heat'
const icon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41],
})

type Coordinates = [number, number]
type HeatLatLngTuple = [number, number, number]
const MapUpdater: React.FC<{ center: Coordinates }> = ({ center }) => {
    const map = useMap()

    useEffect(() => {
        map.setView(center)
    }, [center, map])

    return null
}
interface MapProps {
    onCoordinateChange: (coords: [number, number]) => void;
}

const Map: React.FC<MapProps> = ({ onCoordinateChange }) => {
    const [coord, setCoord] = useState<Coordinates>([27.7172, 85.3240])
    const [searchQuery, setSearchQuery] = useState<string>('')

    useEffect(() => {
        onCoordinateChange(coord);
    }, [coord, onCoordinateChange]);

    const MapEventHandlers = () => {
        useMapEvents({
            click: (e) => {
                const { lat, lng } = e.latlng;
                setCoord([lat, lng]);
            }
        });
        return null;
    };




    const getMyLocation = (): void => {
        setSearchQuery('')
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
                setCoord([position.coords.latitude, position.coords.longitude])
            })
        } else {
            console.log("Geolocation is not supported by this browser.")
        }
    }

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`)
            const data = await response.json()
            if (data && data.length > 0) {
                setCoord([parseFloat(data[0].lat), parseFloat(data[0].lon)])
            }
        } catch (error) {
            console.error("Error searching for location:", error)
        }
    }


    const GetHeatmap: FC = () => {
        const map = useMap();
        const [addressPoints, setAddressPoints] = useState<HeatLatLngTuple[]>([]);

        useEffect(() => {
            const fetchData = async () => {
                try {
                    const response = await fetch('http://127.0.0.1:8000/api/hazards');
                    const data = await response.json();
                    console.log(data);
                    const transformedData: HeatLatLngTuple[] = data.map((item: any) => [
                        item.latitude,
                        item.longitude,
                        scaleToRangeForAccident(item.frequency),
                    ]);
                    console.log(transformedData)
                    setAddressPoints(transformedData);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchData();
        }, []);

        useEffect(() => {
            // Assuming addressPoints is defined elsewhere in your code
            console.log(addressPoints)
            const heatLayer = L.heatLayer(addressPoints, {
                radius: 10,
                blur: 5,
                maxZoom: 17,
            });
            return () => {
                heatLayer.addTo(map);
            };
        }, [map, addressPoints]);

        return null;
    }



    return (
        <Card className="w-full md:w-3/4 lg:w-2/3 h-[calc(85vh-4rem)] m-2 p-4 flex flex-col">
            <CardContent className="p-4 flex-grow flex flex-col">
                <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
                    <Input
                        type="text"
                        placeholder="Search Location"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-grow"
                    />
                    <Button type="submit">Search</Button>
                    <Button onClick={getMyLocation}>My Location</Button>
                </form>
                <div className="flex-grow relative" style={{ minHeight: '300px', maxHeight: '60vh' }}>
                    <MapContainer
                        style={{ height: '100%', width: '100%', aspectRatio: '16 / 9' }}
                        center={coord}
                        zoom={13}
                        scrollWheelZoom={true}
                    >
                        <MapEventHandlers />
                        <MapUpdater center={coord} />
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={coord} icon={icon}>
                            <Popup>Your location</Popup>
                        </Marker>
                        <Circle
                            center={coord}
                            radius={1500} // 1.5 km radius
                            pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.2 }}
                        />
                        <GetHeatmap />
                    </MapContainer>
                </div>
            </CardContent>
        </Card>

    )
}

export default Map
'use client'

import { FC, useEffect, useState } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
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

    //to extract data for heatmap
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/hazards')
                const data = await response.json()
                console.log(data)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
    }, [])


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

        useEffect(() => {
            // Assuming addressPoints is defined elsewhere in your code
            const addressPoints: HeatLatLngTuple[] = [
                [27.7172, 85.3240, 20],
                [27.7129, 85.3188, 60],
                [27.7101, 85.3260, 60],
                [27.7000, 85.3333, 20],

            ];


            const heatLayer = L.heatLayer(addressPoints, {
                radius: 10,
                blur: 5,
                maxZoom: 17,
            });



            return () => {
                heatLayer.addTo(map);
            };
        }, [map]);

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
                        <MapUpdater center={coord} />
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={coord} icon={icon}>
                            <Popup>Your location</Popup>
                        </Marker>
                        <GetHeatmap />
                    </MapContainer>
                </div>
            </CardContent>
        </Card>

    )
}

export default Map
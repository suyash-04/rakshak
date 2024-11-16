'use client'

import { scaleToRangeForAccident, scaleToRangeForLandslide } from '../utils/normalizeFrequency'
import { FC, useEffect, useState } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, MapPin, Search } from 'lucide-react'
import 'leaflet.heat'
import { getLocationFromCoordinates } from '../utils/coordinatesToLocation'
import pLimit from 'p-limit';

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
    const [accidentaddressPoints, setaccidentAddressPoints] = useState<HeatLatLngTuple[]>([])
    const [landslideaddressPoints, setlandslideAddressPoints] = useState<HeatLatLngTuple[]>([])
    const [floodaddressPoints, setfloodAddressPoints] = useState<HeatLatLngTuple[]>([])
    const [newsPoints, setNewsPoints] = useState<object[]>([])

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
        const map = useMap()
        useEffect(() => {
            const fetchData = async () => {
                try {
                    const response = await fetch('http://127.0.0.1:8000/api/hazards');
                    const data = await response.json();
                    console.log(data)
                    const accidenttransformedData = data
                        .filter((item: any) => item.type === "accident") // Filter by type
                        .map((item: any) => [
                            item.latitude,
                            item.longitude,
                            scaleToRangeForAccident(item.frequency),
                        ]);
                    const landslidetransformedData = data
                        .filter((item: any) => item.type === "landslide") // Filter by type
                        .map((item: any) => [
                            item.latitude,
                            item.longitude,
                            100,
                        ]);

                    const floodtransformedData = data
                        .filter((item: any) => item.type === "flood") // Filter by type
                        .map((item: any) => [
                            item.latitude,
                            item.longitude,
                            90,
                        ]);

                    console.log(accidenttransformedData)
                    setaccidentAddressPoints(accidenttransformedData);
                    setfloodAddressPoints(floodtransformedData);
                    setlandslideAddressPoints(landslidetransformedData)
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchData();
        }, []);


        useEffect(() => {
            const fetchLocations = async () => {
                const accidentpointsWithinCircle = [...accidentaddressPoints, ...floodaddressPoints, ...landslideaddressPoints].filter(([lat, lng]) => {
                    const distance = L.latLng(lat, lng).distanceTo(L.latLng(coord[0], coord[1]));
                    return distance <= 10500; // 10.5 km radius
                });

                // Limit concurrent requests to avoid rate limiting
                const limit = pLimit(5); // Adjust concurrency as needed
                const locationPromises = accidentpointsWithinCircle.map(([lat, lng]) =>
                    limit(async () => {
                        try {
                            const location = await getLocationFromCoordinates(lat, lng);
                            if (location && !('error' in location)) {
                                return location;
                            }
                        } catch (error) {
                            console.error(`Error fetching location for [${lat}, ${lng}]:`, error);
                        }
                        return null;
                    })
                );

                const locations = await Promise.all(locationPromises);

                // Filter out null values
                const validLocations = locations.filter(location => location !== null);
                setNewsPoints(validLocations);
                console.log(validLocations);
            };

            fetchLocations();
        }, [coord, accidentaddressPoints, floodaddressPoints, landslideaddressPoints]);

        useEffect(() => {
            // Assuming addressPoints is defined elsewhere in your code

            const accidentheatLayer = L.heatLayer(accidentaddressPoints, {
                radius: 10,
                blur: 5,
                maxZoom: 17, gradient: {
                    '0': 'Red',
                    '1': 'Red'
                },
            })
            const landslideheatLayer = L.heatLayer(landslideaddressPoints, {
                radius: 10,
                blur: 5,
                maxZoom: 17, gradient: {
                    '0': 'Yellow',
                    '1': 'Yellow'
                },
            })
            const floodheatLayer = L.heatLayer(floodaddressPoints, {
                radius: 10,
                blur: 5,
                maxZoom: 17, gradient: {
                    '0': 'Navy',
                    '1': 'Navy'
                },
            })
                ;
            return () => {
                accidentheatLayer.addTo(map);
                floodheatLayer.addTo(map);
                landslideheatLayer.addTo(map);
            };
        }, [map, accidentaddressPoints, floodaddressPoints, landslideaddressPoints]);


        return null;
    }

    return (
        <div className="flex flex-col md:flex-row gap-4 p-4">
            <Card className="flex-grow">
                <CardContent className="p-4">
                    <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
                        <Input
                            type="text"
                            placeholder="Search Location"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-grow"
                        />
                        <Button type="submit" variant="outline">
                            <Search className="w-4 h-4 mr-2" />
                            Search
                        </Button>
                        <Button onClick={getMyLocation} variant="outline">
                            <MapPin className="w-4 h-4 mr-2" />
                            My Location
                        </Button>
                    </form>
                    <div className="relative" style={{ height: 'calc(100vh - 200px)' }}>
                        <MapContainer
                            style={{ height: '100%', width: '100%' }}
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
            <Card className="w-full md:w-80">
                <CardContent className="p-4">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                        Nearby Accidents
                    </h2>
                    <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto">
                        {newsPoints.map((news: any, index: number) => (
                            <div key={index} className="bg-red-50 p-2 rounded-md text-sm">
                                <p className="font-medium">Accident reported</p>
                                <p className="text-xs text-gray-600 truncate">{news.display_name}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Map
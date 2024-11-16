'use client';

import React, { FC, useState, useEffect, useCallback } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, MapPin, Search } from 'lucide-react';
import MapEventHandlers from './MapEventHandlers';
import GetHeatmap from './GetHeatmap';
import MapUpdater from './MapUpdater';
import { scaleToRangeForAccident } from '../utils/normalizeFrequency';


const icon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41],
});
type MapProps = {
    onCoordinateChange: React.Dispatch<React.SetStateAction<[number, number]>>;
};
type Coordinates = [number, number];

const Map: FC<MapProps> = ({ onCoordinateChange }) => {
    const [coord, setCoord] = useState<Coordinates>([27.7172, 85.3240]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [accidentPoints, setAccidentPoints] = useState<[number, number, number][]>([]);
    const [landslidePoints, setLandslidePoints] = useState<[number, number, number][]>([]);
    const [floodPoints, setFloodPoints] = useState<[number, number, number][]>([]);
 

    const fetchData = useCallback(async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/hazards');
            const data = await response.json();

            setAccidentPoints(
                data.filter((item: any) => item.type === 'accident').map((item: any) => [
                    item.latitude,
                    item.longitude,
                    scaleToRangeForAccident(item.frequency),
                ])
            );
            setLandslidePoints(
                data.filter((item: any) => item.type === 'landslide').map((item: any) => [
                    item.latitude,
                    item.longitude,
                    100,
                ])
            );
            setFloodPoints(
                data.filter((item: any) => item.type === 'flood').map((item: any) => [
                    item.latitude,
                    item.longitude,
                    90,
                ])
            );
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
            );
            const data = await response.json();
            if (data && data.length > 0) {
                setCoord([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
            }
        } catch (error) {
            console.error('Error searching for location:', error);
        }
    };

    const getMyLocation = () => {
        setSearchQuery('');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setCoord([position.coords.latitude, position.coords.longitude]);
            });
        } else {
            console.log('Geolocation is not supported by this browser.');
        }
    };

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
                            scrollWheelZoom
                        >
                            <MapEventHandlers setCoord={setCoord} />
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
                                radius={1500}
                                pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.2 }}
                            />
                            <GetHeatmap
                                accidentPoints={accidentPoints}
                                landslidePoints={landslidePoints}
                                floodPoints={floodPoints}
                            />
                        </MapContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Map;

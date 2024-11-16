'use client';

import { FC, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

type GetHeatmapProps = {
    accidentPoints: [number, number, number][];
    landslidePoints: [number, number, number][];
    floodPoints: [number, number, number][];
};

const GetHeatmap: FC<GetHeatmapProps> = ({ accidentPoints, landslidePoints, floodPoints }) => {
    const map = useMap();

    useEffect(() => {
        const accidentLayer = L.heatLayer(accidentPoints, { radius: 10, blur: 5 });
        const landslideLayer = L.heatLayer(landslidePoints, { radius: 10, blur: 5 });
        const floodLayer = L.heatLayer(floodPoints, { radius: 10, blur: 5 });

        map.addLayer(accidentLayer);
        map.addLayer(landslideLayer);
        map.addLayer(floodLayer);

        return () => {
            map.removeLayer(accidentLayer);
            map.removeLayer(landslideLayer);
            map.removeLayer(floodLayer);
        };
    }, [map, accidentPoints, landslidePoints, floodPoints]);

    return null;
};

export default GetHeatmap;

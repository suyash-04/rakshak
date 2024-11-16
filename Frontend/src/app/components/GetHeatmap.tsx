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
        // Assuming addressPoints is defined elsewhere in your code

        const accidentheatLayer = L.heatLayer(accidentPoints, {
            radius: 15,
            blur: 20,
            maxZoom: 17, gradient: {
                '0': 'Red',
                '1': 'Red'
            },
        })
        const landslideheatLayer = L.heatLayer(landslidePoints, {
            radius: 15,
            blur: 20,
            maxZoom: 17, gradient: {
                '0': 'Yellow',
                '1': 'Yellow'
            },
        })
        const floodheatLayer = L.heatLayer(floodPoints, {
            radius: 15,
            blur: 20,
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
    }, [map, accidentPoints, floodPoints, landslidePoints]);

    return null;
};

export default GetHeatmap;

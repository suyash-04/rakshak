'use client';

import { FC, useEffect } from 'react';
import { useMap } from 'react-leaflet';

type MapUpdaterProps = {
    center: [number, number];
};

const MapUpdater: FC<MapUpdaterProps> = ({ center }) => {
    const map = useMap();

    useEffect(() => {
        map.setView(center);
    }, [center, map]);

    return null;
};

export default MapUpdater;

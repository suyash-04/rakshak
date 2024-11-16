'use client';

import { FC } from 'react';
import { useMapEvents } from 'react-leaflet';

type MapEventHandlersProps = {
    setCoord: React.Dispatch<React.SetStateAction<[number, number]>>;
};

const MapEventHandlers: FC<MapEventHandlersProps> = ({ setCoord }) => {
    useMapEvents({
        click: (e) => {
            const { lat, lng } = e.latlng;
            setCoord([lat, lng]);
        },
    });
    return null;
};

export default MapEventHandlers;

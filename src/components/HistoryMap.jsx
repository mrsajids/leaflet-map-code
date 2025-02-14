import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-canvas-markers';
import L from "leaflet";
import CanvasMarkerLayer from './CanvasMarkerLayer';

const markers1 = Array.from({ length: 10000 }, (_, i) => ({
  lat: 37.7749 + Math.random() * 5,
  lng: -122.4194 + Math.random() * 5,
  title: `Marker #${i + 1}`,
}));

// Main Map Component
const MapWithCanvasMarkers = () => {
  return (
    <CanvasMarkerLayer
    markers={markers1}
    iconUrl="https://cdn-icons-png.flaticon.com/512/252/252025.png"
  />
  );
};

export default MapWithCanvasMarkers;
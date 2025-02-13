import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-canvas-markers';
import L from "leaflet";

// Generate 5,000 random markers within India
const markers = Array.from({ length: 5000 }, (_, i) => ({
  id: i,
  lat: 8.4 + Math.random() * (37.6 - 8.4), // Latitude within India
  lng: 68.7 + Math.random() * (97.25 - 68.7), // Longitude within India
}));

// Component to render canvas markers
const CanvasMarkersLayer = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Initialize the canvas markers layer
    const canvasLayer = L.canvasMarkers({
      markers,
      renderMarker: (marker) => {
        const ctx = marker.ctx;
        ctx.beginPath();
        ctx.arc(marker.x, marker.y, 5, 0, Math.PI * 2); // Draw a circle for each marker
        ctx.fillStyle = '#0078ff'; // Marker color
        ctx.fill();
      },
    }).addTo(map);

    // Fit the map to the bounds of the markers
    const bounds = L.latLngBounds(markers.map((marker) => [marker.lat, marker.lng]));
    map.fitBounds(bounds);

    // Cleanup on unmount
    return () => {
      map.removeLayer(canvasLayer);
    };
  }, [map]);

  return null;
};

// Main Map Component
const MapWithCanvasMarkers = () => {
  return (
    <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <CanvasMarkersLayer />
    </MapContainer>
  );
};

export default MapWithCanvasMarkers;
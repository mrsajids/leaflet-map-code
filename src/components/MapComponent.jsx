import React, { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  FeatureGroup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import IndiaMapContainer from "./IndiaMapContainer";
import HistoryMap from "./HistoryMap";

const MapComponent = ({}) => {
  return (
    <IndiaMapContainer>
      <HistoryMap />
    </IndiaMapContainer>
  );
};

export default MapComponent;

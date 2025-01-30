import React from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import IndiaMapContainer from "./IndiaMapContainer";
import HistoryMap from "./HistoryMap";

const MapComponent = ({ }) => {
  return (
    <IndiaMapContainer isLayerSwitcher={true}>
      <HistoryMap />
    </IndiaMapContainer>
  );
};

export default MapComponent;

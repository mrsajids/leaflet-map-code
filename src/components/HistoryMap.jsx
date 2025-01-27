import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  FeatureGroup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const HistoryMap = ({}) => {
  const featureRef = useRef();
  const map = useMap({});
  const [vehicleHistory, setVehicleHistory] = useState([]);

  //   let vehicleHistory = [];
  useEffect(() => {
    // const bounds = featureRef.current.getBounds();
    const tempArr = [
      [28.7041, 77.1025], // Delhi
      [28.5355, 77.391], // Noida
      [28.4595, 77.0266], // Gurgaon
      [28.6139, 77.209], // Central Delhi];
    ];

    if (featureRef.current) {
      // const bounds = featureRef.current.getBounds();
      map.flyToBounds([tempArr], 10);
      setTimeout(() => {
        setVehicleHistory(tempArr);
      }, 2000);
    }
  }, []);

  const pathOptions = { color: "blue", weight: 4 };
  const startMarkerOptions = { color: "green" };
  const endMarkerOptions = { color: "red" };

  return (
    <FeatureGroup ref={featureRef}>
      <Polyline positions={vehicleHistory} pathOptions={pathOptions} />
    </FeatureGroup>
  );
};

export default HistoryMap;

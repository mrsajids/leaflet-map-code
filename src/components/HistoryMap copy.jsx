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
import { historyData } from "./data";
import L from "leaflet";
import greenicon from './greenicon.png';
import redicon from './redicon.png';
import greenarrow from './greenarrow.png';
import redarrow from './redarrow.png';

const HistoryMap = ({ }) => {
  const featureRef = useRef();
  const map = useMap({});
  const [routeArrowMarkers, setRouteArrowMarkers] = useState([]);
  const [startFlagPositions, setStartFlagPositions] = useState([]);
  const [endFlagPosition, setEndFlagPosition] = useState([]);
  const [segments, setSegments] = useState([]);


  //   let vehicleHistory = [];
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    // fetch code
    // ....
    const vehicleData = historyData;
    // first flag
    const initialLat = Number(vehicleData[0].latitude);
    const initialLng = Number(vehicleData[0].longitude);
    // last flag
    const lastLat = Number(vehicleData[vehicleData.length - 1].latitude);
    const lastLng = Number(vehicleData[vehicleData.length - 1].longitude);

    setStartFlagPositions([initialLat, initialLng]);
    setEndFlagPosition([lastLat, lastLng]);

    // drawing new Route
    const newRoute = drawRoute(vehicleData);

    setTimeout(() => {
      setRouteArrowMarkers(vehicleData);
      setSegments(newRoute);
    }, 2500);

    const routeBounds = newRoute.flatMap(item => item.positions);

    // console.log(aaa);
    map.flyToBounds([routeBounds], map.getZoom(), {
      animate: true, // Optional: smooth transition
      duration: 3, // Optional: specify the duration of the flyTo
    });

  }

  const drawRoute = (vehicles) => {
    // line color based on Inside or Outside
    const updatedSegments = [
      { positions: [], color: "#3f3c3c" }, // Default to blue for "Inside"
    ];
    vehicles.forEach((item) => {
      const lat = Number(item.latitude);
      const lng = Number(item.longitude);
      const newPos = [lat, lng];

      const currentStatus =
        item.onhiwaystatus === "Inside" ? "#3f3c3c" : "#9f9f9f";

      // Always add the new position to the last segment
      updatedSegments[updatedSegments.length - 1].positions.push(newPos);

      // If the color changes, add a new segment with the new color but continue the line
      if (
        updatedSegments[updatedSegments.length - 1].color !== currentStatus
      ) {
        updatedSegments.push({ positions: [newPos], color: currentStatus });
      }
    });

    return updatedSegments;
  }



  const getArrowIcon = (vehicle) => {
    // change color of vehicle accroing to its status
    const vehicleSpeed = Number(vehicle.vehiclespeed);

    const arrowicon = vehicleSpeed > 80 ? redarrow : greenarrow;

    return new L.DivIcon({
      className: "", // Custom class for the icon
      html: `<img class="arrow-icon" height="14" src=${arrowicon} alt="" style="transform: rotate(${vehicle?.vehicledirectionvalue}deg);" />`,
      iconSize: [40, 40], // Size of the whole icon container (including text)
      iconAnchor: [0, 0], // Anchor the icon to its center
      // anch
    });
  };

  const commonIcon = (src = "") => {
    // change color of vehicle accroing to its status
    return new L.DivIcon({
      className: "", // Custom class for the icon
      html: `<img class="flag-icon" height="40" src=${src} alt="" />`,
      // iconSize: [0, 0], // Size of the whole icon container (including text)
      iconAnchor: [0, 0], // Anchor the icon to its center
    });
  };


  return (
    <FeatureGroup ref={featureRef}>
      {startFlagPositions.length > 0 && (
        <Marker
          position={startFlagPositions}
          icon={commonIcon(greenicon)}
          zIndexOffset={151}
        ></Marker>
      )}

      {/* arrows showing history */}
      {routeArrowMarkers.length > 0 &&
        routeArrowMarkers.map((vehicle, index) => (
          <Marker
            key={index}
            position={[Number(vehicle.latitude), Number(vehicle.longitude)]}
            icon={getArrowIcon(vehicle)}
            zIndexOffset={150}
            eventHandlers={{
              // click: () => setVehicleInfo(vehicle),
            }}
          >
            <Popup className="historytrack-popup">
              {/* <VehicleDetailCard /> */}
            </Popup>
          </Marker>
        ))}

      {segments.map((segment, index) => (
        <Polyline
          key={index}
          positions={segment.positions}
          pathOptions={{ color: segment.color }}
          weight={7}
          opacity={0.8}
        />
      ))}
      {/* end flag */}
      {endFlagPosition.length > 0 && (
        <Marker
          position={endFlagPosition}
          icon={commonIcon(redicon)}
          zIndexOffset={151}
        ></Marker>
      )}

    </FeatureGroup>
  );
};

export default HistoryMap;

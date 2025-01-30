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
  const [vehicleMarkers, setVehicleMarkers] = useState([]);
  const [startFlagPositions, setStartFlagPositions] = useState([]);
  const [endFlagPosition, setEndFlagPosition] = useState([]);
  const [vehicleHistory, setVehicleHistory] = useState([]);
  const [segments, setSegments] = useState([]);


  //   let vehicleHistory = [];
  useEffect(() => {

    fetchHistory();
    // const bounds = featureRef.current.getBounds();
    // const tempArr = [
    //   [28.7041, 77.1025], // Delhi
    //   [28.5355, 77.391], // Noida
    //   [28.4595, 77.0266], // Gurgaon
    //   [28.6139, 77.209], // Central Delhi];
    // ];

    // if (featureRef.current) {
    //   // const bounds = featureRef.current.getBounds();
    //   map.flyToBounds([tempArr], 10);
    //   setTimeout(() => {
    //     setVehicleHistory(tempArr);
    //   }, 2000);
    // }
  }, []);

  const fetchHistory = async () => {
    // fetch
    const vehicleData = historyData;
    // const totalDistance = res?.entity?.totaldistance;
    // setTotalDistance(totalDistance);

    const initialLat = Number(vehicleData[0].latitude);
    const initialLng = Number(vehicleData[0].longitude);

    // setVehicleInfo(vehicleData[0]);

    const lastLat = Number(vehicleData[vehicleData.length - 1].latitude);
    const lastLng = Number(vehicleData[vehicleData.length - 1].longitude);
    // setTimeout(() => {
    // const lastLat = Number(vehicleData.slice(-1)[0].latitude);
    // const lastLng = Number(vehicleData.slice(-1)[0].longitude);

    setStartFlagPositions([initialLat, initialLng]);
    console.log(lastLat);
    setEndFlagPosition([lastLat, lastLng]);
    // vehicleData.map((item) => {
    //   const lat = Number(item.latitude);
    //   const lng = Number(item.longitude);
    //   const newPos = [lat, lng];
    //   tempPath.push(newPos);

    const updatedSegments = [
      { positions: [], color: "#3f3c3c" }, // Default to blue for "Inside"
    ];
    vehicleData.forEach((item) => {
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

    setTimeout(() => {
      setVehicleMarkers(vehicleData);
      setSegments(updatedSegments); // });
      // setPath(tempPath);
    }, 2500);
    // setIsHistoryPlotted(true);
    // }, 2500);
    // console.log(tempPath);

    // if (tempPath) {
    //   // Automatically adjusts zoom level to fit all markers
    //   map.fitBounds(tempPath, {
    //     padding: [50, 50],
    //     maxZoom: 15,
    //     minZoom: 5,
    //     animate: true,
    //   });
    // }
    // if (initialLat && initialLng)
    // want to spread item.positions

    const aaa = updatedSegments.flatMap(item => item.positions);


    // console.log(aaa);
    map.flyToBounds([aaa], map.getZoom(), {
      animate: true, // Optional: smooth transition
      duration: 3, // Optional: specify the duration of the flyTo
    });

  }


  const customIcon = (vehicle) => {
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
      html: `<img class="flag-icon" height="35" src=${src} alt="" />`,
      iconSize: [0, 0], // Size of the whole icon container (including text)
      iconAnchor: [13, 13], // Anchor the icon to its center
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
      {vehicleMarkers.length > 0 &&
        vehicleMarkers.map((vehicle, index) => (
          <Marker
            key={index}
            position={[Number(vehicle.latitude), Number(vehicle.longitude)]}
            icon={customIcon(vehicle)}
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

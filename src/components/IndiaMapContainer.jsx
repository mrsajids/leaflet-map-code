import React, { createContext, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.fullscreen/Control.FullScreen.css";
import "leaflet.fullscreen";

import "../App.css";
import {
  INDIABOUNDS,
  INDIACENTER,
  MAXZOOM,
  MINZOOM,
  ZOOM,
} from "../mapsettting";
import LayerSwitcher from "./LayerSwitcher"; // Import the LayerSwitcher
import Loader from "./Loader";

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const IndiaMapContainer = ({ children, isLayerSwitcher }) => {
  const MapContext = createContext(null);
  const [isMapLoading, setIsMapLoading] = useState(false);
  // console.log(isLayerSwitcher);

  // Define available layers
  const layers = [
    {
      name: "OL",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    {
      name: "SL",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "&copy; <a href='https://www.esri.com/'>Esri</a>",
    },
    {
      name: "IL", // Add a WMS layer
      url: "http://216.48.185.212/gomapserver/gomaps/wms?",
      attribution: "© GeoServer",
      wmsParams: {
        layers: "gomaps:gomaps", // Layer name from the WMS service
        format: "image/png",
        transparent: true,
        tiled: true,
        crs: L.CRS.EPSG4326,
        version: "1.3.0",
        attribution: "© GeoServer",
      },
    },
  ];

  return (
    <div className={`map-container ${isMapLoading ? "fade-map" : ""}`}>
      <MapContext.Provider value={[isMapLoading, setIsMapLoading]}>
        <MapContainer
          className="map"
          center={INDIACENTER}
          zoom={ZOOM}
          scrollWheelZoom={true}
          minZoom={MINZOOM}
          maxZoom={MAXZOOM}
          maxBounds={INDIABOUNDS}
          maxBoundsViscosity={1.0}
          fullscreenControl={true}
          fullscreenControlOptions={{
            position: "bottomright",
          }}
        >
          {/* Default Tile Layer */}
          <TileLayer attribution={layers[0].attribution} url={layers[0].url} />
          {/* Add the Layer Switcher */}
          {
            isLayerSwitcher && <LayerSwitcher layers={layers} />
          }
          {children}
          <Loader isLoading={isMapLoading} />
        </MapContainer>
      </MapContext.Provider>
    </div>
  );
};

export default IndiaMapContainer;

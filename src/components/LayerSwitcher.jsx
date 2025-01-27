import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const LayerSwitcher = ({ layers }) => {
  const map = useMap();

  useEffect(() => {
    // Set the default layer (first in the list)
    const defaultLayer = layers[0];
    L.tileLayer(defaultLayer.url, { attribution: defaultLayer.attribution }).addTo(map);
  }, [map, layers]);

  const handleLayerChange = (layer) => {
    // Remove all existing layers
    map.eachLayer((existingLayer) => map.removeLayer(existingLayer));

    // Add the selected layer
    if (layer.wmsParams) {
      // Add WMS layer
      L.tileLayer.wms(layer.url, {
        ...layer.wmsParams,
        attribution: layer.attribution,
      }).addTo(map);
    } else {
      // Add standard tile layer
      L.tileLayer(layer.url, { attribution: layer.attribution }).addTo(map);
    }
  };

  return (
    <div className="layer-switcher">
      {layers.map((layer, index) => (
        <button
          key={index}
          className="layer-button"
          onClick={() => handleLayerChange(layer)}
        >
          {layer.name}
        </button>
      ))}
    </div>
  );
};

export default LayerSwitcher;

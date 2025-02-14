import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import greenarrow from "./greenarrow.png";
import redarrow from "./redarrow.png";

const CanvasMarkerLayer = ({ markers }) => {
  const map = useMap();

  useEffect(() => {
    const canvas = L.DomUtil.create("canvas", "leaflet-canvas-layer");
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1; // Handle high DPI screens
    canvas.width = map.getSize().x * dpr;
    canvas.height = map.getSize().y * dpr;
    ctx.scale(dpr, dpr); // Adjust for high DPI screens

    map.getPanes().overlayPane.appendChild(canvas);

    const images = {
      green: new Image(),
      red: new Image(),
    };

    images.green.src = greenarrow;
    images.red.src = redarrow;

    function drawMarkers() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      markers.forEach(({ lat, lng, status, angle }) => {
        const point = map.latLngToContainerPoint([lat, lng]);

        // Choose image based on status
        const img = status === "active" ? images.green : images.red;
        
        // Default rotation if angle is undefined
        const rotationAngle = angle ? (angle * Math.PI) / 180 : 0;

        ctx.save();

        // Translate and rotate around marker point
        ctx.translate(point.x, point.y);
        ctx.rotate(rotationAngle);

        // Use a higher resolution image and scale it properly
        const imageSize = 20; // Increase this for better quality
        ctx.drawImage(img, -imageSize / 2, -imageSize / 2, imageSize, imageSize);

        ctx.restore();
      });
    }

    function updateCanvasPosition() {
      const bounds = map.getBounds();
      const topLeft = map.latLngToLayerPoint(bounds.getNorthWest());
      L.DomUtil.setPosition(canvas, topLeft);
      canvas.width = map.getSize().x * dpr;
      canvas.height = map.getSize().y * dpr;
      ctx.scale(dpr, dpr); // Adjust again after resizing
      drawMarkers();
    }

    function handleMouseMove(event) {
      const mousePoint = event.containerPoint;
      let hovered = false;

      markers.forEach(({ lat, lng }) => {
        const point = map.latLngToContainerPoint([lat, lng]);
        const distance = Math.sqrt(
          Math.pow(point.x - mousePoint.x, 2) + Math.pow(point.y - mousePoint.y, 2)
        );
        if (distance <= 10) hovered = true;
      });

      canvas.style.cursor = hovered ? "pointer" : "default";
    }

    function handleClick(event) {
      markers.forEach(({ lat, lng, title }) => {
        const markerPoint = map.latLngToContainerPoint([lat, lng]);
        const distance = Math.sqrt(
          Math.pow(markerPoint.x - event.containerPoint.x, 2) +
          Math.pow(markerPoint.y - event.containerPoint.y, 2)
        );
        if (distance <= 10) {
          L.popup()
            .setLatLng([lat, lng])
            .setContent(`<strong>${title}</strong>`)
            .openOn(map);
        }
      });
    }

    map.on("moveend zoomend resize", updateCanvasPosition);
    map.on("mousemove", handleMouseMove);
    map.on("click", handleClick);
    updateCanvasPosition();

    return () => {
      map.off("moveend zoomend resize", updateCanvasPosition);
      map.off("mousemove", handleMouseMove);
      map.off("click", handleClick);
      map.getPanes().overlayPane.removeChild(canvas);
    };
  }, [map, markers]);

  return null;
};

export default CanvasMarkerLayer;

import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const CanvasMarkerLayer = ({ markers, iconUrl }) => {
  const map = useMap();

  useEffect(() => {
    const canvas = L.DomUtil.create("canvas", "leaflet-canvas-layer");
    const ctx = canvas.getContext("2d");
    canvas.width = map.getSize().x;
    canvas.height = map.getSize().y;

    map.getPanes().overlayPane.appendChild(canvas);

    const img = new Image();
    img.src = iconUrl;

    img.onload = () => {
      function drawMarkers() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        markers.forEach(({ lat, lng }) => {
        const point = map.latLngToContainerPoint([lat, lng]);

        ctx.save();

        // Translate and rotate around marker point
        ctx.translate(point.x, point.y);
        ctx.rotate((59 * Math.PI) / 180);

        // Draw the image centered at the point
        ctx.drawImage(img, 0, 0, 16, 16);

        ctx.restore();
        //   ctx.drawImage(img, point.x - 8, point.y - 8, 16, 16);
        });
      }

      function updateCanvasPosition() {
        const bounds = map.getBounds();
        const topLeft = map.latLngToLayerPoint(bounds.getNorthWest());
        L.DomUtil.setPosition(canvas, topLeft);
        canvas.width = map.getSize().x;
        canvas.height = map.getSize().y;
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
        const clickPoint = map.containerPointToLatLng(event.containerPoint);

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
        map.off("moveend zoomend resize");
        map.off("mousemove", handleMouseMove);
        map.off("click", handleClick);
        map.getPanes().overlayPane.removeChild(canvas);
      };
    };
  }, [map, markers, iconUrl]);

  return null;
};

export default CanvasMarkerLayer;

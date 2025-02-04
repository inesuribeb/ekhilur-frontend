import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, Circle, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import "./ticketmap.css";

const FixedZoom = ({ zoomLevel }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(map.getCenter(), zoomLevel, { animate: false });
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    map.dragging.disable();

    const southWest = L.latLng(43.255, -1.990);
    const northEast = L.latLng(43.280, -1.960);
    const bounds = L.latLngBounds(southWest, northEast);
    map.setMaxBounds(bounds);
    map.setMinZoom(zoomLevel);
    map.setMaxZoom(zoomLevel);
  }, [map, zoomLevel]);
  return null;
};


const HeatMapLayer = ({ data }) => {
  // Verifica si los datos están vacíos o no están definidos
  if (!data?.length) return null;

  // Procesa los datos para asegurarse de que las coordenadas sean válidas
  const processedData = data
    .map(point => ({
      ...point,
      Latitud: parseFloat(point.Latitud.trim()), // Elimina espacios y convierte a número
      Longitud: parseFloat(point.Longitud.trim()), // Elimina espacios y convierte a número
    }))
    .filter(point => !isNaN(point.Latitud) && !isNaN(point.Longitud)); // Filtra coordenadas inválidas

  // Si no hay datos válidos, no renderices nada
  if (!processedData.length) return null;

  // Calcula el valor máximo y mínimo del ticket medio
  const ticketValues = processedData.map(point => parseFloat(point.Ticket_medio));
  const maxTicket = Math.max(...ticketValues);
  const minTicket = Math.min(...ticketValues);

  // Calcula el radio del círculo basado en el ticket medio
  const calculateRadius = (ticket) => {
    const minRadius = 15;
    const maxRadius = 40;
    const normalized = (ticket - minTicket) / (maxTicket - minTicket);
    return minRadius + normalized * (maxRadius - minRadius);
  };

  // Calcula el color del círculo basado en el ticket medio
  const calculateColor = (ticket) => {
    const normalized = (ticket - minTicket) / (maxTicket - minTicket);
    if (normalized < 0.33) return '#3388ff';
    if (normalized < 0.66) return '#32cd32';
    return '#ff0000';
  };

  // Renderiza los círculos en el mapa
  return processedData.map((point, index) => (
    <Circle
      key={index}
      center={[point.Latitud, point.Longitud]} // Usa Latitud y Longitud directamente
      radius={calculateRadius(parseFloat(point.Ticket_medio))}
      pathOptions={{
        fillColor: calculateColor(parseFloat(point.Ticket_medio)),
        fillOpacity: 0.6,
        color: calculateColor(parseFloat(point.Ticket_medio)),
        weight: 1,
      }}
    >
      <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
        <div className="popup-content">
          <div className="popup-title">{point.Nombre_calle}</div>
          <div className="popup-info-container">
            <div className="popup-info">
              <span className="popup-label">Ticket medio:</span>
              <span className="popup-value">{parseFloat(point.Ticket_medio).toFixed(2)}€</span>
            </div>
          </div>
        </div>
      </Tooltip>
    </Circle>
  ));
};
const TicketMap = ({ mapTicketMedio }) => {
  const ZOOM_LEVEL = 15.5;
  const CENTER = [43.26826, -1.97609];

  return (
    <div className="chart-section">
      <div className="fila6-columna1">
        <h2 className="text-xl font-bold mb-4">Distribución de ticket medio por zona</h2>
        <h1 className="text-base opacity-50">Visualización del ticket medio por área geográfica</h1>
      </div>
      
      <div className="fila6-columna2 map-container">
        <div className="map-content">
          <div className="map-wrapper">
            <MapContainer 
              center={CENTER}
              zoom={ZOOM_LEVEL}
              className="map"
              zoomControl={false}
              scrollWheelZoom={false}
              dragging={false}
              touchZoom={false}
              doubleClickZoom={false}
              boxZoom={false}
            >
              <FixedZoom zoomLevel={ZOOM_LEVEL} />
              <TileLayer
                url="https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a>'
              />
              <HeatMapLayer data={mapTicketMedio} />
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketMap;
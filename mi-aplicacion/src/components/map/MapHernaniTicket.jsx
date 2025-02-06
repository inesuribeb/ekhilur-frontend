import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, Circle, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';

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

const BubblesLayer = ({ data }) => {
  if (!data || data.length === 0) return null;

  // Encontrar el valor máximo y mínimo de Ticket_medio para calcular el tamaño de las burbujas
  const ticketValues = data.map(point => parseFloat(point.Ticket_medio));
  const maxTicket = Math.max(...ticketValues);
  const minTicket = Math.min(...ticketValues);

  // Función para calcular el radio de la burbuja basado en el valor del ticket
  const calculateRadius = (ticketValue) => {
    const minRadius = 10;
    const maxRadius = 30;
    const normalized = (ticketValue - minTicket) / (maxTicket - minTicket);
    return minRadius + normalized * (maxRadius - minRadius);
  };

  // Función para calcular el color basado en el valor del ticket
  const calculateColor = (ticketValue) => {
    const normalized = (ticketValue - minTicket) / (maxTicket - minTicket);
    if (normalized < 0.33) return '#3388ff';
    if (normalized < 0.66) return '#32cd32';
    return '#ff0000';
  };

  return (
    <>
      {data.map((point, index) => {
        const ticketValue = parseFloat(point.Ticket_medio);
        return (
          <Circle
            key={index}
            center={[parseFloat(point.Latitud), parseFloat(point.Longitud.trim())]}
            radius={calculateRadius(ticketValue)}
            pathOptions={{
              fillColor: calculateColor(ticketValue),
              fillOpacity: 0.6,
              color: calculateColor(ticketValue),
              weight: 1
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
        );
      })}
    </>
  );
};

const MapHernaniTicket = () => {
  const [bubbleData, setBubbleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const ZOOM_LEVEL = 15.5;
  const CENTER = [43.26826, -1.97609];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getTicketMap();
        
        if (response.success && response.data) {
          setBubbleData(response.data);
        } else {
          setError('No se pudieron cargar los datos del mapa');
        }
      } catch (error) {
        console.error('Error al obtener datos del mapa:', error);
        setError('Error al cargar los datos del mapa');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="map-container loading">
        Cargando mapa...
      </div>
    );
  }

  if (error) {
    return (
      <div className="map-container loading">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="map-container">
      <div className="map-header">
        <h2 className="map-title">Mapa de Tickets por Zona</h2>
      </div>
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
              attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {bubbleData.length > 0 && <BubblesLayer data={bubbleData} />}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default MapHernaniTicket;
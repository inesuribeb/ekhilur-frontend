import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap, Circle, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../components/map/MapComponent.css';

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
  if (!data?.length) return null;

  const userValues = data.map(point => point.num_usuarios);
  const maxUsers = Math.max(...userValues);
  const minUsers = Math.min(...userValues);

  const calculateRadius = (users) => {
    const minRadius = 15;
    const maxRadius = 40;
    const normalized = (users - minUsers) / (maxUsers - minUsers);
    return minRadius + normalized * (maxRadius - minRadius);
  };

  const calculateColor = (users) => {
    const normalized = (users - minUsers) / (maxUsers - minUsers);
    if (normalized < 0.33) return '#3388ff';
    if (normalized < 0.66) return '#32cd32';
    return '#ff0000';
  };

  return data.map((point, index) => (
    <Circle
      key={index}
      center={[parseFloat(point.Latitud), parseFloat(point.Longitud.trim())]}
      radius={calculateRadius(point.num_usuarios)}
      pathOptions={{
        fillColor: calculateColor(point.num_usuarios),
        fillOpacity: 0.6,
        color: calculateColor(point.num_usuarios),
        weight: 1
      }}
    >
      <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
        <div className="popup-content">
          <div className="popup-title">{point.Nombre_calle}</div>
          <div className="popup-info-container">
            <div className="popup-info">
              <span className="popup-label">Usuarios:</span>
              <span className="popup-value">{point.num_usuarios}</span>
            </div>
          </div>
        </div>
      </Tooltip>
    </Circle>
  ));
};

const HeatMap = ({ mapaClienteZona }) => {
  const ZOOM_LEVEL = 15.5;
  const CENTER = [43.26826, -1.97609];

  return (
    <div className="map-content-cl">
      <div className="map-wrapper-cl">
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
          <HeatMapLayer data={mapaClienteZona} />
        </MapContainer>
      </div>
    </div>
  );
};

export default HeatMap;
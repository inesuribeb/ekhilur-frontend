import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import mockDataMap from "../../utils/mockDataMap";

// Estilos CSS
const styles = `
    .heatmap-container {
        padding: 20px;
        background-color: #1a1e2e;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .heatmap-title {
        font-size: 1.25rem;
        font-weight: bold;
        margin-bottom: 1rem;
        color: white;
    }

    .map-wrapper {
        height: 500px;
        width: 100%;
        border-radius: 8px;
        overflow: hidden;
    }
`;

// Añadir estilos al head
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// Componente que añade la capa de calor
function HeatmapLayer() {
    const map = useMap();

    useEffect(() => {
        if (window.L.heatLayer) {
            // Convertir los datos al formato que espera leaflet.heat
            const points = mockDataMap.heatmapData.coordinates.map(point => [
                point[0], // latitud
                point[1], // longitud
                point[2]  // intensidad
            ]);

            // Crear y añadir la capa de calor
            const heatLayer = window.L.heatLayer(points, {
                radius: mockDataMap.heatmapData.config.radius,
                blur: mockDataMap.heatmapData.config.blur,
                maxZoom: 15,
                max: mockDataMap.heatmapData.config.maxIntensity,
                gradient: {
                    0.4: '#3388ff',
                    0.6: '#00ff00',
                    0.8: '#ffff00',
                    1.0: '#ff0000'
                }
            });

            heatLayer.addTo(map);

            // Limpieza al desmontar
            return () => {
                map.removeLayer(heatLayer);
            };
        } else {
            console.error('Leaflet.heat plugin not loaded');
        }
    }, [map]);

    return null;
}

const HeatMap2 = () => {
    return (
        <div className="heatmap-container">
            <h2 className="heatmap-title">
                Mapa de Calor de Transacciones en Hernani
            </h2>
            <div className="map-wrapper">
                <MapContainer
                    center={[43.2682, -1.9757]}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
                    />
                    <HeatmapLayer />
                </MapContainer>
            </div>
        </div>
    );
};

export default HeatMap2;
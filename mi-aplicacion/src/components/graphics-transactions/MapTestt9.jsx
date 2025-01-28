import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import { useEffect } from 'react';
import mockDataMap from "../../utils/mockDataMap";

const styles = `
    .heat-symbol-map-container {
        padding: 20px;
        background-color: #1a1e2e;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .heat-symbol-map-title {
        font-size: 1.25rem;
        font-weight: bold;
        margin-bottom: 1rem;
        color: white;
    }

    .heat-symbol-map-wrapper {
        height: 500px;
        width: 100%;
        border-radius: 8px;
        overflow: hidden;
    }

    .transaction-value {
        background: rgba(0, 0, 0, 0.7);
        border: 2px solid white;
        border-radius: 50%;
        color: white;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
    }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

function HeatLayer() {
    const map = useMap();

    useEffect(() => {
        if (window.L.heatLayer) {
            const points = mockDataMap.heatmapData.coordinates.map(point => [
                point[0],
                point[1],
                point[2] / 2 // Reducimos la intensidad para que no domine demasiado
            ]);

            const heatLayer = L.heatLayer(points, {
                radius: 30,
                blur: 20,
                maxZoom: 15,
                max: 1.0,
                gradient: {
                    0.4: '#3388ff',
                    0.6: '#00ff00',
                    0.8: '#ffff00',
                    1.0: '#ff0000'
                }
            }).addTo(map);

            return () => {
                map.removeLayer(heatLayer);
            };
        }
    }, [map]);

    return null;
}

const HeatSymbolMap = () => {
    return (
        <div className="heat-symbol-map-container">
            <h2 className="heat-symbol-map-title">Mapa de Calor con Símbolos de Transacciones</h2>
            <div className="heat-symbol-map-wrapper">
                <MapContainer
                    center={[43.2682, -1.9757]}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
                    />
                    <HeatLayer />
                    
                    {/* Símbolos superpuestos */}
                    {mockDataMap.heatmapData.coordinates.map((point, idx) => {
                        const intensity = point[2] / 100;
                        
                        // Color basado en la intensidad
                        const color = intensity > 0.7 ? '#4CAF50' : 
                                    intensity > 0.4 ? '#FFC107' : 
                                    '#FF5722';

                        const icon = L.divIcon({
                            className: 'transaction-value',
                            html: `<div style="
                                background-color: ${color}; 
                                width: 100%; 
                                height: 100%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                border-radius: 50%;
                                border: 2px solid white;
                            ">${point[2]}%</div>`,
                            iconSize: [30, 30]
                        });

                        return (
                            <CircleMarker
                                key={idx}
                                center={[point[0], point[1]]}
                                radius={10}
                                pathOptions={{
                                    fillColor: color,
                                    fillOpacity: 0.7,
                                    color: 'white',
                                    weight: 2
                                }}
                            >
                                <Popup>
                                    <div style={{ padding: '5px' }}>
                                        <h3 style={{ marginBottom: '8px', fontSize: '16px', fontWeight: 'bold' }}>
                                            Zona {idx + 1}
                                        </h3>
                                        <p style={{ fontSize: '14px' }}>Intensidad: {point[2]}%</p>
                                        <p style={{ fontSize: '14px' }}>Transacciones: {Math.floor(point[2] * 15)}</p>
                                    </div>
                                </Popup>
                            </CircleMarker>
                        );
                    })}
                </MapContainer>
            </div>
        </div>
    );
};

export default HeatSymbolMap;
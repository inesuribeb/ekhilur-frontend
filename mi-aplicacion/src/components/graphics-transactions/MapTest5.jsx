import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import mockDataMap from "../../utils/mockDataMap";

const styles = `
    .ripple-map-container {
        padding: 20px;
        background-color: #1a1e2e;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .ripple-map-title {
        font-size: 1.25rem;
        font-weight: bold;
        margin-bottom: 1rem;
        color: white;
    }

    .ripple-map-wrapper {
        height: 500px;
        width: 100%;
        border-radius: 8px;
        overflow: hidden;
    }

    @keyframes ripple {
        0% {
            opacity: 0.8;
            transform: scale(0.3);
        }
        100% {
            opacity: 0;
            transform: scale(1);
        }
    }

    .ripple-circle {
        position: relative;
    }

    .ripple-circle::before,
    .ripple-circle::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: inherit;
        animation: ripple 2s infinite;
        transform-origin: center;
    }

    .ripple-circle::after {
        animation-delay: 1s;
    }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

const RippleMap = () => {
    // Encontrar el valor máximo para normalizar los tamaños
    const maxIntensity = Math.max(...mockDataMap.heatmapData.coordinates.map(point => point[2]));

    return (
        <div className="ripple-map-container">
            <h2 className="ripple-map-title">Mapa de Intensidad de Transacciones en Hernani</h2>
            <div className="ripple-map-wrapper">
                <MapContainer
                    center={[43.2682, -1.9757]}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
                    />
                    {mockDataMap.heatmapData.coordinates.map((point, idx) => {
                        const intensity = point[2] / maxIntensity;
                        const baseRadius = Math.max(20, intensity * 40);
                        
                        // Color basado en la intensidad
                        const color = intensity > 0.7 ? '#4CAF50' : 
                                    intensity > 0.4 ? '#FFC107' : 
                                    '#FF5722';

                        return (
                            <div key={idx}>
                                {/* Círculo base */}
                                <CircleMarker
                                    center={[point[0], point[1]]}
                                    radius={baseRadius / 2}
                                    pathOptions={{
                                        fillColor: color,
                                        fillOpacity: 0.7,
                                        color: 'white',
                                        weight: 1
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

                                {/* Círculos de onda */}
                                {[1, 2, 3].map((ring) => (
                                    <CircleMarker
                                        key={`ring-${ring}`}
                                        center={[point[0], point[1]]}
                                        radius={baseRadius}
                                        pathOptions={{
                                            fillColor: color,
                                            fillOpacity: 0.1,
                                            color: color,
                                            weight: 1,
                                            opacity: 0.3
                                        }}
                                    />
                                ))}
                            </div>
                        );
                    })}
                </MapContainer>
            </div>
        </div>
    );
};

export default RippleMap;
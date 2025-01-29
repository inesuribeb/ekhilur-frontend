import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import mockDataMap from "../../utils/mockDataMap";

const styles = `
    .radial-map-container {
        padding: 20px;
        background-color: #1a1e2e;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .radial-map-title {
        font-size: 1.25rem;
        font-weight: bold;
        margin-bottom: 1rem;
        color: white;
    }

    .radial-map-wrapper {
        height: 500px;
        width: 100%;
        border-radius: 8px;
        overflow: hidden;
    }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

const RadialGradientMap = () => {
    return (
        <div className="radial-map-container">
            <h2 className="radial-map-title">Mapa de Gradiente Radial de Transacciones</h2>
            <div className="radial-map-wrapper">
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
                        const intensity = point[2] / 100;
                        const gradientSteps = 8;
                        const maxRadius = 50;

                        return Array.from({ length: gradientSteps }).map((_, step) => {
                            const radius = (step + 1) * (maxRadius / gradientSteps);
                            const opacity = (1 - step / gradientSteps) * intensity;
                            
                            // Color basado en la intensidad
                            const color = intensity > 0.7 ? '#4CAF50' : 
                                        intensity > 0.4 ? '#FFC107' : 
                                        '#FF5722';

                            return (
                                <CircleMarker
                                    key={`${idx}-${step}`}
                                    center={[point[0], point[1]]}
                                    radius={radius}
                                    pathOptions={{
                                        fillColor: color,
                                        fillOpacity: opacity,
                                        stroke: step === 0,
                                        color: 'white',
                                        weight: step === 0 ? 1 : 0
                                    }}
                                >
                                    {step === 0 && (
                                        <Popup>
                                            <div style={{ padding: '5px' }}>
                                                <h3 style={{ marginBottom: '8px', fontSize: '16px', fontWeight: 'bold' }}>
                                                    Zona {idx + 1}
                                                </h3>
                                                <p style={{ fontSize: '14px' }}>Intensidad: {point[2]}%</p>
                                                <p style={{ fontSize: '14px' }}>Transacciones: {Math.floor(point[2] * 15)}</p>
                                            </div>
                                        </Popup>
                                    )}
                                </CircleMarker>
                            );
                        });
                    })}
                </MapContainer>
            </div>
        </div>
    );
};

export default RadialGradientMap;
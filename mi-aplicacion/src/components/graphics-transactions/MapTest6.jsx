import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import mockDataMap from "../../utils/mockDataMap";

const styles = `
    .isoline-map-container {
        padding: 20px;
        background-color: #1a1e2e;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .isoline-map-title {
        font-size: 1.25rem;
        font-weight: bold;
        margin-bottom: 1rem;
        color: white;
    }

    .isoline-map-wrapper {
        height: 500px;
        width: 100%;
        border-radius: 8px;
        overflow: hidden;
    }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

const IsolineMap = () => {
    return (
        <div className="isoline-map-container">
            <h2 className="isoline-map-title">Mapa de Isolíneas de Transacciones</h2>
            <div className="isoline-map-wrapper">
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
                        // Crear múltiples círculos concéntricos para simular isolíneas
                        const isolines = [0.2, 0.4, 0.6, 0.8, 1.0];
                        return isolines.map((iso, isoIdx) => (
                            <CircleMarker
                                key={`${idx}-${isoIdx}`}
                                center={[point[0], point[1]]}
                                radius={iso * (point[2] / 2)}
                                pathOptions={{
                                    color: '#4fc3f7',
                                    weight: 1,
                                    fillOpacity: 0.1,
                                    fillColor: '#4fc3f7',
                                }}
                            >
                                {isoIdx === isolines.length - 1 && (
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
                        ));
                    })}
                </MapContainer>
            </div>
        </div>
    );
};

export default IsolineMap;
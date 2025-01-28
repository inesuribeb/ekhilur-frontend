import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import mockDataMap from "../../utils/mockDataMap";

const styles = `
    .bubble-map-container {
        padding: 20px;
        background-color: #1a1e2e;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .bubble-map-title {
        font-size: 1.25rem;
        font-weight: bold;
        margin-bottom: 1rem;
        color: white;
    }

    .bubble-map-wrapper {
        height: 500px;
        width: 100%;
        border-radius: 8px;
        overflow: hidden;
    }

    .bubble-map-popup {
        background-color: #1a1e2e;
        color: white;
        border-radius: 4px;
        padding: 10px;
    }
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

const BubbleMap = () => {
    const maxIntensity = Math.max(...mockDataMap.heatmapData.coordinates.map(point => point[2]));
    
    return (
        <div className="bubble-map-container">
            <h2 className="bubble-map-title">Mapa de Burbujas de Transacciones en Hernani</h2>
            <div className="bubble-map-wrapper">
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
                        return (
                            <CircleMarker 
                                key={idx}
                                center={[point[0], point[1]]}
                                radius={30}
                                pathOptions={{
                                    fillColor: '#FF5733',
                                    fillOpacity: intensity,
                                    color: 'white',
                                    weight: 1,
                                    opacity: 0.5
                                }}
                            >
                                <Popup className="bubble-map-popup">
                                    <div>
                                        <h3 style={{marginBottom: '8px'}}>Zona {idx + 1}</h3>
                                        <p>Intensidad: {point[2]}%</p>
                                        <p>Transacciones: {Math.floor(point[2] * 15)}</p>
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

export default BubbleMap;
// HeatMap.jsx
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import mockDataMap from "../../utils/mockDataMap";

const HeatMap = () => {
    return (
        <div className="p-4 bg-gray-900 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-white">Mapa de Transacciones en Hernani</h2>
            <MapContainer
                center={[43.2682, -1.9757]}
                zoom={15}
                style={{ height: '500px', width: '100%' }}
                className="rounded-lg"
            >
                <TileLayer
                    url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
                />
                {mockDataMap.heatmapData.coordinates.map((point, idx) => (
                    <CircleMarker 
                        key={idx}
                        center={[point[0], point[1]]}
                        radius={Math.sqrt(point[2]) * 2}
                        pathOptions={{
                            fillColor: '#3388ff',
                            fillOpacity: 0.6,
                            color: '#ffffff',
                            weight: 1
                        }}
                    >
                        <Popup className="dark-popup">
                            <div className="bg-gray-800 text-white p-2 rounded">
                                <h3 className="font-bold mb-2">Zona {idx + 1}</h3>
                                <p className="text-sm">Intensidad: {point[2]}%</p>
                                <p className="text-sm">Transacciones: {Math.floor(point[2] * 15)}</p>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
        </div>
    );
};

// Estilos para los popups oscuros
const styles = `
    .dark-popup .leaflet-popup-content-wrapper {
        background-color: rgb(31, 41, 55);
        color: white;
    }
    .dark-popup .leaflet-popup-tip {
        background-color: rgb(31, 41, 55);
    }
`;

// Añade los estilos al head
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default HeatMap;
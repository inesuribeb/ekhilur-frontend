import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import mockDataMap from "../../utils/mockDataMap";

const styles = `
    .cluster-map-container {
        padding: 20px;
        background-color: #1a1e2e;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .cluster-map-title {
        font-size: 1.25rem;
        font-weight: bold;
        margin-bottom: 1rem;
        color: white;
    }

    .cluster-map-wrapper {
        height: 500px;
        width: 100%;
        border-radius: 8px;
        overflow: hidden;
    }

    .custom-cluster {
        border-radius: 50%;
        color: white;
        text-align: center;
        border: 2px solid white;
        box-shadow: 0 0 5px rgba(0,0,0,0.3);
    }

    .custom-cluster.small {
        background-color: rgba(241, 128, 23, 0.9);
    }

    .custom-cluster.medium {
        background-color: rgba(240, 194, 12, 0.9);
    }

    .custom-cluster.large {
        background-color: rgba(110, 204, 57, 0.9);
    }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

const ClusterMap = () => {
    const [markers, setMarkers] = useState([]);
    
    useEffect(() => {
        const newMarkers = mockDataMap.heatmapData.coordinates.map((point, index) => {
            const intensity = point[2] / 100;
            
            // Determinar el color según la intensidad
            let iconUrl, iconSize;
            if (intensity > 0.7) {
                // Verde para alta intensidad
                iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png';
                iconSize = [30, 45];
            } else if (intensity > 0.4) {
                // Amarillo para intensidad media
                iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png';
                iconSize = [25, 40];
            } else {
                // Rojo para baja intensidad
                iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png';
                iconSize = [20, 35];
            }

            const customIcon = new L.Icon({
                iconUrl: iconUrl,
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                iconSize: iconSize,
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });

            return {
                position: [point[0], point[1]],
                icon: customIcon,
                intensity: point[2],
                transactions: Math.floor(point[2] * 15),
                index: index
            };
        });

        setMarkers(newMarkers);
    }, []);

    return (
        <div className="cluster-map-container">
            <h2 className="cluster-map-title">Mapa de Clusters de Transacciones en Hernani</h2>
            <div className="cluster-map-wrapper">
                <MapContainer
                    center={[43.2682, -1.9757]}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
                    />
                    <MarkerClusterGroup
                        chunkedLoading
                        iconCreateFunction={(cluster) => {
                            const childCount = cluster.getChildCount();
                            let className = 'custom-cluster ';
                            const size = childCount < 4 ? 35 : 
                                       childCount < 7 ? 45 : 
                                       55;
                            
                            className += childCount < 4 ? 'small' : 
                                       childCount < 7 ? 'medium' : 
                                       'large';

                            return L.divIcon({
                                html: `<div style="
                                    line-height: ${size}px;
                                    width: ${size}px;
                                    height: ${size}px;
                                    font-size: ${size * 0.4}px;
                                ">${childCount}</div>`,
                                className: className,
                                iconSize: L.point(size, size)
                            });
                        }}
                    >
                        {markers.map((marker, idx) => (
                            <Marker
                                key={idx}
                                position={marker.position}
                                icon={marker.icon}
                            >
                                <Popup>
                                    <div style={{ padding: '5px' }}>
                                        <h3 style={{ marginBottom: '8px', fontSize: '16px', fontWeight: 'bold' }}>
                                            Zona {marker.index + 1}
                                        </h3>
                                        <p style={{ fontSize: '14px' }}>Intensidad: {marker.intensity}%</p>
                                        <p style={{ fontSize: '14px' }}>Transacciones: {marker.transactions}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MarkerClusterGroup>
                </MapContainer>
            </div>
        </div>
    );
};

export default ClusterMap;
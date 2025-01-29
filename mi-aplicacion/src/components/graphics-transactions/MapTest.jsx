import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { useState, useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import "./MapTest.css";
import mockDataMap from "../../utils/mockDataMap";

const HeatMap = () => {
    const [mapSize, setMapSize] = useState(0);
    const containerRef = useRef(null);
    const mapRef = useRef(null);

    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const newSize = containerRef.current.offsetWidth;
                setMapSize(newSize);
                
                // Invalidate map size after setting the new size
                if (mapRef.current) {
                    mapRef.current.invalidateSize();
                }
            }
        };

        // Initial size calculation after component mount
        updateSize();

        // Set up ResizeObserver for responsive updates
        const resizeObserver = new ResizeObserver(updateSize);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        // Cleanup
        return () => {
            if (containerRef.current) {
                resizeObserver.unobserve(containerRef.current);
            }
            resizeObserver.disconnect();
        };
    }, []);

    const getIntensityColor = (intensity) => {
        const colors = [
            '#60A5FA',
            '#818CF8',
            '#A78BFA',
            '#C084FC',
        ];
        const index = Math.floor((intensity / 100) * (colors.length - 1));
        return colors[index];
    };

    const HERNANI_CENTER = [43.2682, -1.9757];
    const ZOOM_LEVEL = 15;

    return (
        <div className="heatmap-container">
            <div className="heatmap-header">
                <h2 className="heatmap-title">Mapa de Actividad en Hernani</h2>
            </div>
            <div className="heatmap-content">
                <div 
                    ref={containerRef}
                    className="map-wrapper"
                    style={{ height: mapSize || '400px' }}
                >
                    {mapSize > 0 && (
                        <MapContainer
                            ref={mapRef}
                            center={HERNANI_CENTER}
                            zoom={ZOOM_LEVEL}
                            style={{ height: '100%', width: '100%' }}
                            className="map-container"
                            maxBounds={[
                                [43.2582, -1.9857],
                                [43.2782, -1.9657]
                            ]}
                            zoomControl={false}
                            dragging={false}
                            touchZoom={false}
                            doubleClickZoom={false}
                            scrollWheelZoom={false}
                            boxZoom={false}
                            keyboard={false}
                            bounceAtZoomLimits={false}
                        >
                            <TileLayer
                                url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
                            />
                            {mockDataMap.heatmapData.coordinates.map((point, idx) => (
                                <CircleMarker 
                                    key={idx}
                                    center={[point[0], point[1]]}
                                    radius={Math.sqrt(point[2]) * 1.5}
                                    pathOptions={{
                                        fillColor: getIntensityColor(point[2]),
                                        fillOpacity: 0.7,
                                        color: 'white',
                                        weight: 0.5
                                    }}
                                >
                                    <Popup>
                                        <div className="popup-content">
                                            <h3 className="popup-title">Zona {idx + 1}</h3>
                                            <div className="popup-info-container">
                                                <div className="popup-info">
                                                    <span className="popup-label">Intensidad:</span>
                                                    <span className="popup-value">{point[2]}%</span>
                                                </div>
                                                <div className="popup-info">
                                                    <span className="popup-label">Transacciones:</span>
                                                    <span className="popup-value">
                                                        {Math.floor(point[2] * 15)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Popup>
                                </CircleMarker>
                            ))}
                        </MapContainer>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HeatMap;
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';
import Footer from '../footer/Footer';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = () => {
    return (
        <div className="map-container">
            <MapContainer 
                center={[43.2682, -1.9762]} 
                zoom={15} 
                className="map"
                zoomControl={false}  // Desactivamos controles por defecto
                attributionControl={false}  // Quitamos la atribución para más espacio
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[43.2682, -1.9762]}>
                    <Popup>
                        ¡Bienvenido a Hernani!
                    </Popup>
                </Marker>
            </MapContainer>
            <Footer />
        </div>
    );
};

export default MapComponent;
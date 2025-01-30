import { getAllClients } from '../../utils/apiController';
import { useEffect, useState } from 'react';
import './Clients.css';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await getAllClients();
                if (response.success) {
                    setClients(response.data);
                } else {
                    setError(response.message || 'Error al cargar los clientes');
                }
            } catch (error) {
                setError('Error al cargar los clientes');
                console.error('Error fetching clients:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    if (loading) {
        return (
            <div className="clients-container">
                <h2>Clientes</h2>
                <p>Cargando clientes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="clients-container">
                <h2>Clientes</h2>
                <p className="error-message">{error}</p>
            </div>
        );
    }

    return (
        <div className="clients-container">
            <h2>Clientes</h2>
            {clients.length === 0 ? (
                <p>No hay clientes para mostrar</p>
            ) : (
                <div className="clients-grid">
                    {clients.map((client) => (
                        <div key={client.Id_usuario} className="client-card">
                            <div className="client-header">
                                <h3>Cliente ID: {client.Id_usuario.slice(0, 8)}...</h3>
                                <span className="client-type">{client.Tipo_usuario}</span>
                            </div>
                            <div className="client-details">
                                <p><strong>Edad:</strong> {client.Edad}</p>
                                <p><strong>CP:</strong> {client.CP}</p>
                                <p><strong>Total Disponible:</strong> {client.Total_disponible}</p>
                                <p><strong>Capital Social:</strong> {client.Capital_social_abonado}</p>
                            </div>
                            <div className="client-footer">
                                <span>Alta: {client.Id_fecha_alta} - {client.Hora_alta}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Clients;
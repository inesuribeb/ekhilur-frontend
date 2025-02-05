import React, { useState, useEffect } from 'react';
import { getClientData } from '../../utils/apiController';
import './Matrixgraph.css';

//DE MOMENTO ES INSERVIBLE POR QUE EL EJE Y YA REPRESENTA LA CANTIDAD. TANTO EL EJEX COMO EL Y DEBERÍAN REPRESENTAR MEDIDAS DE TIEMPO PARA QUE LA INTENSIDAD DEL COLOR REPRESENTE LA INTENSIDAD

const MatrixGraph = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const GRID_HEIGHT = 20; // Número de celdas en el eje Y

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getClientData();
                if (response?.success && response?.data?.transaccionesPorHora) {
                    setData(response.data);
                } else {
                    throw new Error('La respuesta del servidor no tiene el formato esperado');
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message || 'Error al cargar los datos');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="loading-state">Cargando...</div>;
    if (error) return <div className="error-state">Error: {error}</div>;
    if (!data) return <div className="no-data-state">No hay datos disponibles</div>;

    // Preparar los datos
    const hours = Array.from({ length: 24 }, (_, hora) => {
        const datoHora = data.transaccionesPorHora.find(
            item => parseInt(item.Hora_Dia) === hora
        );
        return {
            hour: hora,
            value: datoHora ? parseFloat(datoHora.Promedio_Cantidad) : 0
        };
    });

    const maxValue = Math.max(...hours.map(h => h.value));

    // Crear grid de celdas
    const grid = Array.from({ length: GRID_HEIGHT }, (_, y) => {
        return hours.map((hour) => {
            const threshold = (GRID_HEIGHT - y) * (maxValue / GRID_HEIGHT);
            const isActive = hour.value >= threshold;
            // Calcular la intensidad basada en el valor real
            const intensity = isActive ? (hour.value / maxValue) : 0;
            return {
                hour: hour.hour,
                value: hour.value,
                active: isActive,
                intensity: intensity,
                y: y
            };
        });
    });

    return (
        <div className="matrix-container">
            <div className="matrix-grid">
                {grid.map((row, y) => (
                    <div key={y} className="matrix-row">
                        {row.map((cell, x) => (
                            <div 
                                key={`${x}-${y}`}
                                className={`matrix-cell ${cell.active ? 'active' : ''}`}
                                style={{
                                    backgroundColor: cell.active ? `rgba(255, 99, 132, ${cell.intensity})` : 'transparent'
                                }}
                                title={`${String(cell.hour).padStart(2, '0')}:00 - ${cell.value.toLocaleString()} transacciones`}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div className="hour-labels">
                {hours.map((hour, index) => (
                    <div key={index} className="hour-label">
                        {String(hour.hour).padStart(2, '0')}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MatrixGraph;
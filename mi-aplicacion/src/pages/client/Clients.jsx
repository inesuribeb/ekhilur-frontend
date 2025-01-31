import { getClientData } from '../../utils/apiController';
import { useEffect, useState, useRef } from 'react';
import { Bar, Line, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import './Clients.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const monthTranslations = {
    1: 'Ene', 2: 'Feb', 3: 'Mar', 4: 'Abr',
    5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Ago',
    9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dic'
};

function Clients() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(true);  // Añade este estado

    const ageChartRef = useRef(null);
    const evolutionChartRef = useRef(null);
    const pieChartRef = useRef(null);  // Nueva referencia


    useEffect(() => {
        setIsMounted(true); 

        const fetchData = async () => {
            if (!isMounted) return;  // No hacer la petición si no está montado

            try {
                const response = await getClientData();
                if (response.success) {
                    setData(response.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            setIsMounted(false);  // Componente desmontado

            if (ageChartRef.current) {
                ageChartRef.current.destroy();
            }
            if (evolutionChartRef.current) {
                evolutionChartRef.current.destroy();
            }
            if (pieChartRef.current) {
                pieChartRef.current.destroy();
            }
        };
    }, []);

    if (!isMounted) return null;


    if (loading || !data) {
        return <div>Cargando...</div>;
    }

    // Datos para el gráfico de distribución por edad
    const ageDistributionData = {
        labels: data.usuariosPorEdad.map(item => item.Grupo_edad),
        datasets: [{
            label: 'Número de usuarios',
            data: data.usuariosPorEdad.map(item => item.cantidad_usuarios),
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            borderColor: 'rgb(53, 162, 235)',
            borderWidth: 1
        }]
    };

    // Datos para el gráfico de evolución de altas
    const evolutionData = {
        labels: data.evolucionAltas.map(item => {
            const year = item.Ano.split('.')[0];
            const month = monthTranslations[parseInt(item.Mes)];
            return `${month} ${year}`;
        }),
        datasets: [{
            label: 'Nuevas altas',
            data: data.evolucionAltas.map(item => item.total_usuarios),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            tension: 0.3,
            fill: true
        }]
    };

    const paymentData = {
        labels: data.porcentajePagos.map(item => item.Operacion),
        datasets: [{
            data: data.porcentajePagos.map(item => parseFloat(item.porcentaje)),
            backgroundColor: [
                'rgba(54, 162, 235, 0.8)',
                'rgba(75, 192, 192, 0.8)'
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
        }]
    };

    const transactionsByAgeData = {
        labels: Array.from(new Set(data.transaccionesPorEdad.map(item => item.Grupo_edad))),
        datasets: [
            {
                label: 'Pago a usuario',
                data: data.transaccionesPorEdad
                    .filter(item => item.Id_tipo_operacion === 1)
                    .map(item => item.total_transacciones),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            },
            {
                label: 'Cobro desde QR',
                data: data.transaccionesPorEdad
                    .filter(item => item.Id_tipo_operacion === 7)
                    .map(item => item.total_transacciones),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]
    };

    const ticketMedioData = {
        labels: data.ticketMedio.map(item => item.Operacion),
        datasets: [{
            label: 'Ticket Medio (EUR)',
            data: data.ticketMedio.map(item => parseFloat(item.Ticket_medio)),
            backgroundColor: 'rgba(153, 102, 255, 0.5)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
        }]
    };

    const transactionsByHourData = {
        labels: data.transaccionesPorHora.map(item =>
            `${String(item.Hora_Dia).padStart(2, '0')}:00`  // Formato 24h
        ),
        datasets: [{
            label: 'Promedio de transacciones',
            data: data.transaccionesPorHora.map(item =>
                parseFloat(item.Promedio_Cantidad)
            ),
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: 'rgba(255, 99, 132, 1)'
        }]
    };



    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            }
        }
    };

    const ageOptions = {
        ...commonOptions,
        plugins: {
            ...commonOptions.plugins,
            title: {
                display: true,
                text: 'Distribución de Usuarios por Edad'
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    const evolutionOptions = {
        ...commonOptions,
        plugins: {
            ...commonOptions.plugins,
            title: {
                display: true,
                text: 'Evolución de Altas por Mes'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 250,
                ticks: {
                    stepSize: 50
                },
                title: {
                    display: true,
                    text: 'Número de altas'
                }
            }
        }
    };

    const pieOptions = {
        ...commonOptions,
        plugins: {
            ...commonOptions.plugins,
            title: {
                display: true,
                text: 'Distribución de Tipos de Pago'
            },
            legend: {
                position: 'bottom'
            }
        }
    };

    const transactionsByAgeOptions = {
        ...commonOptions,
        plugins: {
            ...commonOptions.plugins,
            title: {
                display: true,
                text: 'Transacciones por Grupo de Edad'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Número de transacciones'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    const ticketMedioOptions = {
        ...commonOptions,
        plugins: {
            ...commonOptions.plugins,
            title: {
                display: true,
                text: 'Ticket Medio por Tipo de Operación'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'EUR'
                },
                ticks: {
                    callback: function (value) {
                        return value.toFixed(2) + ' €';
                    }
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    const transactionsByHourOptions = {
        ...commonOptions,
        plugins: {
            ...commonOptions.plugins,
            title: {
                display: true,
                text: 'Transacciones por Hora del Día'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Promedio de transacciones'
                },
                ticks: {
                    callback: function (value) {
                        return value.toLocaleString();  // Formato con separadores de miles
                    }
                }
            },
            x: {
                grid: {
                    display: true
                },
                title: {
                    display: true,
                    text: 'Hora del día'
                }
            }
        }
    };

    return (
        <div className="clients-container">
            <div className="charts-grid">
                <div className="chart-section">
                    <h2 className="text-xl font-bold mb-4">Distribución por Edad</h2>
                    <div className="h-[300px]">
                        <Bar
                            ref={ageChartRef}
                            data={ageDistributionData}
                            options={ageOptions}
                        />
                    </div>
                </div>

                <div className="chart-section">
                    <h2 className="text-xl font-bold mb-4">Evolución del número de altas por mes</h2>
                    <div className="h-[300px]">
                        <Line
                            ref={evolutionChartRef}
                            data={evolutionData}
                            options={evolutionOptions}
                        />
                    </div>
                </div>

                <div className="chart-section">
                    <h2 className="text-xl font-bold mb-4">Tipos de Pago</h2>
                    <div className="h-[500px] flex items-center justify-center">
                        <Pie
                            ref={pieChartRef}
                            data={paymentData}
                            options={pieOptions}
                        />
                    </div>
                </div>

                <div className="chart-section">
                    <h2 className="text-xl font-bold mb-4">Transacciones por Edad</h2>
                    <div className="h-[500px]">
                        <Bar
                            data={transactionsByAgeData}
                            options={transactionsByAgeOptions}
                        />
                    </div>
                </div>

                <div className="chart-section">
                    <h2 className="text-xl font-bold mb-4">Ticket Medio</h2>
                    <div className="h-[500px]">
                        <Bar
                            data={ticketMedioData}
                            options={ticketMedioOptions}
                        />
                    </div>
                </div>

                <div className="chart-section">
                    <h2 className="text-xl font-bold mb-4">Transacciones por Hora</h2>
                    <div className="h-[500px]">
                        <Line
                            data={transactionsByHourData}
                            options={transactionsByHourOptions}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Clients;
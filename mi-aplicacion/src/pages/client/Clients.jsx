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
    ArcElement,
    Filler
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
    ArcElement,
    Filler
);

const monthTranslations = {
    1: 'Ene', 2: 'Feb', 3: 'Mar', 4: 'Abr',
    5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Ago',
    9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dic'
};

function Clients() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const chartInstances = useRef({});

    useEffect(() => {

        const cleanupCharts = () => {
            Object.values(chartInstances.current).forEach(chart => {
                if (chart && typeof chart.destroy === 'function') {
                    chart.destroy();
                }
            });
            chartInstances.current = {};
        };


        const fetchData = async () => {

            try {
                const response = await getClientData();

                if (response?.error) {
                    throw new Error(response.error);
                }

                if (response?.success && response?.data) {
                    const requiredProperties = [
                        'usuariosPorEdad',
                        'evolucionAltas',
                        'porcentajePagos',
                        'transaccionesPorEdad',
                        'ticketMedio',
                        'transaccionesPorHora'
                    ];

                    const missingProperties = requiredProperties.filter(prop => !response.data[prop]);

                    if (missingProperties.length > 0) {
                        throw new Error(`Faltan datos requeridos: ${missingProperties.join(', ')}`);
                    }

                    setData(response.data);
                } else {
                    throw new Error('La respuesta del servidor no tiene el formato esperado');
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message || 'Error al cargar los datos. Por favor, intente nuevamente más tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            cleanupCharts();
        };

    }, []);


    if (loading) return <div className="p-4">Cargando...</div>;
    if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
    if (!data) return <div className="p-4">No hay datos disponibles</div>;

    const ageDistributionData = {
        labels: data.usuariosPorEdad.map(item => item.Grupo_edad),
        datasets: [{
            label: 'Número de usuarios',
            data: data.usuariosPorEdad.map(item => item.cantidad_usuarios),
            borderColor: 'rgb(44, 47, 136)',
            backgroundColor: 'rgba(44, 47, 136, 0.5)',
            borderWidth: 1
        }]
    };

    const evolutionData = {
        labels: data.evolucionAltas.map(item => {
            const year = item.Ano.split('.')[0];
            const month = monthTranslations[parseInt(item.Mes)];
            return `${month} ${year}`;
        }),
        datasets: [{
            label: 'Nuevas altas',
            data: data.evolucionAltas.map(item => item.total_usuarios),
            borderColor: 'rgb(71, 84, 198)',
            backgroundColor: '(214, 216, 222, 0.5)',
            tension: 0.3,
            fill: true
        }]
    };

    const paymentData = {
        labels: data.porcentajePagos.map(item => item.Operacion),
        datasets: [{
            data: data.porcentajePagos.map(item => parseFloat(item.porcentaje)),
            backgroundColor: [
                'rgba(242, 152, 188, 0.8)',
                'rgba(230, 88, 88, 0.8)'
            ],
            borderColor: [
                'rgba(242, 152, 188,)',
                'rgba(230, 88, 88)'
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
                backgroundColor: 'rgba(254, 232, 3, 0.8)',
                borderColor: 'rgba(254, 232, 3)',
                borderWidth: 1
            },
            {
                label: 'Cobro desde QR',
                data: data.transaccionesPorEdad
                    .filter(item => item.Id_tipo_operacion === 7)
                    .map(item => item.total_transacciones),
                backgroundColor: 'rgba(251, 68, 2, 0.8)',
                borderColor: 'rgba(251, 68, 2)',
                borderWidth: 1
            }
        ]
    };

    const ticketMedioData = {
        labels: data.ticketMedio.map(item => item.Operacion),
        datasets: [{
            label: 'Ticket Medio (EUR)',
            data: data.ticketMedio.map(item => parseFloat(item.Ticket_medio)),
            backgroundColor: 'rgba(251, 81, 6, 0.5)',
            borderColor: 'rgba(251, 81, 6, 1)',
            borderWidth: 1
        }]
    };

    const transactionsByHourData = {
        labels: data.transaccionesPorHora.map(item =>
            `${String(item.Hora_Dia).padStart(2, '0')}:00`
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
                // text: 'Distribución de Usuarios por Edad'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: false  // Quita las líneas horizontales
                },
                border: {
                    display: false  // Quita la línea del eje Y
                }
            },
            x: {
                grid: {
                    display: false  // Quita las líneas verticales
                },
                border: {
                    display: false  // Quita la línea del eje Y
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
                // text: 'Distribución de Tipos de Pago'
            },
            legend: {
                position: 'bottom'
            }
        }
    };

    const evolutionOptions = {
        ...commonOptions,
        plugins: {
            ...commonOptions.plugins,
            title: {
                display: true,
                // text: 'Evolución de Altas por Mes'
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
                },
                grid: {
                    display: false  // Quita las líneas horizontales
                },
                border: {
                    display: false  // Quita la línea del eje Y
                },
                ticks: {
                    color: '#000000'  // Color para los números del eje Y
                }
            },
            x: {
                grid: {
                    display: false  // Quita las líneas verticales
                },
                border: {
                    display: false  // Quita la línea del eje Y
                },
                ticks: {
                    color: '#000000'  // Color para los números del eje Y
                }
            }
        }
    };

    const transactionsByAgeOptions = {
        ...commonOptions,
        plugins: {
            ...commonOptions.plugins,
            title: {
                display: true,
                // text: 'Transacciones por Grupo de Edad'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Número de transacciones'
                },
                grid: {
                    display: false
                },
                border: {
                    display: false  // Quita la línea del eje Y
                }
            },
            x: {
                grid: {
                    display: false
                },
                border: {
                    display: false  // Quita la línea del eje Y
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
                // text: 'Ticket Medio por Tipo de Operación'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'EUR'
                },
                grid: {
                    display: false
                },
                ticks: {
                    callback: function (value) {
                        return value.toFixed(2) + ' €';
                    }
                },
                border: {
                    display: false  // Quita la línea del eje Y
                }
            },
            x: {
                grid: {
                    display: false
                },
                border: {
                    display: false  // Quita la línea del eje Y
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
                // text: 'Transacciones por Hora del Día'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    // text: 'Promedio de transacciones'
                },
                ticks: {
                    callback: function (value) {
                        return value.toLocaleString();  // Formato con separadores de miles
                    }
                },
                grid: {
                    display: false
                },
                border: {
                    display: false  // Quita la línea del eje Y
                }
            },
            x: {
                grid: {
                    display: false
                },
                title: {
                    display: true,
                    // text: 'Hora del día'
                },
                border: {
                    display: false  // Quita la línea del eje Y
                }
            }
        }
    };

    return (
        <div className="clients-container">
            <div className="charts-grid">
                <div className="charts-grid">

                    <div className="chart-section">

                        <div className='fila1-columna1'>
                            <h2 className="text-xl font-bold mb-4">Distribución de usuarios por Edad</h2>
                            <h1>Sorprendente: los mayores de 55 casi triplican a los jóvenes de 18-25</h1>
                        </div>

                        <div className='fila1-columna2'>
                            <div className="chart-bar">
                                <Bar
                                    ref={(ref) => {
                                        if (ref) {
                                            chartInstances.current['age'] = ref;

                                        }
                                    }}
                                    // ref={ageChartRef}
                                    data={ageDistributionData}
                                    options={ageOptions}
                                />
                            </div>
                        </div>

                    </div>

                    <div className="chart-section">

                        <div className='fila2-columna1'>
                            <div className="chart-line">
                                <Line
                                    ref={(ref) => {
                                        if (ref) {
                                            chartInstances.current['evolution'] = ref;

                                        }
                                    }}
                                    // ref={evolutionChartRef}
                                    data={evolutionData}
                                    options={evolutionOptions}
                                />
                            </div>
                        </div>

                        <div className='fila2-columna2'>
                            <h2 className="text-xl font-bold mb-4">Evolución del número de altas por mes</h2>
                            <h1>Crecimiento Sostenido: Las Altas de Usuarios Se Mantienen Estables Tras un Inicio Explosivo</h1>
                        </div>

                    </div>

                    <div className="chart-section">

                        <div className='fila3-columna1'>
                            <h2 className="text-xl font-bold mb-4">Distribución de tipos de Pago</h2>
                            <h1>El 89.74% de las transacciones corresponden a pagos a usuarios, destacando la preferencia por este método de pago sobre los cobros desde QR</h1>
                        </div>

                        <div className='fila3-columna2'>
                            <div className="chart-pie">
                                <Pie
                                    ref={(ref) => {
                                        if (ref) {

                                            chartInstances.current['pie'] = ref;

                                        }
                                    }}
                                    data={paymentData}
                                    options={pieOptions}
                                />
                            </div>
                        </div>


                    </div>

                    <div className="chart-section">

                        <div className='fila4-columna1'>
                            <div className="chart-bar">
                                <Bar
                                    ref={(ref) => {
                                        if (ref) {

                                            chartInstances.current['transactions'] = ref;

                                        }
                                    }}
                                    data={transactionsByAgeData}
                                    options={transactionsByAgeOptions}
                                />
                            </div>
                        </div>

                        <div className='fila4-columna2'>
                            <h2 className="text-xl font-bold mb-4">Transacciones por grupos de Edad</h2>
                            <h1>Los grupos de edad de 46-65 años lideran las transacciones, con un notable aumento en los pagos y cobros desde QR en personas mayores de 65 años</h1>
                        </div>

                    </div>

                    <div className="chart-section">

                        <div className='fila5-columna1'>
                            <h2 className="text-xl font-bold mb-4">Ticket Medio por Tipo de Operación</h2>
                            <h1>Los pagos a usuarios presentan un ticket medio más alto que los cobros desde QR, reflejando transacciones de mayor valor</h1>
                        </div>

                        <div className='fila5-columna2'>
                            <div className="chart-bar">
                                <Bar
                                    ref={(ref) => {
                                        if (ref) {

                                            chartInstances.current['ticket'] = ref;

                                        }
                                    }}
                                    data={ticketMedioData}
                                    options={ticketMedioOptions}
                                />
                            </div>
                        </div>

                    </div>

                    <div className="chart-section">

                        <div className='fila6-columna1'>
                            <div className="chart-line">
                                <Line
                                    ref={(ref) => {
                                        if (ref) {

                                            chartInstances.current['hourly'] = ref;

                                        }
                                    }}
                                    data={transactionsByHourData}
                                    options={transactionsByHourOptions}
                                />
                            </div>
                        </div>

                        <div className='fila6-columna2'>
                            <h2 className="text-xl font-bold mb-4">Transacciones por Hora del Día</h2>
                            <h1>Las transacciones alcanzan su pico entre las 10:00 AM y las 12:00 PM, lo que sugiere una mayor actividad durante las primeras horas del día</h1>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default Clients;
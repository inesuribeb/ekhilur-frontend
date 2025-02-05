import React, { useEffect, useState, useRef, useContext } from 'react';
import { getClientData } from '../../utils/apiController';
import { LanguageContext } from '../../context/LanguageContext';
import LoadComponent from '../../components/loadComponent/LoadComponent';
import translate from '../../utils/language';
import { Bar, Line, Pie } from "react-chartjs-2";
import HeatMap from './HeatMap';
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
    const { language } = useContext(LanguageContext);

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
                        'transaccionesPorHora',
                        'mapaClienteZona'
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
                setError(err.message || 'Error al cargar los datos');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        return () => {
            cleanupCharts();
        };
    }, []);

    // if (loading) return <div className="p-4">Cargando...</div>;
    if (loading) return <LoadComponent isLoading={loading} />;

    if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
    if (!data) return <div className="p-4">No hay datos disponibles</div>;

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
        scales: {
            y: {
                beginAtZero: true,
                grid: { display: false },
                border: { display: false }
            },
            x: {
                grid: { display: false },
                border: { display: false }
            }
        }
    };

    const chartData = {
        ageDistribution: {
            labels: data.usuariosPorEdad.map(item => item.Grupo_edad),
            datasets: [{
                label: translate.userNumber[language],
                data: data.usuariosPorEdad.map(item => item.cantidad_usuarios),
                borderColor: 'rgb(0, 0, 0)',
                backgroundColor: 'rgb(0, 0, 0)',
                borderWidth: 1
            }]
        },
<<<<<<< HEAD
        scales: {
            y: {
                beginAtZero: true,
                max: 250,
                stepSize: 50,
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
=======
        evolution: {
            labels: data.evolucionAltas.map(item => {
                const year = item.Ano.split('.')[0];
                const month = monthTranslations[parseInt(item.Mes)];
                return `${month} ${year}`;
            }),
            datasets: [{
                label: translate.userNumber[language],
                data: data.evolucionAltas.map(item => item.total_usuarios),
                borderColor: 'rgb(71, 84, 198)',
                backgroundColor: 'rgba(214, 216, 222, 0.5)',
                tension: 0.3,
                fill: true
            }]
>>>>>>> 41fff86bbd8b817c23fb918bc28e36c0e4495805
        },
        payment: {
            labels: data.porcentajePagos.map(item => item.Operacion),
            datasets: [{
                data: data.porcentajePagos.map(item => parseFloat(item.porcentaje)),
                backgroundColor: [
                    'rgba(230, 234, 41, 1)',
                    'rgba(0, 0, 0, 1)'
                    
                ],
                borderColor: [
                    'rgba(230, 234, 41)',
                    'rgba(0, 0 , 0)'
                    
                ],
                borderWidth: 1
            }]
        },
        transactionsByAge: {
            labels: Array.from(new Set(data.transaccionesPorEdad.map(item => item.Grupo_edad))),
            datasets: [
                {
                    label: translate.payToUser[language],
                    data: data.transaccionesPorEdad
                        .filter(item => item.Id_tipo_operacion === 1)
                        .map(item => item.total_transacciones),
                    backgroundColor: 'rgba(0, 0, 0)',
                    borderColor: 'rgba(0, 0, 0)',
                    borderWidth: 1
                },
                {
                    label: translate.QRpay[language],
                    data: data.transaccionesPorEdad
                        .filter(item => item.Id_tipo_operacion === 7)
                        .map(item => item.total_transacciones),
                    backgroundColor: 'rgba(187, 145, 255, 1)',
                    borderColor: 'rgba(187, 145, 255',
                    borderWidth: 1
                }
            ]
        },
        ticketMedio: {
            labels: data.ticketMedio.map(item => item.Operacion),
            datasets: [{
                label: translate.averageTicket[language],
                data: data.ticketMedio.map(item => parseFloat(item.Ticket_medio)),
                backgroundColor: 'rgba(187, 145, 255)',
                borderColor: 'rgba(187, 145, 255)',
                borderWidth: 1
            }]
        },
        transactionsByHour: {
            labels: data.transaccionesPorHora.map(item => 
                `${String(item.Hora_Dia).padStart(2, '0')}:00`
            ),
            datasets: [{
                label: translate.averageTransactions[language],
                data: data.transaccionesPorHora.map(item => 
                    parseFloat(item.Promedio_Cantidad)
                ),
                borderColor: 'rgba(0, 0, 0, 1)',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: 'rgba(0, 0, 0, 1)'
            }]
        }
    };

    return (
        <div className="clients-container">
            <div className="charts-grid">
                <div className="chart-section">
                    <div className='fila1-columna1'>
                        <h2 className="text-xl font-bold mb-4">{translate.ageDistribution[language]}</h2>
                        <h1>{translate.ageDistributionText[language]}</h1>
                    </div>
                    <div className='fila1-columna2'>
                        <div className="chart-bar">
                            <Bar
                                ref={ref => { if (ref) chartInstances.current['age'] = ref }}
                                data={chartData.ageDistribution}
                                options={ageOptions}
                            />
                        </div>
                    </div>
                </div>

                <div className="chart-section">
                    <div className='fila2-columna1'>
                        <div className="chart-line">
                            <Line
                                ref={ref => { if (ref) chartInstances.current['evolution'] = ref }}
                                data={chartData.evolution}
                                options={commonOptions}
                            />
                        </div>
                    </div>
                    <div className='fila2-columna2'>
                        <h2 className="text-xl font-bold mb-4">{translate.signUpEvolution[language]}</h2>
                        <h1>{translate.signUpEvolutionText[language]}</h1>
                    </div>
                </div>

                <div className="chart-section">
                    <div className='fila3-columna1'>
                        <h2 className="text-xl font-bold mb-4">{translate.payDistribution[language]}</h2>
                        <h1>{translate.payDistributionText[language]}</h1>
                    </div>
                    <div className='fila3-columna2'>
                        <div className="chart-pie">
                            <Pie
                                ref={ref => { if (ref) chartInstances.current['payment'] = ref }}
                                data={chartData.payment}
                                options={commonOptions}
                            />
                        </div>
                    </div>
                </div>

                <div className="chart-section">
                    <div className='fila4-columna1'>
                        <div className="chart-bar">
                            <Bar
                                ref={ref => { if (ref) chartInstances.current['transactions'] = ref }}
                                data={chartData.transactionsByAge}
                                options={commonOptions}
                            />
                        </div>
                    </div>
                    <div className='fila4-columna2'>
                        <h2 className="text-xl font-bold mb-4">{translate.transactionsByAge[language]}</h2>
                        <h1>{translate.transactionsByAgeText[language]}</h1>
                    </div>
                </div>

                <div className="chart-section">
                    <div className='fila5-columna1'>
                        <h2 className="text-xl font-bold mb-4">{translate.averageTicketByOperationType[language]}</h2>
                        <h1>{translate.averageTicketByOperationTypeText[language]}</h1>
                    </div>
                    <div className='fila5-columna2'>
                        <div className="chart-bar">
                            <Bar
                                ref={ref => { if (ref) chartInstances.current['ticketMedio'] = ref }}
                                data={chartData.ticketMedio}
                                options={commonOptions}
                            />
                        </div>
                    </div>
                </div>

                <div className="chart-section">
                    <div className='fila6-columna1'>
                        <div className="chart-line">
                            <Line
                                ref={ref => { if (ref) chartInstances.current['hourly'] = ref }}
                                data={chartData.transactionsByHour}
                                options={commonOptions}
                            />
                        </div>
                    </div>
                    <div className='fila6-columna2'>
                        <h2 className="text-xl font-bold mb-4">{translate.transactionsPerHour[language]}</h2>
                        <h1>{translate.transactionsPerHourText[language]}</h1>
                    </div>
                </div>

                <HeatMap mapaClienteZona={data.mapaClienteZona} />
            </div>
        </div>
    );
}

export default Clients;
import React, { useEffect, useState, useRef, useContext } from 'react';
import { getTransactionData } from '../../utils/apiController';
import { LanguageContext } from '../../context/LanguageContext';
import translate from '../../utils/language';
import LoadComponent from '../../components/loadComponent/LoadComponent';
import { Bar, Line, Pie } from "react-chartjs-2";
import TransactionTypeTable from './TransactionTypeTable';
import TicketMap from './TicketMap';
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
import './Transactions.css';
import './TransactionTypeTable.css';

ChartJS.register(
    CategoryScale, LinearScale, BarElement, LineElement,
    PointElement, Title, Tooltip, Legend, ArcElement, Filler
);

const monthTranslations = {
    1: 'Ene', 2: 'Feb', 3: 'Mar', 4: 'Abr',
    5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Ago',
    9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dic'
};

function Transactions() {
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
                const response = await getTransactionData();
                console.log("Full response:", response);
                
                if (!response || !response.data) {
                    throw new Error('No hay datos disponibles');
                }

                const requiredProperties = [
                    'transactions',
                    'totalWastedVsCashBack',
                    'mobileAverage',
                    'transaccionesEntreSemanaYFinDeSemana',
                    'transaccionesPorHora',
                    'mapTicketMedio'
                ];

                const missingProperties = requiredProperties.filter(prop => !response.data[prop]);
                if (missingProperties.length > 0) {
                    throw new Error(`Faltan datos requeridos: ${missingProperties.join(', ')}`);
                }

                setData(response.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        return () => cleanupCharts();
    }, []);

    if (loading) return <LoadComponent isLoading={loading} />;
    if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
    if (!data) return <div className="p-4">No hay datos disponibles</div>;

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { display: false },
                border: { display: false },
                ticks: {
                    callback: value => value >= 1000 ? `${value/1000}K` : value
                }
            },
            x: {
                grid: { display: false },
                border: { display: false }
            }
        }
    };

    const chartData = {
        cashback: {
            labels: data.totalWastedVsCashBack.map(item => item.Categoria || 'Sin categoría'),
            datasets: [{
                data: data.totalWastedVsCashBack.map(item => parseFloat(item.Total || 0)),
                backgroundColor: [
                    'rgb(0, 0, 0)',
                    'rgb(198, 198, 198)'
                ],
                borderColor: [
                    'rgb(0, 0, 0)',
                    'rgb(198, 198, 198)'
                ],
                borderWidth: 1
            }]
        },
        mobileAverage: {
            labels: data.mobileAverage
                .filter(item => new Date(item.Id_fecha) >= new Date('2024-01-31'))
                .filter((_, index) => index % 14 === 0)
                .map(item => {
                    if (!item.Id_fecha) return '';
                    try {
                        const date = new Date(item.Id_fecha);
                        return `${date.getDate()} ${monthTranslations[date.getMonth() + 1]}`;
                    } catch (e) {
                        return 'Fecha inválida';
                    }
                }),
            datasets: [
                {
                    label: 'shift_14',
                    data: data.mobileAverage
                        .filter(item => new Date(item.Id_fecha) >= new Date('2024-01-31'))
                        .filter((_, index) => index % 14 === 0)
                        .map(item => parseFloat(item.shift_14 || 0)),
                    borderColor: 'rgb(233, 236, 23)',
                    tension: 0.4,
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: 'Compras Acumuladas',
                    data: data.mobileAverage
                        .filter(item => new Date(item.Id_fecha) >= new Date('2024-01-31'))
                        .filter((_, index) => index % 14 === 0)
                        .map(item => parseFloat(item.sum_compras_acumulado || 0)),
                    borderColor: 'rgb(54, 162, 235)',
                    tension: 0.4,
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        weekdayVsWeekend: {
            labels: [...new Set(data.transaccionesEntreSemanaYFinDeSemana
                .map(item => monthTranslations[parseInt(item.Mes)] || 'Sin mes'))],
            datasets: [
                {
                    label: 'Entre semana',
                    data: data.transaccionesEntreSemanaYFinDeSemana
                        .filter(item => item.dia_semana === "Entre semana")
                        .map(item => parseFloat(item.Cantidad_total || 0)),
                    backgroundColor: 'rgb(0, 0, 0)',
                    borderColor: 'rgb(0, 0, 0)',
                    borderWidth: 1
                },
                {
                    label: 'Fin de semana',
                    data: data.transaccionesEntreSemanaYFinDeSemana
                        .filter(item => item.dia_semana === "Fin de semana")
                        .map(item => parseFloat(item.Cantidad_total || 0)),
                    backgroundColor: 'rgb(187, 145, 255)',
                    borderColor: 'rgb(187, 145, 255)',
                    borderWidth: 1
                }
            ]
        },
        hourlyTransactions: {
            labels: data.transaccionesPorHora.map(item => 
                `${String(item.Hora_Dia || 0).padStart(2, '0')}:00`
            ),
            datasets: [{
                label: 'Promedio de transacciones por hora',
                data: data.transaccionesPorHora.map(item => parseFloat(item.Promedio_Cantidad || 0)),
                borderColor: 'rgb(153, 102, 255)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                tension: 0.4,
                fill: true
            }]
        }
    };

    return (
        <div className="transactions-container">
            <div className="charts-grid">
                <div className="chart-section">
                    <div className="fila1-columna1">
                        <h2 className="text-xl font-bold mb-4">{translate.transactionsDetails[language]}</h2>
                        <h1>{translate.transactionsDetailsText[language]}</h1>
                    </div>
                    <div className="fila1-columna2">
                        {data && <TransactionTypeTable transactions={data.transactions} />}
                    </div>
                </div>

                <div className="chart-section">
                    <div className="fila2-columna1">
                        <div className="chart-pie">
                            <Pie
                                ref={ref => { if (ref) chartInstances.current['cashback'] = ref }}
                                data={chartData.cashback}
                                options={{
                                    ...commonOptions,
                                    plugins: {
                                        ...commonOptions.plugins,
                                        legend: { position: 'bottom' }
                                    },
                                    scales: {
                                        y: { display: false }
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div className="fila2-columna2">
                        <h2 className="text-xl font-bold mb-4">{translate.cashback[language]}</h2>
                        <h1>{translate.cashbackText[language]}</h1>
                    </div>
                </div>

                <div className="chart-section">
                    <div className="fila3-columna1">
                        <h2 className="text-xl font-bold mb-4">{translate.accumulateBuys[language]}</h2>
                        <h1>{translate.accumulateBuysText[language]}</h1>
                    </div>
                    <div className="fila3-columna2">
                        <div className="chart-line">
                            <Line
                                ref={ref => { if (ref) chartInstances.current['mobile'] = ref }}
                                data={chartData.mobileAverage}
                                options={commonOptions}
                            />
                        </div>
                    </div>
                </div>

                <div className="chart-section">
                    <div className="fila4-columna1">
                        <div className="chart-bar">
                            <Bar
                                ref={ref => { if (ref) chartInstances.current['weekday'] = ref }}
                                data={chartData.weekdayVsWeekend}
                                options={commonOptions}
                            />
                        </div>
                    </div>
                    <div className="fila4-columna2">
                        <h2 className="text-xl font-bold mb-4">{translate.transactionsWeekend[language]}</h2>
                        <h1>{translate.transactionsWeekendText[language]}</h1>
                    </div>
                </div>

                <div className="chart-section">
                    <div className="fila5-columna1">
                        <h2 className="text-xl font-bold mb-4">{translate.transactionsHour[language]}</h2>
                        <h1>{translate.transactionsHourText[language]}</h1>
                    </div>
                    <div className="fila5-columna2">
                        <div className="chart-line">
                            <Line
                                ref={ref => { if (ref) chartInstances.current['hourly'] = ref }}
                                data={chartData.hourlyTransactions}
                                options={commonOptions}
                            />
                        </div>
                    </div>
                </div>

                <TicketMap mapTicketMedio={data.mapTicketMedio} />
            </div>
        </div>
    );
}

export default Transactions;
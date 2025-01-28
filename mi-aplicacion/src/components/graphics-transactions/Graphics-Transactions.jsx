import { Bar, Line, Pie } from "react-chartjs-2";
import { useEffect, useRef } from 'react';
import mockData from "../../utils/mockData";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Registramos los componentes necesarios de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    // Referencias para cada gráfico
    const chartRefs = {
        barChart: useRef(null),
        lineChart: useRef(null),
        pieChart: useRef(null),
        hourlyChart: useRef(null),
        ageChart: useRef(null),
        locationChart: useRef(null),
        amountChart: useRef(null),
        flowChart: useRef(null),
        balanceChart: useRef(null)
    };

    // Cleanup cuando el componente se desmonte
    useEffect(() => {
        return () => {
            Object.values(chartRefs).forEach(ref => {
                if (ref.current) {
                    ref.current.destroy();
                }
            });
        };
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            <div className="p-4 bg-white rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Transacciones por Tipo</h2>
                <div className="h-[300px]">
                    <Bar 
                        ref={chartRefs.barChart}
                        id="transactions-by-type"
                        data={mockData.transactionsByOperation}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false
                        }}
                    />
                </div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Volumen de Transacciones</h2>
                <div className="h-[300px]">
                    <Line 
                        ref={chartRefs.lineChart}
                        id="transactions-volume"
                        data={mockData.transactionsOverTime}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false
                        }}
                    />
                </div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Distribución de Usuarios</h2>
                <div className="h-[300px]">
                    <Pie 
                        ref={chartRefs.pieChart}
                        id="user-distribution"
                        data={mockData.userDistribution}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false
                        }}
                    />
                </div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Transacciones por Hora</h2>
                <div className="h-[300px]">
                    <Bar 
                        ref={chartRefs.hourlyChart}
                        id="transactions-by-hour"
                        data={mockData.transactionsByHour}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false
                        }}
                    />
                </div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Distribución por Edad</h2>
                <div className="h-[300px]">
                    <Bar 
                        ref={chartRefs.ageChart}
                        id="age-distribution"
                        data={mockData.userAgeDistribution}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false
                        }}
                    />
                </div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Transacciones por Ubicación</h2>
                <div className="h-[300px]">
                    <Bar 
                        ref={chartRefs.locationChart}
                        id="location-distribution"
                        data={mockData.transactionsByLocation}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false
                        }}
                    />
                </div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Monto Promedio por Operación</h2>
                <div className="h-[300px]">
                    <Bar 
                        ref={chartRefs.amountChart}
                        id="average-amount"
                        data={mockData.averageAmountByOperationType}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false
                        }}
                    />
                </div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Flujo Mensual de Transacciones</h2>
                <div className="h-[300px]">
                    <Line 
                        ref={chartRefs.flowChart}
                        id="monthly-flow"
                        data={mockData.monthlyTransactionFlow}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false
                        }}
                    />
                </div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Distribución de Saldos</h2>
                <div className="h-[300px]">
                    <Pie 
                        ref={chartRefs.balanceChart}
                        id="balance-distribution"
                        data={mockData.userBalanceDistribution}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
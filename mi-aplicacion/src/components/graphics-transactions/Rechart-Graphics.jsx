import { useEffect, useState } from 'react';
import {
    BarChart, Bar,
    LineChart, Line,
    PieChart, Pie, Sector,
    XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer,
    Cell
} from 'recharts';
import './Graphics-Transactions.css';

const COLORS = ['#60A5FA', '#818CF8', '#A78BFA', '#C084FC', '#A855F7'];

const mockData = {
    transactionsByOperation: [
        { name: 'Depósitos', value: 120 },
        { name: 'Retiros', value: 90 },
        { name: 'Transferencias', value: 150 },
        { name: 'Pagos', value: 80 }
    ],
    transactionsOverTime: [
        { name: 'Ene', value: 300 },
        { name: 'Feb', value: 450 },
        { name: 'Mar', value: 380 },
        { name: 'Abr', value: 500 },
        { name: 'May', value: 420 },
        { name: 'Jun', value: 550 }
    ],
    userDistribution: [
        { name: 'Activos', value: 65 },
        { name: 'Inactivos', value: 25 },
        { name: 'Nuevos', value: 10 }
    ],
    transactionsByHour: [
        { name: '00:00', value: 30 },
        { name: '04:00', value: 15 },
        { name: '08:00', value: 80 },
        { name: '12:00', value: 120 },
        { name: '16:00', value: 90 },
        { name: '20:00', value: 45 }
    ],
    userAgeDistribution: [
        { name: '18-25', value: 250 },
        { name: '26-35', value: 420 },
        { name: '36-45', value: 330 },
        { name: '46-55', value: 200 },
        { name: '56+', value: 150 }
    ],
    transactionsByLocation: [
        { name: 'Centro', value: 450 },
        { name: 'Norte', value: 380 },
        { name: 'Sur', value: 320 },
        { name: 'Este', value: 280 },
        { name: 'Oeste', value: 250 }
    ],
    averageAmountByOperationType: [
        { name: 'Depósitos', value: 1200 },
        { name: 'Retiros', value: 800 },
        { name: 'Transferencias', value: 1500 },
        { name: 'Pagos', value: 500 }
    ],
    monthlyTransactionFlow: [
        { name: 'Ene', value: 5000 },
        { name: 'Feb', value: 6200 },
        { name: 'Mar', value: 5800 },
        { name: 'Abr', value: 7000 },
        { name: 'May', value: 6500 },
        { name: 'Jun', value: 7500 }
    ],
    balanceDistribution: [
        { name: '< 1000', value: 30 },
        { name: '1000-5000', value: 40 },
        { name: '5000-10000', value: 20 },
        { name: '> 10000', value: 10 }
    ]
};

const renderActiveShape = (props) => {
    const {
        cx, cy, innerRadius, outerRadius,
        startAngle, endAngle, fill, payload, percent
    } = props;

    return (
        <g>
            <text x={cx} y={cy - 10} textAnchor="middle" fill="#333" className="pie-label">
                {payload.name}
            </text>
            <text x={cx} y={cy + 10} textAnchor="middle" fill="#333" className="pie-label">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 10}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
        </g>
    );
};

const RechartDashboard = () => {
    const [visibleCharts, setVisibleCharts] = useState(new Set());
    const [activePieIndices, setActivePieIndices] = useState({});

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const chartId = entry.target.dataset.chartId;
                        setVisibleCharts(prev => new Set([...prev, chartId]));
                    }
                });
            },
            {
                rootMargin: '-20px',
                threshold: 0.1
            }
        );

        document.querySelectorAll('.chart-card').forEach(chart => {
            observer.observe(chart);
        });

        return () => observer.disconnect();
    }, []);

    const BarChartComponent = ({ data }) => (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );

    const LineChartComponent = ({ data }) => (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#818CF8" 
                    strokeWidth={2}
                    dot={{ fill: '#818CF8' }}
                    activeDot={{ r: 8 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );

    const PieChartComponent = ({ data, chartId }) => (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    activeIndex={activePieIndices[chartId]}
                    activeShape={renderActiveShape}
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                    onClick={(_, index) => {
                        setActivePieIndices(prev => ({
                            ...prev,
                            [chartId]: prev[chartId] === index ? undefined : index
                        }));
                    }}
                >
                    {data.map((_, index) => (
                        <Cell 
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );

    const charts = [
        {
            id: 'transactions',
            title: 'Transacciones por Tipo',
            component: <BarChartComponent data={mockData.transactionsByOperation} />
        },
        {
            id: 'volume',
            title: 'Volumen de Transacciones',
            component: <LineChartComponent data={mockData.transactionsOverTime} />
        },
        {
            id: 'distribution',
            title: 'Distribución de Usuarios',
            component: <PieChartComponent 
                data={mockData.userDistribution} 
                chartId="distribution" 
            />
        },
        {
            id: 'hourly',
            title: 'Transacciones por Hora',
            component: <BarChartComponent data={mockData.transactionsByHour} />
        },
        {
            id: 'age',
            title: 'Distribución por Edad',
            component: <BarChartComponent data={mockData.userAgeDistribution} />
        },
        {
            id: 'location',
            title: 'Transacciones por Ubicación',
            component: <BarChartComponent data={mockData.transactionsByLocation} />
        },
        {
            id: 'amount',
            title: 'Monto Promedio por Operación',
            component: <BarChartComponent data={mockData.averageAmountByOperationType} />
        },
        {
            id: 'flow',
            title: 'Flujo Mensual de Transacciones',
            component: <LineChartComponent data={mockData.monthlyTransactionFlow} />
        },
        {
            id: 'balance',
            title: 'Distribución de Saldos',
            component: <PieChartComponent 
                data={mockData.balanceDistribution}
                chartId="balance"
            />
        }
    ];

    return (
        <div className="dashboard-grid">
            {charts.map((chart) => (
                <div 
                    key={chart.id}
                    className={`chart-card ${visibleCharts.has(chart.id) ? 'visible' : ''}`}
                    data-chart-id={chart.id}
                >
                    <h2>{chart.title}</h2>
                    <div className="chart-container">
                        {chart.component}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RechartDashboard;
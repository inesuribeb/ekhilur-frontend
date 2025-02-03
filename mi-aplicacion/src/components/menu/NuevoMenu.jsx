import React, { useState, useEffect, useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList } from 'recharts';
import { LanguageContext } from '../../context/LanguageContext';
import translate from '../../utils/language';
import { getLandingPageData } from '../../utils/apiController';
import './NuevoMenu.css';

function NuevoMenu() {
    const [isMobile, setIsMobile] = useState(false);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [hoveredBar, setHoveredBar] = useState(null);
    const { language } = useContext(LanguageContext);

    const monthTranslations = {
        Eus: {
            1: 'Urt', 2: 'Ots', 3: 'Mar', 4: 'Api',
            5: 'Mai', 6: 'Eka', 7: 'Uzt', 8: 'Abu',
            9: 'Ira', 10: 'Urr', 11: 'Aza', 12: 'Abe'
        },
        Es: {
            1: 'Ene', 2: 'Feb', 3: 'Mar', 4: 'Abr',
            5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Ago',
            9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dic'
        }
    };

    const getChartData = (flujoMensual) => {
        return flujoMensual
            .slice(-4)
            .map(item => ({
                month: monthTranslations[language][item.Mes],
                value: parseFloat(item['Entradas (€)']),
                salidas: parseFloat(item['Salidas (€)']),
                rawData: item
            }));
    };

    const CustomLabel = (props) => {
        const { x, y, value, width } = props;
        return (
            <text 
                x={x + width / 2} 
                y={y - 10} 
                fill="#000" 
                textAnchor="middle"
                fontSize={12}
            >
                {parseFloat(value).toLocaleString()}€
            </text>
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getLandingPageData();
                if (response.success) {
                    setData(response.data);
                    setError(null);
                } else {
                    setError(response.message || 'Error al cargar los datos');
                }
            } catch (error) {
                setError('Error al conectar con el servidor');
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const handleBarClick = (data) => {
        if (data && data.activePayload) {
            const clickedData = data.activePayload[0].payload;
            setSelectedMonth({
                value: clickedData.value,
                salidas: clickedData.salidas
            });
        }
    };

    const CustomBar = (props) => {
        const { fill, x, y, width, height, index } = props;
        const isHovered = hoveredBar === index;
        const isSelected = selectedMonth && props.payload.value === selectedMonth.value;
        
        return (
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={isHovered || isSelected ? '#333333' : '#000000'}
                rx={4}
                ry={4}
                onMouseEnter={() => {
                    setHoveredBar(index);
                    setSelectedMonth({
                        value: props.payload.value,
                        salidas: props.payload.salidas
                    });
                }}
                onMouseLeave={() => {
                    setHoveredBar(null);
                    setSelectedMonth(null);
                }}
                style={{ cursor: 'pointer' }}
            />
        );
    };

    const MobileVersion = () => {
        if (!data) return null;

        const {
            userAnalysis,
            monthlyAverageSpending,
            monthlySavingsAverage,
            totalOperationsData,
            cashFlowAnalysis
        } = data;

        const chartData = getChartData(cashFlowAnalysis['Flujo de dinero mensual 2024']);
        const totalesAnuales = cashFlowAnalysis['Totales anuales'];
        const displayData = selectedMonth || {
            value: parseFloat(totalesAnuales['Total Entradas (€)']),
            salidas: parseFloat(totalesAnuales['Total Salidas (€)'])
        };

        return (
            <div className="mobile-menu">
                <div className="blue-stripe"></div>

                <div className="mobile-content">
                    <div className="mobile-first-line">
                        <div className="mobile-column1-line1">
                            <p>{userAnalysis[1].Total_Diciembre_2024}</p>
                            <p className="mobile-title-1l">{translate.companies[language]}</p>
                            <p className="stat">
                                ▲ {userAnalysis[1].Incremento_Porcentual}% {translate.lastMonth[language]}
                            </p>
                        </div>

                        <div className="mobile-column2-line1">
                            <p>{userAnalysis[0].Total_Diciembre_2024}</p>
                            <p className="mobile-title-1l">{translate.users[language]}</p>
                            <p className="stat">
                                ▲ {userAnalysis[0].Incremento_Porcentual}% {translate.lastMonth[language]}
                            </p>
                        </div>
                    </div>

                    <div className="mobile-second-line">
                        <div className="mobile-column1-line2">
                            <p>{parseFloat(monthlyAverageSpending['Gasto medio mensual por usuario']).toFixed(0)} EUR</p>
                            <p>{translate.averageSpending[language]}</p>
                        </div>

                        <div className="mobile-column2-line2">
                            <p>{parseFloat(monthlySavingsAverage['Ahorro medio mensual por usuario']).toFixed(0)} EUR</p>
                            <p>{translate.cashbackSavings[language]}</p>
                        </div>
                    </div>

                    <div className="mobile-third-line">
                        <h4>{translate.lastMonthTitle[language]}</h4>
                        <p>{totalOperationsData['Número total de operaciones']} {translate.purchasesIn[language]}</p>
                        <p>{totalOperationsData['Importe total (€)']} {translate.paidWith[language]}</p>
                    </div>

                    <div className="mobile-chart">
                        <div className="flex justify-between mb-4">
                            <h4>↗ {(displayData.value / 1000).toFixed(0)}k {translate.realEnter[language]}</h4>
                            <h4>↘ {(displayData.salidas / 1000).toFixed(0)}k {translate.realExit[language]}</h4>
                        </div>
                        <div style={{ width: '100%', height: '150px' }}>
                            <ResponsiveContainer>
                                <BarChart 
                                    data={chartData}
                                    onClick={handleBarClick}
                                >
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis hide />
                                    <Bar
                                        dataKey="value"
                                        shape={<CustomBar />}
                                    >
                                        <LabelList content={<CustomLabel />} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const DesktopVersion = () => {
        if (!data) return null;

        const {
            userAnalysis,
            monthlyAverageSpending,
            monthlySavingsAverage,
            totalOperationsData,
            cashFlowAnalysis
        } = data;

        const chartData = getChartData(cashFlowAnalysis['Flujo de dinero mensual 2024']);
        const totalesAnuales = cashFlowAnalysis['Totales anuales'];
        const displayData = selectedMonth || {
            value: parseFloat(totalesAnuales['Total Entradas (€)']),
            salidas: parseFloat(totalesAnuales['Total Salidas (€)'])
        };

        return (
            <div className="NuevoMenu">
                <div className="menu-left">
                    <h1 className="menu-title">
                        {translate.menuTitle[language]}
                    </h1>
                </div>

                <div className="menu-right">
                </div>

                <div className="menu-left-info">
                    <div className="info-block">
                        <p className="number">
                            {userAnalysis[1].Total_Diciembre_2024} {translate.companies[language]}
                        </p>
                        <div className="stat">
                            <div className="triangle"></div>
                            <span>{userAnalysis[1].Incremento_Porcentual}% {translate.lastMonth[language]}</span>
                        </div>
                    </div>

                    <div className="info-block">
                        <p className="number">
                            {userAnalysis[0].Total_Diciembre_2024} {translate.users[language]}
                        </p>
                        <div className="stat">
                            <div className="triangle"></div>
                            <span>{userAnalysis[0].Incremento_Porcentual}% {translate.lastMonth[language]}</span>
                        </div>
                    </div>
                </div>

                <div className="menu-right-info">
                    <p>{parseFloat(monthlyAverageSpending['Gasto medio mensual por usuario']).toFixed(0)} EUR</p>
                    <p>{translate.averageSpending[language]}</p>
                </div>

                <div className="menu-right-info2">
                    <p>{parseFloat(monthlySavingsAverage['Ahorro medio mensual por usuario']).toFixed(0)} EUR</p>
                    <p>{translate.cashbackSavings[language]}</p>
                </div>

                <div className="menu-right-info3">
                    <h5>{translate.lastMonthTitle[language]}</h5>
                    <p>{totalOperationsData['Número total de operaciones']} {translate.purchasesIn[language]}</p>
                    <p>{totalOperationsData['Importe total (€)']} {translate.paidWith[language]}</p>
                </div>

                <div className="menu-center">
                    <div className="flex justify-between mb-20">
                        <h4>
                            <span className="arrow-up">↗</span>
                            <span>{displayData.value.toLocaleString()} </span>
                            <span className="text-sm ml-2">{translate.realEnter[language]}</span>
                        </h4>
                        <h4>
                            <span className="arrow-down">↘</span>
                            <span>{displayData.salidas.toLocaleString()} </span>
                            <span className="text-sm ml-2">{translate.realExit[language]}</span>
                        </h4>
                    </div>
                    <div style={{ width: '100%', height: '70%' }}>
                        <ResponsiveContainer>
                            <BarChart 
                                data={chartData}
                                onClick={handleBarClick}
                            >
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis hide />
                                <Bar
                                    dataKey="value"
                                    shape={<CustomBar />}
                                >
                                    <LabelList content={<CustomLabel />} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!data) return <div>No se pudieron cargar los datos</div>;

    return isMobile ? <MobileVersion /> : <DesktopVersion />;
}

export default NuevoMenu;
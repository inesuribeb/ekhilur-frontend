import React, { useState, useEffect, useContext, useRef } from 'react';
import { ComposedChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList, Line, Tooltip } from 'recharts';
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
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const hasAnimatedRef = useRef(false);
    const chartRef = useRef(null);
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

    const startAnimation = () => {
        // Establecer la variable CSS
        document.documentElement.style.setProperty('--animation-state', 'running');
        // Después de que terminen todas las animaciones, mantener el estado final
        setTimeout(() => {
            document.documentElement.style.setProperty('--animation-state', 'finished');
        }, 8000); // 8 segundos para cubrir todas las animaciones
    };
    
    // Modificar el efecto de animación
    useEffect(() => {
        if (data && !loading) {
            startAnimation();
        }
    }, [data, loading]);

    useEffect(() => {
        if (data && !loading && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            setShouldAnimate(true);
        }
    }, [data, loading]);

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

        return () => {
            window.removeEventListener('resize', checkIfMobile);
            hasAnimatedRef.current = false;
        };
    }, []);

    const formatPercentage = (percentage) => {
        const value = parseFloat(percentage);
        let symbol;
        if (value > 0) {
            symbol = '▲';
        } else if (value < 0) {
            symbol = '▼';
        } else {
            symbol = '=';
        }
        return (
            <div className="stat">
                <span>{symbol}</span>
                {`${Math.abs(value).toFixed(1)}% azken hilabetean`}
            </div>
        );
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

    const getAnimationClass = (baseClass, delay = 0) => {
        return shouldAnimate ? `${baseClass} animate-with-delay-${delay}` : baseClass;
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

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[1];
            return (
                <div className="custom-tooltip">
                    {data.value.toLocaleString()}€
                </div>
            );
        }
        return null;
    };

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
        const { x, y, width, height } = props;
        const isSelected = selectedMonth && props.payload.value === selectedMonth.value;
        
        return (
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={isSelected ? '#333333' : '#000000'}
                rx={4}
                ry={4}
                style={{ 
                    cursor: 'pointer',
                    transition: 'fill 0.3s ease'
                }}
            />
        );
    };

    const Chart = ({ data, isMobile = false }) => {
        const margins = isMobile 
            ? { top: 20, right: 10, bottom: 0, left: 10 }
            : { top: 20, right: 20, bottom: 0, left: 20 };
            
        return (
            <ResponsiveContainer width="100%" height={isMobile ? 200 : "100%"}>
                <ComposedChart 
                    data={data}
                    onClick={handleBarClick}
                    margin={margins}
                    ref={chartRef}
                >
                    <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                    />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                        dataKey="value"
                        shape={<CustomBar />}
                        zIndex={1}
                        isAnimationActive={false}
                    >
                        <LabelList 
                            content={<CustomLabel />}
                            position="top"
                        />
                    </Bar>
                    <Line
                        type="monotone"
                        dataKey="salidas"
                        stroke="#FFFFFF"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6, fill: "#FFFFFF" }}
                        zIndex={2}
                        isAnimationActive={false}
                    />
                </ComposedChart>
            </ResponsiveContainer>
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
                            {formatPercentage(userAnalysis[1].Incremento_Porcentual)}
                        </div>

                        <div className="mobile-column2-line1">
                            <p>{userAnalysis[0].Total_Diciembre_2024}</p>
                            <p className="mobile-title-1l">{translate.users[language]}</p>
                            {formatPercentage(userAnalysis[0].Incremento_Porcentual)}
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
                        <div className="chart-header">
                            <h4>
                                <span className="arrow-up">▲</span>
                                {(displayData.value / 1000).toFixed(0)}k {translate.realEnter[language]}
                            </h4>
                            <h4 className="exits-text">
                                <span className="arrow-down">▲</span>
                                {(displayData.salidas / 1000).toFixed(0)}k {translate.realExit[language]}
                            </h4>
                        </div>
                        <div className="chart-container">
                            <Chart data={chartData} isMobile={true} />
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

                <div className={getAnimationClass('menu-center', 0)}>
                    <div className="flex justify-between mb-20">
                        <h4>
                            <span className="arrow-up">▲</span>
                            <span>{displayData.value.toLocaleString()} </span>
                            <span className="text-sm ml-2">{translate.realEnter[language]}</span>
                        </h4>
                        <h4 className="exits-text">
                            <span className="arrow-down">▲</span>
                            <span>{displayData.salidas.toLocaleString()} </span>
                            <span className="text-sm ml-2">{translate.realExit[language]}</span>
                        </h4>
                    </div>
                    <div style={{ width: '100%', height: '70%' }}>
                        <Chart data={chartData} isMobile={false} />
                    </div>
                </div>

                <div className={getAnimationClass('menu-left-info', 1)}>
                    <div className="info-block">
                        <p className="number">
                            {userAnalysis[1].Total_Diciembre_2024} {translate.companies[language]}
                        </p>
                        {formatPercentage(userAnalysis[1].Incremento_Porcentual)}
                    </div>

                    <div className="info-block">
                        <p className="number">
                            {userAnalysis[0].Total_Diciembre_2024} {translate.users[language]}
                        </p>
                        {formatPercentage(userAnalysis[0].Incremento_Porcentual)}
                    </div>
                </div>

                <div className={getAnimationClass('menu-right-info', 2)}>
                    <p>{parseFloat(monthlyAverageSpending['Gasto medio mensual por usuario']).toFixed(0)} EUR</p>
                    <p>{translate.averageSpending[language]}</p>
                </div>

                <div className={getAnimationClass('menu-right-info2', 3)}>
                    <p>{parseFloat(monthlySavingsAverage['Ahorro medio mensual por usuario']).toFixed(0)} EUR</p>
                    <p>{translate.cashbackSavings[language]}</p>
                </div>

                <div className={getAnimationClass('menu-right-info3', 4)}>
                    <h5>{translate.lastMonthTitle[language]}</h5>
                    <p>{totalOperationsData['Número total de operaciones']} {translate.purchasesIn[language]}</p>
                    <p>{totalOperationsData['Importe total (€)']} {translate.paidWith[language]}</p>
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
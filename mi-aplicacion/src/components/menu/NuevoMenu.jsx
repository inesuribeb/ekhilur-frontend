import React, { useState, useEffect, useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { LanguageContext } from '../../context/LanguageContext';
import translate from '../../utils/language';
import mockData from '../../utils/mockData';
import './NuevoMenu.css';

function NuevoMenu() {
    const [isMobile, setIsMobile] = useState(false);
    const { language } = useContext(LanguageContext);

    const monthTranslations = {
        Eus: {
            1: 'Urt',
            2: 'Ots',
            3: 'Mar',
            4: 'Api',
            5: 'Mai',
            6: 'Eka',
            7: 'Uzt',
            8: 'Abu',
            9: 'Ira',
            10: 'Urr',
            11: 'Aza',
            12: 'Abe'
        },
        Es: {
            1: 'Ene',
            2: 'Feb',
            3: 'Mar',
            4: 'Abr',
            5: 'May',
            6: 'Jun',
            7: 'Jul',
            8: 'Ago',
            9: 'Sep',
            10: 'Oct',
            11: 'Nov',
            12: 'Dic'
        }
    };

    const getChartData = (flujoMensual) => {
        return flujoMensual
            .slice(-4)
            .map(item => {
                const monthName = monthTranslations[language][item.mes];
                return {
                    month: monthName,
                    value: item.entradas,
                    salidas: item.salidas
                };
            });
    };

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const MobileVersion = () => {
        const {
            analisis_usuarios,
            promedio_mensual,
            ahorro_mensual,
            total_diciembre,
            flujo_efectivo
        } = mockData;

        const chartData = getChartData(flujo_efectivo.flujo_mensual);

        return (
            <div className="mobile-menu">
                <div className="blue-stripe"></div>

                <div className="mobile-content">
                    <div className='mobile-first-line'>
                        <div className="mobile-column1-line1">
                            <p>{analisis_usuarios[1].Total_Diciembre_2024}</p>
                            <p className="mobile-title-1l">{translate.companies[language]}</p>
                            <p className="stat">
                                ▲ {analisis_usuarios[1].Incremento_Porcentual} {translate.lastMonth[language]}
                            </p>
                        </div>

                        <div className="mobile-column2-line1">
                            <p>{analisis_usuarios[0].Total_Diciembre_2024}</p>
                            <p className="mobile-title-1l">{translate.users[language]}</p>
                            <p className="stat">
                                ▲ {analisis_usuarios[0].Incremento_Porcentual} {translate.lastMonth[language]}
                            </p>
                        </div>
                    </div>

                    <div className='mobile-second-line'>
                        <div className="mobile-column1-line2">
                            <p>{promedio_mensual.gasto_medio_mensual.toFixed(0)} EUR</p>
                            <p>{translate.averageSpending[language]}</p>
                        </div>

                        <div className="mobile-column2-line2">
                            <p>{ahorro_mensual.ahorro_medio_mensual.toFixed(0)} EUR</p>
                            <p>{translate.cashbackSavings[language]}</p>
                        </div>
                    </div>

                    <div className="mobile-third-line">
                        <h4>{translate.lastMonthTitle[language]}</h4>
                        <p>{total_diciembre.numero_total_operaciones} {translate.purchasesIn[language]}</p>
                        <p>{total_diciembre.importe_total.toFixed(0)} {translate.paidWith[language]}</p>
                    </div>

                    <div className="mobile-chart">
                        <div className="flex justify-between mb-4">
                            <h4>↗ {(flujo_efectivo.total_entradas / 1000).toFixed(0)}k {translate.realEnter[language]}</h4>
                            <h4>↘ {(flujo_efectivo.total_salidas / 1000).toFixed(0)}k {translate.realExit[language]}</h4>
                        </div>
                        <div style={{ width: '100%', height: '150px' }}>
                            <ResponsiveContainer>
                                <BarChart data={chartData}>
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis hide />
                                    <Bar
                                        dataKey="value"
                                        fill="#000000"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const DesktopVersion = () => {
        const {
            analisis_usuarios,
            promedio_mensual,
            ahorro_mensual,
            total_diciembre,
            flujo_efectivo
        } = mockData;

        const chartData = getChartData(flujo_efectivo.flujo_mensual);

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
                            {analisis_usuarios[1].Total_Diciembre_2024} {translate.companies[language]}
                        </p>
                        <div className="stat">
                            <div className="triangle"></div>
                            <span>{analisis_usuarios[1].Incremento_Porcentual} {translate.lastMonth[language]}</span>
                        </div>
                    </div>

                    <div className="info-block">
                        <p className="number">
                            {analisis_usuarios[0].Total_Diciembre_2024} {translate.users[language]}
                        </p>
                        <div className="stat">
                            <div className="triangle"></div>
                            <span>{analisis_usuarios[0].Incremento_Porcentual} {translate.lastMonth[language]}</span>
                        </div>
                    </div>
                </div>

                <div className="menu-right-info">
                    <p>{promedio_mensual.gasto_medio_mensual.toFixed(0)} EUR</p>
                    <p>{translate.averageSpending[language]}</p>
                </div>

                <div className="menu-right-info2">
                    <p>{ahorro_mensual.ahorro_medio_mensual.toFixed(0)} EUR</p>
                    <p>{translate.cashbackSavings[language]}</p>
                </div>

                <div className="menu-right-info3">
                    <h5>{translate.lastMonthTitle[language]}</h5>
                    <p>{total_diciembre.numero_total_operaciones} {translate.purchasesIn[language]}</p>
                    <p>{total_diciembre.importe_total.toFixed(0)} {translate.paidWith[language]}</p>
                </div>

                <div className="menu-center">
                    <div className="flex justify-between mb-20">
                        <h4>
                            <span className="arrow-up">↗</span>
                            <span>{flujo_efectivo.total_entradas.toLocaleString()} </span>
                            <span className="text-sm ml-2">{translate.realEnter[language]}</span>
                        </h4>
                        <h4>
                            <span className="arrow-down">↘</span>
                            <span>{flujo_efectivo.total_salidas.toLocaleString()} </span>
                            <span className="text-sm ml-2">{translate.realExit[language]}</span>
                        </h4>
                    </div>
                    <div style={{ width: '100%', height: '70%' }}>
                        <ResponsiveContainer>
                            <BarChart data={chartData}>
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis hide />
                                <Bar
                                    dataKey="value"
                                    fill="#000000"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        );
    };

    return isMobile ? <MobileVersion /> : <DesktopVersion />;
}

export default NuevoMenu;
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import mockData from '../../utils/mockData';
import './NuevoMenu.css';

function NuevoMenu() {
    const [isMobile, setIsMobile] = useState(false);
    const chartData = [
        { month: 'ene', value: 100 },
        { month: 'feb', value: 200 },
        { month: 'mar', value: 300 },
        { month: 'abr', value: 400 }
    ];

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    // const MobileVersion = () => (
    //     <div className="mobile-menu">
    //         <div className="blue-stripe"></div>


    //         <div className="mobile-content">
    //             <div className='mobile-first-line'>
    //                 <div className="mobile-column1-line1">
    //                     <p>125</p>
    //                     <p className="mobile-title-1l">Empresas</p>
    //                     <p className="stat">▲ +5% último mes</p>
    //                 </div>

    //                 <div className="mobile-column2-line1">
    //                     <p>1,380</p>
    //                     <p className="mobile-title-1l">Usuarios</p>
    //                     <p className="stat">▲ +12% último mes</p>
    //                 </div>
    //             </div>

    //             <div className='mobile-second-line'>
    //                 <div className="mobile-column1-line2">
    //                     <p>198 EUR</p>
    //                     <p>Gasto medio cliente / mes</p>
    //                 </div>

    //                 <div className="mobile-column2-line2">
    //                     <p>21 EUR</p>
    //                     <p>Ahorro cashback cliente / mes</p>
    //                 </div>
    //             </div>

    //             <div className="mobile-third-line">
    //                 <h4>ÚLTIMO MES</h4>
    //                 <p>2,150 compras en Ekhilur</p>
    //                 <p>42,700 EUR pagados con Ekhilur</p>
    //             </div>

    //             <div className="mobile-chart">
    //                 <div className="flex justify-between mb-4">
    //                     <h4>↗ 1,900 EUR entran real</h4>
    //                     <h4>↘ 225 EUR salen real</h4>
    //                 </div>
    //                 <div style={{ width: '100%', height: '150px' }}>
    //                     <ResponsiveContainer>
    //                         <BarChart data={chartData}>
    //                             <XAxis dataKey="month" />
    //                             <YAxis hide />
    //                             <Bar dataKey="value" fill="#000000" />
    //                         </BarChart>
    //                     </ResponsiveContainer>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // );

    const MobileVersion = () => {
        const {
            analisis_usuarios,
            promedio_mensual,
            ahorro_mensual,
            total_diciembre,
            flujo_efectivo
        } = mockData;

        // Preparar datos para el gráfico
        // const chartData = flujo_efectivo.flujo_mensual.map(item => ({
        //     month: `mes${item.mes}`,
        //     value: item.entradas
        // }));

        const chartData = flujo_efectivo.flujo_mensual
            .slice(-4)  // Toma solo los últimos 4 meses
            .map(item => {
                const monthName = new Date(2024, item.mes - 1).toLocaleDateString('es', { month: 'short' });
                return {
                    month: monthName,
                    value: item.entradas,
                    salidas: item.salidas
                };
            });

        return (
            <div className="mobile-menu">
                <div className="blue-stripe"></div>

                <div className="mobile-content">
                    <div className='mobile-first-line'>
                        <div className="mobile-column1-line1">
                            <p>{analisis_usuarios[1].Total_Diciembre_2024}</p>
                            <p className="mobile-title-1l">Empresas</p>
                            <p className="stat">
                                ▲ {analisis_usuarios[1].Incremento_Porcentual} último mes
                            </p>
                        </div>

                        <div className="mobile-column2-line1">
                            <p>{analisis_usuarios[0].Total_Diciembre_2024}</p>
                            <p className="mobile-title-1l">Usuarios</p>
                            <p className="stat">
                                ▲ {analisis_usuarios[0].Incremento_Porcentual} último mes
                            </p>
                        </div>
                    </div>

                    <div className='mobile-second-line'>
                        <div className="mobile-column1-line2">
                            <p>{promedio_mensual.gasto_medio_mensual.toFixed(0)} EUR</p>
                            <p>Gasto medio cliente / mes</p>
                        </div>

                        <div className="mobile-column2-line2">
                            <p>{ahorro_mensual.ahorro_medio_mensual.toFixed(0)} EUR</p>
                            <p>Ahorro cashback cliente / mes</p>
                        </div>
                    </div>

                    <div className="mobile-third-line">
                        <h4>ÚLTIMO MES</h4>
                        <p>{total_diciembre.numero_total_operaciones} compras en Ekhilur</p>
                        <p>{total_diciembre.importe_total.toFixed(0)} EUR pagados con Ekhilur</p>
                    </div>

                    <div className="mobile-chart">
                        <div className="flex justify-between mb-4">
                            <h4>↗ {(flujo_efectivo.total_entradas / 1000).toFixed(0)}k EUR entran real</h4>
                            <h4>↘ {(flujo_efectivo.total_salidas / 1000).toFixed(0)}k EUR salen real</h4>
                        </div>
                        <div style={{ width: '100%', height: '150px' }}>
                            <ResponsiveContainer>
                                {/* <BarChart data={chartData}>
                                    <XAxis dataKey="month" />
                                    <YAxis hide />
                                    <Bar
                                        dataKey="value"
                                        fill="#000000"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart> */}
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

    // const DesktopVersion = () => (
    //     <div className="NuevoMenu">
    //         <div className="menu-left">
    //             <h1 className="menu-title">
    //                 Comprometidos/as con una economía más cercana.
    //             </h1>
    //         </div>

    //         <div className="menu-right">
    //         </div>

    //         <div class="menu-left-info">
    //             <div class="info-block">
    //                 <p class="number">125 Empresas</p>
    //                 <div class="stat">
    //                     <div class="triangle"></div>
    //                     <span>+5% último mes</span>
    //                 </div>
    //             </div>

    //             <div class="info-block">
    //                 <p class="number">1,380 Usuarios</p>
    //                 <div class="stat">
    //                     <div class="triangle"></div>
    //                     <span>+12% último mes</span>
    //                 </div>
    //             </div>
    //         </div>

    //         <div className="menu-right-info">
    //             <p>198 EUR</p>
    //             <p>Gasto medio cliente / mes</p>
    //         </div>

    //         <div className="menu-right-info2">
    //             <p>21 EUR</p>
    //             <p>Ahorro cashback cliente / mes</p>
    //         </div>

    //         <div className="menu-right-info3">
    //             <h5>ÚLTIMO MES</h5>
    //             <p>2,150 compras en Ekhilur</p>
    //             <p>42,700 EUR pagados con Ekhilur</p>
    //         </div>


    //         <div className="menu-center">
    //             <div className="flex justify-between mb-20">
    //                 <h4>
    //                     <span className="arrow-up">↗</span>
    //                     <span>1,900 </span>
    //                     <span className="text-sm ml-2">EUR entran real</span>
    //                 </h4>
    //                 <h4>
    //                     <span className="arrow-down">↘</span>
    //                     <span>225 </span>
    //                     <span className="text-sm ml-2">EUR salen real</span>
    //                 </h4>
    //             </div>
    //             <div style={{ width: '100%', height: '70%' }}>
    //                 <ResponsiveContainer>
    //                     <BarChart data={chartData}>
    //                         <XAxis
    //                             dataKey="month"
    //                             axisLine={false}
    //                             tickLine={false}
    //                             tick={{ fontSize: 12 }}
    //                         />
    //                         <YAxis hide />
    //                         <Bar
    //                             dataKey="value"
    //                             fill="#000000"
    //                             radius={[4, 4, 0, 0]}  // Bordes redondeados arriba
    //                         />
    //                     </BarChart>
    //                 </ResponsiveContainer>
    //             </div>
    //         </div>
    //     </div>
    // );
    const DesktopVersion = () => {
        // Extraer datos del mock
        const {
            analisis_usuarios,
            promedio_mensual,
            ahorro_mensual,
            total_diciembre,
            flujo_efectivo
        } = mockData;

        // Preparar datos para el gráfico
        // const chartData = flujo_efectivo.flujo_mensual.map(item => ({
        //     month: `mes${item.mes}`,
        //     value: item.entradas
        // }));

        const chartData = flujo_efectivo.flujo_mensual
            .slice(-4)  // Toma solo los últimos 4 meses
            .map(item => {
                const monthName = new Date(2024, item.mes - 1).toLocaleDateString('es', { month: 'short' });
                return {
                    month: monthName,
                    value: item.entradas,
                    salidas: item.salidas
                };
            });

        return (
            <div className="NuevoMenu">
                <div className="menu-left">
                    <h1 className="menu-title">
                        Comprometidos/as con una economía más cercana.
                    </h1>
                </div>

                <div className="menu-right">
                    {/* El círculo rosa se genera con el pseudo-elemento ::after */}
                </div>

                <div className="menu-left-info">
                    <div className="info-block">
                        <p className="number">
                            {analisis_usuarios[1].Total_Diciembre_2024} Empresas
                        </p>
                        <div className="stat">
                            <div className="triangle"></div>
                            <span>{analisis_usuarios[1].Incremento_Porcentual} último mes</span>
                        </div>
                    </div>

                    <div className="info-block">
                        <p className="number">
                            {analisis_usuarios[0].Total_Diciembre_2024} Usuarios
                        </p>
                        <div className="stat">
                            <div className="triangle"></div>
                            <span>{analisis_usuarios[0].Incremento_Porcentual} último mes</span>
                        </div>
                    </div>
                </div>

                <div className="menu-right-info">
                    <p>{promedio_mensual.gasto_medio_mensual.toFixed(0)} EUR</p>
                    <p>Gasto medio cliente / mes</p>
                </div>

                <div className="menu-right-info2">
                    <p>{ahorro_mensual.ahorro_medio_mensual.toFixed(0)} EUR</p>
                    <p>Ahorro cashback cliente / mes</p>
                </div>

                <div className="menu-right-info3">
                    <h5>ÚLTIMO MES</h5>
                    <p>{total_diciembre.numero_total_operaciones} compras en Ekhilur</p>
                    <p>{total_diciembre.importe_total.toFixed(0)} EUR pagados con Ekhilur</p>
                </div>

                <div className="menu-center">
                    <div className="flex justify-between mb-20">
                        <h4>
                            <span className="arrow-up">↗</span>
                            <span>{flujo_efectivo.total_entradas.toLocaleString()} </span>
                            <span className="text-sm ml-2">EUR entran real</span>
                        </h4>
                        <h4>
                            <span className="arrow-down">↘</span>
                            <span>{flujo_efectivo.total_salidas.toLocaleString()} </span>
                            <span className="text-sm ml-2">EUR salen real</span>
                        </h4>
                    </div>
                    <div style={{ width: '100%', height: '70%' }}>
                        <ResponsiveContainer>
                            {/* <BarChart data={chartData}>
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
                            </BarChart> */}
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
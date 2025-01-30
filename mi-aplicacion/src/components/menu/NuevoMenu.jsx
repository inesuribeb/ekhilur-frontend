import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
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

    const MobileVersion = () => (
        <div className="mobile-menu">
            <div className="blue-stripe"></div>


            <div className="mobile-content">
                <div className='mobile-first-line'>
                    <div className="mobile-column1-line1">
                        <p>125</p>
                        <p className="mobile-title-1l">Empresas</p>
                        <p className="stat">▲ +5% último mes</p>
                    </div>

                    <div className="mobile-column2-line1">
                        <p>1,380</p>
                        <p className="mobile-title-1l">Usuarios</p>
                        <p className="stat">▲ +12% último mes</p>
                    </div>
                </div>

                <div className='mobile-second-line'>
                    <div className="mobile-column1-line2">
                        <p>198 EUR</p>
                        <p>Gasto medio cliente / mes</p>
                    </div>

                    <div className="mobile-column2-line2">
                        <p>21 EUR</p>
                        <p>Ahorro cashback cliente / mes</p>
                    </div>
                </div>

                <div className="mobile-third-line">
                    <h4>ÚLTIMO MES</h4>
                    <p>2,150 compras en Ekhilur</p>
                    <p>42,700 EUR pagados con Ekhilur</p>
                </div>

                <div className="mobile-chart">
                    <div className="flex justify-between mb-4">
                        <h4>↗ 1,900 EUR entran real</h4>
                        <h4>↘ 225 EUR salen real</h4>
                    </div>
                    <div style={{ width: '100%', height: '150px' }}>
                        <ResponsiveContainer>
                            <BarChart data={chartData}>
                                <XAxis dataKey="month" />
                                <YAxis hide />
                                <Bar dataKey="value" fill="#000000" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
    // const MobileVersion = () => (
    //     <div className="mobile-menu">
    //         <div className="mobile-header">
    //             <img src="/logo.png" alt="DatuSarea" />
    //         </div>

    //         <div className="mobile-container">
    //             <div className="mobile-info-pair">
    //                 <p className="number">125 Empresas</p>
    //                 <div className="stat">
    //                     <div className="triangle"></div>
    //                     <span>+5% último mes</span>
    //                 </div>
    //             </div>

    //             <div className="mobile-info-pair">
    //                 <p className="number">1,380 Usuarios</p>
    //                 <div className="stat">
    //                     <div className="triangle"></div>
    //                     <span>+12% último mes</span>
    //                 </div>
    //             </div>

    //             <div className="mobile-info-pair">
    //                 <p className="number">198 EUR</p>
    //                 <p className="subtitle">gasto medio cliente / mes</p>
    //             </div>

    //             <div className="mobile-info-pair">
    //                 <p className="number">21 EUR</p>
    //                 <p className="subtitle">ahorro cashback-cliente / mes</p>
    //             </div>

    //             <div className="mobile-last-month">
    //                 <h5>ÚLTIMO MES</h5>
    //                 <p>2,150 compras en Ekhilur</p>
    //                 <p>42,700 EUR pagados con Ekhilur</p>
    //             </div>

    //             <div className="mobile-chart">
    //                 <div className="chart-header">
    //                     <div className="in-amount">
    //                         <span className="arrow-up">↗</span>
    //                         <span>1,900</span>
    //                         <span className="unit">EUR entran real</span>
    //                     </div>
    //                     <div className="out-amount">
    //                         <span className="arrow-down">↘</span>
    //                         <span>225</span>
    //                         <span className="unit">EUR salen real</span>
    //                     </div>
    //                 </div>
    //                 <div className="chart-container">
    //                     <ResponsiveContainer>
    //                         <BarChart data={chartData}>
    //                             <XAxis dataKey="month" axisLine={false} tickLine={false} />
    //                             <YAxis hide />
    //                             <Bar dataKey="value" fill="#000000" radius={[4, 4, 0, 0]} />
    //                         </BarChart>
    //                     </ResponsiveContainer>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // );




    const DesktopVersion = () => (
        <div className="NuevoMenu">
            <div className="menu-left">
                <h1 className="menu-title">
                    Comprometidos/as con una economía más cercana.
                </h1>
            </div>

            <div className="menu-right">
                {/* El círculo rosa se genera con el pseudo-elemento ::after */}
            </div>

            <div class="menu-left-info">
                <div class="info-block">
                    <p class="number">125 Empresas</p>
                    <div class="stat">
                        <div class="triangle"></div>
                        <span>+5% último mes</span>
                    </div>
                </div>

                <div class="info-block">
                    <p class="number">1,380 Usuarios</p>
                    <div class="stat">
                        <div class="triangle"></div>
                        <span>+12% último mes</span>
                    </div>
                </div>
            </div>

            <div className="menu-right-info">
                <p>198 EUR</p>
                <p>gasto medio cliente / mes</p>
            </div>

            <div className="menu-right-info2">
                <p>21 EUR</p>
                <p>ahorro cashback cliente / mes</p>
            </div>

            <div className="menu-right-info3">
                <h5>ÚLTIMO MES</h5>
                <p>2,150 compras en Ekhilur</p>
                <p>42,700 EUR pagados con Ekhilur</p>
            </div>


            <div className="menu-center">
                <div className="flex justify-between mb-20">
                    <h4>
                        <span className="arrow-up">↗</span>
                        <span>1,900</span>
                        <span className="text-sm ml-2">EUR entran real</span>
                    </h4>
                    <h4>
                        <span className="arrow-down">↘</span>
                        <span>225</span>
                        <span className="text-sm ml-2">EUR salen real</span>
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
                                radius={[4, 4, 0, 0]}  // Bordes redondeados arriba
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );

    return isMobile ? <MobileVersion /> : <DesktopVersion />;
}

export default NuevoMenu;
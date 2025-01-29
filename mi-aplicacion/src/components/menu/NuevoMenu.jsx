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
            <div className="mobile-header">
                {/* Removed the title from mobile version */}
            </div>
            
            <div className="mobile-content">
                <div className="mobile-info-card mobile-info-pair">
                    <div className="text-2xl font-bold">125 Empresas</div>
                    <div className="text-blue-600">▲ +5% último mes</div>
                </div>

                <div className="mobile-info-card mobile-info-pair">
                    <div className="text-2xl font-bold">1,380 Usuarios</div>
                    <div className="text-blue-600">▲ +12% último mes</div>
                </div>

                <div className="mobile-info-card mobile-info-pair">
                    <div className="text-2xl font-bold">198 EUR</div>
                    <div>gasto medio cliente / mes</div>
                </div>

                <div className="mobile-info-card mobile-info-pair">
                    <div className="text-2xl font-bold">21 EUR</div>
                    <div>ahorro cashback cliente / mes</div>
                </div>

                <div className="mobile-info-card mobile-info-full">
                    <div className="text-blue-600 font-bold">ÚLTIMO MES</div>
                    <div className="text-2xl font-bold mt-2">2,150 compras en Ekhilur</div>
                    <div className="text-2xl font-bold">42,700 EUR pagados con Ekhilur</div>
                </div>

                <div className="mobile-chart">
                    <div className="flex justify-between mb-4">
                        <div>↗ 1,900 EUR entran real</div>
                        <div>↘ 225 EUR salen real</div>
                    </div>
                    <div style={{ width: '100%', height: '300px' }}>
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

            <div className="menu-left-info">
                <div className="text-2xl font-bold">125 Empresas</div>
                <div className="text-blue-600">▲ +5% último mes</div>
            </div>

            <div className="menu-left-info2">
                <div className="text-2xl font-bold">1,380 Usuarios</div>
                <div className="text-blue-600">▲ +12% último mes</div>
            </div>

            <div className="menu-right-info">
                <div className="text-2xl font-bold">198 EUR</div>
                <div>gasto medio cliente / mes</div>
            </div>

            <div className="menu-right-info2">
                <div className="text-2xl font-bold">21 EUR</div>
                <div>ahorro cashback cliente / mes</div>
            </div>

            <div className="menu-right-info3">
                <div className="text-blue-600 font-bold">ÚLTIMO MES</div>
                <div className="text-2xl font-bold mt-2">2,150 compras en Ekhilur</div>
                <div className="text-2xl font-bold">42,700 EUR pagados con Ekhilur</div>
            </div>

            <div className="menu-center">
                <div className="flex justify-between mb-4">
                    <div>↗ 1,900 EUR entran real</div>
                    <div>↘ 225 EUR salen real</div>
                </div>
                <div style={{ width: '100%', height: '80%' }}>
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
    );

    return isMobile ? <MobileVersion /> : <DesktopVersion />;
}

export default NuevoMenu;
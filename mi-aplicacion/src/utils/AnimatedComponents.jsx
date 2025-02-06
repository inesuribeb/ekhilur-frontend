import React, { useEffect, useState, useRef } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';

const AnimatedSection = ({ children, className }) => {
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.8) {
                    setIsVisible(true);
                }
            },
            {
                threshold: 0.8, // Requiere que el 80% del elemento sea visible
                rootMargin: '-50px 0px' // Añade un pequeño margen para mejor control
            }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, []);

    return (
        <div
            ref={elementRef}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: `translateY(${isVisible ? '0' : '50px'})`,
                transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
            }}
            className={className}
        >
            {isVisible && children}
        </div>
    );
};

const AnimatedPieChart = ({ data, options, onChartRef }) => (
    <div style={{ height: '100%', width: '100%' }}>
        <Pie
            data={data}
            options={{
                ...options,
                animation: {
                    duration: 1200, // Aumentado la duración de la animación
                    easing: 'easeInOutQuart' // Añadido un easing más suave
                }
            }}
            ref={onChartRef}
        />
    </div>
);

const AnimatedLineChart = ({ data, options, onChartRef }) => (
    <div style={{ height: '100%', width: '100%' }}>
        <Line
            data={data}
            options={{
                ...options,
                animation: {
                    duration: 1200,
                    easing: 'easeInOutQuart'
                }
            }}
            ref={onChartRef}
        />
    </div>
);

const AnimatedBarChart = ({ data, options, onChartRef }) => (
    <div style={{ height: '100%', width: '100%' }}>
        <Bar
            data={data}
            options={{
                ...options,
                animation: {
                    duration: 900,
                    easing: 'easeInOutQuart'
                }
            }}
            ref={onChartRef}
        />
    </div>
);

export {
    AnimatedSection,
    AnimatedPieChart,
    AnimatedLineChart,
    AnimatedBarChart
};
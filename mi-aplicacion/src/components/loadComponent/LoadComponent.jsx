import { useState, useEffect } from 'react';
import './LoadComponent.css';

function LoadComponent({ isLoading }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let intervalId;
        
        if (isLoading) {
            setProgress(0);
            intervalId = setInterval(() => {
                setProgress(prev => {
                    if (prev < 90) {
                        return prev + Math.random() * 15;
                    }
                    return prev;
                });
            }, 500);
        } else {
            setProgress(100);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isLoading]);

    return (
        <div className="loading-container">
            <div className="loading-content">
                <div className="loading-text">
                    {progress < 100 ? 'Cargando gráficas...' : 'Carga completada'}
                </div>
                <div className="progress-bar-container">
                    <div 
                        className="progress-bar"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                </div>
                <div className="progress-text">
                    {Math.min(Math.round(progress), 100)}%
                </div>
            </div>
        </div>
    );
}

export default LoadComponent;
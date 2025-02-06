// import { useState, useEffect } from 'react';
// import './LoadComponent.css';

// function LoadComponent({ isLoading }) {
//     const [progress, setProgress] = useState(0);

//     useEffect(() => {
//         let intervalId;
        
//         if (isLoading) {
//             setProgress(0);
//             intervalId = setInterval(() => {
//                 setProgress(prev => {
//                     if (prev < 90) {
//                         return prev + Math.random() * 15;
//                     }
//                     return prev;
//                 });
//             }, 500);
//         } else {
//             setProgress(100);
//         }

//         return () => {
//             if (intervalId) {
//                 clearInterval(intervalId);
//             }
//         };
//     }, [isLoading]);

//     return (
//         <div className="loading-container">
//             <div className="loading-content">
//                 <div className="loading-text">
//                     {progress < 100 ? 'Cargando gráficas...' : 'Carga completada'}
//                 </div>
//                 <div className="progress-bar-container">
//                     <div 
//                         className="progress-bar"
//                         style={{ width: `${Math.min(progress, 100)}%` }}
//                     />
//                 </div>
//                 <div className="progress-text">
//                     {Math.min(Math.round(progress), 100)}%
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default LoadComponent;

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

    const circumference = 2 * Math.PI * 45; // radio de 45
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="loading-container">
            <div className="loading-circle-container">
                <svg className="progress-ring" viewBox="0 0 100 100">
                    {/* Círculo de fondo */}
                    <circle
                        className="progress-ring-circle-bg"
                        r="45"
                        cx="50"
                        cy="50"
                    />
                    {/* Círculo de progreso */}
                    <circle
                        className="progress-ring-circle"
                        r="45"
                        cx="50"
                        cy="50"
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: strokeDashoffset
                        }}
                    />
                </svg>
                <div className="loading-text-center">
                    {/* <div className="loading-message">
                        {progress < 100 ? 'Cargando gráficas...' : 'Carga completada'}
                    </div> */}
                    <div className="loading-percentage">
                        {Math.min(Math.round(progress), 100)}%
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoadComponent;
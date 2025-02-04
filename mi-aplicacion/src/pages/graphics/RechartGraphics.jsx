import { useEffect, useState } from 'react';
import { getPrediction } from "../../utils/apiController";
import { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import translate from '../../utils/language';
import './Graphics.css';

function RechartGraphics() {
    const [predictionData, setPredictionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { language } = useContext(LanguageContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getPrediction();
                setPredictionData(response.data);
            } catch (error) {
                console.error('Error fetching prediction data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading || !predictionData) return <div>Cargando...</div>;

    const { predicciones } = predictionData;

    return ( // Hay que automatizar lo de MARZO 2025, hay un problema con ingreso total y diario y el BR por la traducción,
        <div className="graphics-container">
            <div className="primera-columna-predict">

                <div className='primera-columna-primera-fila'>
                    <div className="dates">
                        <h2>{predicciones.periodo.inicio.replace(/\//g, '.')}</h2>
                        <h2>{predicciones.periodo.fin.replace(/\//g, '.')}</h2>
                    </div>
                    <div className="title">
                        <h1>{translate.prediction[language]}<br />{translate.march2025[language]}</h1> 
                    </div>
                </div>

                <div className="primera-columna-segunda-fila">
                    <div className="segunda-fila-columna-izquierda">
                        <span className="ingreso-descripcion-uno">{translate.totalIncome[language]}</span>
                        <div className="cifra-ingreso-total">
                            <span className="amount">{Math.round(predicciones.resumen_general.ingreso_total_predicho)}</span>
                            <span className="currency">EUR</span>
                        </div>
                    </div>

                    <div className="segunda-fila-columna-derecha">
                        <div className='cifra-ingreso-diario'>
                            <span className="amount">{Math.round(predicciones.resumen_general.ingreso_diario_promedio)}</span>
                            <span className="currency">EUR</span>
                        </div>
                        <span className="ingreso-descripcion-dos">{translate.dailyIncome[language]}</span>
                    </div>
                </div>

            </div>


            <div className="segunda-columna-predict">
                <div className="segunda-columna-primera-fila">
                    <div className="label-uno">
                        <span>{translate.maxIncome[language]}</span>
                    </div>
                    <div className="amount-info">
                        {predicciones.resumen_general.dia_mayor_ingreso.fecha.split('/')[0]}.{predicciones.resumen_general.dia_mayor_ingreso.fecha.split('/')[1]} | {Math.round(predicciones.resumen_general.dia_mayor_ingreso.cantidad)} EUR
                    </div>
                </div>
                <div className="segunda-columna-segunda-fila">
                    <div className="label-dos">
                        <span>{translate.minIncome[language]}</span>
                    </div>
                    <div className="amount-info">
                        {predicciones.resumen_general.dia_menor_ingreso.fecha.split('/')[0]}.{predicciones.resumen_general.dia_menor_ingreso.fecha.split('/')[1]} | {Math.round(predicciones.resumen_general.dia_menor_ingreso.cantidad)} EUR
                    </div>
                </div>
            </div>

        </div>
    );
}

export default RechartGraphics;
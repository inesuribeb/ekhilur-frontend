import React, { useState, useEffect, useContext, useRef } from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
  Line,
  Tooltip,
} from "recharts";
import { LanguageContext } from "../../context/LanguageContext";
import translate from "../../utils/language";
import { getLandingPageData } from "../../utils/apiController";
import "./NuevoMenu.css";

function NuevoMenu() {
  const [isMobile, setIsMobile] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [hasFetchedData, setHasFetchedData] = useState(false); // Nuevo estado para controlar la llamada a la API
  const animationInProgressRef = useRef(false);
  const hasFinishedAnimationRef = useRef(false);
  const chartRef = useRef(null);
  const { language } = useContext(LanguageContext);

  // Función para obtener el valor más reciente de un array de datos mensuales
  const getLatestValue = (array, valueKey) => {
    if (!Array.isArray(array) || array.length === 0) return 0;
    const sorted = [...array].sort(
      (a, b) => parseFloat(b.Mes) - parseFloat(a.Mes)
    );
    return sorted[0][valueKey];
  };

  // Función auxiliar para parsear números de forma segura
  const safeParseFloat = (value, defaultValue = 0) => {
    if (!value) return defaultValue;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  };

  // Función auxiliar para formatear números
  const formatNumber = (number, decimals = 0) => {
    return safeParseFloat(number, 0).toLocaleString("es-ES", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const monthTranslations = {
    Eus: {
      1: "Urt",
      2: "Ots",
      3: "Mar",
      4: "Api",
      5: "Mai",
      6: "Eka",
      7: "Uzt",
      8: "Abu",
      9: "Ira",
      10: "Urr",
      11: "Aza",
      12: "Abe",
    },
    Es: {
      1: "Ene",
      2: "Feb",
      3: "Mar",
      4: "Abr",
      5: "May",
      6: "Jun",
      7: "Jul",
      8: "Ago",
      9: "Sep",
      10: "Oct",
      11: "Nov",
      12: "Dic",
    },
  };

  const startAnimation = () => {
    if (!animationInProgressRef.current && !hasFinishedAnimationRef.current) {
      animationInProgressRef.current = true;
      document.documentElement.style.setProperty("--animation-state", "paused");
      void document.documentElement.offsetHeight;
      requestAnimationFrame(() => {
        document.documentElement.style.setProperty(
          "--animation-state",
          "running"
        );
        setTimeout(() => {
          document.documentElement.style.setProperty(
            "--animation-state",
            "finished"
          );
          hasFinishedAnimationRef.current = true;
          animationInProgressRef.current = false;
        }, 8000);
      });
    }
  };

  useEffect(() => {
    // Si ya se ha realizado la llamada a la API, no hacer nada
    if (hasFetchedData) return;
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await getLandingPageData();
        if (isMounted) {
          if (response.success) {
            setData(response.data);
            setError(null);
          } else {
            setError(response.message || "Error al cargar los datos");
          }
          setHasFetchedData(true);
        }
      } catch (error) {
        if (isMounted) {
          setError("Error al conectar con el servidor");
          console.error("Error:", error);
          setHasFetchedData(true);
        }
      } finally {
        if(isMounted){
        setLoading(false);
        } // Marcar que la llamada a la API ya se ha realizado
      }
    };

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    animationInProgressRef.current = false;
    hasFinishedAnimationRef.current = false;
    document.documentElement.style.setProperty("--animation-state", "paused");

    fetchData();
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
      document.documentElement.style.setProperty("--animation-state", "paused");
      animationInProgressRef.current = false;
      hasFinishedAnimationRef.current = false;
    };
  }, [hasFetchedData]); // Dependencia para evitar llamadas duplicadas

  useEffect(() => {
    if (data && !loading) {
      const timer = setTimeout(startAnimation, 100);
      return () => clearTimeout(timer);
    }
  }, [data, loading]);

  const getChartData = (flujoMensual) => {
    if (!Array.isArray(flujoMensual)) return [];

    return flujoMensual.slice(-4).map((item) => ({
      month:
        monthTranslations[language][Math.floor(safeParseFloat(item.Mes))] || "",
      value: safeParseFloat(item.Entradas),
      salidas: safeParseFloat(item.Salidas),
      rawData: item,
    }));
  };

  const formatPercentage = (percentage) => {
    if (!percentage) return null;
    const value = safeParseFloat(percentage);

    let symbol = value > 0 ? "▲" : value < 0 ? "▼" : "=";

    return (
      <div className="stat">
        <span>{symbol}</span>
        {`${Math.abs(value).toFixed(1)}% azken hilabetean`}
      </div>
    );
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
        {formatNumber(value)}€
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[1];
      return <div className="custom-tooltip">{formatNumber(data.value)}€</div>;
    }
    return null;
  };

  const handleBarClick = (data) => {
    if (data && data.activePayload) {
      const clickedData = data.activePayload[0].payload;
      setSelectedMonth({
        value: clickedData.value,
        salidas: clickedData.salidas,
      });
    }
  };

  const CustomBar = (props) => {
    const { x, y, width, height } = props;
    const isSelected =
      selectedMonth && props.payload.value === selectedMonth.value;

    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={isSelected ? "#333333" : "#000000"}
        rx={4}
        ry={4}
        style={{
          cursor: "pointer",
          transition: "fill 0.3s ease",
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
            <LabelList content={<CustomLabel />} position="top" />
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
      cashFlowAnalysis,
    } = data;

    const chartData = getChartData(
      cashFlowAnalysis?.["Flujo de dinero mensual 2024"] || []
    );
    const totalesAnuales = cashFlowAnalysis?.["Totales anuales"] || {};
    const displayData = selectedMonth || {
      value: safeParseFloat(totalesAnuales["Total Entradas (€)"]),
      salidas: safeParseFloat(totalesAnuales["Total Salidas (€)"]),
    };

    return (
      <div className="mobile-menu">
        <div className="blue-stripe"></div>

        <div className="mobile-content">
          <div className="mobile-first-line">
            <div className="mobile-column1-line1">
              <p>{userAnalysis[1]?.Total_Diciembre_2024}</p>
              <p className="mobile-title-1l">{translate.companies[language]}</p>
              {formatPercentage(userAnalysis[1]?.Incremento_Porcentual)}
            </div>

            <div className="mobile-column2-line1">
              <p>{userAnalysis[0]?.Total_Diciembre_2024}</p>
              <p className="mobile-title-1l">{translate.users[language]}</p>
              {formatPercentage(userAnalysis[0]?.Incremento_Porcentual)}
            </div>
          </div>

          <div className="mobile-second-line">
            <div className="mobile-column1-line2">
              <p>
                {formatNumber(
                  getLatestValue(monthlyAverageSpending, "Gasto_Medio_Mensual")
                )}{" "}
                EUR
              </p>
              <p>{translate.averageSpending[language]}</p>
            </div>

            <div className="mobile-column2-line2">
              <p>
                {formatNumber(
                  getLatestValue(monthlySavingsAverage, "Ahorro_Medio_Mensual")
                )}{" "}
                EUR
              </p>
              <p>{translate.cashbackSavings[language]}</p>
            </div>
          </div>

          <div className="mobile-third-line">
            <h4>{translate.lastMonthTitle[language]}</h4>
            <p>
              {formatNumber(
                totalOperationsData?.["Número total de operaciones"]
              )}{" "}
              {translate.purchasesIn[language]}
            </p>
            <p>
              {formatNumber(totalOperationsData?.["Importe total (€)"])}{" "}
              {translate.paidWith[language]}
            </p>
          </div>

          <div className="mobile-chart">
            <div className="chart-header">
              <h4>
                <span className="arrow-up">▲</span>
                {(displayData.value / 1000).toFixed(0)}k{" "}
                {translate.realEnter[language]}
              </h4>
              <h4 className="exits-text">
                <span className="arrow-down">▲</span>
                {(displayData.salidas / 1000).toFixed(0)}k{" "}
                {translate.realExit[language]}
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
      cashFlowAnalysis,
    } = data;

    const chartData = getChartData(
      cashFlowAnalysis?.["Flujo de dinero mensual 2024"] || []
    );
    const totalesAnuales = cashFlowAnalysis?.["Totales anuales"] || {};

    const displayData = selectedMonth || {
      value: safeParseFloat(totalesAnuales["Total Entradas (€)"]),
      salidas: safeParseFloat(totalesAnuales["Total Salidas (€)"]),
    };

    return (
      <div className="NuevoMenu">
        <div className="menu-left">
          <h1 className="menu-title">{translate.menuTitle[language]}</h1>
        </div>

        <div className="menu-right"></div>

        <div className="menu-center">
          <div className="flex justify-between mb-20">
            <h4>
              <span className="arrow-up">▲</span>
              <span>{formatNumber(displayData.value)} </span>
              <span className="text-sm ml-2">
                {translate.realEnter[language]}
              </span>
            </h4>
            <h4 className="exits-text">
              <span className="arrow-down">▲</span>
              <span>{formatNumber(displayData.salidas)} </span>
              <span className="text-sm ml-2">
                {translate.realExit[language]}
              </span>
            </h4>
          </div>
          <div style={{ width: "100%", height: "70%" }}>
            <Chart data={chartData} isMobile={false} />
          </div>
        </div>

        <div className="menu-left-info">
          <div className="info-block">
            <p className="number">
              {userAnalysis[1]?.Total_Diciembre_2024}{" "}
              {translate.companies[language]}
            </p>
            {formatPercentage(userAnalysis[1]?.Incremento_Porcentual)}
          </div>

          <div className="info-block">
            <p className="number">
              {userAnalysis[0]?.Total_Diciembre_2024}{" "}
              {translate.users[language]}
            </p>
            {formatPercentage(userAnalysis[0]?.Incremento_Porcentual)}
          </div>
        </div>

        <div className="menu-right-info">
          <p>
            {formatNumber(
              getLatestValue(monthlyAverageSpending, "Gasto_Medio_Mensual")
            )}{" "}
            EUR
          </p>
          <p>{translate.averageSpending[language]}</p>
        </div>

        <div className="menu-right-info2">
          <p>
            {formatNumber(
              getLatestValue(monthlySavingsAverage, "Ahorro_Medio_Mensual")
            )}{" "}
            EUR
          </p>
          <p>{translate.cashbackSavings[language]}</p>
        </div>

        <div className="menu-right-info3">
          <h5>{translate.lastMonthTitle[language]}</h5>
          <p>
            {formatNumber(totalOperationsData?.["Número total de operaciones"])}{" "}
            {translate.purchasesIn[language]}
          </p>
          <p>
            {formatNumber(totalOperationsData?.["Importe total (€)"])}{" "}
            {translate.paidWith[language]}
          </p>
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

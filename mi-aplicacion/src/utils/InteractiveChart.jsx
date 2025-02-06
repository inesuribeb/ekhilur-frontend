import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import translate from '../utils/language';

const InteractiveChart = ({ data, language, isMobile = false, className = '' }) => {
  const [selectedData, setSelectedData] = useState(null);

  const formatPercentage = (percentage) => {
    const value = parseFloat(percentage);
    if (value > 0) return `▲ ${value}%`;
    if (value < 0) return `▼ ${Math.abs(value)}%`;
    return `= ${value}%`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 rounded shadow border border-gray-200">
          <p className="text-sm font-medium">{`${payload[0].payload.month}`}</p>
          <p className="text-sm text-gray-600">{`${translate.realEnter[language]}: ${payload[0].payload.value.toLocaleString()} €`}</p>
          <p className="text-sm text-gray-600">{`${translate.realExit[language]}: ${payload[0].payload.salidas.toLocaleString()} €`}</p>
        </div>
      );
    }
    return null;
  };

  const currentData = selectedData || data[data.length - 1];

  return (
    <div className={className}>
      <div className="flex justify-between mb-4">
        <h4>
          <span className="arrow-up">↗</span>
          <span>{currentData.value.toLocaleString()}</span>
          <span className="text-sm ml-2">{translate.realEnter[language]}</span>
        </h4>
        <h4>
          <span className="arrow-down">↘</span>
          <span>{currentData.salidas.toLocaleString()}</span>
          <span className="text-sm ml-2">{translate.realExit[language]}</span>
        </h4>
      </div>
      <div style={{ width: '100%', height: isMobile ? '150px' : '70%' }}>
        <ResponsiveContainer>
          <BarChart 
            data={data} 
            onClick={(data) => data && setSelectedData(data.activePayload[0].payload)}
            onMouseLeave={() => setSelectedData(null)}
          >
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ 
                fontSize: isMobile ? 10 : 12,
                fill: '#666666' 
              }}
            />
            <YAxis hide />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
            />
            <Bar
              dataKey="value"
              fill="#000000"
              radius={[4, 4, 0, 0]}
              cursor="pointer"
              onMouseOver={(data) => setSelectedData(data)}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InteractiveChart;


const HeatMapBubbles = ({ mapaClienteZona }) => {
  const data = mapaClienteZona || [];
  
  // Encontrar los valores mínimos y máximos para la escala
  const minUsers = Math.min(...data.map(d => d.num_usuarios));
  const maxUsers = Math.max(...data.map(d => d.num_usuarios));

  // Función para calcular el tamaño de la burbuja basado en el número de usuarios
  const getBubbleSize = (numUsers) => {
    const minSize = 20;
    const maxSize = 60;
    const scale = (numUsers - minUsers) / (maxUsers - minUsers);
    return minSize + (maxSize - minSize) * scale;
  };

  // Función para obtener el color basado en el número de usuarios
  const getBubbleColor = (numUsers) => {
    const scale = (numUsers - minUsers) / (maxUsers - minUsers);
    const hue = 200; // Tono azul
    const saturation = 80;
    const lightness = 100 - (scale * 50); // Más oscuro para valores más altos
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  // Encontrar los límites del mapa
  const minLat = Math.min(...data.map(d => parseFloat(d.Latitud)));
  const maxLat = Math.max(...data.map(d => parseFloat(d.Latitud)));
  const minLon = Math.min(...data.map(d => parseFloat(d.Longitud)));
  const maxLon = Math.max(...data.map(d => parseFloat(d.Longitud)));

  // Función para convertir coordenadas a posición en el SVG
  const getXPosition = (lon) => {
    return ((parseFloat(lon) - minLon) / (maxLon - minLon)) * 100;
  };

  const getYPosition = (lat) => {
    return ((parseFloat(lat) - minLat) / (maxLat - minLat)) * 100;
  };

  return (
    <div className="w-full">
      <div className="chart-section">
        <div className="fila7-columna1">
          <h2 className="text-xl font-bold mb-4">Distribución geográfica de usuarios</h2>
          <h1 className="text-base opacity-50">Visualización de la concentración de usuarios por zona</h1>
        </div>
        
        <div className="fila7-columna2">
          <div className="relative w-full h-96">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              style={{ backgroundColor: '#f8f9fa' }}
            >
              {data.map((location, index) => (
                <g key={index}>
                  <circle
                    cx={`${getXPosition(location.Longitud)}%`}
                    cy={`${getYPosition(location.Latitud)}%`}
                    r={getBubbleSize(location.num_usuarios) / 10}
                    fill={getBubbleColor(location.num_usuarios)}
                    opacity="0.7"
                  >
                    <title>
                      {`${location.Nombre_calle}\nUsuarios: ${location.num_usuarios}`}
                    </title>
                  </circle>
                </g>
              ))}
            </svg>
          </div>
          
          {/* Leyenda */}
          <div className="flex justify-center mt-4 space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: getBubbleColor(minUsers) }}></div>
              <span className="text-sm">Menos usuarios</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: getBubbleColor(maxUsers) }}></div>
              <span className="text-sm">Más usuarios</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatMapBubbles;
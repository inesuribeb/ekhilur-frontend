import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Map, BarChart2, CreditCard } from 'lucide-react';
import './MobileNavbar.css';

const navigationItems = [
  {
    route: '/mapak',
    name: 'Mapas',
    icon: Map
  },
  {
    route: '/transakzioak',
    name: 'Transacciones',
    icon: CreditCard
  },
  {
    route: '/grafikak',
    name: 'Graficos',
    icon: BarChart2
  }
];

const MobileNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [spinningItem, setSpinningItem] = useState(null);

  // Verificar si estamos en la página de login o home
  const isPublicRoute = location.pathname === '/' || location.pathname === '/login';

  // Si estamos en una ruta pública, no mostramos el navbar
  if (isPublicRoute) {
    return null;
  }

  const handleClick = (route) => {
    setSpinningItem(route);
    navigate(route);
    
    setTimeout(() => {
      setSpinningItem(null);
    }, 500); 
  };

  return (
    <nav className="mobile-navbar">
      <div className="mobile-navbar__container">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.route;
          const isSpinning = spinningItem === item.route;
          const IconComponent = item.icon;
          
          return (
            <button
              key={item.route}
              onClick={() => handleClick(item.route)}
              className={`mobile-navbar__item ${isActive ? 'is-active' : ''} ${isSpinning ? 'spinning' : ''}`}
            >
              <div className="mobile-navbar__icon">
                <IconComponent size={24} />
              </div>
              <span className="mobile-navbar__label">
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavbar;
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, LogOut, Menu as MenuIcon, X } from 'lucide-react';
import Logo from '../../utils/proyecto.png';
import LanguageButton from '../LanguageButton/LanguageButton';
import './DesktopNavbar.css';

const BasicNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  const isMenuPage = location.pathname === '/menu';
  const isHomePage = location.pathname === '/';

  const handleLogout = () => {
    
    navigate('/');
  };

  const menuItems = [
    { name: 'Mapak', route: '/mapak' },
    { name: 'Transakzioak', route: '/transakzioak' },
    { name: 'Grafikak', route: '/grafikak' }
  ];

  return (
    <>
      <nav className="modern-navbar">
        <div className="modern-navbar__container">
          <div className="modern-navbar__logo" onClick={() => navigate('/')}>
            <img src={Logo} alt="EkhiLur Logo" className="logo-image" />
          </div>
          <div className="modern-navbar__controls">
            <div className="language-switcher">
              <Eye className="eye-icon" size={24} />
              <LanguageButton />
            </div>
            {!isHomePage && ( 
              <>
                {!isMenuPage && (
                  <button
                    className="hamburger-button"
                    onClick={() => setIsHamburgerOpen(!isHamburgerOpen)}
                  >
                    {isHamburgerOpen ? <X size={24} /> : <MenuIcon size={24} />}
                  </button>
                )}
                <button className="logout-button" onClick={handleLogout}>
                  <LogOut size={24} />
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Menú hamburguesa */}
      {!isMenuPage && !isHomePage && (
        <div className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''}`}>
          {menuItems.map((item) => (
            <button
              key={item.route}
              className="hamburger-menu-item"
              onClick={() => {
                navigate(item.route);
                setIsHamburgerOpen(false);
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default BasicNavbar;
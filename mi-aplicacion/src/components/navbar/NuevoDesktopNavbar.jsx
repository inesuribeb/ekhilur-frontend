import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, LogOut, Menu as MenuIcon, X } from 'lucide-react';
import { LanguageContext } from '../../context/LanguageContext';
import Logo from '../../utils/proyecto.png';
import LanguageButton from '../LanguageButton/LanguageButton';
import './NuevoDesktopNavbar.css';

const NuevoDesktopNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isButtonBlinking, setIsButtonBlinking] = useState(false);
  const { toggleLanguage } = useContext(LanguageContext);

  const isMenuPage = location.pathname === '/menus';
  const isHomePage = location.pathname === '/';

  const handleLogout = () => {
    navigate('/');
  };

  const handleEyeClick = () => {
    setIsBlinking(true);
    setIsButtonBlinking(true);
    setTimeout(() => {
      setIsBlinking(false);
      setIsButtonBlinking(false);
      toggleLanguage();
    }, 150);
  };

  const menuItems = [
    { name: 'Mapak', route: '/mapak' },
    { name: 'Transakzioak', route: '/transakzioak' },
    { name: 'Grafikak', route: '/grafikak' },
    { 
      name: '', 
      route: '/', 
      icon: <LogOut size={24} />,
      onClick: handleLogout 
    }
  ];

  return (
    <>
      <nav className={`modern-navbar ${isHomePage ? 'home-route' : ''}`}>
        <div className="modern-navbar__container">
          <div className="modern-navbar__logo" onClick={() => navigate('/')}>
            <img src={Logo} alt="Logo" className="logo-image" />
          </div>
          <div className="modern-navbar__controls">
            <div className="language-switcher" onClick={handleEyeClick}>
              <Eye className={`eye-icon ${isBlinking ? 'blink' : ''}`} size={24} />
              <LanguageButton isBlinking={isButtonBlinking} />
            </div>
            {!isHomePage && !isMenuPage && (
              <button
                className={`hamburger-button ${isHamburgerOpen ? 'open' : ''}`}
                onClick={() => setIsHamburgerOpen(!isHamburgerOpen)}
              >
                <MenuIcon className="menu-icon menu-icon-bars" size={24} />
                <X className="menu-icon menu-icon-close" size={24} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hamburger menu */}
      {!isMenuPage && !isHomePage && (
        <div className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''}`}>
          {menuItems.map((item) => (
            <button
              key={item.route}
              className="hamburger-menu-item"
              onClick={() => {
                if (item.onClick) {
                  item.onClick();
                } else {
                  navigate(item.route);
                }
                setIsHamburgerOpen(false);
              }}
            >
              <span>{item.name}</span>
              {item.icon && <span className="menu-item-icon">{item.icon}</span>}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default NuevoDesktopNavbar;
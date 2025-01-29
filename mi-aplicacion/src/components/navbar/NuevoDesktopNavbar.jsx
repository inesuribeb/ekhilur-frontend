import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, LogOut, Menu as MenuIcon, X } from 'lucide-react';
import Logo from '../../utils/proyecto.png';
import LanguageButton from '../LanguageButton/LanguageButton';
import './NuevoDesktopNavbar.css';

const NuevoDesktopNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  const isMenuPage = location.pathname === '/menus';
  const isHomePage = location.pathname === '/';

  const handleLogout = () => {
    navigate('/');
  };

  const menuItems = [
    { name: 'Mapak', route: '/mapak' },
    { name: 'Transakzioak', route: '/transakzioak' },
    { name: 'Grafikak', route: '/grafikak' },
    { 
      name: 'Logout', 
      route: '/', 
      icon: <LogOut size={24} />,
      onClick: handleLogout 
    }
  ];

  return (
    <>
      <nav className="modern-navbar">
        <div className="modern-navbar__container">
          <div className="modern-navbar__logo" onClick={() => navigate('/')}>
            <img src={Logo} alt="Logo" className="logo-image" />
          </div>
          <div className="modern-navbar__controls">
            <div className="language-switcher">
              <Eye className="eye-icon" size={24} />
              <LanguageButton />
            </div>
            {!isHomePage && !isMenuPage && (
              <button
                className="hamburger-button"
                onClick={() => setIsHamburgerOpen(!isHamburgerOpen)}
              >
                {isHamburgerOpen ? <X size={24} /> : <MenuIcon size={24} />}
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
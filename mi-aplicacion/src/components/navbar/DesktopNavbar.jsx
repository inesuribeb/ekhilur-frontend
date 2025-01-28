import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Eye } from 'lucide-react';
import Login from '../auth/Login';
import Logo from '../../utils/proyecto.png';
import './DesktopNavbar.css';

const ModernNavbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState('EUS');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const pages = [
    {  route: '/login', color: '#FFFFFF', component: <Login /> },
    { name: 'Mapak', route: '/mapak', color: '#FF1493' },
    { name: 'Transakzioak', route: '/transakzioak', color: '#4F46E5' },
    { name: 'Grafikak', route: '/grafikak', color: '#EC4899' }
  ];

  const handleTabClick = (index, route) => {
    if (index !== activeTab) {
      setActiveTab(index);
    } else {
      navigate(route);
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <div className={`background-video ${isMenuOpen ? 'hidden' : ''}`}>
        <iframe
          src="https://www.youtube.com/embed/xWqE6cesR-M?autoplay=1&mute=1&controls=0&loop=1&playlist=xWqE6cesR-M"
          title="Hernani Background Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
        <div className="video-overlay"></div>
      </div>

      <nav className="modern-navbar">
        <div className="modern-navbar__container">
          <div className="modern-navbar__logo" onClick={() => navigate('/')}>
            <img src={Logo} alt="EkhiLur Logo" className="logo-image" />
          </div>
          <div className="modern-navbar__controls">
            <button
              className="language-switcher"
              onClick={() => setLanguage((prev) => (prev === 'EUS' ? 'ES' : 'EUS'))}
            >
              <Eye size={24} className="eye-icon" />
              <span>{language}</span>
            </button>
            <button
              className="modern-navbar__menu-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={40} /> : <Menu size={40} />}
            </button>
          </div>
        </div>
      </nav>

      <div className={`menu-container ${isMenuOpen ? 'is-open' : ''}`}>
        <div className="vertical-tabs">
          {pages.map((page, index) => (
            <div
              key={page.route}
              className={`tab-bar ${index === activeTab ? 'active' : ''} ${page.route === '/login' && index !== activeTab ? 'login-tab' : ''}`}
              style={{
                backgroundColor: page.color,
                zIndex: pages.length - index
              }}
              onClick={() => handleTabClick(index, page.route)}
            >
              <div className="tab-content">
                <span className="page-name">{page.name}</span>
                {index === activeTab && page.route === '/login' && (
                  <div className="login-container">
                    {page.component}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="menu-image">
          <img
            src="https://ikaivans.com/wp-content/uploads/Casco-historico-hernani.jpg"
            alt="Casco histórico de Hernani"
          />
        </div>
      </div>
    </>
  );
};

export default ModernNavbar;
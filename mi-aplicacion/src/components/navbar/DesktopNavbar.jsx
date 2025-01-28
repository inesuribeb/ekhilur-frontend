import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import Logo from '../../utils/proyecto.png';
import LanguageButton from '../LanguageButton/LanguageButton';
import './DesktopNavbar.css';

const BasicNavbar = () => {
  const navigate = useNavigate();

  return (
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
        </div>
      </div>
    </nav>
  );
};

export default BasicNavbar;
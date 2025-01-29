import { useState } from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const columns = [
    {
      title: "Company",
      links: ["About", "Services", "Contact"]
    },
    {
      title: "Support",
      links: ["Help", "Terms", "Privacy"]
    },
    {
      title: "Resources",
      links: ["Blog", "Docs", "FAQ"]
    }
  ];

  const [hoveredIcon, setHoveredIcon] = useState(null);

  return (
    <footer className="footer">
      <div className="container">
        <div className="main">
          <div className="company-info">
            <div>
              <h2 className="company-title">DatuSarea</h2>
            </div>
            <div className="social-links">
              <Facebook 
                className={`icon ${hoveredIcon === 'facebook' ? 'icon-hover' : ''}`}
                onMouseEnter={() => setHoveredIcon('facebook')}
                onMouseLeave={() => setHoveredIcon(null)}
              />
              <Twitter 
                className={`icon ${hoveredIcon === 'twitter' ? 'icon-hover' : ''}`}
                onMouseEnter={() => setHoveredIcon('twitter')}
                onMouseLeave={() => setHoveredIcon(null)}
              />
              <Instagram 
                className={`icon ${hoveredIcon === 'instagram' ? 'icon-hover' : ''}`}
                onMouseEnter={() => setHoveredIcon('instagram')}
                onMouseLeave={() => setHoveredIcon(null)}
              />
            </div>
          </div>

          <div className="contact-info">
            <div className="contact-item">
              <Mail className="icon" />
              <a href="mailto:kaixo@ekhilur.eus" className="contact-text">
                kaixo@ekhilur.eus
              </a>
            </div>
            <div className="contact-item">
              <Phone className="icon" />
              <a href="tel:944686273" className="contact-text">
                944 68 62 73
              </a>
            </div>
          </div>
        </div>

        <div className="navigation">
          {columns.map((column, index) => (
            <div key={index} className="nav-column">
              <h3 className="nav-title">{column.title}</h3>
              <ul className="nav-list">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href="#" className="nav-link">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="legal-section">
          <div className="legal-links">
            <a href="#" className="legal-link">POLÍTICA DE PRIVACIDAD</a>
            <span className="separator">|</span>
            <a href="#" className="legal-link">AVISO LEGAL</a>
            <span className="separator">|</span>
            <a href="#" className="legal-link">POLÍTICA DE COOKIES</a>
          </div>
          <p className="legal-notice">
            *Bajo la cobertura legal de UP Aganea EDE entidad inscrita con el número 6709 en el Registro oficial de Entidades Financieras.*
          </p>
        </div>
        
        <div className="copyright">
          <div className="copyright-divider"></div>
          <p className="copyright-text">
            ekhilur e. koop. © 2025 Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
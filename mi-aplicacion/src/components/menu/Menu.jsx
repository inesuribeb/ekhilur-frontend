import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import './Menu.css';

const Menu = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(null);

  const pages = [
    { name: 'Mapak', route: '/mapak', color: '#111111' },
    { name: 'Transakzioak', route: '/transakzioak', color: '#4F46E5' },
    { name: 'Grafikak', route: '/grafikak', color: '#EC4899' }
  ];

  const handleTabClick = (index, route) => {
    if (index === activeTab) {
      navigate(route);
    } else {
      setActiveTab(index);
    }
  };

  const handleBack = () => {
    setActiveTab(null);
  };

  return (
    <>
      <BasicNavbar />
      <div className="menu-container is-open">
        <div className={`vertical-tabs ${activeTab !== null ? 'expanded' : ''}`}>
          {pages.map((page, index) => (
            <div
              key={page.route}
              className={`tab-bar ${index === activeTab ? 'active' : ''}`}
              style={{
                backgroundColor: page.color,
                zIndex: activeTab === index ? 0 : 2
              }}
              onClick={() => handleTabClick(index, page.route)}
            >
              <div className="tab-content">
                <span className="page-name">{page.name}</span>
              </div>
            </div>
          ))}
          {activeTab !== null && (
            <button className="back-button" onClick={handleBack}>
              <ArrowLeft size={24} />
            </button>
          )}
        </div>

        <div className="menu-video">
          <iframe
            src="https://www.youtube.com/embed/xWqE6cesR-M?autoplay=1&mute=1&controls=0&loop=1&playlist=xWqE6cesR-M"
            title="Hernani Menu Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </>
  );
};

export default Menu;
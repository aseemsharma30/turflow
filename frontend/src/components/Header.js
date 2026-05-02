import React from 'react';
import { FiMapPin, FiBell } from 'react-icons/fi';
import './Header.css';

function Header({ location }) {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="logo">
          Tur<span className="logo-green">Flow</span>
        </h1>
      </div>

      <div className="header-right">
        <div className="location-selector">
          <span className="location-btn">
            <FiMapPin />
            {location || 'Lucknow'}
          </span>
        </div>

        <button className="notification-btn">
          <FiBell />
        </button>
      </div>
    </header>
  );
}

export default Header;
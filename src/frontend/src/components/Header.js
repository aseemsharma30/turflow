import React, { useState } from 'react';
import { FiMapPin, FiBell } from 'react-icons/fi';
import './Header.css';

function Header({ location, setLocation }) {
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const locations = ['Lucknow', 'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad'];

  const handleLocationSelect = (loc) => {
    setLocation(loc);
    setShowLocationDropdown(false);
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="logo">
          Tur<span className="logo-green">Flow</span>
        </h1>
      </div>

      <div className="header-right">
        <div className="location-selector">
          <button
            className="location-btn"
            onClick={() => setShowLocationDropdown(!showLocationDropdown)}
          >
            <FiMapPin />
            {location}
          </button>
          {showLocationDropdown && (
            <div className="location-dropdown">
              {locations.map((loc) => (
                <div
                  key={loc}
                  className="location-option"
                  onClick={() => handleLocationSelect(loc)}
                >
                  {loc}
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="notification-btn">
          <FiBell />
        </button>
      </div>
    </header>
  );
}

export default Header;


import React from 'react';
import { FiMapPin, FiBell } from 'react-icons/fi';
import './Header.css';

function Header({ location }) {
  return (
    <header className="header">
      <div className="header-left">
        <span style={{fontFamily:'"Arial Black",Impact,sans-serif',fontStyle:'italic',fontWeight:900,fontSize:'28px',letterSpacing:'-0.5px',lineHeight:1,userSelect:'none'}}>
          <span style={{color:'#fff'}}>Tur</span><span style={{color:'#20c05c'}}>Flow</span>
        </span>
      </div>

      <div className="header-right">
        <div className="location-selector">
          <span className="location-btn">
            <FiMapPin />
            {location || 'Lucknow'}
          </span>
        </div>


      </div>
    </header>
  );
}

export default Header;
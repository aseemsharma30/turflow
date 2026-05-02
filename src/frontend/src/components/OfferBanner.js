import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import './OfferBanner.css';

function OfferBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="offer-banner">
      <div className="offer-content">
        <div className="offer-percent">
          <span className="percent">25%</span>
          <span className="off">OFF</span>
        </div>
        <div className="offer-text">
          <h3>New User Offer!</h3>
          <p>Get 25% off on your second booking!</p>
        </div>
      </div>
      <button
        className="close-btn"
        onClick={() => setIsVisible(false)}
      >
        <FiX />
      </button>
    </div>
  );
}

export default OfferBanner;


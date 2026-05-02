import React from 'react';
import { GiCricketBat } from 'react-icons/gi';
import { FaFootballBall } from 'react-icons/fa';
import './SportsSelector.css';

function SportsSelector({ selectedSport, setSelectedSport }) {
  const sports = [
    {
      id: 'cricket',
      name: 'Cricket',
      icon: <GiCricketBat />
    },
    {
      id: 'football',
      name: 'Football',
      icon: <FaFootballBall />
    },
    {
      id: 'pickleball',
      name: 'Pickleball',
      icon: <GiCricketBat /> // Using cricket icon as placeholder
    }
  ];

  return (
    <div className="sports-selector">
      <h3>Sports</h3>
      <div className="sports-grid">
        {sports.map((sport) => (
          <button
            key={sport.id}
            className={`sport-btn ${selectedSport === sport.id ? 'active' : ''}`}
            onClick={() => setSelectedSport(sport.id)}
          >
            <div className="sport-icon">
              {sport.icon}
            </div>
            <span>{sport.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default SportsSelector;


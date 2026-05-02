import React from 'react';
import { FiCalendar, FiHome, FiUser } from 'react-icons/fi';
import './BottomNavigation.css';

function BottomNavigation() {
  const [activeTab, setActiveTab] = React.useState('home');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="bottom-navigation">
      <button
        className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => handleTabClick('home')}
      >
        <FiHome />
        <span>Home</span>
      </button>

      <button
        className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
        onClick={() => handleTabClick('bookings')}
      >
        <FiCalendar />
        <span>Bookings</span>
      </button>

      <button
        className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
        onClick={() => handleTabClick('profile')}
      >
        <FiUser />
        <span>Profile</span>
      </button>
    </div>
  );
}

export default BottomNavigation;

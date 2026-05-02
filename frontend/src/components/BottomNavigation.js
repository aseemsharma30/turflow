import React from 'react';
import { FiCalendar, FiHome, FiUser } from 'react-icons/fi';
import './BottomNavigation.css';

function ComingSoonOverlay({ label, onClose }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
        zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff', borderRadius: '16px', padding: '40px 32px',
          textAlign: 'center', maxWidth: '280px', width: '90%'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🚧</div>
        <h2 style={{ margin: '0 0 8px', fontSize: '20px' }}>{label}</h2>
        <p style={{ margin: '0 0 20px', color: '#666', fontSize: '14px' }}>
          This feature is coming soon. Stay tuned!
        </p>
        <button
          onClick={onClose}
          style={{
            background: '#22c55e', color: '#fff', border: 'none',
            borderRadius: '8px', padding: '10px 28px', fontSize: '15px', cursor: 'pointer'
          }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}

function BottomNavigation() {
  const [activeTab, setActiveTab] = React.useState('home');
  const [comingSoon, setComingSoon] = React.useState(null);

  const handleTabClick = (tab) => {
    if (tab === 'bookings' || tab === 'profile') {
      setComingSoon(tab === 'bookings' ? 'Bookings' : 'Profile');
      return;
    }
    setActiveTab(tab);
  };

  return (
    <>
      {comingSoon && (
        <ComingSoonOverlay label={comingSoon} onClose={() => setComingSoon(null)} />
      )}
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
    </>
  );
}

export default BottomNavigation;
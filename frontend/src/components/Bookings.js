import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { apiUrl } from '../apiConfig';
import './Bookings.css';

function Bookings({ onSignInClick, onBack }) {
  const { isAuthenticated, user } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await fetch(apiUrl('/api/user-bookings.php'), {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('userToken')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setBookings(Array.isArray(data) ? data : []);
        } else {
          setError('Failed to load bookings');
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Error loading bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="bookings-container">
        <div className="bookings-loading">Loading bookings...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bookings-container">
        <div className="bookings-signin-prompt">
          <h2>My Bookings</h2>
          <p>Please sign in to view your bookings</p>
          <button className="bookings-signin-btn" onClick={onSignInClick}>
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bookings-container">
      <div className="bookings-header">
        <h2>My Bookings</h2>
        <button className="bookings-back-btn" onClick={onBack}>
          ← Back
        </button>
      </div>

      {error && <div className="bookings-error">{error}</div>}

      {bookings.length === 0 ? (
        <div className="bookings-empty">
          <p>No bookings yet</p>
          <p className="bookings-empty-hint">Start booking venues to see them here</p>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <h3>{booking.venue_name}</h3>
                <span className={`booking-status ${booking.status.toLowerCase()}`}>
                  {booking.status}
                </span>
              </div>

              <div className="booking-details">
                <div className="booking-detail-item">
                  <label>Location:</label>
                  <span>{booking.venue_location}</span>
                </div>

                <div className="booking-detail-item">
                  <label>Date:</label>
                  <span>{booking.date_label}</span>
                </div>

                <div className="booking-detail-item">
                  <label>Time:</label>
                  <span>{booking.booking_time}</span>
                </div>

                <div className="booking-detail-item">
                  <label>Duration:</label>
                  <span>{booking.duration} hour(s)</span>
                </div>

                <div className="booking-detail-item">
                  <label>Amount:</label>
                  <span className="booking-amount">₹{booking.amount}</span>
                </div>
              </div>

              <div className="booking-footer">
                <small>Booked on {new Date(booking.created_at).toLocaleDateString()}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Bookings;

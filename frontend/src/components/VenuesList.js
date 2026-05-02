import React, { useContext } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { FiMapPin } from 'react-icons/fi';
import { VenueContext } from '../context/VenueContext';
import './VenuesList.css';

function VenuesList({ onBookVenue }) {
  const { venues } = useContext(VenueContext);

  return (
    <div className="venues-list">
      <h2>Venues</h2>
      <div className="venues-container">
        {venues.length === 0 ? (
          <div className="no-venues-message">
            No venues available yet.
          </div>
        ) : (
          venues.map((venue) => (
            <div key={venue.id} className="venue-item">
              <div className="venue-image-small">
                <img src={venue.image} alt={venue.name} />
                {venue.badge && (
                  <div className="venue-badge">{venue.badge}</div>
                )}
              </div>

              <div className="venue-info">
                <h3>{venue.name}</h3>
                <div className="venue-location">
                  <FiMapPin />
                  <span>{venue.location}</span>
                </div>
                {venue.description && (
                  <p className="venue-description-small">{venue.description}</p>
                )}

                <div className="venue-bottom">
                  <div className="venue-rating">
                    <AiFillStar /> {venue.rating}
                  </div>
                  <div className="venue-price">₹{venue.price}<span>/hr</span></div>
                </div>

                <div className="venue-sports">
                  {venue.sports.map((sport) => (
                    <span key={sport} className="venue-sport-tag">{sport}</span>
                  ))}
                </div>
              </div>

              <div className="venue-actions-small">
                <button className="book-btn-small" onClick={() => onBookVenue(venue.id)}>Book</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default VenuesList;

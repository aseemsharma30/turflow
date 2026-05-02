import React, { useContext, useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiHeart, FiImage } from 'react-icons/fi';
import { AiFillStar } from 'react-icons/ai';
import { VenueContext } from '../context/VenueContext';
import './FeaturedVenues.css';

function FeaturedVenues({ onBookVenue }) {
  const { venues } = useContext(VenueContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState(false);

  const displayVenues = venues.filter(venue => venue.isFeatured).slice(0, 6);

  useEffect(() => {
    if (currentIndex >= displayVenues.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, displayVenues.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayVenues.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + displayVenues.length) % displayVenues.length);
  };

  if (displayVenues.length === 0) {
    return (
      <div className="featured-venues">
        <h3>Featured Venues</h3>
        <div className="no-venues-message">
          No venues available yet.
        </div>
      </div>
    );
  }

  const currentVenue = displayVenues[currentIndex];

  return (
    <div className="featured-venues">
      <h3>Featured Venues</h3>
      <div className="carousel-container">
        <div className="carousel">
          <div className="venue-card">
            {currentVenue.badge && (
              <div className="badge">{currentVenue.badge}</div>
            )}
            <div className="venue-image">
              <img src={currentVenue.image} alt={currentVenue.name} />
              <button
                className="like-btn"
                onClick={() => setLiked(!liked)}
              >
                <FiHeart fill={liked ? '#22c55e' : 'none'} />
              </button>
            </div>

            <div className="venue-details">
              <h4>{currentVenue.name}</h4>
              <p className="location">{currentVenue.location}</p>
              {currentVenue.description && (
                <p className="venue-description">{currentVenue.description}</p>
              )}

              <div className="venue-meta">
                <div className="rating">
                  <AiFillStar /> {currentVenue.rating}
                </div>
                <div className="price">₹{currentVenue.price}<span>/hr</span></div>
              </div>

              <div className="sports-tags">
                {currentVenue.sports.map((sport) => (
                  <span key={sport} className="sport-tag">{sport}</span>
                ))}
              </div>

              <div className="venue-actions">
                <button className="book-btn" onClick={() => onBookVenue(currentVenue.id)}>Book Now →</button>
                <button className="gallery-btn">
                  <FiImage /> {currentVenue.gallery.length > 0 ? `${currentVenue.gallery.length} Photos` : 'Gallery'}
                </button>
              </div>
            </div>
          </div>

          <div className="carousel-controls">
            <button className="nav-btn prev" onClick={handlePrev}>
              <FiChevronLeft />
            </button>
            <div className="dots">
              {displayVenues.map((_, index) => (
                <div
                  key={index}
                  className={`dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
            <button className="nav-btn next" onClick={handleNext}>
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturedVenues;

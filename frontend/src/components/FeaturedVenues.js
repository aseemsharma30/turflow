import React, { useContext, useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiHeart, FiImage } from 'react-icons/fi';
import { AiFillStar } from 'react-icons/ai';
import { VenueContext } from '../context/VenueContext';
import './FeaturedVenues.css';

function FeaturedVenues({ onBookVenue }) {
  const { venues } = useContext(VenueContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(null);

  const displayVenues = venues.filter(venue => venue.isFeatured).slice(0, 6);

  useEffect(() => {
    if (currentIndex >= displayVenues.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, displayVenues.length]);

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % displayVenues.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + displayVenues.length) % displayVenues.length);

  if (displayVenues.length === 0) {
    return (
      <div className="featured-venues">
        <h3>Featured Venues</h3>
        <div className="no-venues-message">No venues available yet.</div>
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

            </div>

            <div className="venue-details">
              <h4>{currentVenue.name}</h4>
              <p className="location">{currentVenue.location}</p>
              {currentVenue.description && (
                <p className="venue-description">{currentVenue.description}</p>
              )}

              <div className="venue-meta">
                <div className="rating"><AiFillStar /> {currentVenue.rating}</div>
                <div className="price">₹{currentVenue.price}<span>/hr</span></div>
              </div>

              <div className="sports-tags">
                {currentVenue.sports.map((sport) => (
                  <span key={sport} className="sport-tag">{sport}</span>
                ))}
              </div>

              <div className="venue-actions">
                <button className="book-btn" onClick={() => onBookVenue(currentVenue.id)}>Book Now →</button>
                <button
                  className="gallery-btn"
                  onClick={() => currentVenue.gallery.length > 0 && setGalleryIndex(0)}
                  style={{ opacity: currentVenue.gallery.length > 0 ? 1 : 0.5, cursor: currentVenue.gallery.length > 0 ? 'pointer' : 'default' }}
                >
                  <FiImage /> {currentVenue.gallery.length > 0 ? `${currentVenue.gallery.length} Photos` : 'No Gallery'}
                </button>
              </div>
            </div>
          </div>

          <div className="carousel-controls">
            <button className="nav-btn prev" onClick={handlePrev}><FiChevronLeft /></button>
            <div className="dots">
              {displayVenues.map((_, index) => (
                <div
                  key={index}
                  className={`dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
            <button className="nav-btn next" onClick={handleNext}><FiChevronRight /></button>
          </div>
        </div>
      </div>

      {/* Gallery lightbox */}
      {galleryIndex !== null && currentVenue.gallery.length > 0 && (
        <div
          onClick={() => setGalleryIndex(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px' }}
        >
          <button
            onClick={() => setGalleryIndex(null)}
            style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', borderRadius: '50%', width: '36px', height: '36px', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >✕</button>
          <img
            src={currentVenue.gallery[galleryIndex]}
            alt={`Gallery ${galleryIndex + 1}`}
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '92vw', maxHeight: '75vh', borderRadius: '12px', objectFit: 'contain' }}
          />
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {currentVenue.gallery.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`thumb ${i}`}
                onClick={e => { e.stopPropagation(); setGalleryIndex(i); }}
                style={{ width: '56px', height: '42px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer', border: i === galleryIndex ? '2px solid #22c55e' : '2px solid transparent', opacity: i === galleryIndex ? 1 : 0.6 }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FeaturedVenues;
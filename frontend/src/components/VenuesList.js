import React, { useContext, useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { FiMapPin } from 'react-icons/fi';
import { VenueContext } from '../context/VenueContext';
import './VenuesList.css';

function VenuesList({ onBookVenue }) {
  const { venues } = useContext(VenueContext);
  const [gallery, setGallery] = useState({ photos: [], index: null });

  const openGallery = (e, venue) => {
    e.stopPropagation();
    const photos = (venue.gallery && venue.gallery.length > 0) ? venue.gallery : (venue.image ? [venue.image] : []);
    if (photos.length > 0) setGallery({ photos, index: 0 });
  };

  const closeGallery = () => setGallery({ photos: [], index: null });

  return (
    <div className="venues-list">
      <h2>Venues</h2>
      <div className="venues-container">
        {venues.length === 0 ? (
          <div className="no-venues-message">No venues available yet.</div>
        ) : (
          venues.map((venue) => (
            <div
              key={venue.id}
              className="venue-item"
              onClick={() => onBookVenue(venue.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="venue-image-small" onClick={(e) => openGallery(e, venue)}>
                <img src={venue.image} alt={venue.name} />
                {venue.badge && <div className="venue-badge">{venue.badge}</div>}
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
                  <div className="venue-rating"><AiFillStar /> {venue.rating}</div>
                  <div className="venue-price">₹{venue.price}<span>/hr</span></div>
                </div>
                <div className="venue-sports">
                  {venue.sports.map((sport) => (
                    <span key={sport} className="venue-sport-tag">{sport}</span>
                  ))}
                </div>
              </div>

              <div className="venue-actions-small">
                <button className="book-btn-small" onClick={(e) => { e.stopPropagation(); onBookVenue(venue.id); }}>Book</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Gallery lightbox */}
      {gallery.index !== null && (
        <div
          onClick={closeGallery}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px' }}
        >
          <button
            onClick={closeGallery}
            style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', borderRadius: '50%', width: '36px', height: '36px', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >✕</button>
          <img
            src={gallery.photos[gallery.index]}
            alt={`Photo ${gallery.index + 1}`}
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '92vw', maxHeight: '75vh', borderRadius: '12px', objectFit: 'contain' }}
          />
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {gallery.photos.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`thumb ${i}`}
                onClick={e => { e.stopPropagation(); setGallery(g => ({ ...g, index: i })); }}
                style={{ width: '56px', height: '42px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer', border: i === gallery.index ? '2px solid #22c55e' : '2px solid transparent', opacity: i === gallery.index ? 1 : 0.6 }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default VenuesList;
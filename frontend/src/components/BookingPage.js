import React, { useContext, useMemo, useState } from 'react';
import { FiArrowLeft, FiMapPin } from 'react-icons/fi';
import { AiFillStar } from 'react-icons/ai';
import { VenueContext } from '../context/VenueContext';
import './BookingPage.css';

const timeSlots = [];
for (let hour = 0; hour < 24; hour++) {
  const ampm = hour < 12 ? 'AM' : 'PM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  timeSlots.push(`${displayHour}:00 ${ampm}`);
  timeSlots.push(`${displayHour}:30 ${ampm}`);
}

const durationOptions = [1, 2, 3, 4, 5, 6];

const formatDateOption = (date) => (
  date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  })
);

function BookingPage({ venueId, onBack, onContinue }) {
  const { venues } = useContext(VenueContext);
  const venue = venues.find(item => String(item.id) === String(venueId));
  const dateOptions = useMemo(() => (
    Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() + index);
      return {
        value: date.toISOString().slice(0, 10),
        label: formatDateOption(date)
      };
    })
  ), []);

  const [selectedDate, setSelectedDate] = useState(dateOptions[0].value);
  const [galleryIndex, setGalleryIndex] = useState(null);
  const [selectedTime, setSelectedTime] = useState('6:00 PM');
  const [duration, setDuration] = useState(1);

  if (!venue) {
    return (
      <main className="booking-page">
        <div className="booking-topbar">
          <button className="booking-back-btn" onClick={onBack} aria-label="Back">
            <FiArrowLeft />
          </button>
          <h1>Book Turf</h1>
        </div>
        <div className="booking-empty">Venue not found.</div>
      </main>
    );
  }

  const photos = [venue.image, ...(venue.gallery || [])].filter(Boolean).slice(0, 4);
  const selectedDateLabel = dateOptions.find(option => option.value === selectedDate)?.label;
  const total = Number(venue.price || 0) * Number(duration);
  const handleContinue = () => {
    onContinue({
      venueId,
      date: selectedDate,
      dateLabel: selectedDateLabel,
      time: selectedTime,
      duration,
      total
    });
  };

  return (
    <main className="booking-page">
      <div className="booking-topbar">
        <button className="booking-back-btn" onClick={onBack} aria-label="Back">
          <FiArrowLeft />
        </button>
        <h1>Book Turf</h1>
      </div>

      <section className="booking-section">
        <h2>Turf Photos</h2>
        <div className="booking-photo-grid">
          {photos.map((photo, index) => (
            <div className="booking-photo" key={`${photo}-${index}`} onClick={() => setGalleryIndex(index)} style={{cursor:'pointer'}}>
              <img src={photo} alt={`${venue.name} ${index + 1}`} />
              <span>{index + 1}/{photos.length}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="booking-venue-card">
        <div>
          <h2>{venue.name}</h2>
          <div className="booking-location">
            <FiMapPin />
            <span>{venue.location}</span>
          </div>
          {venue.description && <p>{venue.description}</p>}
          <div className="booking-meta">
            <span><AiFillStar /> {venue.rating}</span>
            <strong>₹{venue.price}<small>/hr</small></strong>
          </div>
        </div>
        <div className="booking-sports">
          {venue.sports.map(sport => (
            <span key={sport}>{sport}</span>
          ))}
        </div>
      </section>

      <section className="booking-controls">
        <div className="booking-field">
          <label htmlFor="booking-date">Select Date</label>
          <select
            id="booking-date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
          >
            {dateOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="booking-field">
          <label htmlFor="booking-time">Select Time</label>
          <select
            id="booking-time"
            value={selectedTime}
            onChange={(event) => setSelectedTime(event.target.value)}
          >
            {timeSlots.map(slot => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
        </div>

        <div className="booking-field">
          <label htmlFor="booking-duration">Number of Hours</label>
          <select
            id="booking-duration"
            value={duration}
            onChange={(event) => setDuration(Number(event.target.value))}
          >
            {durationOptions.map(option => (
              <option key={option} value={option}>{option} hr</option>
            ))}
          </select>
        </div>
      </section>

      <section className="booking-summary">
        <h2>Booking Summary</h2>
        <div>
          <span>Duration</span>
          <strong>{duration} hr</strong>
        </div>
        <div>
          <span>Date & Slot</span>
          <strong>{selectedDateLabel} • {selectedTime}</strong>
        </div>
        <div className="booking-total">
          <span>Total ({duration} x ₹{venue.price})</span>
          <strong>₹{total}</strong>
        </div>
      </section>

      <button className="booking-submit" type="button" onClick={handleContinue}>
        Continue to Your Details
      </button>

      {/* Gallery lightbox */}
      {galleryIndex !== null && (
        <div
          onClick={() => setGalleryIndex(null)}
          style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.92)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'12px'}}
        >
          <button
            onClick={() => setGalleryIndex(null)}
            style={{position:'absolute',top:'16px',right:'16px',background:'rgba(255,255,255,0.15)',border:'none',color:'#fff',borderRadius:'50%',width:'36px',height:'36px',fontSize:'20px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}
          >✕</button>
          <img
            src={photos[galleryIndex]}
            alt={`${venue.name} ${galleryIndex + 1}`}
            onClick={e => e.stopPropagation()}
            style={{maxWidth:'92vw',maxHeight:'75vh',borderRadius:'12px',objectFit:'contain'}}
          />
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap',justifyContent:'center'}}>
            {photos.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`thumb ${i}`}
                onClick={e => { e.stopPropagation(); setGalleryIndex(i); }}
                style={{width:'56px',height:'42px',objectFit:'cover',borderRadius:'6px',cursor:'pointer',border: i === galleryIndex ? '2px solid #22c55e' : '2px solid transparent',opacity: i === galleryIndex ? 1 : 0.6}}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

export default BookingPage;
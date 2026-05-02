import React, { useContext, useMemo, useState } from 'react';
import { FiArrowLeft, FiMapPin } from 'react-icons/fi';
import { AiFillStar } from 'react-icons/ai';
import { VenueContext } from '../context/VenueContext';
import './BookingPage.css';

const timeSlots = [
  '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM',
  '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
  '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'
];

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
            <div className="booking-photo" key={`${photo}-${index}`}>
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
    </main>
  );
}

export default BookingPage;

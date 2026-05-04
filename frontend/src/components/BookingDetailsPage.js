import React, { useContext, useMemo, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { VenueContext } from '../context/VenueContext';
import './BookingDetailsPage.css';

const OWNER_WHATSAPP_NUMBER = '917355657353';

function BookingDetailsPage({ bookingDetails, onBack }) {
  const { addBooking, venues } = useContext(VenueContext);
  const venue = venues.find(item => String(item.id) === String(bookingDetails?.venueId));
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: ''
  });
  const [error, setError] = useState('');

  const total = Number(bookingDetails?.total || 0);
  const duration = Number(bookingDetails?.duration || 1);

  const summary = useMemo(() => {
    if (!venue || !bookingDetails) return null;

    return {
      venueName: venue.name,
      venueLocation: venue.location,
      date: bookingDetails.date,
      dateLabel: bookingDetails.dateLabel,
      time: bookingDetails.time,
      duration,
      amount: total
    };
  }, [bookingDetails, duration, total, venue]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const customerName = formData.customerName.trim();
    const customerPhone = formData.customerPhone.trim();

    if (!customerName || !/^[0-9]{10}$/.test(customerPhone)) {
      setError('Please enter your name and a valid 10-digit phone number.');
      return;
    }

    await addBooking({
      venueId: venue.id,
      venueName: venue.name,
      venueLocation: venue.location,
      date: summary.date,
      dateLabel: summary.dateLabel,
      time: summary.time,
      duration: summary.duration,
      amount: summary.amount,
      customerName,
      customerPhone
    });

    const message = `Hi! I'd like to book a turf at *${venue.name}* - ${venue.location} - Date: ${summary.dateLabel} - Time: ${summary.time} - Amount: ₹${summary.amount} - Name: ${customerName} - Phone: ${customerPhone} Please confirm my booking and share payment details. Thank you!`;
    const whatsappUrl = `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    setError('');
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  if (!venue || !summary) {
    return (
      <main className="details-page">
        <div className="details-topbar">
          <button className="details-back-btn" onClick={onBack} aria-label="Back">
            <FiArrowLeft />
          </button>
          <h1>Your Details</h1>
        </div>
        <div className="details-empty">Booking details not found.</div>
      </main>
    );
  }

  return (
    <main className="details-page">
      <div className="details-topbar">
        <button className="details-back-btn" onClick={onBack} aria-label="Back">
          <FiArrowLeft />
        </button>
        <h1>Your Details</h1>
      </div>

      <section className="details-summary-card">
        <span>{summary.dateLabel}</span>
        <h2>{summary.venueName}</h2>
        <strong>{summary.time} - ₹{summary.amount}</strong>
      </section>

      <form className="customer-details-form" onSubmit={handleSubmit}>
        <h2>Enter Your Details</h2>

        <div className="customer-field">
          <label htmlFor="customer-name">Your Name *</label>
          <input
            id="customer-name"
            name="customerName"
            type="text"
            value={formData.customerName}
            onChange={handleInputChange}
            placeholder="e.g. Akash Singh"
            required
          />
        </div>

        <div className="customer-field">
          <label htmlFor="customer-phone">Phone Number *</label>
          <input
            id="customer-phone"
            name="customerPhone"
            type="tel"
            inputMode="numeric"
            maxLength="10"
            value={formData.customerPhone}
            onChange={handleInputChange}
            placeholder="10-digit mobile number"
            required
          />
        </div>

        {error && <div className="customer-error">{error}</div>}

        <p>Your details help us identify your booking. Tapping the button below will open WhatsApp with a pre-filled message.</p>

        <button className="details-submit" type="submit">
          Open WhatsApp & Book Slot
        </button>
      </form>
    </main>
  );
}

export default BookingDetailsPage;

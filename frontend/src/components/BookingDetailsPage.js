import React, { useContext, useMemo, useState } from 'react';
import { FiArrowLeft, FiUser, FiLogIn } from 'react-icons/fi';
import { VenueContext } from '../context/VenueContext';
import { UserContext } from '../context/UserContext';
import './BookingDetailsPage.css';

const OWNER_WHATSAPP_NUMBER = '917355657353';

function BookingDetailsPage({ bookingDetails, onBack, onSignInClick }) {
  const { addBooking, venues } = useContext(VenueContext);
  const { user, isAuthenticated, loading } = useContext(UserContext);
  const venue = venues.find(item => String(item.id) === String(bookingDetails?.venueId));
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async () => {
    if (!isAuthenticated || !user) return;

    const customerName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    const customerPhone = user.phone?.trim() || '';

    if (!customerName || !/^[0-9]{10}$/.test(customerPhone)) {
      setError('Your profile is missing a valid name or phone number. Please update your profile.');
      return;
    }

    setSubmitting(true);
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
    setSubmitting(false);
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

      {loading ? (
        <div className="details-auth-loading">Checking your session...</div>
      ) : isAuthenticated && user ? (
        /* SIGNED IN: show user info and confirm button */
        <div className="customer-details-form">
          <h2>Booking As</h2>

          <div className="details-user-card">
            <div className="details-user-avatar">
              <FiUser size={22} />
            </div>
            <div className="details-user-info">
              <strong>{`${user.firstName || ''} ${user.lastName || ''}`.trim()}</strong>
              <span>{user.phone}</span>
            </div>
          </div>

          {error && <div className="customer-error">{error}</div>}

          <p>Tapping the button below will open WhatsApp with a pre-filled booking message.</p>

          <button
            className="details-submit"
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Processing...' : 'Open WhatsApp & Book Slot'}
          </button>
        </div>
      ) : (
        /* NOT SIGNED IN: prompt to sign in */
        <div className="customer-details-form">
          <div className="details-auth-prompt">
            <div className="details-auth-icon">
              <FiLogIn size={28} />
            </div>
            <h2>Sign in to continue</h2>
            <p>We'll use your saved name and phone number to confirm the booking — no need to type anything.</p>

            <button
              className="details-submit"
              type="button"
              onClick={() => onSignInClick && onSignInClick('signin')}
            >
              Sign In
            </button>

            <button
              className="details-signup-link"
              type="button"
              onClick={() => onSignInClick && onSignInClick('signup')}
            >
              Don't have an account? Sign Up
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default BookingDetailsPage;
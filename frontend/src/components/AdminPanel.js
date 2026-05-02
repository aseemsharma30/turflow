import React, { useState, useContext } from 'react';
import { FiEdit2, FiImage, FiMessageCircle, FiPlus, FiTrash2, FiUpload, FiX } from 'react-icons/fi';
import { VenueContext } from '../context/VenueContext';
import './AdminPanel.css';

const emptyForm = {
  name: '',
  location: '',
  city: '',
  description: '',
  price: '',
  rating: '',
  sports: [],
  image: '',
  gallery: [],
  badge: '',
  isFeatured: true
};

function AdminPanel() {
  const {
    allVenues: venues,
    bookings,
    addVenue,
    updateVenue,
    deleteVenue,
    updateBookingStatus,
    deleteBooking,
    refreshBookings
  } = useContext(VenueContext);
  const [activeAdminTab, setActiveAdminTab] = useState('venues');
  const [bookingFilter, setBookingFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const sportOptions = ['Cricket', 'Football', 'Pickleball'];
  const bookingStatuses = ['New', 'Confirmed', 'Cancelled'];
  const filteredBookings = bookingFilter === 'All'
    ? bookings
    : bookings.filter(booking => booking.status === bookingFilter);
  const totalRevenue = bookings.reduce((total, booking) => total + Number(booking.amount || 0), 0);
  const totalPendingBookings = bookings.filter(booking => booking.status === 'New').length;

  const handleInputChange = (e) => {
    const { checked, name, type, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleCoverUpload = async (e) => {
    const [file] = e.target.files;
    if (!file) return;

    const image = await readFileAsDataUrl(file);
    setFormData(prev => ({
      ...prev,
      image
    }));
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const images = await Promise.all(files.map(readFileAsDataUrl));
    setFormData(prev => ({
      ...prev,
      gallery: [...prev.gallery, ...images]
    }));
  };

  const removeGalleryImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSportToggle = (sport) => {
    setFormData(prev => ({
      ...prev,
      sports: prev.sports.includes(sport)
        ? prev.sports.filter(s => s !== sport)
        : [...prev.sports, sport]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.location || !formData.price || !formData.rating) {
      showToast('Please fill in all required fields');
      return;
    }

    const venuePayload = {
      ...formData,
      name: formData.name.trim(),
      location: formData.location.trim(),
      city: formData.city.trim(),
      description: formData.description.trim(),
      price: String(formData.price),
      rating: Number(formData.rating),
      badge: formData.badge || ''
    };

    if (editingId) {
      updateVenue(editingId, venuePayload);
      showToast('Venue updated successfully!');
    } else {
      addVenue(venuePayload);
      showToast('Venue added successfully!');
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (venue) => {
    setFormData({
      ...emptyForm,
      ...venue,
      city: venue.city || '',
      rating: String(venue.rating || ''),
      gallery: venue.gallery || []
    });
    setEditingId(venue.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this venue?')) {
      deleteVenue(id);
      showToast('Venue deleted successfully!');
    }
  };

  const handleDeleteBooking = (id) => {
    if (window.confirm('Delete this booking entry?')) {
      deleteBooking(id);
    }
  };

  const getBookingMessage = (booking) => (
    `Hi! I'd like to book a turf at *${booking.venueName}* - ${booking.venueLocation} - Date: ${booking.dateLabel} - Time: ${booking.time} - Amount: ₹${booking.amount} - Name: ${booking.customerName} - Phone: ${booking.customerPhone} Please confirm my booking and share payment details. Thank you!`
  );

  const getBookingWhatsappUrl = (booking) => (
    `https://wa.me/919821357889?text=${encodeURIComponent(getBookingMessage(booking))}`
  );

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div>
          <h1>Admin Panel</h1>
          <p>Manage venues, featured listings and customer booking requests.</p>
        </div>
        {activeAdminTab === 'venues' && (
          <button
            className="add-btn"
            onClick={() => setShowForm(!showForm)}
          >
            <FiPlus /> {showForm ? 'Close' : 'Add New Venue'}
          </button>
        )}
      </div>

      <div className="admin-tabs">
        <button
          className={activeAdminTab === 'venues' ? 'active' : ''}
          onClick={() => setActiveAdminTab('venues')}
        >
          Venues
        </button>
        <button
          className={activeAdminTab === 'bookings' ? 'active' : ''}
          onClick={() => {
            setActiveAdminTab('bookings');
            refreshBookings();
          }}
        >
          Bookings
          <span>{bookings.length}</span>
        </button>
      </div>

      {activeAdminTab === 'venues' && showForm && (
        <div className="form-container">
          <div className="form-content">
            <button className="close-form" onClick={() => setShowForm(false)}>
              <FiX />
            </button>

            <h2>{editingId ? 'Edit Venue' : 'Add New Venue'}</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Venue Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Ball N Goal"
                  required
                />
              </div>

              <div className="form-group">
                <label>Location *</label>
                <textarea
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Full address with sector and city"
                  required
                />
              </div>

              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g. Lucknow, Delhi, Mumbai"
                  required
                />
              </div>

              <div className="form-group">
                <label>Details</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Short notes about pitch size, lighting, parking, amenities"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹/hr) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="1000"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Rating (0-5) *</label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    placeholder="4.8"
                    min="0"
                    max="5"
                    step="0.1"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Sports Available</label>
                <div className="sports-checkbox-group">
                  {sportOptions.map(sport => (
                    <label key={sport} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.sports.includes(sport)}
                        onChange={() => handleSportToggle(sport)}
                      />
                      {sport}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Cover Photo</label>
                <label className="file-upload">
                  <FiUpload />
                  <span>Upload cover photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                  />
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image.startsWith('data:') ? '' : formData.image}
                  onChange={handleInputChange}
                  placeholder="Or paste an image URL"
                />
                {formData.image && (
                  <div className="image-preview">
                    <img src={formData.image} alt="Venue cover preview" />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Gallery Photos</label>
                <label className="file-upload">
                  <FiImage />
                  <span>Add gallery photos</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryUpload}
                  />
                </label>
                {formData.gallery.length > 0 && (
                  <div className="gallery-preview">
                    {formData.gallery.map((photo, index) => (
                      <div className="gallery-preview-item" key={`${photo}-${index}`}>
                        <img src={photo} alt={`Venue gallery ${index + 1}`} />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          aria-label="Remove gallery photo"
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Badge</label>
                <select
                  name="badge"
                  value={formData.badge}
                  onChange={handleInputChange}
                >
                  <option value="">None</option>
                  <option value="NEW">NEW</option>
                  <option value="24hrs">24hrs</option>
                </select>
              </div>

              <label className="feature-toggle">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                />
                <span>Add to featured venue slide</span>
              </label>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  {editingId ? 'Update Venue' : 'Add Venue'}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeAdminTab === 'venues' && (
      <div className="venues-table">
        <h2>All Venues ({venues.length})</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Photo</th>
                <th>Name</th>
                <th>Location</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Sports</th>
                <th>Badge</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {venues.map(venue => (
                <tr key={venue.id}>
                  <td>#{venue.id}</td>
                  <td>
                    <img className="venue-thumb" src={venue.image} alt={venue.name} />
                  </td>
                  <td className="venue-name">{venue.name}</td>
                  <td className="venue-location">{venue.location}</td>
                  <td className="venue-price">₹{venue.price}/hr</td>
                  <td className="venue-rating">★ {venue.rating}</td>
                  <td className="venue-sports">
                    {venue.sports.join(', ')}
                  </td>
                  <td className="venue-badge">
                    {venue.badge ? (
                      <span className="badge-tag">{venue.badge}</span>
                    ) : (
                      <span className="badge-none">-</span>
                    )}
                  </td>
                  <td>
                    {venue.isFeatured ? (
                      <span className="badge-tag">Yes</span>
                    ) : (
                      <span className="badge-none">No</span>
                    )}
                  </td>
                  <td className="actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(venue)}
                      title="Edit"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(venue.id)}
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {venues.length === 0 && (
          <div className="empty-state">
            <p>No venues added yet. Create your first venue!</p>
          </div>
        )}
      </div>
      )}

      {activeAdminTab === 'bookings' && (
        <div className="bookings-admin">
          <div className="booking-stats-grid">
            <div className="booking-stat">
              <span>Total Bookings</span>
              <strong>{bookings.length}</strong>
            </div>
            <div className="booking-stat">
              <span>Total Pending</span>
              <strong>{totalPendingBookings}</strong>
            </div>
            <div className="booking-stat">
              <span>New Requests</span>
              <strong>{bookings.filter(booking => booking.status === 'New').length}</strong>
            </div>
            <div className="booking-stat">
              <span>Total Revenue</span>
              <strong>₹{totalRevenue}</strong>
            </div>
          </div>

          <div className="bookings-toolbar">
            <h2>Booking Requests</h2>
            <select
              value={bookingFilter}
              onChange={(event) => setBookingFilter(event.target.value)}
            >
              <option value="All">All statuses</option>
              {bookingStatuses.map(status => (
                <option value={status} key={status}>{status}</option>
              ))}
            </select>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="empty-state">
              <p>No booking requests yet.</p>
            </div>
          ) : (
            <div className="booking-request-list">
              {filteredBookings.map(booking => (
                <article className="booking-request-card" key={booking.id}>
                  <div className="booking-request-main">
                    <div>
                      <span className="booking-id">#{booking.id}</span>
                      <h3>{booking.venueName}</h3>
                      <p>{booking.venueLocation}</p>
                    </div>
                    <span className={`booking-status ${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="booking-request-grid">
                    <div>
                      <span>Customer</span>
                      <strong>{booking.customerName}</strong>
                    </div>
                    <div>
                      <span>Phone</span>
                      <strong>{booking.customerPhone}</strong>
                    </div>
                    <div>
                      <span>Date & Time</span>
                      <strong>{booking.dateLabel} • {booking.time}</strong>
                    </div>
                    <div>
                      <span>Duration</span>
                      <strong>{booking.duration} hr</strong>
                    </div>
                    <div>
                      <span>Amount</span>
                      <strong>₹{booking.amount}</strong>
                    </div>
                    <div>
                      <span>Received</span>
                      <strong>{new Date(booking.createdAt).toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                  <div className="booking-request-actions">
                    <select
                      value={booking.status}
                      onChange={(event) => updateBookingStatus(booking.id, event.target.value)}
                    >
                      {bookingStatuses.map(status => (
                        <option value={status} key={status}>{status}</option>
                      ))}
                    </select>
                    <a href={getBookingWhatsappUrl(booking)} target="_blank" rel="noreferrer">
                      <FiMessageCircle />
                      WhatsApp
                    </a>
                    <button
                      className="delete-booking-btn"
                      onClick={() => handleDeleteBooking(booking.id)}
                    >
                      <FiTrash2 />
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px',
          background: '#22c55e', color: '#fff',
          padding: '12px 20px', borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          fontSize: '14px', fontWeight: '500', zIndex: 9999,
          animation: 'fadeIn 0.2s ease'
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
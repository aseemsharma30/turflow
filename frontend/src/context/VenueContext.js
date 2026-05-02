import React, { createContext, useCallback, useEffect, useState } from 'react';
import { apiUrl, getAuthHeaders } from '../apiConfig';

export const VenueContext = createContext();

const VENUES_API_URL = apiUrl('/api/venues.php');
const BOOKINGS_API_URL = apiUrl('/api/bookings.php');

const normalizeVenue = (venue) => ({
  ...venue,
  description: venue.description || '',
  price: String(venue.price || ''),
  rating: Number(venue.rating || 0),
  sports: Array.isArray(venue.sports) ? venue.sports : [],
  image: venue.image || '',
  gallery: Array.isArray(venue.gallery) ? venue.gallery : [],
  badge: venue.badge || '',
  isFeatured: venue.isFeatured ?? true
});

export const VenueProvider = ({ children }) => {
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVenues = searchQuery.trim()
    ? venues.filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : venues;

  // ─── Venues ────────────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch(VENUES_API_URL, { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setVenues(data.map(normalizeVenue));
        } else {
          console.error('Failed to fetch venues');
        }
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };
    fetchVenues();
  }, []);

  const addVenue = useCallback(async (venueData) => {
    try {
      const response = await fetch(VENUES_API_URL, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(venueData)
      });
      if (response.ok) {
        const newVenue = await response.json();
        setVenues((prev) => [normalizeVenue(newVenue), ...prev]);
        return newVenue;
      } else {
        const err = await response.json().catch(() => ({}));
        console.error('Failed to add venue:', err);
      }
    } catch (error) {
      console.error('Error adding venue:', error);
    }
  }, []);

  const updateVenue = useCallback(async (id, venueData) => {
    try {
      const response = await fetch(VENUES_API_URL, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ ...venueData, id })
      });
      if (response.ok) {
        const updated = await response.json();
        setVenues((prev) =>
          prev.map((v) => (v.id === id ? normalizeVenue(updated) : v))
        );
        return updated;
      } else {
        const err = await response.json().catch(() => ({}));
        console.error('Failed to update venue:', err);
      }
    } catch (error) {
      console.error('Error updating venue:', error);
    }
  }, []);

  const deleteVenue = useCallback(async (id) => {
    try {
      const response = await fetch(`${VENUES_API_URL}?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        setVenues((prev) => prev.filter((v) => v.id !== id));
      } else {
        console.error('Failed to delete venue');
      }
    } catch (error) {
      console.error('Error deleting venue:', error);
    }
  }, []);

  // ─── Bookings ───────────────────────────────────────────────────────────────

  const refreshBookings = useCallback(async () => {
    try {
      const response = await fetch(BOOKINGS_API_URL, {
        credentials: 'include',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        console.error('Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  }, []);

  const addBooking = useCallback(async (bookingData) => {
    try {
      const response = await fetch(BOOKINGS_API_URL, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      if (response.ok) {
        const newBooking = await response.json();
        return newBooking;
      } else {
        const err = await response.json().catch(() => ({}));
        console.error('Failed to add booking:', err);
      }
    } catch (error) {
      console.error('Error adding booking:', error);
    }
  }, []);

  const updateBookingStatus = useCallback(async (id, status) => {
    try {
      const response = await fetch(BOOKINGS_API_URL, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ id, status })
      });
      if (response.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status } : b))
        );
      } else {
        console.error('Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  }, []);

  const deleteBooking = useCallback(async (id) => {
    try {
      const response = await fetch(`${BOOKINGS_API_URL}?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
      } else {
        console.error('Failed to delete booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  }, []);

  const value = {
    // Venues
    venues: filteredVenues,
    allVenues: venues,
    setVenues,
    setSearchQuery,
    addVenue,
    updateVenue,
    deleteVenue,
    // Bookings
    bookings,
    addBooking,
    refreshBookings,
    updateBookingStatus,
    deleteBooking
  };

  return (
    <VenueContext.Provider value={value}>
      {children}
    </VenueContext.Provider>
  );
};
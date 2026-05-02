import React, { createContext, useEffect, useState } from 'react';
import { apiUrl, getAuthHeaders } from '../apiConfig';

export const VenueContext = createContext();

const STORAGE_KEY = 'turflow_venues';
const BOOKINGS_STORAGE_KEY = 'turflow_bookings';
const VENUES_API_URL = apiUrl('/api/venues.php');
const BOOKINGS_API_URL = apiUrl('/api/bookings.php');
const DEFAULT_IMAGE = 'https://via.placeholder.com/800x500?text=TurFlow+Venue';

const starterVenues = [
  {
    id: 1,
    name: 'Ball N Goal',
    location: 'Gate No. 1, MI Rustle Court, Sector 6, Gomti Nagar, Lucknow',
    description: 'Multi-sport turf with cricket, football and pickleball slots.',
    price: '1100',
    rating: 4.8,
    sports: ['Cricket', 'Football', 'Pickleball'],
    image: 'https://images.unsplash.com/photo-1550881111-7cfde14b8073?auto=format&fit=crop&w=900&q=80',
    gallery: [],
    badge: 'NEW',
    isFeatured: true
  },
  {
    id: 2,
    name: 'Elite Sports Arena',
    location: 'A-1/26, Viram Khand 1, Gomti Nagar, Lucknow',
    description: 'Floodlit turf for evening football and box cricket bookings.',
    price: '1100',
    rating: 4.8,
    sports: ['Cricket', 'Football'],
    image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=900&q=80',
    gallery: [],
    badge: '',
    isFeatured: true
  },
  {
    id: 3,
    name: 'Players Town',
    location: 'S-524 Vishal Khand, Gomti Nagar, Lucknow',
    description: 'Compact neighborhood venue with fast booking availability.',
    price: '1100',
    rating: 4.7,
    sports: ['Cricket', 'Football'],
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=900&q=80',
    gallery: [],
    badge: 'NEW',
    isFeatured: true
  }
];

const normalizeVenue = (venue) => ({
  ...venue,
  description: venue.description || '',
  price: String(venue.price || ''),
  rating: Number(venue.rating || 0),
  sports: Array.isArray(venue.sports) ? venue.sports : [],
  image: venue.image || DEFAULT_IMAGE,
  gallery: Array.isArray(venue.gallery) ? venue.gallery : [],
  badge: venue.badge || '',
  isFeatured: venue.isFeatured ?? true
});

const loadVenues = () => {
  try {
    const savedVenues = localStorage.getItem(STORAGE_KEY);
    if (savedVenues) {
      return JSON.parse(savedVenues).map(normalizeVenue);
    }
  } catch (error) {
    console.warn('Unable to load saved venues', error);
  }

  return starterVenues.map(normalizeVenue);
};

const normalizeBooking = (booking) => ({
  ...booking,
  id: booking.id || Date.now(),
  status: booking.status || 'New',
  createdAt: booking.createdAt || new Date().toISOString()
});

const loadBookings = () => {
  try {
    const savedBookings = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (savedBookings) {
      return JSON.parse(savedBookings).map(normalizeBooking);
    }
  } catch (error) {
    console.warn('Unable to load saved bookings', error);
  }

  return [];
};

export const VenueProvider = ({ children }) => {
  const [venues, setVenues] = useState(loadVenues);
  const [bookings, setBookings] = useState(loadBookings);

  useEffect(() => {
    let isMounted = true;

const loadServerVenues = async () => {
       try {
         const response = await fetch(VENUES_API_URL, {
           credentials: 'include'
         });
         const contentType = response.headers.get('content-type') || '';
         if (!response.ok || !contentType.includes('application/json')) return;

         const serverVenues = await response.json();
         if (isMounted && Array.isArray(serverVenues) && serverVenues.length > 0) {
           setVenues(serverVenues.map(normalizeVenue));
        }
       } catch (error) {
         console.warn('Using local venue storage fallback', error);
       }
     };

    loadServerVenues();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadServerBookings = async () => {
      try {
        const response = await fetch(BOOKINGS_API_URL, {
          credentials: 'include',
          headers: getAuthHeaders()
        });
        const contentType = response.headers.get('content-type') || '';
        if (!response.ok || !contentType.includes('application/json')) return;

        const serverBookings = await response.json();
        if (isMounted && Array.isArray(serverBookings)) {
          setBookings(serverBookings.map(normalizeBooking));
        }
      } catch (error) {
        console.warn('Using local booking storage fallback', error);
      }
    };

    loadServerBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(venues));
  }, [venues]);

  useEffect(() => {
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings]);

   const refreshVenues = async () => {
     try {
       const response = await fetch(VENUES_API_URL, {
         credentials: 'include'
       });
       const contentType = response.headers.get('content-type') || '';
       if (!response.ok || !contentType.includes('application/json')) return;

       const serverVenues = await response.json();
       if (Array.isArray(serverVenues) && serverVenues.length > 0) {
         setVenues(serverVenues.map(normalizeVenue));
       }
     } catch (error) {
       console.warn('Unable to refresh server venues', error);
     }
   };

   const refreshBookings = async () => {
     try {
       const response = await fetch(BOOKINGS_API_URL, {
         credentials: 'include',
         headers: getAuthHeaders()
       });
       const contentType = response.headers.get('content-type') || '';
       if (!response.ok || !contentType.includes('application/json')) return;

       const serverBookings = await response.json();
       if (Array.isArray(serverBookings)) {
         setBookings(serverBookings.map(normalizeBooking));
       }
     } catch (error) {
       console.warn('Unable to refresh server bookings', error);
     }
   };

  const addVenue = async (venue) => {
    const newVenue = normalizeVenue({
      ...venue,
      id: Math.max(...venues.map(v => v.id), 0) + 1
    });
    setVenues(prevVenues => [...prevVenues, newVenue]);

    try {
      const response = await fetch(VENUES_API_URL, {
        method: 'POST',
        credentials: 'include',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newVenue)
      });
      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const savedVenue = normalizeVenue(await response.json());
        setVenues(prevVenues => prevVenues.map(item =>
          item.id === newVenue.id ? savedVenue : item
        ));
        return savedVenue;
      }
    } catch (error) {
      console.warn('Venue saved locally only', error);
    }

    return newVenue;
  };

  const updateVenue = async (id, updatedVenue) => {
    setVenues(prevVenues => prevVenues.map(venue =>
      venue.id === id ? normalizeVenue({ ...venue, ...updatedVenue }) : venue
    ));

    try {
      const response = await fetch(VENUES_API_URL, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...updatedVenue, id })
      });
      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const savedVenue = normalizeVenue(await response.json());
        setVenues(prevVenues => prevVenues.map(venue =>
          venue.id === id ? savedVenue : venue
        ));
      }
    } catch (error) {
      console.warn('Venue updated locally only', error);
    }
  };

  const deleteVenue = async (id) => {
    setVenues(prevVenues => prevVenues.filter(venue => venue.id !== id));

    try {
      await fetch(`${VENUES_API_URL}?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.warn('Venue deleted locally only', error);
    }
  };

  const addBooking = async (booking) => {
    const newBooking = normalizeBooking({
      ...booking,
      id: Date.now()
    });
    setBookings(prevBookings => [newBooking, ...prevBookings]);

    try {
      const response = await fetch(BOOKINGS_API_URL, {
        method: 'POST',
        credentials: 'include',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newBooking)
      });
      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const savedBooking = normalizeBooking(await response.json());
        setBookings(prevBookings => prevBookings.map(item =>
          item.id === newBooking.id ? savedBooking : item
        ));
        return savedBooking;
      }
    } catch (error) {
      console.warn('Booking saved locally only', error);
    }

    return newBooking;
  };

  const updateBookingStatus = async (id, status) => {
    setBookings(prevBookings => prevBookings.map(booking =>
      booking.id === id ? { ...booking, status } : booking
    ));

    try {
      await fetch(BOOKINGS_API_URL, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, status })
      });
    } catch (error) {
      console.warn('Booking status updated locally only', error);
    }
  };

  const deleteBooking = async (id) => {
    setBookings(prevBookings => prevBookings.filter(booking => booking.id !== id));

    try {
      await fetch(`${BOOKINGS_API_URL}?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.warn('Booking deleted locally only', error);
    }
  };

   const value = {
     venues,
     bookings,
     addVenue,
     updateVenue,
     deleteVenue,
     addBooking,
     updateBookingStatus,
     deleteBooking,
     refreshVenues,
     refreshBookings
   };

  return (
    <VenueContext.Provider value={value}>
      {children}
    </VenueContext.Provider>
  );
};

import React, { useEffect, useState } from 'react';
import './App.css';
import { VenueProvider } from './context/VenueContext';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import OfferBanner from './components/OfferBanner';
import SportsSelector from './components/SportsSelector';
import FeaturedVenues from './components/FeaturedVenues';
import VenuesList from './components/VenuesList';
import BottomNavigation from './components/BottomNavigation';
import AdminPanel from './components/AdminPanel';
import AdminLogin, { clearAdminSession, isAdminAuthenticated } from './components/AdminLogin';
import BookingPage from './components/BookingPage';
import BookingDetailsPage from './components/BookingDetailsPage';
import { apiUrl, getAuthHeaders } from './apiConfig';

function App() {
  const [selectedSport, setSelectedSport] = useState('cricket');
  const [selectedLocation, setSelectedLocation] = useState('Lucknow');
  const [path, setPath] = useState(window.location.pathname);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(isAdminAuthenticated);

  useEffect(() => {
    const handleRouteChange = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const goHome = () => {
    window.history.pushState({}, '', '/');
    setPath('/');
  };

  const openBookingPage = (venueId) => {
    window.history.pushState({}, '', `/book/${venueId}`);
    setPath(`/book/${venueId}`);
  };

  const openBookingDetailsPage = (details) => {
    const params = new URLSearchParams({
      date: details.date,
      dateLabel: details.dateLabel,
      time: details.time,
      duration: String(details.duration),
      total: String(details.total)
    });
    window.history.pushState({}, '', `/book/${details.venueId}/details?${params.toString()}`);
    setPath(window.location.pathname);
  };

  const goBackToBooking = (venueId) => {
    window.history.pushState({}, '', `/book/${venueId}`);
    setPath(`/book/${venueId}`);
  };

  const handleAdminLogout = () => {
    fetch(apiUrl('/api/admin-logout.php'), {
      method: 'POST',
      credentials: 'include',
      headers: getAuthHeaders()
    }).catch(() => {});
    clearAdminSession();
    setIsAdminLoggedIn(false);
  };

  const isAdminRoute = path === '/admin';
  const isBookingDetailsRoute = path.startsWith('/book/') && path.endsWith('/details');
  const isBookingRoute = path.startsWith('/book/') && !isBookingDetailsRoute;
  const bookingVenueId = path.startsWith('/book/') ? path.split('/')[2] : null;
  const bookingParams = new URLSearchParams(window.location.search);
  const bookingDetails = isBookingDetailsRoute ? {
    venueId: bookingVenueId,
    date: bookingParams.get('date'),
    dateLabel: bookingParams.get('dateLabel'),
    time: bookingParams.get('time'),
    duration: Number(bookingParams.get('duration') || 1),
    total: Number(bookingParams.get('total') || 0)
  } : null;

  return (
    <VenueProvider>
      <div className={`app ${isAdminRoute || isBookingRoute || isBookingDetailsRoute ? 'admin-app' : ''}`}>
        {isAdminRoute ? (
          isAdminLoggedIn ? (
            <>
              <div className="admin-header-bar">
                <div className="admin-header-content">
                  <span style={{fontFamily:'"Arial Black",Impact,sans-serif',fontStyle:'italic',fontWeight:900,fontSize:'28px',letterSpacing:'-0.5px',lineHeight:1,userSelect:'none'}}>
                    <span style={{color:'#fff'}}>Tur</span><span style={{color:'#20c05c'}}>Flow</span>
                  </span>
                  <div className="admin-header-actions">
                    <button
                      className="back-to-home-btn"
                      onClick={goHome}
                    >
                      Back to Home
                    </button>
                    <button
                      className="logout-btn"
                      onClick={handleAdminLogout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
              <AdminPanel />
            </>
          ) : (
            <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />
          )
        ) : isBookingDetailsRoute ? (
          <BookingDetailsPage
            bookingDetails={bookingDetails}
            onBack={() => goBackToBooking(bookingVenueId)}
          />
        ) : isBookingRoute ? (
          <BookingPage
            venueId={bookingVenueId}
            onBack={goHome}
            onContinue={openBookingDetailsPage}
          />
        ) : (
          <>
            <Header location={selectedLocation} setLocation={setSelectedLocation} />
            <SearchBar />
            <OfferBanner />
            <SportsSelector selectedSport={selectedSport} setSelectedSport={setSelectedSport} />
            <FeaturedVenues onBookVenue={openBookingPage} />
            <VenuesList onBookVenue={openBookingPage} />
            <BottomNavigation />
          </>
        )}
      </div>
    </VenueProvider>
  );
}

export default App;
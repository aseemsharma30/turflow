# TurFlow Frontend - Quick Start Guide

## 🚀 Quick Commands

### Start Development Server
```bash
cd src/frontend
npm start
```
Opens automatically at http://localhost:3000

### Build for Production
```bash
npm run build
```

### Using Docker
```bash
docker-compose up --build
```

## 📱 Features Implemented

### ✅ Header Section
- [x] TurFlow Logo (with green accent)
- [x] Location Selector (with dropdown)
- [x] Notification Icon
- [x] Sticky positioning

### ✅ Search Section
- [x] Search bar with icon
- [x] Placeholder text
- [x] Focus effects

### ✅ Offer Banner
- [x] 25% OFF promotion
- [x] "New User Offer!" text
- [x] Close button
- [x] Green gradient background

### ✅ Sports Selector
- [x] Cricket, Football, Pickleball options
- [x] Icons for each sport
- [x] Active state highlighting
- [x] Click to select

### ✅ Featured Venues Carousel
- [x] Image carousel with navigation
- [x] Venue card with details
- [x] Rating display (★ 4.8)
- [x] Price per hour
- [x] Sports tags
- [x] "Book Now" button (green)
- [x] "Gallery" button
- [x] Like/Heart button
- [x] Dot navigation
- [x] Badge (NEW, 24hrs)

### ✅ Venues List Section
- [x] Grid of venue cards
- [x] Venue image thumbnail
- [x] Venue name, location
- [x] Rating and price
- [x] Sports tags
- [x] Book button for each venue
- [x] Hover effects

### ✅ Bottom Navigation
- [x] Fixed bottom bar
- [x] Home, Bookings, Profile tabs
- [x] Icons for each section
- [x] Active state styling
- [x] Click handlers

### ✅ Theme & Styling
- [x] Dark background (#0a1a0f)
- [x] Green accents (#22c55e)
- [x] Dark card background (#1a2e1f)
- [x] Smooth animations and transitions
- [x] Hover effects on interactive elements
- [x] Responsive design

## 🎨 Design System

### Colors
```css
--primary-green: #22c55e
--dark-bg: #0a1a0f
--card-bg: #1a2e1f
--border-color: #2a4a2f
--text-primary: #ffffff
--text-secondary: #a0a0a0
```

### Components & Their Purpose

| Component | Purpose |
|-----------|---------|
| Header | Navigation and user info |
| SearchBar | Find venues by name |
| OfferBanner | Promotional offers |
| SportsSelector | Filter by sport type |
| FeaturedVenues | Showcase top venues |
| VenuesList | Browse all venues |
| BottomNavigation | Main app navigation |

## 📦 Dependencies

- **React 18.2.0** - UI Framework
- **react-icons 4.11.0** - Icon Library (Feather, Font Awesome, etc.)
- **react-scripts 5.0.1** - Build tools

## 🔧 Development Notes

### File Organization
- Each component has its own `.js` and `.css` file
- CSS is component-scoped for easy maintenance
- Main App.js coordinates all components
- Global styles in App.css and index.css

### State Management
- Currently uses React hooks (useState)
- Ready to integrate Redux or Context API
- Component states are independent and modular

### Data Flow
- Props passed from App.js to components
- Each section is self-contained
- Easy to connect to backend APIs

## 🔄 Next Steps for Backend Integration

1. **Replace mock data** with API calls in:
   - FeaturedVenues.js
   - VenuesList.js

2. **Connect search** to backend search API

3. **Implement authentication** for:
   - Profile tab
   - Booking history

4. **Add booking flow** with:
   - Date/time selection
   - Payment integration

5. **Real-time updates** with:
   - WebSockets or polling
   - Notification system

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Clear cache and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

### Build errors
```bash
npm run build
# Check the console output for specific errors
```

## 📸 Component Screenshots Ready

All components are ready to be connected with:
- Real venue images from backend
- Live data from database
- User authentication state
- Booking management system

---

**Status**: ✅ Frontend Complete and Ready for Backend Integration  
**Last Updated**: May 2, 2026  
**Next Review**: After backend integration


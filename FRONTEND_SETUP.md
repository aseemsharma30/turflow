# TurFlow Frontend Setup Guide

## Project Overview

The TurFlow homepage has been successfully created using React.js with the exact design specifications from the provided mockups. The frontend features a dark theme with green accents and includes all the requested components.

## What's Included

### Components Created

1. **Header** (`Header.js`)
   - Logo on the left
   - Location selector dropdown (Lucknow, Delhi, Mumbai, Bangalore, Hyderabad)
   - Notification bell icon on the right

2. **Search Bar** (`SearchBar.js`)
   - Search input with icon
   - Placeholder: "Search turf name..."

3. **Offer Banner** (`OfferBanner.js`)
   - 25% OFF promotional banner
   - "New User Offer!" with description
   - Closable banner

4. **Sports Selector** (`SportsSelector.js`)
   - Cricket, Football, and Pickleball buttons
   - Active state for selected sport
   - Icon support for each sport

5. **Featured Venues Carousel** (`FeaturedVenues.js`)
   - Image carousel with navigation buttons
   - Venue details (name, location, price, rating)
   - Sports tags
   - Book Now button
   - Gallery button
   - Like/Heart button
   - Dot navigation indicators

6. **Venues List** (`VenuesList.js`)
   - Comprehensive list of all venues
   - Card layout with images, ratings, prices
   - Sports tags for each venue
   - Book button for each venue
   - Badges for special venues (NEW, 24hrs)

7. **Bottom Navigation** (`BottomNavigation.js`)
   - Fixed bottom navigation bar
   - Home, Bookings, and Profile tabs
   - Active state styling

### Styling

- **Dark Theme**: Primary background color #0a1a0f
- **Accent Color**: Green #22c55e
- **Card Background**: Dark green #1a2e1f
- **Border Color**: #2a4a2f
- **All CSS**: Custom CSS without external UI frameworks

## Installation & Running

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Step 1: Install Dependencies
```bash
cd src/frontend
npm install
```

### Step 2: Run Development Server
```bash
npm start
```
The app will automatically open in your browser at `http://localhost:3000`

### Step 3: Build for Production
```bash
npm run build
```

## Docker Support

You can also run the frontend using Docker. The updated `docker-compose.yml` includes the frontend service:

```bash
cd /Users/aseemsharma/IdeaProjects/turflow
docker-compose up --build
```

This will start:
- Frontend on http://localhost:3000
- Backend on http://localhost:8000
- Database on localhost:5432

## Project Structure

```
src/frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js & Header.css
│   │   ├── SearchBar.js & SearchBar.css
│   │   ├── OfferBanner.js & OfferBanner.css
│   │   ├── SportsSelector.js & SportsSelector.css
│   │   ├── FeaturedVenues.js & FeaturedVenues.css
│   │   ├── VenuesList.js & VenuesList.css
│   │   └── BottomNavigation.js & BottomNavigation.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
├── Dockerfile
└── README.md
```

## Design Features

✅ **Exact Theme Matching**: Matches the provided mockups with dark background and green accents  
✅ **Responsive Design**: Works on mobile, tablet, and desktop  
✅ **Interactive Components**: All buttons and controls are fully functional  
✅ **Smooth Animations**: Hover effects and transitions  
✅ **Modern UI**: Clean, professional dark theme  
✅ **Fixed Bottom Navigation**: Always accessible navigation bar  
✅ **Image Placeholders**: Ready to connect with real backend data  

## Key Features to Integrate

When connecting to the backend, update these components:

1. **Header**: Connect location selector to backend
2. **Search Bar**: Connect to venue search API
3. **Featured Venues**: Fetch featured venues from backend
4. **Venues List**: Fetch all venues from backend with pagination
5. **Navigation**: Wire up navigation to different pages/sections

## Technologies Used

- **React 18.2.0**: UI framework
- **react-icons**: Icon library (Feather Icons, Font Awesome, etc.)
- **CSS3**: Styling with modern features

## Notes

- All placeholder images use `https://via.placeholder.com`
- Replace with real images from your backend
- The app is fully responsive and mobile-friendly
- Theme colors can be easily customized via CSS variables in App.css
- State management is handled with React hooks (useState)

## Next Steps

1. Connect search functionality to backend API
2. Fetch real venue data from database
3. Implement user authentication
4. Add booking functionality
5. Integrate payment system
6. Connect to email notifications
7. Add user profiles and booking history

---

For questions or issues, refer to the individual component files for detailed comments and structure.


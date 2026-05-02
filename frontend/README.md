# TurFlow Frontend

A beautiful React.js homepage for TurFlow - a sports venue booking platform.

## Features

- **Header**: Logo, location selector, and notification icon
- **Search Bar**: Search for turf names
- **Offer Banner**: Promotional offers
- **Sports Selector**: Choose between Cricket, Football, and Pickleball
- **Featured Venues Carousel**: Browse featured venues with booking options
- **Venues List**: View all available venues with details
- **Bottom Navigation**: Home, Bookings, and Profile tabs
- **Dark Theme**: Professional dark theme with green accents

## Installation

1. Navigate to the frontend directory:
```bash
cd src/frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the App

Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Building

Create a production build:
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Header.js
│   ├── SearchBar.js
│   ├── OfferBanner.js
│   ├── SportsSelector.js
│   ├── FeaturedVenues.js
│   ├── VenuesList.js
│   └── BottomNavigation.js
├── App.js
├── App.css
├── index.js
└── index.css
public/
└── index.html
```

## Styling

The app uses a custom dark theme with:
- Primary Color: Green (#22c55e)
- Background: Dark (#0a1a0f)
- Cards: Dark Green (#1a2e1f)

All styling is done with CSS and no external UI frameworks are used.

## Dependencies

- React 18.2.0
- react-icons (for all icons)


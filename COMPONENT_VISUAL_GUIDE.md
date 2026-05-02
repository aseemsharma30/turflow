# 🎨 TurFlow - Visual Component Guide

## Component Layout & Hierarchy

```
┌─────────────────────────────────────────────────────┐
│                       HEADER                         │
│  Logo        Location (v)      🔔 Notification     │
│  TurFlow     Lucknow           [Bell Icon]         │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                    SEARCH BAR                        │
│  🔍 Search turf name...                            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                 OFFER BANNER (Green)                │
│  25% │ New User Offer!                      ✕     │
│  OFF │ Get 25% off on your second booking!        │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                  SPORTS SELECTOR                     │
│  [🏏 Cricket] [⚽ Football] [🏓 Pickleball]       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│              FEATURED VENUES CAROUSEL                │
│                                                     │
│  < ┌─────────────────────────────┐ >              │
│    │                             │                 │
│    │  [Image - NEW Badge]        │                 │
│    │                             │                 │
│    │  Ball N Goal          ❤️    │                 │
│    │  Gate No. 1, MI Rustle...   │                 │
│    │  ⭐ 4.8      ₹1100/hr      │                 │
│    │  [Cricket] [Football] [Pkl]│                 │
│    │  [Book Now →] [🖼 Gallery] │                 │
│    └─────────────────────────────┘                 │
│     • ● • • •  (dots)                              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                   VENUES LIST                        │
│                                                     │
│  [Img] Players Town          ⭐ 4.7  ₹1100/hr     │
│        S-524 Vishal Khand    [Cricket][Football]   │
│        📍 Location...                 [Book]       │
│                                                     │
│  [Img] Elite Sports Arena    ⭐ 4.8  ₹1100/hr     │
│        A-1/26, Viram Khand   [Cricket][Football]   │
│        📍 Location...                 [Book]       │
│                                                     │
│  [Img] PrimePlay             ⭐ 4.7  ₹1000/hr     │
│        4/337, Sector 4       [Cricket][Football]   │
│        📍 Location...               [24hrs][Book]  │
│                                                     │
│  ... (more venues) ...                              │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│           BOTTOM NAVIGATION (Fixed)                 │
│  🏠          📅        👤                           │
│  Home      Bookings    Profile                      │
└─────────────────────────────────────────────────────┘
```

---

## 🎨 Color Palette Display

```
┌─────────────────────────┐
│ Primary Green           │
│ #22c55e                 │
│ ✓ Buttons              │
│ ✓ Highlights           │
│ ✓ Active states        │
└─────────────────────────┘

┌─────────────────────────┐
│ Dark Background         │
│ #0a1a0f                 │
│ ✓ Main background      │
│ ✓ Page color           │
└─────────────────────────┘

┌─────────────────────────┐
│ Card Background         │
│ #1a2e1f                 │
│ ✓ Component bg         │
│ ✓ Card backgrounds     │
└─────────────────────────┘

┌─────────────────────────┐
│ Border Color            │
│ #2a4a2f                 │
│ ✓ Component borders    │
│ ✓ Dividers             │
└─────────────────────────┘

┌─────────────────────────┐
│ Text Primary            │
│ #ffffff (White)         │
│ ✓ Main text            │
└─────────────────────────┘

┌─────────────────────────┐
│ Text Secondary          │
│ #a0a0a0                 │
│ ✓ Muted text           │
│ ✓ Placeholder          │
└─────────────────────────┘
```

---

## 📐 Component Dimensions

### Header
- Height: Auto (sticky)
- Padding: 16px 24px
- Contains: Logo, Location Selector, Notification

### Search Bar
- Padding: 16px 24px
- Input Height: 44px
- Border Radius: 12px

### Offer Banner
- Padding: 16px 24px
- Margin: 16px 24px
- Height: Auto
- Border Radius: 12px

### Sports Selector
- Padding: 24px
- Grid Gap: 16px
- Button Min-width: 100px
- Button Padding: 16px 20px

### Featured Venues
- Padding: 24px
- Card Height: Auto
- Image Height: 300px
- Border Radius: 16px

### Venues List
- Padding: 24px
- Card Padding: 16px
- Image Size: 100x100px
- Gap: 16px

### Bottom Navigation
- Position: Fixed bottom
- Height: 80px
- Z-Index: 1000
- Gap: Auto (space-around)

---

## 🖱️ Interactive Elements

### Buttons
```
┌──────────┐          ┌──────────┐
│ Book Now │          │ Default  │
│ (Enabled)│  Hover→  │ Button   │  (Darker Green)
└──────────┘          └──────────┘

┌──────────┐          ┌──────────┐
│ Gallery  │          │ Gallery  │  (Border Color)
│          │  Hover→  │          │
└──────────┘          └──────────┘
```

### Interactive States
- **Hover**: Border color changes to green, background opacity increases
- **Active**: Full green background color
- **Focus**: Border color green with box shadow

### Cards
- **Hover**: Border becomes green, slight box shadow appears
- **Like Button**: Changes color to green when clicked, stays green
- **Carousel Dots**: Active dot becomes longer and green

---

## 📱 Responsive Breakpoints

### Mobile (< 640px)
- Full width components
- Adjusted padding (16px instead of 24px)
- Single column layouts
- Stacked navigation

### Tablet (640px - 1024px)
- Flexible width
- Standard padding
- Mixed layouts

### Desktop (> 1024px)
- Max-width maintained
- Full features enabled
- Optimal spacing

---

## 🔄 State Changes

### Location Selector
```
Default     Dropdown Open    Selected
  ↓              ↓               ↓
|v Lucknow|  |v Lucknow|    |v Mumbai|
             / Delhi  \
            | Mumbai  |
            | Bangalore|
             \ Hydrabad/
```

### Sports Selector
```
Cricket (Active)  Football (Inactive)  Pickleball (Inactive)
┌──────────────┐  ┌──────────────┐     ┌──────────────┐
│ 🏏 Cricket   │  │ ⚽ Football  │     │ 🏓 Pickleball│
│ (Green BG)   │  │ (Border only)│     │ (Border only)│
└──────────────┘  └──────────────┘     └──────────────┘
```

### Carousel Navigation
```
Slide 1 (Current)   Slide 2         Slide 3
  [Image1]↓         [Image2]        [Image3]
  •●···             ·•···           ··•··
```

### Heart/Like Button
```
Unlike (Hollow)    Like (Filled)
    ♡                  ♥
  (White)           (Green)
```

---

## 🎯 Typography Scale

```
Logo Title:       24px | Bold | White
Section Heading:  20px | Bold | White
Card Heading:     18px | Bold | White
Subheading:       16px | Bold | White
Body Text:        14px | Regular | White
Small Text:       13px | Regular | Secondary
Button Text:      14px | Bold | White/Green
Badge Text:       12px | Bold | White
Hint/Helper:      11px | Regular | Secondary
```

---

## 🎬 Animation Timings

- **Standard Transition**: 0.3s ease
- **Hover Effects**: Instant to 0.3s
- **Carousel Slide**: 0.5s smooth
- **Banner Close**: 0.3s fade out

---

## 📊 Component Tree

```
App
├── Header
│   ├── Logo
│   ├── LocationSelector
│   │   ├── LocationBtn
│   │   └── LocationDropdown (conditional)
│   └── NotificationBtn
├── SearchBar
│   └── SearchInput
├── OfferBanner (conditional)
│   └── CloseBtn
├── SportsSelector
│   └── SportsGrid
│       ├── SportBtn (Cricket)
│       ├── SportBtn (Football)
│       └── SportBtn (Pickleball)
├── FeaturedVenues
│   ├── Carousel
│   │   ├── VenueCard
│   │   │   ├── Badge (conditional)
│   │   │   ├── VenueImage
│   │   │   ├── VenueDetails
│   │   │   └── VenueActions
│   │   └── CarouselControls
│   │       ├── PrevBtn
│   │       ├── Dots
│   │       └── NextBtn
├── VenuesList
│   └── VenueItem[] (repeating)
│       ├── VenueImage
│       ├── VenueInfo
│       └── BookBtn
└── BottomNavigation
    ├── NavItem (Home)
    ├── NavItem (Bookings)
    └── NavItem (Profile)
```

---

## ✨ Visual Enhancements

### Shadows & Depth
- Cards: `box-shadow: 0 0 20px rgba(34, 197, 94, 0.1)` on hover
- Buttons: Default flat, elevated on hover

### Focus States
- All inputs: Green border on focus
- All buttons: Green highlight on focus
- Full keyboard accessibility

### Loading States
- Placeholder colors for images
- Skeleton screens ready
- Progressive loading support

---

## 🎯 User Experience Features

### Feedback
- Hover effects on all interactive elements
- Color changes for active states
- Border highlights for focus
- Smooth transitions between states

### Affordances
- Green color signals actionable elements
- Buttons clearly distinguishable
- Icons provide visual hints
- Spacing creates clear sections

### Accessibility
- High contrast white on dark
- Clear focus indicators
- Semantic HTML structure
- Keyboard navigation ready

---

## 🚀 Future Enhancements

- [ ] Animations on scroll
- [ ] Image lazy loading
- [ ] Skeleton loading states
- [ ] Dark/Light mode toggle
- [ ] Custom carousel animation
- [ ] Infinite scroll for venues list
- [ ] Wishlist heart animation
- [ ] Toast notifications

---

*This visual guide provides a complete reference for the TurFlow frontend design system.*


# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kaiten Share Calculator is a web-based conveyor belt sushi/mala restaurant bill calculator that helps groups split bills based on individual plate consumption. The app is designed to be a pure frontend application with no backend dependencies.

**Current Status: Production-Ready**
- Configuration files and documentation are complete
- Main application files (HTML, JS, CSS) are fully implemented
- Supports multiple restaurant types: sushi (Sushiro, Katsu Midori) and mala hot pot (Yijia Suki Mala)
- Deployed at https://kaiten-share-calculator.vercel.app/

## Technology Stack

- **HTML5**: Structure and markup
- **CSS3 + TailwindCSS**: Styling and responsive design (via CDN)
- **JavaScript (ES6)**: Application logic and interactivity
- **JSON Configuration**: Restaurant data management
- **No Backend**: Pure frontend application (no localStorage used)
- **Vercel**: Deployment platform

## Architecture Overview

### Configuration-Driven Design
The app uses JSON configuration files to manage restaurant data:
- `config/sushiro.json`: Sushiro restaurant configuration
- `config/katsu_midori.json`: Katsu Midori restaurant configuration  
- `config/yijia_suki_mala.json`: Yijia Suki Mala hot pot restaurant configuration

Each config contains:
- Restaurant metadata (name, logo, description)
- Currency formatting rules
- Service charge and VAT settings
- Plate definitions (colors/types, prices, images, multilingual labels)

### Key Application Flow
1. **Restaurant Selection**: User chooses from configured restaurants
2. **Participant Management**: Add/edit participant names with visual participant cards
3. **Plate Tracking**: Real-time plate counting per participant with visual feedback
4. **Bill Calculation**: Automatic calculation with service charges and VAT
5. **Bill Summary**: Detailed breakdown showing individual consumption and total amounts
6. **Bill Splitting**: Individual totals based on consumption + proportional fees

### Data Structure Patterns
- Multilingual support (Thai/English labels)
- Flexible currency formatting
- Configurable tax and service charge rates
- Image-based plate identification

## File Structure

```
/
├── README.MD                    # Project documentation
├── index.html                   # Main HTML file with complete UI
├── app.js                       # Main JavaScript application logic
├── config/                      # Restaurant configurations
│   ├── katsu_midori.json       # Katsu Midori restaurant data
│   ├── sushiro.json            # Sushiro restaurant data
│   └── yijia_suki_mala.json    # Yijia Suki Mala hot pot restaurant data
├── images/                     # Static assets
│   ├── logo_restaurants/       # Restaurant logos
│   │   ├── katsu_midori.png
│   │   ├── sushiro.png
│   │   └── yijia_suki_mala.png
│   └── plates/                 # Plate images by restaurant
│       ├── katsu_midori/       # Colored plates for sushi
│       ├── sushiro/            # Colored plates for sushi
│       └── yijia_suki_mala/    # Various dishes/items for hot pot
├── favicon.ico                 # Favicon files
├── favicon.svg
├── apple-touch-icon.png
└── logo.png                    # App logo
```

## Configuration Schema

Restaurant JSON files follow this structure:
- `restaurantName`, `restaurantId`, `restaurantLogo`
- `currency*` fields for formatting
- `serviceCharge`, `vat`, `*Included` flags
- `plates` object with color-coded entries containing:
  - `label_th`, `label_en`: Multilingual labels
  - `image`: Path to plate image
  - `price`: Plate price in THB

## Development Commands

**Note**: This project uses a simple setup with no build system:

- Use a simple HTTP server for development (e.g., `python -m http.server` or `npx serve`)
- TailwindCSS is loaded via CDN - no build process needed
- No testing framework currently configured
- Direct file serving works for development and production

## Implementation Guidelines

### Adding New Restaurants
1. Create new JSON config in `config/[restaurant_id].json`
2. Add restaurant logo to `images/logo_restaurants/`
3. Create plate images in `images/plates/[restaurant_id]/`
4. Add the new config filename to the `restaurantFiles` array in `app.js:30`

### Plate Configuration
- Use consistent naming for plate colors/types across restaurants
- Include both Thai and English labels
- Maintain image aspect ratios and file sizes
- Price should be in THB (Thai Baht)
- Support different plate types: colored plates (sushi) vs. dishes/items (hot pot)

### Currency Handling
- All prices stored as numbers (no currency formatting in JSON)
- Currency formatting handled by application logic
- Support for different decimal places and separators

### State Management
- No localStorage used - fresh session each time
- Implement data validation for user inputs
- Handle edge cases (zero plates, negative values)
- State managed through JavaScript objects and DOM updates

## Mobile-First Design

The application is designed with mobile-first responsive principles:
- Touch-friendly interface for plate selection with hover effects
- Optimized for portrait orientation
- Accessible tap targets (minimum 48px) and readable text
- Responsive grid layouts for different screen sizes
- Floating action buttons for navigation
- Visual feedback for user interactions (tooltips, animations)

## Key Features

### User Interface
- **Restaurant Selection**: Visual cards with logos and descriptions
- **Participant Management**: Add/edit participants with visual cards
- **Plate Selection**: Image-based plate selection with real-time counting
- **Bill Summary**: Detailed breakdown table with totals

### User Experience
- **Visual Feedback**: Animated tooltips when plates are added/removed
- **Real-time Updates**: Instant calculation and display updates
- **Mobile Optimized**: Touch-friendly buttons and responsive design
- **Multilingual**: Thai/English labels throughout the interface

### Technical Features
- **SEO Optimized**: Complete meta tags and structured data
- **PWA Ready**: Favicon and manifest files included
- **Performance**: Lazy loading for images and efficient DOM updates

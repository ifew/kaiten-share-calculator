# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kaiten Share Calculator is a web-based conveyor belt sushi bill calculator that helps groups split bills based on individual plate consumption. The app is designed to be a pure frontend application with no backend dependencies.

**Current Status: Early Development Stage**
- Configuration files and documentation are complete
- Main application files (HTML, JS, CSS) need to be implemented

## Technology Stack

- **HTML5**: Structure and markup
- **CSS3 + TailwindCSS**: Styling and responsive design
- **JavaScript (ES6)**: Application logic and interactivity
- **JSON Configuration**: Restaurant data management
- **LocalStorage**: Session persistence (optional)
- **No Backend**: Pure frontend application

## Architecture Overview

### Configuration-Driven Design
The app uses JSON configuration files to manage restaurant data:
- `config/sushiro.json`: Sushiro restaurant configuration
- `config/katsu_midori.json`: Katsu Midori restaurant configuration

Each config contains:
- Restaurant metadata (name, logo, description)
- Currency formatting rules
- Service charge and VAT settings
- Plate definitions (colors, prices, images, multilingual labels)

### Key Application Flow
1. **Restaurant Selection**: User chooses from configured restaurants
2. **Participant Management**: Add/edit participant names
3. **Plate Tracking**: Real-time plate counting per participant
4. **Bill Calculation**: Automatic calculation with service charges and VAT
5. **Bill Splitting**: Individual totals based on consumption + proportional fees

### Data Structure Patterns
- Multilingual support (Thai/English labels)
- Flexible currency formatting
- Configurable tax and service charge rates
- Image-based plate identification

## File Structure

```
/
├── README.MD                    # Project documentation
├── config/                      # Restaurant configurations
│   ├── katsu_midori.json       # Katsu Midori restaurant data
│   └── sushiro.json            # Sushiro restaurant data
└── images/                     # Static assets
    ├── logo_restaurants/       # Restaurant logos
    └── plates/                 # Plate images by restaurant
        ├── katsu_midori/
        └── sushiro/
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

**Note**: This project currently has no build system configured. When implementing:

- Consider using a simple HTTP server for development (e.g., `python -m http.server` or `npx serve`)
- If adding TailwindCSS, will need build process (e.g., `npm run build`)
- No testing framework currently configured

## Implementation Guidelines

### Adding New Restaurants
1. Create new JSON config in `config/[restaurant_id].json`
2. Add restaurant logo to `images/logo_restaurants/`
3. Create plate images in `images/plates/[restaurant_id]/`
4. Update main application to load new configuration

### Plate Configuration
- Use consistent naming for plate colors across restaurants
- Include both Thai and English labels
- Maintain image aspect ratios and file sizes
- Price should be in THB (Thai Baht)

### Currency Handling
- All prices stored as numbers (no currency formatting in JSON)
- Currency formatting handled by application logic
- Support for different decimal places and separators

### State Management
- Use LocalStorage for session persistence
- Implement data validation for user inputs
- Handle edge cases (zero plates, negative values)

## Mobile-First Design

The application is designed with mobile-first responsive principles:
- Touch-friendly interface for plate selection
- Optimized for portrait orientation
- Accessible tap targets and readable text
- Offline capability for restaurant environments
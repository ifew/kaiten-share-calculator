# Kaiten Share Calculator

🍣 Conveyor Belt Sushi/Mala Bill Calculator - Web App for Thailand

## 🌟 Features

### Restaurant Management
- **Multi-restaurant support**: Sushiro, Katsu Midori, and Yijia Suki Mala hot pot
- **Automatic restaurant loading**: JSON configuration files automatically detect new restaurants
- **Flexible pricing**: Support different menu items (plates, sticks, dishes, drinks, beer)
- **Custom pricing rules**: Configurable service charge and VAT per restaurant

### User Experience
- **Touch-friendly interface**: Click plates to add, tap minus button to remove
- **Real-time feedback**: Animated tooltips (+1 green, -1 red) for plate changes
- **Participant management**: Unlimited participants with full-width name editing
- **Smart navigation**: Auto-scroll to plates section when selecting participants
- **Mobile-first design**: Optimized for thumb-friendly interactions

### Bill Calculation
- **Individual tracking**: Track plates per participant with visual counters
- **Live totals**: Real-time calculation of plates and amounts
- **Service charges**: Automatic calculation of service charge and VAT
- **Fair splitting**: Proportional distribution of fees based on consumption
- **Detailed summary**: Complete breakdown with subtotals and final amounts

### Technical Features
- **Offline-capable**: No backend required, works without internet
- **Responsive design**: Mobile-optimized with prevent zoom on double-tap
- **Session management**: Optional localStorage for data persistence
- **Error handling**: Graceful fallbacks and user-friendly error messages

---

## 🌟 Technology Stack

### Frontend
- **HTML5**: Semantic structure with accessibility features
- **CSS3 + TailwindCSS**: Utility-first styling with custom animations
- **JavaScript (ES6+)**: Modern vanilla JavaScript with async/await
- **Responsive Design**: Mobile-first approach with touch optimization

### Data Management
- **JSON Configuration**: Restaurant and menu item configurations
- **Dynamic Loading**: Automatic detection of restaurant config files
- **LocalStorage**: Optional session persistence
- **Client-side State**: Real-time data management without backend

### Architecture
- **Static Site**: Pure frontend application, no server required
- **Progressive Enhancement**: Works offline with graceful degradation
- **Modular Design**: Configuration-driven restaurant management
- **Cross-platform**: Compatible with all modern browsers

---

## 🌟 User Journey

### 1. Restaurant Selection
- **Auto-load restaurants**: System automatically detects available restaurants from JSON configs
- **Visual selection**: Choose from restaurant cards showing logos and descriptions
- **Supported restaurants**: Sushiro, Katsu Midori, Yijia Suki Mala hot pot

### 2. Participant Setup
- **Quick start**: App begins with one default participant
- **Easy management**: 
  - Click "Add Person" to add more participants
  - Edit names directly in full-width input fields
  - Remove participants with confirmation dialog
- **Visual feedback**: Cards show plate count and running totals
- **Smart layout**: 2-column grid optimized for mobile viewing

### 3. Plate Selection & Tracking
- **Intuitive interaction**:
  - Click any plate/item to add (+1 with green tooltip)
  - Minus button appears only when count > 0
  - Animated feedback for every change
- **Participant switching**: 
  - Click participant cards to select who you're ordering for
  - Auto-scroll to plates section for seamless flow
- **Real-time updates**: Live totals update instantly
- **Visual guidance**: Clear instructions in Thai language

### 4. Bill Summary & Splitting
- **Detailed breakdown**:
  - Individual participant totals with plate counts
  - Subtotals before fees
  - Service charge and VAT calculations
  - Final amounts per person
- **Fair distribution**: Fees split proportionally based on consumption
- **Mobile-optimized**: Compact table design with smaller fonts

### 5. Actions & Navigation
- **Easy navigation**: 
  - "Back to Edit" returns to calculator
  - Floating scroll button when scrolled past participants
- **Reset option**: Clear all data and restart
- **No save required**: Works entirely offline without accounts

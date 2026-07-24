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
- **Responsive design**: Mobile-optimized; buttons use `touch-action: manipulation` to avoid accidental double-tap zoom while keeping pinch-to-zoom available
- **No data storage**: Fresh session each time — nothing is saved and no personal data is collected
- **Error handling**: Graceful fallbacks and user-friendly error messages
- **SEO & AI friendly**: JSON-LD (`WebApplication` + `FAQPage`), `robots.txt`, `sitemap.xml`, `llms.txt`, and static HTML content so search engines and AI crawlers can read the page

---

## 🌟 Technology Stack

### Frontend
- **HTML5**: Semantic structure with accessibility features
- **CSS3 + TailwindCSS**: Utility-first styling, **prebuilt & purged into `tailwind.css`** (no CDN) with custom animations
- **JavaScript (ES6+)**: Modern vanilla JavaScript with async/await
- **Responsive Design**: Mobile-first approach with touch optimization

### Data Management
- **JSON Configuration**: Restaurant and menu item configurations
- **Dynamic Loading**: Automatic detection of restaurant config files
- **No persistence**: State lives in memory only — no localStorage, no backend
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

---

## 📁 Project Structure

```text
/
├── index.html                  # Main HTML — UI, SEO/meta, JSON-LD, links /tailwind.css
├── app.js                      # Application logic (vanilla ES6)
├── tailwind.css                # Prebuilt + purged Tailwind (COMMITTED, served as-is)
├── src/
│   └── tailwind.input.css      # Tailwind entry (@tailwind base/components/utilities)
├── tailwind.config.js          # Purge/content config → scans index.html + app.js
├── config/                     # Restaurant configs (one JSON per restaurant)
│   ├── sushiro.json
│   ├── katsu_midori.json
│   └── yijia_suki_mala.json
├── images/                     # Logos + plate images per restaurant
├── robots.txt                  # Crawl rules (search engines + AI bots)
├── sitemap.xml                 # Sitemap for search engines
├── llms.txt                    # Site summary for AI crawlers
├── site.webmanifest            # PWA manifest
├── favicon*.png / .ico / .svg  # Icons
├── tests/                      # Jest unit + integration tests
└── cypress/                    # Cypress end-to-end tests
```

---

## 🚀 Getting Started

Requires Node.js (for tooling) — the app itself is static.

```bash
npm install          # install dev tooling (Tailwind, Jest, Cypress, ...)
npm run build:css    # build tailwind.css (required before first run)
npm run dev          # serve locally at http://localhost:3000
```

### Building CSS

Tailwind is **not** loaded from a CDN — it is compiled into `tailwind.css`.

```bash
npm run build:css    # one-off minified build
npm run watch:css    # rebuild automatically while developing
```

> ⚠️ After changing **any** Tailwind class name in `index.html` or `app.js`, run `npm run build:css` and commit the updated `tailwind.css`. Otherwise new classes won't have styles in production.

---

## 🧪 Testing

```bash
npm test             # Jest unit + integration tests
npm run test:unit    # unit tests only
npm run test:integration
npm run test:coverage # tests with coverage report
npm run cypress:open # open Cypress interactive runner (E2E)
npm run cypress:run  # run Cypress E2E headless
npm run test:ui      # start server + run Cypress E2E
npm run test:all     # coverage + E2E
npm run lint         # ESLint
npm run format       # Prettier
```

---

## ☁️ Deployment

Deployed on **Vercel** as a pure static site — **no build runs on deploy**, files are served exactly as committed.

1. Run `npm run build:css` locally and commit the updated `tailwind.css`.
2. Commit and push to the default branch.
3. Vercel serves the static files directly.

Because Vercel does not build the CSS, the committed `tailwind.css` **must** be up to date — this is the most common deployment mistake to avoid.

Live: <https://kaiten-share-calculator.vercel.app/>

---

## 📋 Development Rules

These rules keep SEO, accessibility, and the CSS pipeline healthy (also enforced in `CLAUDE.md`):

1. **Rebuild CSS after class changes** — run `npm run build:css` and commit `tailwind.css`. Never re-add `cdn.tailwindcss.com`.
2. **Never disable zoom** — keep `<meta name="viewport" content="width=device-width, initial-scale=1.0">`; no `user-scalable=no` / `maximum-scale`.
3. **Stay Thai-first** — keep `<html lang="th">` and `og:locale=th_TH`.
4. **Keep referenced assets real** — every file referenced in `index.html` must exist; keep `robots.txt`, `sitemap.xml`, `llms.txt` present.
5. **Keep SEO/AI metadata in sync** — when restaurants/features/FAQs change, update the JSON-LD blocks, the static About/FAQ `<section>`, and `llms.txt` together.

### Adding a New Restaurant

1. Create `config/[restaurant_id].json`.
2. Add a logo to `images/logo_restaurants/` and plate images to `images/plates/[restaurant_id]/`.
3. Add the config filename to the `restaurantFiles` array in `app.js`.
4. If you introduce new Tailwind classes, run `npm run build:css` and commit `tailwind.css`.

# Kaiten Share Calculator

🍣 Conveyor Belt Sushi Bill Calculator - Web App

## 🌟 Features

- Support select multiple restaurant (manage restaurant with config from JSON file in config/*.json)
- Load plate colors and prices each restuarant from JSON file (in config/*.json)
- Record plates picked per user (increase, decrease)
- Can add user unlimited person
- Show total plates, total amount in Thai Bath
- Show total amount with service charge (configurable, e.g. 10%) and VAT (configurable, e.g. 7%)
- Split bill per person (based on plates they picked, and plsu average total service charge and VAT)
- Reset / clear all data
- Responsive design for mobile first
- Offline-capable (no database, pure frontend)

---

## 🌟 Technology Stack

- **HTML5**: structure
- **CSS3 + TailwindCSS**: styling
- **JavaScript (ES6)**: logic
- **JSON file**: restaurant & plate color config
- **LocalStorage (optional)**: to persist session data temporarily
- **No backend / no database**

---

## 🌟 User Journey

1. **Landing Page**
   - JSON config loads restaurants (in config/*.json)
   - User selects restaurant from logo and restaurant name (e.g. Sushiro, Katsu Midori)

2. **Calculate Page > Add Participants**
   - Show number plates and total amount with service charge + vat on Top
   - Automatic show first user in the group, and default name in number (e.g. 1)
   - JSON config loads image plate and colors + prices
   - User can chaneg names of people in the group (e.g. Few, ,Nop, Mint, Kung, Dai)

3. **Calculate Page > Pick Plates**  
   - For each participant, user taps to add/remove plates of each color
   - Realtime calculation shows their running total plates and total amount for each Participants

4. **Summary Page**  
   - Show table of all participants:
     - Number of plates by color
     - Subtotal
     - Total with service charge + vat
   - Show grand total for the table

5. **Summary Page > Footer**  
   - User can reset to clear all data and start over
   - User can back to edit

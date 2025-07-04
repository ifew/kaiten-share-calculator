// Global variables
let currentRestaurant = null;
let participants = [];
let currentParticipantIndex = 0;
let plateSelections = {}; // participantId -> { plateColor: count }

// Application state
const AppState = {
    LOADING: 'loading',
    RESTAURANT_SELECTION: 'restaurant-selection',
    CALCULATOR: 'calculator-page',
    SUMMARY: 'summary-page'
};

let currentState = AppState.LOADING;

// Initialize application
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadRestaurants();
        switchToState(AppState.RESTAURANT_SELECTION);
    } catch (error) {
        console.error('Failed to load restaurants:', error);
        alert('Failed to load restaurant data. Please refresh the page.');
    }
});

// Load restaurants from config files
async function loadRestaurants() {
    const restaurantFiles = ['sushiro.json', 'katsu_midori.json'];
    const restaurants = [];
    
    for (const file of restaurantFiles) {
        try {
            const response = await fetch(`config/${file}`);
            const restaurant = await response.json();
            restaurants.push(restaurant);
        } catch (error) {
            console.error(`Failed to load ${file}:`, error);
        }
    }
    
    displayRestaurants(restaurants);
}

// Display restaurants on selection page
function displayRestaurants(restaurants) {
    const restaurantList = document.getElementById('restaurant-list');
    restaurantList.innerHTML = '';
    
    restaurants.forEach(restaurant => {
        const card = document.createElement('div');
        card.className = 'restaurant-card bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow';
        card.onclick = () => selectRestaurant(restaurant);
        
        card.innerHTML = `
            <article class="text-center">
                <img src="${restaurant.restaurantLogo}" alt="${restaurant.restaurantName} logo" 
                     class="w-24 h-24 mx-auto mb-4 object-cover" loading="lazy">
                <h2 class="text-xl font-semibold text-gray-800 mb-2">${restaurant.restaurantName}</h2>
                <p class="text-gray-600 text-sm">${restaurant.restaurantDescription}</p>
            </article>
        `;
        
        restaurantList.appendChild(card);
    });
}

// Select restaurant and initialize calculator
function selectRestaurant(restaurant) {
    currentRestaurant = restaurant;
    participants = [{ id: 1, name: '1' }];
    currentParticipantIndex = 0;
    plateSelections = { 1: {} };
    
    document.getElementById('selected-restaurant').textContent = restaurant.restaurantName;
    initializeCalculator();
    switchToState(AppState.CALCULATOR);
}

// Initialize calculator page
function initializeCalculator() {
    updateParticipantsList();
    updateParticipantSelector();
    displayPlates();
    updateTotals();
}

// Update participants list
function updateParticipantsList() {
    const participantsList = document.getElementById('participants-list');
    participantsList.innerHTML = '';
    
    participants.forEach((participant, index) => {
        const participantDiv = document.createElement('div');
        participantDiv.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg';
        
        const plateCount = getTotalPlatesForParticipant(participant.id);
        const amount = getTotalAmountForParticipant(participant.id);
        
        participantDiv.innerHTML = `
            <div class="flex items-center flex-1">
                <input type="text" value="${participant.name}" 
                       class="thumb-friendly-input bg-transparent border-none font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                       onchange="updateParticipantName(${participant.id}, this.value)">
                <span class="ml-4 text-sm text-gray-600">${plateCount} plates • ${formatCurrency(amount)}</span>
            </div>
            ${participants.length > 1 ? `
                <button onclick="removeParticipant(${participant.id})" class="participant-remove-btn text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors">
                    ✕
                </button>
            ` : ''}
        `;
        
        participantsList.appendChild(participantDiv);
    });
}

// Update participant selector
function updateParticipantSelector() {
    const selector = document.getElementById('participant-selector');
    selector.innerHTML = '';
    
    participants.forEach(participant => {
        const option = document.createElement('option');
        option.value = participant.id;
        option.textContent = participant.name;
        selector.appendChild(option);
    });
    
    selector.value = participants[currentParticipantIndex].id;
    selector.onchange = (e) => {
        currentParticipantIndex = participants.findIndex(p => p.id == e.target.value);
        displayPlates(); // Refresh plates display to show correct counts for selected participant
    };
}

// Display plates for current restaurant
function displayPlates() {
    const platesGrid = document.getElementById('plates-grid');
    platesGrid.innerHTML = '';
    
    Object.entries(currentRestaurant.plates).forEach(([plateColor, plateData]) => {
        const plateDiv = document.createElement('div');
        plateDiv.className = 'bg-white rounded-lg shadow-md p-4 text-center';
        
        const currentParticipant = participants[currentParticipantIndex];
        const count = plateSelections[currentParticipant.id]?.[plateColor] || 0;
        
        plateDiv.innerHTML = `
            <img src="${plateData.image}" alt="${plateData.label_en} plate - ${formatCurrency(plateData.price)}" 
                 class="w-16 h-16 mx-auto mb-2 rounded-full object-cover" loading="lazy">
            <h3 class="font-medium text-gray-800 mb-1">${plateData.label_en}</h3>
            <p class="text-sm text-gray-600 mb-2">${plateData.label_th}</p>
            <p class="text-lg font-bold text-green-600 mb-3">${formatCurrency(plateData.price)}</p>
            <div class="flex items-center justify-center gap-3">
                <button onclick="updatePlateCount('${plateColor}', -1)" 
                        class="plate-button bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors ${count <= 0 ? 'opacity-50 cursor-not-allowed' : ''}">
                    −
                </button>
                <span class="text-xl font-bold text-gray-800 min-w-12 text-center">${count}</span>
                <button onclick="updatePlateCount('${plateColor}', 1)" 
                        class="plate-button bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors">
                    +
                </button>
            </div>
        `;
        
        platesGrid.appendChild(plateDiv);
    });
}

// Update plate count for current participant
function updatePlateCount(plateColor, delta) {
    const currentParticipant = participants[currentParticipantIndex];
    if (!plateSelections[currentParticipant.id]) {
        plateSelections[currentParticipant.id] = {};
    }
    
    const currentCount = plateSelections[currentParticipant.id][plateColor] || 0;
    const newCount = Math.max(0, currentCount + delta);
    
    if (newCount === 0) {
        delete plateSelections[currentParticipant.id][plateColor];
    } else {
        plateSelections[currentParticipant.id][plateColor] = newCount;
    }
    
    displayPlates();
    updateParticipantsList();
    updateTotals();
}

// Add new participant
function addParticipant() {
    const newId = Math.max(...participants.map(p => p.id)) + 1;
    const newName = newId.toString();
    
    participants.push({ id: newId, name: newName });
    plateSelections[newId] = {};
    
    updateParticipantsList();
    updateParticipantSelector();
}

// Remove participant
function removeParticipant(id) {
    if (participants.length <= 1) return;
    
    participants = participants.filter(p => p.id !== id);
    delete plateSelections[id];
    
    if (currentParticipantIndex >= participants.length) {
        currentParticipantIndex = 0;
    }
    
    updateParticipantsList();
    updateParticipantSelector();
    displayPlates();
    updateTotals();
}

// Update participant name
function updateParticipantName(id, newName) {
    const participant = participants.find(p => p.id === id);
    if (participant) {
        participant.name = newName;
        updateParticipantSelector();
    }
}

// Calculate total plates for a participant
function getTotalPlatesForParticipant(participantId) {
    const selections = plateSelections[participantId] || {};
    return Object.values(selections).reduce((sum, count) => sum + count, 0);
}

// Calculate total amount for a participant
function getTotalAmountForParticipant(participantId) {
    const selections = plateSelections[participantId] || {};
    let total = 0;
    
    Object.entries(selections).forEach(([plateColor, count]) => {
        const plateData = currentRestaurant.plates[plateColor];
        if (plateData) {
            total += plateData.price * count;
        }
    });
    
    return total;
}

// Update totals display
function updateTotals() {
    const totalPlates = participants.reduce((sum, participant) => 
        sum + getTotalPlatesForParticipant(participant.id), 0);
    
    const totalAmount = participants.reduce((sum, participant) => 
        sum + getTotalAmountForParticipant(participant.id), 0);
    
    document.getElementById('total-plates').textContent = totalPlates;
    document.getElementById('total-amount').textContent = formatCurrency(totalAmount);
}

// Format currency according to restaurant settings
function formatCurrency(amount) {
    const formatted = amount.toFixed(currentRestaurant.currencyDecimalDigits);
    return currentRestaurant.currencyPosition === 'before' 
        ? `${currentRestaurant.currencySymbol}${formatted}`
        : `${formatted}${currentRestaurant.currencySymbol}`;
}

// Show summary page
function showSummary() {
    // Check if any plates have been selected
    const totalPlates = participants.reduce((sum, participant) => 
        sum + getTotalPlatesForParticipant(participant.id), 0);
    
    if (totalPlates === 0) {
        alert('Please select at least one plate before viewing the summary.');
        return;
    }
    
    generateSummaryTable();
    switchToState(AppState.SUMMARY);
}

// Generate summary table
function generateSummaryTable() {
    const tableBody = document.getElementById('summary-table-body');
    tableBody.innerHTML = '';
    
    let grandTotal = 0;
    const subtotal = participants.reduce((sum, participant) => 
        sum + getTotalAmountForParticipant(participant.id), 0);
    
    const serviceCharge = subtotal * currentRestaurant.serviceCharge;
    const vat = subtotal * currentRestaurant.vat;
    const totalWithTaxes = subtotal + serviceCharge + vat;
    
    participants.forEach(participant => {
        const participantSubtotal = getTotalAmountForParticipant(participant.id);
        const participantServiceCharge = (participantSubtotal / subtotal) * serviceCharge;
        const participantVat = (participantSubtotal / subtotal) * vat;
        const participantTotal = participantSubtotal + participantServiceCharge + participantVat;
        
        grandTotal += participantTotal;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="border border-gray-300 p-2 font-medium">${participant.name}</td>
            <td class="border border-gray-300 p-2 text-center">${getTotalPlatesForParticipant(participant.id)}</td>
            <td class="border border-gray-300 p-2 text-right">${formatCurrency(participantSubtotal)}</td>
            <td class="border border-gray-300 p-2 text-right font-semibold">${formatCurrency(participantTotal)}</td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add summary rows
    const summaryRows = [
        ['Subtotal', '', formatCurrency(subtotal), ''],
        ['Service Charge (10%)', '', formatCurrency(serviceCharge), ''],
        ['VAT (7%)', '', formatCurrency(vat), '']
    ];
    
    summaryRows.forEach(([label, plates, amount, total]) => {
        const row = document.createElement('tr');
        row.className = 'bg-gray-50';
        row.innerHTML = `
            <td class="border border-gray-300 p-2 font-medium">${label}</td>
            <td class="border border-gray-300 p-2 text-center">${plates}</td>
            <td class="border border-gray-300 p-2 text-right">${amount}</td>
            <td class="border border-gray-300 p-2 text-right">${total}</td>
        `;
        tableBody.appendChild(row);
    });
    
    document.getElementById('grand-total').textContent = formatCurrency(grandTotal);
}

// Reset all data
function resetAll() {
    if (confirm('Are you sure you want to reset all data?')) {
        participants = [{ id: 1, name: '1' }];
        currentParticipantIndex = 0;
        plateSelections = { 1: {} };
        
        localStorage.removeItem('kaiten-calculator-session');
        
        switchToState(AppState.RESTAURANT_SELECTION);
    }
}

// Save session to localStorage
function saveSession() {
    const sessionData = {
        restaurant: currentRestaurant.restaurantId,
        participants: participants,
        plateSelections: plateSelections,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('kaiten-calculator-session', JSON.stringify(sessionData));
    alert('Session saved successfully!');
}

// Switch between application states
function switchToState(state) {
    // Hide all pages
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('restaurant-selection').classList.add('hidden');
    document.getElementById('calculator-page').classList.add('hidden');
    document.getElementById('summary-page').classList.add('hidden');
    
    // Show target page
    document.getElementById(state).classList.remove('hidden');
    currentState = state;
}

// Event listeners
document.getElementById('add-participant').addEventListener('click', addParticipant);
document.getElementById('back-to-restaurants').addEventListener('click', () => switchToState(AppState.RESTAURANT_SELECTION));
document.getElementById('back-to-calculator').addEventListener('click', () => switchToState(AppState.CALCULATOR));
document.getElementById('show-summary').addEventListener('click', showSummary);
document.getElementById('reset-all').addEventListener('click', resetAll);
document.getElementById('save-session').addEventListener('click', saveSession);

// Load saved session on startup
window.addEventListener('load', () => {
    const savedSession = localStorage.getItem('kaiten-calculator-session');
    if (savedSession) {
        try {
            const sessionData = JSON.parse(savedSession);
            // Could implement session restoration here
        } catch (error) {
            console.error('Failed to load saved session:', error);
        }
    }
});
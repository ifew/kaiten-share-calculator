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
    const restaurantFiles = ['sushiro.json', 'katsu_midori.json', 'yijia_suki_mala.json'];
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
    updateSelectedParticipantDisplay();
    displayPlates();
    updateTotals();
    setupScrollListener();
}

// Update participants list
function updateParticipantsList() {
    const participantsList = document.getElementById('participants-list');
    participantsList.innerHTML = '';
    
    participants.forEach((participant, index) => {
        const participantDiv = document.createElement('div');
        const isActive = currentParticipantIndex === index;
        participantDiv.className = `participant-card bg-white border-2 rounded-lg p-4 cursor-pointer ${isActive ? 'active' : 'border-gray-200'}`;
        
        const plateCount = getTotalPlatesForParticipant(participant.id);
        const amount = getTotalAmountForParticipant(participant.id);
        
        participantDiv.innerHTML = `
            <div class="mb-2">
                <input type="text" value="${participant.name}" 
                       class="thumb-friendly-input bg-white border border-gray-300 rounded font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                       onchange="updateParticipantName(${participant.id}, this.value)"
                       onclick="event.stopPropagation()">
            </div>
            <div class="flex items-center justify-between">
                <div class="text-sm text-gray-600">
                    <span class="font-medium">${plateCount} plates</span> • <span class="font-medium text-green-600">${formatCurrency(amount)}</span>
                </div>
                ${participants.length > 1 ? `
                    <button onclick="confirmRemoveParticipant(${participant.id}); event.stopPropagation()" class="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors p-1 text-sm">
                        ✕
                    </button>
                ` : ''}
            </div>
        `;
        
        participantDiv.addEventListener('click', () => selectParticipantAndScroll(index));
        participantsList.appendChild(participantDiv);
    });
}

// Update selected participant display
function updateSelectedParticipantDisplay() {
    const display = document.getElementById('selected-participant-display');
    if (participants.length > 0 && currentParticipantIndex < participants.length) {
        const currentParticipant = participants[currentParticipantIndex];
        display.textContent = currentParticipant.name;
    } else {
        display.textContent = '-';
    }
}

// Select participant for editing
function selectParticipant(index) {
    currentParticipantIndex = index;
    updateParticipantsList();
    updateSelectedParticipantDisplay();
    displayPlates();
}

// Select participant and scroll to plates section
function selectParticipantAndScroll(index) {
    selectParticipant(index);
    
    // Scroll to plates section
    const platesSection = document.getElementById('plates-section');
    if (platesSection) {
        platesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Display plates for current restaurant
function displayPlates() {
    const platesGrid = document.getElementById('plates-grid');
    platesGrid.innerHTML = '';
    
    Object.entries(currentRestaurant.plates).forEach(([plateColor, plateData]) => {
        const plateDiv = document.createElement('div');
        plateDiv.className = 'bg-white rounded-lg shadow-md p-4 text-center cursor-pointer hover:shadow-lg transition-shadow relative';
        
        const currentParticipant = participants[currentParticipantIndex];
        const count = plateSelections[currentParticipant.id]?.[plateColor] || 0;
        
        plateDiv.innerHTML = `
            ${plateData.image && plateData.image.trim() !== '' ? `
                <img src="${plateData.image}" alt="${plateData.label_en} plate - ${formatCurrency(plateData.price)}" 
                     class="w-16 h-16 mx-auto mb-2 rounded-full object-cover" loading="lazy">
            ` : `
                <div class="mx-auto mb-2 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center" style="width: 72px; height: 72px;">
                    <span class="text-xs font-semibold text-gray-900 text-center leading-tight px-1">${plateData.label_en}</span>
                </div>
            `}
            <h3 class="font-medium text-gray-800 mb-1">${plateData.label_en}</h3>
            <p class="text-lg font-bold text-green-600 mb-3">${formatCurrency(plateData.price)}</p>
            <div class="flex items-center justify-center gap-3">
                ${count > 0 ? `
                    <button onclick="updatePlateCount('${plateColor}', -1); event.stopPropagation()" 
                            class="plate-button bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                        −
                    </button>
                ` : ''}
                <span class="text-xl font-bold text-gray-800 min-w-12 text-center">${count}</span>
            </div>
        `;
        
        // Make plate clickable to add
        plateDiv.addEventListener('click', () => updatePlateCount(plateColor, 1));
        
        platesGrid.appendChild(plateDiv);
    });
}

// Show tooltip animation
function showPlateTooltip(plateColor, delta) {
    const plateElements = document.querySelectorAll('.bg-white.rounded-lg.shadow-md.p-4.text-center');
    
    // Find the correct plate element by checking its content
    let targetPlate = null;
    plateElements.forEach(plate => {
        const plateLabel = plate.querySelector('h3');
        if (plateLabel && plateLabel.textContent === currentRestaurant.plates[plateColor].label_en) {
            targetPlate = plate;
        }
    });
    
    if (targetPlate) {
        const tooltip = document.createElement('div');
        tooltip.className = `plate-tooltip ${delta > 0 ? 'positive' : 'negative'}`;
        tooltip.textContent = delta > 0 ? '+1' : '-1';
        
        targetPlate.appendChild(tooltip);
        
        // Remove tooltip after animation
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        }, 1500);
    }
}

// Update plate count for current participant
function updatePlateCount(plateColor, delta) {
    const currentParticipant = participants[currentParticipantIndex];
    if (!plateSelections[currentParticipant.id]) {
        plateSelections[currentParticipant.id] = {};
    }
    
    const currentCount = plateSelections[currentParticipant.id][plateColor] || 0;
    const newCount = Math.max(0, currentCount + delta);
    
    // Only show tooltip if count actually changes
    if (newCount !== currentCount) {
        showPlateTooltip(plateColor, delta);
    }
    
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
    updateSelectedParticipantDisplay();
}

// Confirm participant removal
function confirmRemoveParticipant(id) {
    if (participants.length <= 1) return;
    
    const participant = participants.find(p => p.id === id);
    const participantName = participant ? participant.name : 'this participant';
    
    if (confirm(`Confirm to delete "${participantName}"?`)) {
        removeParticipant(id);
    }
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
    updateSelectedParticipantDisplay();
    displayPlates();
    updateTotals();
}

// Update participant name
function updateParticipantName(id, newName) {
    const participant = participants.find(p => p.id === id);
    if (participant) {
        participant.name = newName;
        updateSelectedParticipantDisplay();
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
    
    // Scroll to top when showing summary
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <td class="border border-gray-300 p-2 font-medium text-sm">${participant.name}</td>
            <td class="border border-gray-300 p-2 text-center text-sm">${getTotalPlatesForParticipant(participant.id)}</td>
            <td class="border border-gray-300 p-2 text-right text-sm">${formatCurrency(participantSubtotal)}</td>
            <td class="border border-gray-300 p-2 text-right font-semibold text-sm">${formatCurrency(participantTotal)}</td>
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
            <td class="border border-gray-300 p-2 font-medium text-sm">${label}</td>
            <td class="border border-gray-300 p-2 text-center text-sm">${plates}</td>
            <td class="border border-gray-300 p-2 text-right text-sm">${amount}</td>
            <td class="border border-gray-300 p-2 text-right text-sm">${total}</td>
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

// Setup scroll listener for floating button
function setupScrollListener() {
    const floatingBtn = document.getElementById('scroll-to-participants');
    const participantsSection = document.getElementById('participants-section');
    
    function checkScroll() {
        if (currentState === AppState.CALCULATOR) {
            const rect = participantsSection.getBoundingClientRect();
            if (rect.bottom < 0) {
                floatingBtn.classList.remove('hidden');
            } else {
                floatingBtn.classList.add('hidden');
            }
        } else {
            floatingBtn.classList.add('hidden');
        }
    }
    
    window.addEventListener('scroll', checkScroll);
    
    floatingBtn.addEventListener('click', () => {
        participantsSection.scrollIntoView({ behavior: 'smooth' });
    });
}

// Event listeners
document.getElementById('add-participant').addEventListener('click', addParticipant);
document.getElementById('back-to-restaurants').addEventListener('click', () => switchToState(AppState.RESTAURANT_SELECTION));
document.getElementById('back-to-calculator').addEventListener('click', () => switchToState(AppState.CALCULATOR));
document.getElementById('show-summary').addEventListener('click', showSummary);
document.getElementById('reset-all').addEventListener('click', resetAll);

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
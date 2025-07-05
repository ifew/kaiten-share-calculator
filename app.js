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

// Initialize application (only in browser environment)
if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('DOMContentLoaded', async () => {
        try {
            await loadRestaurants();
            switchToState(AppState.RESTAURANT_SELECTION);
        } catch (error) {
            console.error('Failed to load restaurants:', error);
            alert('Failed to load restaurant data. Please refresh the page.');
        }
    });
}

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
    if (!restaurantList) return;
    restaurantList.innerHTML = '';
    
    restaurants.forEach(restaurant => {
        const card = document.createElement('div');
        card.className = 'restaurant-card bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow';
        card.setAttribute('data-restaurant', restaurant.restaurantId);
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
    
    const selectedRestaurantEl = document.getElementById('selected-restaurant');
    if (selectedRestaurantEl) {
        selectedRestaurantEl.textContent = restaurant.restaurantName;
    }
    
    // Only call DOM-dependent functions if we're in a browser environment
    if (typeof window !== 'undefined' && window.document) {
        initializeCalculator();
        switchToState(AppState.CALCULATOR);
    }
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
    if (!participantsList) return;
    participantsList.innerHTML = '';
    
    participants.forEach((participant, index) => {
        const participantDiv = document.createElement('div');
        const isActive = currentParticipantIndex === index;
        participantDiv.className = `participant-card bg-white border-2 rounded-lg p-3 cursor-pointer ${isActive ? 'active' : 'border-gray-200'}`;
        participantDiv.setAttribute('data-participant', participant.id);
        
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
    if (!display) return;
    
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
    if (!platesGrid || !currentRestaurant) return;
    platesGrid.innerHTML = '';
    
    Object.entries(currentRestaurant.plates).forEach(([plateColor, plateData]) => {
        const plateDiv = document.createElement('div');
        plateDiv.className = 'bg-white rounded-lg shadow-md p-4 text-center cursor-pointer hover:shadow-lg transition-shadow relative no-select';
        plateDiv.setAttribute('data-plate', plateColor);
        plateDiv.setAttribute('data-plate-color', plateColor);
        
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
            <div class="flex items-center">
                ${count > 0 ? `
                    <button onclick="updatePlateCount('${plateColor}', -1); event.stopPropagation()" 
                            class="bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex-1 flex items-center justify-center"
                            style="height: 32px; font-size: 16px;">
                        −
                    </button>
                    <span class="text-xl font-bold text-gray-800 flex-1 text-center">${count}</span>
                ` : `
                    <span class="text-xl font-bold text-gray-800 w-full text-center">${count}</span>
                `}
            </div>
        `;
        
        // Make plate clickable to add
        plateDiv.addEventListener('click', () => updatePlateCount(plateColor, 1));
        
        platesGrid.appendChild(plateDiv);
    });
}

// Show tooltip animation - REMOVED
// Tooltip functionality has been removed to improve mobile UX

// Update plate count for current participant
function updatePlateCount(plateColor, delta) {
    if (participants.length === 0 || currentParticipantIndex >= participants.length) {
        return; // No participants to update
    }
    
    const currentParticipant = participants[currentParticipantIndex];
    if (!currentParticipant) {
        return; // Invalid participant
    }
    
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
    
    if (!currentRestaurant || !currentRestaurant.plates) {
        return total;
    }
    
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
    
    const totalPlatesEl = document.getElementById('total-plates');
    const totalAmountEl = document.getElementById('total-amount');
    
    if (totalPlatesEl) totalPlatesEl.textContent = totalPlates;
    if (totalAmountEl) totalAmountEl.textContent = formatCurrency(totalAmount);
}

// Format currency according to restaurant settings
function formatCurrency(amount) {
    if (!currentRestaurant) {
        // Default formatting when no restaurant is selected
        const formatted = amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return `฿${formatted}`;
    }
    
    const decimalDigits = currentRestaurant.currencyDecimalDigits || 2;
    const thousandsSeparator = currentRestaurant.currencyThousandsSeparator || ',';
    
    let formatted = amount.toFixed(decimalDigits);
    
    // Add thousands separator
    if (thousandsSeparator) {
        const parts = formatted.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
        formatted = parts.join('.');
    }
    
    return currentRestaurant.currencyPosition === 'before' 
        ? `${currentRestaurant.currencySymbol || '฿'}${formatted}`
        : `${formatted}${currentRestaurant.currencySymbol || '฿'}`;
}

// Show summary page
function showSummary() {
    // Check if any plates have been selected
    const totalPlates = participants.reduce((sum, participant) => 
        sum + getTotalPlatesForParticipant(participant.id), 0);
    
    if (totalPlates === 0) {
        if (typeof alert !== 'undefined') {
            alert('Please select at least one plate before viewing the summary.');
        }
        return;
    }
    
    generateSummaryTable();
    switchToState(AppState.SUMMARY);
    
    // Scroll to top when showing summary (only in browser)
    if (typeof window !== 'undefined' && window.scrollTo) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Generate summary table
function generateSummaryTable() {
    // Generate summary totals
    generateSummaryTotals();
    
    // Generate plate breakdown table
    generatePlateBreakdownTable();
    
    // Generate participant summary table
    const tableBody = document.getElementById('summary-table-body');
    if (!tableBody) return;
    tableBody.innerHTML = '';
    
    let grandTotal = 0;
    const subtotal = participants.reduce((sum, participant) => 
        sum + getTotalAmountForParticipant(participant.id), 0);
    
    let serviceCharge, vat, totalWithTaxes;
    
    if (currentRestaurant.vatIncluded) {
        // VAT is included in prices - need to extract VAT from the total
        serviceCharge = subtotal * currentRestaurant.serviceCharge;
        const totalWithServiceCharge = subtotal + serviceCharge;
        
        // Calculate net amount and VAT from the total that includes VAT
        const netAmount = totalWithServiceCharge / (1 + currentRestaurant.vat);
        vat = totalWithServiceCharge - netAmount;
        totalWithTaxes = totalWithServiceCharge; // Final total remains the same
    } else {
        // VAT is not included in prices - add VAT to the total
        serviceCharge = subtotal * currentRestaurant.serviceCharge;
        vat = subtotal * currentRestaurant.vat;
        totalWithTaxes = subtotal + serviceCharge + vat;
    }
    
    participants.forEach(participant => {
        const participantSubtotal = getTotalAmountForParticipant(participant.id);
        const participantServiceCharge = subtotal > 0 ? (participantSubtotal / subtotal) * serviceCharge : 0;
        
        let participantTotal;
        if (currentRestaurant.vatIncluded) {
            // VAT is included in prices, so total is subtotal + service charge (VAT already included)
            participantTotal = participantSubtotal + participantServiceCharge;
        } else {
            // VAT is not included in prices, so add VAT
            const participantVat = subtotal > 0 ? (participantSubtotal / subtotal) * vat : 0;
            participantTotal = participantSubtotal + participantServiceCharge + participantVat;
        }
        
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
    
    // Add summary rows based on VAT inclusion
    const summaryRows = [];
    
    if (currentRestaurant.vatIncluded) {
        // VAT is included in prices, so show breakdown with VAT extraction
        const totalWithServiceCharge = subtotal + serviceCharge;
        const netAmount = totalWithServiceCharge / (1 + currentRestaurant.vat);
        
        summaryRows.push(
            ['ราคารวม VAT', '', formatCurrency(subtotal), ''],
            ['Service Charge (' + Math.round(currentRestaurant.serviceCharge * 100) + '%)', '', formatCurrency(serviceCharge), ''],
            ['รวมก่อนถอด VAT', '', formatCurrency(totalWithServiceCharge), ''],
            ['ถอด VAT (' + Math.round(currentRestaurant.vat * 100) + '%)', '', formatCurrency(vat), ''],
            ['ราคาสุทธิ (หลังถอด VAT)', '', formatCurrency(netAmount), '']
        );
    } else {
        // VAT is not included in prices, so show "VAT" (VAT addition)
        summaryRows.push(
            ['ราคารวมก่อน VAT', '', formatCurrency(subtotal), ''],
            ['Service Charge (' + Math.round(currentRestaurant.serviceCharge * 100) + '%)', '', formatCurrency(serviceCharge), ''],
            ['VAT (' + Math.round(currentRestaurant.vat * 100) + '%)', '', formatCurrency(vat), '']
        );
    }
    
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
    
    const grandTotalEl = document.getElementById('grand-total');
    if (grandTotalEl) grandTotalEl.textContent = formatCurrency(grandTotal);
}

// Generate summary totals section
function generateSummaryTotals() {
    const totalPlates = participants.reduce((sum, participant) => 
        sum + getTotalPlatesForParticipant(participant.id), 0);
    
    const totalAmount = participants.reduce((sum, participant) => 
        sum + getTotalAmountForParticipant(participant.id), 0);
    
    let grandTotal = totalAmount;
    if (currentRestaurant) {
        if (currentRestaurant.vatIncluded) {
            // VAT is included in prices - final total is plates + service charge
            const serviceCharge = totalAmount * (currentRestaurant.serviceCharge || 0);
            grandTotal = totalAmount + serviceCharge;
        } else {
            // VAT is not included in prices - add service charge and VAT
            const serviceCharge = totalAmount * (currentRestaurant.serviceCharge || 0);
            const vat = totalAmount * (currentRestaurant.vat || 0);
            grandTotal = totalAmount + serviceCharge + vat;
        }
    }
    
    const summaryTotalPlatesEl = document.getElementById('summary-total-plates');
    const summaryTotalAmountEl = document.getElementById('summary-total-amount');
    
    if (summaryTotalPlatesEl) summaryTotalPlatesEl.textContent = totalPlates;
    if (summaryTotalAmountEl) summaryTotalAmountEl.textContent = formatCurrency(grandTotal);
}

// Generate plate breakdown table
function generatePlateBreakdownTable() {
    const tableBody = document.getElementById('plate-breakdown-table-body');
    if (!tableBody) return;
    tableBody.innerHTML = '';
    
    // Collect all plate counts by type
    const plateCounts = {};
    
    participants.forEach(participant => {
        const participantPlates = plateSelections[participant.id] || {};
        Object.entries(participantPlates).forEach(([plateColor, count]) => {
            if (count > 0) {
                plateCounts[plateColor] = (plateCounts[plateColor] || 0) + count;
            }
        });
    });
    
    // Sort plates by price (highest first)
    const sortedPlates = Object.entries(plateCounts).sort((a, b) => {
        const priceA = currentRestaurant.plates[a[0]]?.price || 0;
        const priceB = currentRestaurant.plates[b[0]]?.price || 0;
        return priceB - priceA;
    });
    
    // Generate rows for each plate type
    sortedPlates.forEach(([plateColor, count]) => {
        const plateInfo = currentRestaurant.plates[plateColor];
        if (!plateInfo) return;
        
        const platePrice = plateInfo.price;
        const totalPrice = platePrice * count;
        const plateLabel = plateInfo.label_th || plateInfo.label_en || plateColor;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="border border-gray-300 p-2 font-medium text-sm">${plateLabel}</td>
            <td class="border border-gray-300 p-2 text-center text-sm">${count}</td>
            <td class="border border-gray-300 p-2 text-right text-sm">${formatCurrency(platePrice)}</td>
            <td class="border border-gray-300 p-2 text-right font-semibold text-sm">${formatCurrency(totalPrice)}</td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add total row
    const totalPlates = Object.values(plateCounts).reduce((sum, count) => sum + count, 0);
    const totalAmount = Object.entries(plateCounts).reduce((sum, [plateColor, count]) => {
        const platePrice = currentRestaurant.plates[plateColor]?.price || 0;
        return sum + (platePrice * count);
    }, 0);
    
    if (totalPlates > 0) {
        const totalRow = document.createElement('tr');
        totalRow.className = 'bg-gray-100 font-semibold';
        totalRow.innerHTML = `
            <td class="border border-gray-300 p-2 text-sm">รวม</td>
            <td class="border border-gray-300 p-2 text-center text-sm">${totalPlates}</td>
            <td class="border border-gray-300 p-2 text-right text-sm">-</td>
            <td class="border border-gray-300 p-2 text-right text-sm">${formatCurrency(totalAmount)}</td>
        `;
        
        tableBody.appendChild(totalRow);
    }
}

// Reset all data
function resetAll() {
    const shouldReset = typeof confirm !== 'undefined' ? 
        confirm('Are you sure you want to reset all data?') : true;
        
    if (shouldReset) {
        participants = [{ id: 1, name: '1' }];
        currentParticipantIndex = 0;
        plateSelections = { 1: {} };
        
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('kaiten-calculator-session');
        }
        
        switchToState(AppState.RESTAURANT_SELECTION);
    }
}

// Save session to localStorage
function saveSession() {
    if (!currentRestaurant) {
        if (typeof alert !== 'undefined') {
            alert('No restaurant selected to save session.');
        }
        return;
    }
    
    const sessionData = {
        restaurant: currentRestaurant.restaurantId,
        participants: participants,
        plateSelections: plateSelections,
        timestamp: new Date().toISOString()
    };
    
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('kaiten-calculator-session', JSON.stringify(sessionData));
    }
    
    if (typeof alert !== 'undefined') {
        alert('Session saved successfully!');
    }
}

// Switch between application states
function switchToState(state) {
    // Hide all pages
    const loadingEl = document.getElementById('loading');
    const restaurantSelectionEl = document.getElementById('restaurant-selection');
    const calculatorPageEl = document.getElementById('calculator-page');
    const summaryPageEl = document.getElementById('summary-page');
    
    if (loadingEl) loadingEl.classList.add('hidden');
    if (restaurantSelectionEl) restaurantSelectionEl.classList.add('hidden');
    if (calculatorPageEl) calculatorPageEl.classList.add('hidden');
    if (summaryPageEl) summaryPageEl.classList.add('hidden');
    
    // Show target page
    const targetEl = document.getElementById(state);
    if (targetEl) targetEl.classList.remove('hidden');
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

// Event listeners (only in browser environment)
if (typeof window !== 'undefined' && window.document) {
    const addParticipantBtn = document.getElementById('add-participant');
    const backToRestaurantsBtn = document.getElementById('back-to-restaurants');
    const backToCalculatorBtn = document.getElementById('back-to-calculator');
    const showSummaryBtn = document.getElementById('show-summary');
    const resetAllBtn = document.getElementById('reset-all');
    
    if (addParticipantBtn) addParticipantBtn.addEventListener('click', addParticipant);
    if (backToRestaurantsBtn) backToRestaurantsBtn.addEventListener('click', () => switchToState(AppState.RESTAURANT_SELECTION));
    if (backToCalculatorBtn) backToCalculatorBtn.addEventListener('click', () => switchToState(AppState.CALCULATOR));
    if (showSummaryBtn) showSummaryBtn.addEventListener('click', showSummary);
    if (resetAllBtn) resetAllBtn.addEventListener('click', resetAll);
}

// Load saved session on startup (only in browser environment)
if (typeof window !== 'undefined' && window.addEventListener) {
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
}

// Export functions for testing (Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Core calculation functions
        getTotalPlatesForParticipant,
        getTotalAmountForParticipant,
        formatCurrency,
        
        // State management functions
        selectRestaurant,
        addParticipant,
        removeParticipant,
        confirmRemoveParticipant,
        updateParticipantName,
        selectParticipant,
        updatePlateCount,
        
        // Display functions
        displayRestaurants,
        displayPlates,
        updateParticipantsList,
        updateSelectedParticipantDisplay,
        
        // Summary functions
        generateSummaryTable,
        generateSummaryTotals,
        generatePlateBreakdownTable,
        showSummary,
        
        // Utility functions
        updateTotals,
        switchToState,
        resetAll,
        saveSession,
        loadRestaurants,
        initializeCalculator,
        selectParticipantAndScroll,
        setupScrollListener,
        
        // State variables (for testing)
        getCurrentRestaurant: () => currentRestaurant,
        getParticipants: () => participants,
        getPlateSelections: () => plateSelections,
        getCurrentParticipantIndex: () => currentParticipantIndex,
        getCurrentState: () => currentState,
        
        // State setters (for testing)
        setCurrentRestaurant: (restaurant) => { currentRestaurant = restaurant; },
        setParticipants: (p) => { participants = p; },
        setPlateSelections: (ps) => { plateSelections = ps; },
        setCurrentParticipantIndex: (index) => { currentParticipantIndex = index; },
        setCurrentState: (state) => { currentState = state; },
        
        // Constants
        AppState
    };
}
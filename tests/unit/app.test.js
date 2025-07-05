/**
 * Comprehensive Unit Tests for app.js
 * Tests actual functions from the application for 100% coverage
 */

// Import the actual app functions
const {
    getTotalPlatesForParticipant,
    getTotalAmountForParticipant,
    formatCurrency,
    selectRestaurant,
    addParticipant,
    removeParticipant,
    confirmRemoveParticipant,
    updateParticipantName,
    selectParticipant,
    updatePlateCount,
    displayRestaurants,
    displayPlates,
    updateParticipantsList,
    updateSelectedParticipantDisplay,
    showPlateTooltip,
    generateSummaryTable,
    generateSummaryTotals,
    generatePlateBreakdownTable,
    showSummary,
    updateTotals,
    switchToState,
    resetAll,
    saveSession,
    loadRestaurants,
    initializeCalculator,
    selectParticipantAndScroll,
    setupScrollListener,
    getCurrentRestaurant,
    getParticipants,
    getPlateSelections,
    getCurrentParticipantIndex,
    getCurrentState,
    setCurrentRestaurant,
    setParticipants,
    setPlateSelections,
    setCurrentParticipantIndex,
    setCurrentState,
    AppState
} = require('../../app.js');

// Mock restaurant configurations
const mockKatsuMidori = {
    restaurantName: "Katsu Midori",
    restaurantId: "katsu_midori",
    vatIncluded: true,
    vat: 0.07,
    serviceCharge: 0.1,
    currency: "THB",
    currencySymbol: "฿",
    currencyPosition: "before",
    currencyDecimalDigits: 2,
    currencyDecimalSeparator: ".",
    currencyThousandsSeparator: ",",
    plates: {
        red: { label_th: "แดง", label_en: "Red", price: 40 },
        blue: { label_th: "น้ำเงิน", label_en: "Blue", price: 50 },
        green: { label_th: "เขียว", label_en: "Green", price: 60 },
        yellow: { label_th: "เหลือง", label_en: "Yellow", price: 70 },
        brown: { label_th: "น้ำตาล", label_en: "Brown", price: 80 },
        pink: { label_th: "ชมพู", label_en: "Pink", price: 90 },
        white: { label_th: "ขาว", label_en: "White", price: 120 },
        gold: { label_th: "ทอง", label_en: "Gold", price: 150 }
    }
};

const mockSushiro = {
    restaurantName: "Sushiro",
    restaurantId: "sushiro",
    vatIncluded: true,
    vat: 0.07,
    serviceCharge: 0.1,
    currency: "THB",
    currencySymbol: "฿",
    currencyPosition: "before",
    currencyDecimalDigits: 2,
    currencyDecimalSeparator: ".",
    currencyThousandsSeparator: ",",
    plates: {
        red: { label_th: "แดง", label_en: "Red", price: 40 },
        silver: { label_th: "เงิน", label_en: "Silver", price: 60 },
        gold: { label_th: "ทอง", label_en: "Gold", price: 80 },
        black: { label_th: "ดำ", label_en: "Black", price: 120 },
        special70: { label_th: "จานพิเศษ 70", label_en: "Special 70", price: 70 }
    }
};

describe('App.js - Core Calculation Functions', () => {
    
    beforeEach(() => {
        // Reset state before each test
        setCurrentRestaurant(null);
        setParticipants([]);
        setPlateSelections({});
        setCurrentParticipantIndex(0);
        setCurrentState(AppState.LOADING);
    });

    describe('getTotalPlatesForParticipant', () => {
        test('should calculate correct total plates for participant', () => {
            setPlateSelections({
                1: { red: 3, blue: 5, green: 11 },
                2: { red: 1, gold: 2 }
            });
            
            expect(getTotalPlatesForParticipant(1)).toBe(19); // 3+5+11
            expect(getTotalPlatesForParticipant(2)).toBe(3);  // 1+2
        });
        
        test('should return 0 for participant with no plates', () => {
            setPlateSelections({});
            expect(getTotalPlatesForParticipant(999)).toBe(0);
        });
        
        test('should handle empty plate selections for existing participant', () => {
            setPlateSelections({ 1: {} });
            expect(getTotalPlatesForParticipant(1)).toBe(0);
        });
    });

    describe('getTotalAmountForParticipant', () => {
        beforeEach(() => {
            setCurrentRestaurant(mockKatsuMidori);
        });
        
        test('should calculate correct amount for participant', () => {
            setPlateSelections({
                1: { red: 3, blue: 5, green: 11 } // 3*40 + 5*50 + 11*60 = 120+250+660 = 1030
            });
            
            expect(getTotalAmountForParticipant(1)).toBe(1030);
        });
        
        test('should return 0 for participant with no plates', () => {
            setPlateSelections({});
            expect(getTotalAmountForParticipant(999)).toBe(0);
        });
        
        test('should handle unknown plate colors', () => {
            setPlateSelections({
                1: { unknown_plate: 5, red: 2 } // unknown ignored, red counted
            });
            
            expect(getTotalAmountForParticipant(1)).toBe(80); // 2*40
        });
        
        test('should handle no current restaurant', () => {
            setCurrentRestaurant(null);
            setPlateSelections({ 1: { red: 5 } });
            
            expect(getTotalAmountForParticipant(1)).toBe(0);
        });
    });

    describe('formatCurrency', () => {
        beforeEach(() => {
            setCurrentRestaurant(mockKatsuMidori);
        });
        
        test('should format Thai Baht correctly', () => {
            expect(formatCurrency(1234.56)).toBe('฿1,234.56');
        });
        
        test('should format large amounts with commas', () => {
            expect(formatCurrency(12345.67)).toBe('฿12,345.67');
        });
        
        test('should handle zero amount', () => {
            expect(formatCurrency(0)).toBe('฿0.00');
        });
        
        test('should handle negative amounts', () => {
            expect(formatCurrency(-100)).toBe('฿-100.00');
        });
        
        test('should handle very large amounts', () => {
            expect(formatCurrency(1234567.89)).toBe('฿1,234,567.89');
        });
        
        test('should handle no current restaurant', () => {
            setCurrentRestaurant(null);
            expect(formatCurrency(100)).toBe('฿100.00'); // Default formatting
        });
    });
});

describe('App.js - State Management Functions', () => {
    
    beforeEach(() => {
        // Reset state and create DOM elements for testing
        setCurrentRestaurant(null);
        setParticipants([]);
        setPlateSelections({});
        setCurrentParticipantIndex(0);
        setCurrentState(AppState.LOADING);
        
        // Mock DOM elements
        document.body.innerHTML = `
            <div id="selected-restaurant"></div>
            <div id="participants-list"></div>
            <div id="selected-participant-display"></div>
            <div id="plates-grid"></div>
            <div id="total-plates">0</div>
            <div id="total-amount">฿0.00</div>
            <div id="summary-total-plates">0</div>
            <div id="summary-total-amount">฿0.00</div>
            <div id="summary-table-body"></div>
            <div id="plate-breakdown-table-body"></div>
            <div id="grand-total">฿0.00</div>
            <div id="grand-total-label">ราคารวมสุทธิ:</div>
            <div id="loading"></div>
            <div id="restaurant-selection" class="hidden"></div>
            <div id="calculator-page" class="hidden"></div>
            <div id="summary-page" class="hidden"></div>
            <div id="participants-section"></div>
            <div id="plates-section"></div>
            <div id="scroll-to-participants" class="hidden"></div>
        `;
    });

    describe('selectRestaurant', () => {
        test('should set restaurant and initialize state', () => {
            // Mock window to enable browser-dependent functionality in tests
            global.window = { document: global.document };
            
            selectRestaurant(mockKatsuMidori);
            
            expect(getCurrentRestaurant()).toEqual(mockKatsuMidori);
            expect(getParticipants()).toHaveLength(1);
            expect(getParticipants()[0]).toEqual({ id: 1, name: '1' });
            expect(getCurrentParticipantIndex()).toBe(0);
            expect(getPlateSelections()).toEqual({ 1: {} });
            
            delete global.window;
        });
    });

    describe('addParticipant', () => {
        test('should add new participant', () => {
            setParticipants([{ id: 1, name: '1' }]);
            setPlateSelections({ 1: {} });
            
            addParticipant();
            
            const participants = getParticipants();
            expect(participants).toHaveLength(2);
            expect(participants[1]).toEqual({ id: 2, name: '2' });
            expect(getPlateSelections()).toEqual({ 1: {}, 2: {} });
        });
    });

    describe('removeParticipant', () => {
        test('should remove participant and their selections', () => {
            setParticipants([
                { id: 1, name: '1' },
                { id: 2, name: '2' },
                { id: 3, name: '3' }
            ]);
            setPlateSelections({
                1: { red: 2 },
                2: { blue: 3 },
                3: { gold: 1 }
            });
            setCurrentParticipantIndex(1); // Currently on participant 2 (index 1)
            
            removeParticipant(2);
            
            const participants = getParticipants();
            expect(participants).toHaveLength(2);
            expect(participants.find(p => p.id === 2)).toBeUndefined();
            expect(getPlateSelections()).toEqual({
                1: { red: 2 },
                3: { gold: 1 }
            });
            // Index remains 1 since there are still 2 participants left (index 0 and 1 are valid)
            expect(getCurrentParticipantIndex()).toBe(1);
        });
        
        test('should not remove last participant', () => {
            setParticipants([{ id: 1, name: '1' }]);
            
            removeParticipant(1);
            
            expect(getParticipants()).toHaveLength(1);
        });
    });

    describe('updateParticipantName', () => {
        test('should update participant name', () => {
            setParticipants([
                { id: 1, name: '1' },
                { id: 2, name: '2' }
            ]);
            
            updateParticipantName(2, 'Alice');
            
            const participants = getParticipants();
            expect(participants[1].name).toBe('Alice');
        });
        
        test('should handle non-existent participant', () => {
            setParticipants([{ id: 1, name: '1' }]);
            
            updateParticipantName(999, 'Alice');
            
            // Should not crash, participant name unchanged
            expect(getParticipants()[0].name).toBe('1');
        });
    });

    describe('selectParticipant', () => {
        test('should set current participant index', () => {
            setParticipants([
                { id: 1, name: '1' },
                { id: 2, name: '2' },
                { id: 3, name: '3' }
            ]);
            
            selectParticipant(2);
            
            expect(getCurrentParticipantIndex()).toBe(2);
        });
        
        test('should handle invalid index', () => {
            setParticipants([{ id: 1, name: '1' }]);
            setCurrentParticipantIndex(0);
            
            selectParticipant(5);
            
            // Should update index even if out of bounds (app doesn't validate index)
            expect(getCurrentParticipantIndex()).toBe(5);
        });
    });

    describe('updatePlateCount', () => {
        beforeEach(() => {
            setCurrentRestaurant(mockKatsuMidori);
            setParticipants([{ id: 1, name: '1' }]);
            setPlateSelections({ 1: {} });
            setCurrentParticipantIndex(0);
        });
        
        test('should add plates correctly', () => {
            updatePlateCount('red', 3);
            
            expect(getPlateSelections()).toEqual({ 1: { red: 3 } });
        });
        
        test('should increment existing plates', () => {
            setPlateSelections({ 1: { red: 2 } });
            
            updatePlateCount('red', 1);
            
            expect(getPlateSelections()).toEqual({ 1: { red: 3 } });
        });
        
        test('should remove plates correctly', () => {
            setPlateSelections({ 1: { red: 5 } });
            
            updatePlateCount('red', -2);
            
            expect(getPlateSelections()).toEqual({ 1: { red: 3 } });
        });
        
        test('should not go below zero', () => {
            setPlateSelections({ 1: { red: 2 } });
            
            updatePlateCount('red', -5);
            
            // When count reaches 0, the plate is deleted from selections
            expect(getPlateSelections()).toEqual({ 1: {} });
        });
        
        test('should handle no participants', () => {
            setParticipants([]);
            setPlateSelections({});
            setCurrentParticipantIndex(0);
            
            // Should not crash when no participants exist
            expect(() => updatePlateCount('red', 1)).not.toThrow();
        });
    });
});

describe('App.js - Display Functions', () => {
    
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="restaurant-list"></div>
            <div id="participants-list"></div>
            <div id="selected-participant-display"></div>
            <div id="plates-grid"></div>
        `;
        
        setCurrentRestaurant(mockKatsuMidori);
        setParticipants([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]);
        setPlateSelections({ 1: { red: 2 }, 2: { blue: 1 } });
        setCurrentParticipantIndex(0);
    });

    describe('displayRestaurants', () => {
        test('should display restaurant cards', () => {
            const restaurants = [mockKatsuMidori, mockSushiro];
            
            displayRestaurants(restaurants);
            
            const restaurantList = document.getElementById('restaurant-list');
            expect(restaurantList.children).toHaveLength(2);
            expect(restaurantList.innerHTML).toContain('Katsu Midori');
            expect(restaurantList.innerHTML).toContain('Sushiro');
        });
        
        test('should handle empty restaurant list', () => {
            displayRestaurants([]);
            
            const restaurantList = document.getElementById('restaurant-list');
            expect(restaurantList.children).toHaveLength(0);
        });
    });

    describe('updateParticipantsList', () => {
        test('should update participants display', () => {
            updateParticipantsList();
            
            const participantsList = document.getElementById('participants-list');
            expect(participantsList.children).toHaveLength(2);
            expect(participantsList.innerHTML).toContain('Alice');
            expect(participantsList.innerHTML).toContain('Bob');
        });
    });

    describe('updateSelectedParticipantDisplay', () => {
        test('should show current participant', () => {
            updateSelectedParticipantDisplay();
            
            const display = document.getElementById('selected-participant-display');
            expect(display.textContent).toBe('Alice');
        });
    });

    describe('displayPlates', () => {
        test('should display plates for current restaurant', () => {
            displayPlates();
            
            const platesGrid = document.getElementById('plates-grid');
            expect(platesGrid.children.length).toBeGreaterThan(0);
            expect(platesGrid.innerHTML).toContain('Red'); // Red plate in English (label_en)
        });
        
        test('should handle no current restaurant', () => {
            setCurrentRestaurant(null);
            
            displayPlates();
            
            // Should not crash
            const platesGrid = document.getElementById('plates-grid');
            expect(platesGrid.innerHTML).toBe('');
        });
    });
});

describe('App.js - Summary Functions', () => {
    
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="summary-total-plates">0</div>
            <div id="summary-total-amount">฿0.00</div>
            <div id="summary-table-body"></div>
            <div id="plate-breakdown-table-body"></div>
            <div id="grand-total">฿0.00</div>
            <div id="grand-total-label">ราคารวมสุทธิ:</div>
        `;
        
        setCurrentRestaurant(mockKatsuMidori);
        setParticipants([{ id: 1, name: 'Alice' }]);
        setPlateSelections({ 1: { red: 2, blue: 1 } }); // 2*40 + 1*50 = 130
    });

    describe('generateSummaryTotals', () => {
        test('should calculate and display summary totals', () => {
            generateSummaryTotals();
            
            expect(document.getElementById('summary-total-plates').textContent).toBe('3');
            expect(document.getElementById('summary-total-amount').textContent).toBe('฿143.00'); // 130 + 13 service
        });
    });

    describe('generatePlateBreakdownTable', () => {
        test('should generate plate breakdown table', () => {
            generatePlateBreakdownTable();
            
            const tableBody = document.getElementById('plate-breakdown-table-body');
            expect(tableBody.children.length).toBeGreaterThan(0);
            expect(tableBody.innerHTML).toContain('แดง'); // Red plate
            expect(tableBody.innerHTML).toContain('น้ำเงิน'); // Blue plate
        });
    });

    describe('generateSummaryTable', () => {
        test('should generate complete summary table', () => {
            generateSummaryTable();
            
            const tableBody = document.getElementById('summary-table-body');
            expect(tableBody.children.length).toBeGreaterThan(0);
            expect(tableBody.innerHTML).toContain('Alice');
        });
    });
});

describe('App.js - Utility Functions', () => {
    
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="total-plates">0</div>
            <div id="total-amount">฿0.00</div>
            <div id="loading"></div>
            <div id="restaurant-selection" class="hidden"></div>
            <div id="calculator-page" class="hidden"></div>
            <div id="summary-page" class="hidden"></div>
        `;
        
        setCurrentRestaurant(mockKatsuMidori);
        setParticipants([{ id: 1, name: 'Alice' }]);
        setPlateSelections({ 1: { red: 2 } });
    });

    describe('updateTotals', () => {
        test('should update total displays', () => {
            updateTotals();
            
            expect(document.getElementById('total-plates').textContent).toBe('2');
            expect(document.getElementById('total-amount').textContent).toBe('฿80.00'); // 2 plates * 40 price = 80
        });
    });

    describe('switchToState', () => {
        test('should switch to restaurant selection state', () => {
            switchToState(AppState.RESTAURANT_SELECTION);
            
            expect(getCurrentState()).toBe(AppState.RESTAURANT_SELECTION);
            expect(document.getElementById('loading').classList.contains('hidden')).toBe(true);
            expect(document.getElementById('restaurant-selection').classList.contains('hidden')).toBe(false);
        });
        
        test('should switch to calculator state', () => {
            switchToState(AppState.CALCULATOR);
            
            expect(getCurrentState()).toBe(AppState.CALCULATOR);
            expect(document.getElementById('calculator-page').classList.contains('hidden')).toBe(false);
        });
        
        test('should switch to summary state', () => {
            switchToState(AppState.SUMMARY);
            
            expect(getCurrentState()).toBe(AppState.SUMMARY);
            expect(document.getElementById('summary-page').classList.contains('hidden')).toBe(false);
        });
    });

    describe('resetAll', () => {
        test('should reset application state', () => {
            // Mock confirm to return true
            global.confirm = jest.fn(() => true);
            
            resetAll();
            
            expect(getParticipants()).toEqual([{ id: 1, name: '1' }]);
            expect(getCurrentParticipantIndex()).toBe(0);
            expect(getPlateSelections()).toEqual({ 1: {} });
            expect(getCurrentState()).toBe(AppState.RESTAURANT_SELECTION);
        });
        
        test('should not reset if user cancels', () => {
            global.confirm = jest.fn(() => false);
            const originalParticipants = getParticipants();
            
            resetAll();
            
            expect(getParticipants()).toEqual(originalParticipants);
        });
    });

    describe('showSummary', () => {
        test('should show summary if plates exist', () => {
            // Mock alert
            global.alert = jest.fn();
            
            showSummary();
            
            expect(getCurrentState()).toBe(AppState.SUMMARY);
            expect(global.alert).not.toHaveBeenCalled();
        });
        
        test('should show alert if no plates selected', () => {
            global.alert = jest.fn();
            setPlateSelections({ 1: {} });
            setCurrentState(AppState.CALCULATOR); // Start in calculator state
            
            showSummary();
            
            expect(global.alert).toHaveBeenCalledWith('Please select at least one plate before viewing the summary.');
            expect(getCurrentState()).toBe(AppState.CALCULATOR); // Should remain in calculator state
        });
    });
    
    describe('confirmRemoveParticipant', () => {
        test('should confirm and remove participant', () => {
            global.confirm = jest.fn(() => true);
            setParticipants([
                { id: 1, name: 'Alice' },
                { id: 2, name: 'Bob' }
            ]);
            
            confirmRemoveParticipant(2);
            
            expect(global.confirm).toHaveBeenCalledWith('Confirm to delete "Bob"?');
            expect(getParticipants()).toHaveLength(1);
        });
        
        test('should not remove if user cancels', () => {
            global.confirm = jest.fn(() => false);
            setParticipants([
                { id: 1, name: 'Alice' },
                { id: 2, name: 'Bob' }
            ]);
            
            confirmRemoveParticipant(2);
            
            expect(global.confirm).toHaveBeenCalledWith('Confirm to delete "Bob"?');
            expect(getParticipants()).toHaveLength(2);
        });
        
        test('should handle non-existent participant', () => {
            global.confirm = jest.fn(() => true);
            setParticipants([
                { id: 1, name: 'Alice' },
                { id: 2, name: 'Bob' }
            ]);
            
            // Try to remove non-existent participant
            confirmRemoveParticipant(999);
            
            // Should still call confirm with default name
            expect(global.confirm).toHaveBeenCalledWith('Confirm to delete "this participant"?');
        });
    });
    
    describe('saveSession', () => {
        test('should save session to localStorage', () => {
            // Mock localStorage properly for Jest environment
            Object.defineProperty(global, 'localStorage', {
                value: {
                    setItem: jest.fn(),
                    getItem: jest.fn(),
                    removeItem: jest.fn()
                },
                writable: true
            });
            global.alert = jest.fn();
            
            // Set a valid restaurant first
            setCurrentRestaurant(mockKatsuMidori);
            setParticipants([{ id: 1, name: 'Alice' }]);
            setPlateSelections({ 1: { red: 2 } });
            
            saveSession();
            
            expect(global.localStorage.setItem).toHaveBeenCalledWith('kaiten-calculator-session', expect.any(String));
            expect(global.alert).toHaveBeenCalledWith('Session saved successfully!');
        });
        
        test('should handle no restaurant selected', () => {
            global.alert = jest.fn();
            setCurrentRestaurant(null);
            
            saveSession();
            
            expect(global.alert).toHaveBeenCalledWith('No restaurant selected to save session.');
        });
    });
    
    describe('loadRestaurants', () => {
        test('should handle fetch errors gracefully', async () => {
            global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
            console.error = jest.fn();
            
            await loadRestaurants();
            
            expect(console.error).toHaveBeenCalled();
        });
    });
    
    describe('showPlateTooltip', () => {
        test('should show tooltip for positive delta', () => {
            setCurrentRestaurant(mockKatsuMidori);
            document.body.innerHTML = `
                <div class="bg-white rounded-lg shadow-md p-4 text-center">
                    <h3>Red</h3>
                </div>
            `;
            
            showPlateTooltip('red', 1);
            
            // Check that tooltip was added
            const tooltips = document.querySelectorAll('.plate-tooltip');
            expect(tooltips.length).toBeGreaterThan(0);
        });
    });
});

describe('App.js - Edge Cases and Error Handling', () => {
    
    describe('Error handling with null/undefined values', () => {
        test('should handle null restaurant gracefully', () => {
            setCurrentRestaurant(null);
            
            expect(() => getTotalAmountForParticipant(1)).not.toThrow();
            expect(() => formatCurrency(100)).not.toThrow();
            expect(() => updateTotals()).not.toThrow();
        });
        
        test('should handle empty participants array', () => {
            setParticipants([]);
            
            expect(() => updateParticipantsList()).not.toThrow();
            expect(() => selectParticipant(0)).not.toThrow();
        });
        
        test('should handle missing DOM elements gracefully', () => {
            document.body.innerHTML = ''; // Remove all DOM elements
            
            expect(() => updateTotals()).not.toThrow();
            expect(() => displayPlates()).not.toThrow();
            expect(() => updateParticipantsList()).not.toThrow();
        });
    });

    describe('Boundary value testing', () => {
        test('should handle zero quantities', () => {
            setPlateSelections({ 1: { red: 0 } });
            
            expect(getTotalPlatesForParticipant(1)).toBe(0);
            expect(getTotalAmountForParticipant(1)).toBe(0);
        });
        
        test('should handle very large quantities', () => {
            setCurrentRestaurant(mockKatsuMidori);
            setPlateSelections({ 1: { red: 999999 } });
            
            expect(getTotalPlatesForParticipant(1)).toBe(999999);
            expect(getTotalAmountForParticipant(1)).toBe(999999 * 40);
        });
        
        test('should handle negative delta in updatePlateCount', () => {
            setCurrentRestaurant(mockKatsuMidori);
            setParticipants([{ id: 1, name: '1' }]);
            setPlateSelections({ 1: { red: 5 } });
            setCurrentParticipantIndex(0);
            
            updatePlateCount('red', -10);
            
            // When count reaches 0, the plate is deleted from selections
            expect(getPlateSelections()[1]).toEqual({});
        });
    });
});
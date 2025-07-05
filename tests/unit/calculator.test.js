/**
 * Unit Tests for Kaiten Share Calculator
 * Tests core calculation functions and business logic
 */

// Mock restaurant configurations for testing
const mockKatsuMidori = {
    restaurantName: "Katsu Midori",
    restaurantId: "katsu_midori",
    vatIncluded: true,
    vat: 0.07,
    serviceCharge: 0.1,
    currency: "THB",
    currencySymbol: "฿",
    plates: {
        red: { label_th: "แดง", price: 40 },
        blue: { label_th: "น้ำเงิน", price: 50 },
        green: { label_th: "เขียว", price: 60 },
        yellow: { label_th: "เหลือง", price: 70 },
        brown: { label_th: "น้ำตาล", price: 80 },
        pink: { label_th: "ชมพู", price: 90 },
        white: { label_th: "ขาว", price: 120 },
        gold: { label_th: "ทอง", price: 150 }
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
    plates: {
        red: { label_th: "แดง", price: 40 },
        silver: { label_th: "เงิน", price: 60 },
        gold: { label_th: "ทอง", price: 80 },
        black: { label_th: "ดำ", price: 120 },
        special70: { label_th: "จานพิเศษ 70", price: 70 }
    }
};

// Test data for Test Case 1: Katsu Midori
const testCase1Data = {
    participants: [
        { id: 1, name: "Person 1" },
        { id: 2, name: "Person 2" },
        { id: 3, name: "Person 3" },
        { id: 4, name: "Person 4" },
        { id: 5, name: "Person 5" }
    ],
    plateSelections: {
        1: { red: 3, blue: 5, green: 11, yellow: 5, brown: 6, pink: 2, white: 5, gold: 1 }
    },
    expectedResults: {
        totalPlates: 38,
        subtotal: 2790,
        serviceCharge: 279,
        totalBeforeVAT: 3069,
        vatAmount: 200.77,
        netAmount: 2868.23
    }
};

// Test data for Test Case 2: Sushiro
const testCase2Data = {
    participants: [
        { id: 1, name: "Person 1" }
    ],
    plateSelections: {
        1: { red: 5, silver: 3, gold: 11, black: 1, special70: 3 }
    },
    expectedResults: {
        totalPlates: 23,
        subtotal: 1590, // 5*40 + 3*60 + 11*80 + 1*120 + 3*70 = 200+180+880+120+210 = 1590
        serviceCharge: 159,
        totalBeforeVAT: 1749,
        vatAmount: 114.42, // 1749 - (1749/1.07) = 114.42 (rounded)
        netAmount: 1634.58 // 1749/1.07 = 1634.58 (rounded)
    }
};

/**
 * Calculator Core Functions
 * These functions should be extracted from app.js for testing
 */

// Mock the core calculation functions
function getTotalPlatesForParticipant(participantId, plateSelections) {
    const participantPlates = plateSelections[participantId] || {};
    return Object.values(participantPlates).reduce((sum, count) => sum + count, 0);
}

function getTotalAmountForParticipant(participantId, plateSelections, restaurant) {
    const participantPlates = plateSelections[participantId] || {};
    return Object.entries(participantPlates).reduce((sum, [plateColor, count]) => {
        const platePrice = restaurant.plates[plateColor]?.price || 0;
        return sum + (platePrice * count);
    }, 0);
}

function calculateServiceCharge(amount, rate) {
    return amount * rate;
}

function calculateVATIncluded(totalWithServiceCharge, vatRate) {
    const netAmount = totalWithServiceCharge / (1 + vatRate);
    const vatAmount = totalWithServiceCharge - netAmount;
    return { netAmount, vatAmount };
}

function calculateVATExcluded(subtotal, vatRate) {
    return subtotal * vatRate;
}

function formatCurrency(amount, currency = "THB", symbol = "฿") {
    return symbol + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Test Suite: Core Calculation Functions
 */
describe("Kaiten Share Calculator - Core Functions", () => {
    
    describe("getTotalPlatesForParticipant", () => {
        test("should calculate correct total plates for participant", () => {
            const result = getTotalPlatesForParticipant(1, testCase1Data.plateSelections);
            expect(result).toBe(testCase1Data.expectedResults.totalPlates);
        });
        
        test("should return 0 for participant with no plates", () => {
            const result = getTotalPlatesForParticipant(999, testCase1Data.plateSelections);
            expect(result).toBe(0);
        });
    });

    describe("getTotalAmountForParticipant", () => {
        test("should calculate correct amount for Katsu Midori plates", () => {
            const result = getTotalAmountForParticipant(1, testCase1Data.plateSelections, mockKatsuMidori);
            expect(result).toBe(testCase1Data.expectedResults.subtotal);
        });
        
        test("should calculate correct amount for Sushiro plates", () => {
            const result = getTotalAmountForParticipant(1, testCase2Data.plateSelections, mockSushiro);
            expect(result).toBe(testCase2Data.expectedResults.subtotal);
        });
        
        test("should return 0 for unknown plate types", () => {
            const plateSelections = { 1: { unknown_plate: 5 } };
            const result = getTotalAmountForParticipant(1, plateSelections, mockKatsuMidori);
            expect(result).toBe(0);
        });
    });

    describe("calculateServiceCharge", () => {
        test("should calculate 10% service charge correctly", () => {
            const result = calculateServiceCharge(2790, 0.1);
            expect(result).toBe(279);
        });
        
        test("should handle zero amount", () => {
            const result = calculateServiceCharge(0, 0.1);
            expect(result).toBe(0);
        });
        
        test("should handle zero rate", () => {
            const result = calculateServiceCharge(1000, 0);
            expect(result).toBe(0);
        });
    });

    describe("calculateVATIncluded", () => {
        test("should extract VAT correctly from Katsu Midori total", () => {
            const result = calculateVATIncluded(3069, 0.07);
            expect(Math.round(result.netAmount * 100) / 100).toBe(2868.22); // Rounded
            expect(Math.round(result.vatAmount * 100) / 100).toBe(200.78); // Rounded
        });
        
        test("should extract VAT correctly from Sushiro total", () => {
            const result = calculateVATIncluded(1309, 0.07);
            expect(Math.round(result.netAmount * 100) / 100).toBe(1223.36); // Rounded
            expect(Math.round(result.vatAmount * 100) / 100).toBe(85.64); // Rounded
        });
        
        test("should handle zero VAT rate", () => {
            const result = calculateVATIncluded(1000, 0);
            expect(result.netAmount).toBe(1000);
            expect(result.vatAmount).toBe(0);
        });
    });

    describe("calculateVATExcluded", () => {
        test("should add VAT correctly", () => {
            const result = calculateVATExcluded(1000, 0.07);
            expect(result).toBe(70);
        });
        
        test("should handle zero amounts", () => {
            const result = calculateVATExcluded(0, 0.07);
            expect(result).toBe(0);
        });
    });

    describe("formatCurrency", () => {
        test("should format Thai Baht correctly", () => {
            const result = formatCurrency(2790);
            expect(result).toBe("฿2,790.00");
        });
        
        test("should format large amounts with commas", () => {
            const result = formatCurrency(12345.67);
            expect(result).toBe("฿12,345.67");
        });
        
        test("should handle zero amount", () => {
            const result = formatCurrency(0);
            expect(result).toBe("฿0.00");
        });
    });
});

/**
 * Test Suite: Integration Tests
 */
describe("Kaiten Share Calculator - Integration Tests", () => {
    
    describe("Test Case 1: Katsu Midori", () => {
        let participants, plateSelections, restaurant;
        
        beforeEach(() => {
            participants = testCase1Data.participants;
            plateSelections = testCase1Data.plateSelections;
            restaurant = mockKatsuMidori;
        });
        
        test("should calculate correct total plates", () => {
            const totalPlates = participants.reduce((sum, participant) => 
                sum + getTotalPlatesForParticipant(participant.id, plateSelections), 0);
            expect(totalPlates).toBe(38);
        });
        
        test("should calculate correct subtotal", () => {
            const subtotal = participants.reduce((sum, participant) => 
                sum + getTotalAmountForParticipant(participant.id, plateSelections, restaurant), 0);
            expect(subtotal).toBe(2790);
        });
        
        test("should calculate correct service charge", () => {
            const subtotal = 2790;
            const serviceCharge = calculateServiceCharge(subtotal, restaurant.serviceCharge);
            expect(serviceCharge).toBe(279);
        });
        
        test("should calculate correct VAT extraction", () => {
            const totalWithServiceCharge = 3069;
            const { netAmount, vatAmount } = calculateVATIncluded(totalWithServiceCharge, restaurant.vat);
            
            // Allow for small rounding differences
            expect(Math.abs(netAmount - 2868.23)).toBeLessThan(0.01);
            expect(Math.abs(vatAmount - 200.77)).toBeLessThan(0.01);
        });
    });
    
    describe("Test Case 2: Sushiro", () => {
        let participants, plateSelections, restaurant;
        
        beforeEach(() => {
            participants = testCase2Data.participants;
            plateSelections = testCase2Data.plateSelections;
            restaurant = mockSushiro;
        });
        
        test("should calculate correct total plates", () => {
            const totalPlates = participants.reduce((sum, participant) => 
                sum + getTotalPlatesForParticipant(participant.id, plateSelections), 0);
            expect(totalPlates).toBe(23);
        });
        
        test("should calculate correct subtotal", () => {
            const subtotal = participants.reduce((sum, participant) => 
                sum + getTotalAmountForParticipant(participant.id, plateSelections, restaurant), 0);
            expect(subtotal).toBe(1590);
        });
        
        test("should calculate correct service charge", () => {
            const subtotal = 1590;
            const serviceCharge = calculateServiceCharge(subtotal, restaurant.serviceCharge);
            expect(serviceCharge).toBe(159);
        });
        
        test("should calculate correct VAT extraction", () => {
            const totalWithServiceCharge = 1749; // Updated total: 1590 + 159 = 1749
            const { netAmount, vatAmount } = calculateVATIncluded(totalWithServiceCharge, restaurant.vat);
            
            // Allow for small rounding differences
            expect(Math.abs(netAmount - 1634.58)).toBeLessThan(0.01);
            expect(Math.abs(vatAmount - 114.42)).toBeLessThan(0.01);
        });
    });
});

/**
 * Test Suite: Edge Cases and Error Handling
 */
describe("Kaiten Share Calculator - Edge Cases", () => {
    
    test("should handle empty plate selections", () => {
        const result = getTotalPlatesForParticipant(1, {});
        expect(result).toBe(0);
    });
    
    test("should handle missing restaurant plates", () => {
        const emptyRestaurant = { plates: {} };
        const plateSelections = { 1: { red: 5 } };
        const result = getTotalAmountForParticipant(1, plateSelections, emptyRestaurant);
        expect(result).toBe(0);
    });
    
    test("should handle very large numbers", () => {
        const largeAmount = 999999.99;
        const serviceCharge = calculateServiceCharge(largeAmount, 0.1);
        expect(Math.abs(serviceCharge - 99999.999)).toBeLessThan(0.001); // Allow for floating point precision
    });
    
    test("should handle negative amounts gracefully", () => {
        const result = formatCurrency(-100);
        expect(result).toBe("฿-100.00");
    });
    
    test("should handle division by zero in VAT calculation", () => {
        const result = calculateVATIncluded(0, 0.07);
        expect(result.netAmount).toBe(0);
        expect(result.vatAmount).toBe(0);
    });
});

/**
 * Test Suite: Performance Tests
 */
describe("Kaiten Share Calculator - Performance", () => {
    
    test("should handle large number of plates efficiently", () => {
        const largePlateSelection = {};
        for (let i = 1; i <= 100; i++) {
            largePlateSelection[i] = { red: 100, gold: 50 };
        }
        
        const start = performance.now();
        const totalPlates = getTotalPlatesForParticipant(1, { 1: largePlateSelection[1] });
        const end = performance.now();
        
        expect(totalPlates).toBe(150);
        expect(end - start).toBeLessThan(10); // Should complete in less than 10ms
    });
    
    test("should handle many participants efficiently", () => {
        const manyParticipants = [];
        const plateSelections = {};
        
        for (let i = 1; i <= 50; i++) {
            manyParticipants.push({ id: i, name: `Person ${i}` });
            plateSelections[i] = { red: 2, gold: 1 };
        }
        
        const start = performance.now();
        const totalAmount = manyParticipants.reduce((sum, participant) => 
            sum + getTotalAmountForParticipant(participant.id, plateSelections, mockKatsuMidori), 0);
        const end = performance.now();
        
        expect(totalAmount).toBe(50 * (2 * 40 + 1 * 150)); // 50 * (80 + 150) = 11500
        expect(end - start).toBeLessThan(50); // Should complete in less than 50ms
    });
});

// Export for use in other test files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        mockKatsuMidori,
        mockSushiro,
        testCase1Data,
        testCase2Data,
        getTotalPlatesForParticipant,
        getTotalAmountForParticipant,
        calculateServiceCharge,
        calculateVATIncluded,
        calculateVATExcluded,
        formatCurrency
    };
}
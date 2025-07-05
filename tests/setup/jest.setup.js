/**
 * Jest Setup File
 * Global test setup and utilities
 */

// Mock DOM APIs that might not be available in Node.js
global.performance = {
  now: jest.fn(() => Date.now())
};

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock fetch for API calls
global.fetch = jest.fn();

// Mock window.alert
global.alert = jest.fn();

// Mock window.confirm
global.confirm = jest.fn();

// Custom matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
  
  toBeCloseToPercentage(received, expected, precision = 0.01) {
    const pass = Math.abs(received - expected) <= precision;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be close to ${expected} within ${precision}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be close to ${expected} within ${precision}`,
        pass: false,
      };
    }
  }
});

// Setup DOM environment
document.body.innerHTML = `
  <div id="loading"></div>
  <div id="restaurant-selection" class="hidden">
    <div id="restaurant-list"></div>
  </div>
  <div id="calculator-page" class="hidden">
    <div id="total-plates">0</div>
    <div id="total-amount">฿0.00</div>
    <div id="participants-list"></div>
    <div id="plates-grid"></div>
    <div id="selected-participant-display">-</div>
  </div>
  <div id="summary-page" class="hidden">
    <div id="summary-total-plates">0</div>
    <div id="summary-total-amount">฿0.00</div>
    <table>
      <tbody id="summary-table-body"></tbody>
      <tbody id="plate-breakdown-table-body"></tbody>
    </table>
    <div id="grand-total">฿0.00</div>
    <div id="grand-total-label">ราคารวมสุทธิ:</div>
  </div>
`;

// Global test helpers
global.testHelpers = {
  // Create mock restaurant data
  createMockRestaurant: (overrides = {}) => ({
    restaurantName: "Test Restaurant",
    restaurantId: "test",
    vatIncluded: true,
    vat: 0.07,
    serviceCharge: 0.1,
    currency: "THB",
    currencySymbol: "฿",
    plates: {
      red: { label_th: "แดง", price: 40 },
      blue: { label_th: "น้ำเงิน", price: 50 }
    },
    ...overrides
  }),
  
  // Create mock participants
  createMockParticipants: (count = 1) => {
    const participants = [];
    for (let i = 1; i <= count; i++) {
      participants.push({ id: i, name: `Person ${i}` });
    }
    return participants;
  },
  
  // Create mock plate selections
  createMockPlateSelections: (participantId, plates) => ({
    [participantId]: plates
  }),
  
  // Wait for DOM updates
  waitForDOM: () => new Promise(resolve => setTimeout(resolve, 0)),
  
  // Format currency for comparison
  formatTestCurrency: (amount) => `฿${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
};

// Console setup for tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is deprecated')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
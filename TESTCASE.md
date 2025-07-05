# Test Cases for Kaiten Share Calculator

## Overview
This document outlines comprehensive test cases for the Kaiten Share Calculator application, covering both unit tests and UI tests for different restaurant configurations and VAT calculations.

## Test Case 1: Katsu Midori Restaurant (VAT Included)

### Test Configuration
- **Restaurant**: Katsu Midori
- **VAT Configuration**: `vatIncluded: true`, `vat: 0.07` (7%), `serviceCharge: 0.1` (10%)
- **Participants**: 5 people
- **Plates Ordered**:
  - Red (฿40): 3 plates
  - Blue (฿50): 5 plates  
  - Green (฿60): 11 plates
  - Yellow (฿70): 5 plates
  - Brown (฿80): 6 plates
  - Pink (฿90): 2 plates
  - White (฿120): 5 plates
  - Gold (฿150): 1 plate

### Expected Results
- **Total Plates**: 38 plates
- **Subtotal (รวม VAT)**: ฿2,790
- **Service Charge (10%)**: ฿279
- **Total Before VAT Deduction**: ฿3,069
- **VAT Deducted**: ฿200.77
- **Net Amount (After VAT Deduction)**: ฿2,868.23

### Calculation Breakdown
```
Plate costs calculation:
- Red: 3 × ฿40 = ฿120
- Blue: 5 × ฿50 = ฿250
- Green: 11 × ฿60 = ฿660
- Yellow: 5 × ฿70 = ฿350
- Brown: 6 × ฿80 = ฿480
- Pink: 2 × ฿90 = ฿180
- White: 5 × ฿120 = ฿600
- Gold: 1 × ฿150 = ฿150
Total plates: ฿2,790

Service charge: ฿2,790 × 10% = ฿279
Total before VAT deduction: ฿2,790 + ฿279 = ฿3,069

VAT extraction (since VAT is included):
Net amount: ฿3,069 ÷ 1.07 = ฿2,868.23
VAT amount: ฿3,069 - ฿2,868.23 = ฿200.77
```

## Test Case 2: Sushiro Restaurant (VAT Included)

### Test Configuration
- **Restaurant**: Sushiro
- **VAT Configuration**: `vatIncluded: true`, `vat: 0.07` (7%), `serviceCharge: 0.1` (10%)
- **Participants**: 1 person
- **Plates Ordered**:
  - Red (฿40): 5 plates
  - Silver (฿60): 3 plates
  - Gold (฿80): 11 plates
  - Black (฿120): 1 plate
  - Special70 (฿70): 3 plates

### Expected Results
- **Total Plates**: 23 plates
- **Subtotal (รวม VAT)**: ฿1,590
- **Service Charge (10%)**: ฿159
- **Total Before VAT Deduction**: ฿1,749
- **VAT Deducted**: ฿114.42
- **Net Amount (After VAT Deduction)**: ฿1,634.58

### Calculation Breakdown
```
Plate costs calculation:
- Red: 5 × ฿40 = ฿200
- Silver: 3 × ฿60 = ฿180
- Gold: 11 × ฿80 = ฿880
- Black: 1 × ฿120 = ฿120
- Special70: 3 × ฿70 = ฿210
Total plates: ฿1,590

Service charge: ฿1,590 × 10% = ฿159
Total before VAT deduction: ฿1,590 + ฿159 = ฿1,749

VAT extraction (since VAT is included):
Net amount: ฿1,749 ÷ 1.07 = ฿1,634.58
VAT amount: ฿1,749 - ฿1,634.58 = ฿114.42
```

## Test Case 3: VAT Not Included Scenario

### Test Configuration
- **Restaurant**: Hypothetical restaurant with `vatIncluded: false`
- **VAT Configuration**: `vatIncluded: false`, `vat: 0.07` (7%), `serviceCharge: 0.1` (10%)
- **Participants**: 2 people
- **Plates Ordered**: Simple order for testing VAT addition

### Expected Results
- VAT should be **added** to the final total
- VAT label should show "VAT (7%)" instead of "ถอด VAT"
- Final total = subtotal + service charge + VAT

## Unit Test Functions to Implement

### Core Calculation Functions
1. `getTotalPlatesForParticipant(participantId)`
2. `getTotalAmountForParticipant(participantId)`
3. `calculateServiceCharge(amount, rate)`
4. `calculateVATIncluded(totalAmount, vatRate)`
5. `calculateVATExcluded(subtotal, vatRate)`
6. `formatCurrency(amount)`

### Summary Generation Functions
1. `generateSummaryTotals()`
2. `generatePlateBreakdownTable()`
3. `generateSummaryTable()`

## UI Test Scenarios

### Restaurant Selection Tests
1. **Test**: Click on Katsu Midori restaurant card
2. **Expected**: Navigate to calculator page with correct restaurant data
3. **Verify**: Restaurant name displayed, plate options loaded

### Participant Management Tests
1. **Test**: Add 5 participants
2. **Expected**: 5 participant cards displayed
3. **Test**: Edit participant names
4. **Expected**: Names updated correctly

### Plate Selection Tests
1. **Test**: Select plates according to Test Case 1
2. **Expected**: Plate counts updated in real-time
3. **Verify**: Total plates and amount updated correctly

### Summary Page Tests
1. **Test**: Navigate to summary page
2. **Expected**: All calculations match expected results
3. **Verify**: 
   - Total plates count
   - Subtotal amount
   - Service charge calculation
   - VAT extraction/addition
   - Final total amount

### Cross-Browser Tests
- **Chrome**: Full functionality test
- **Safari**: Mobile responsive test
- **Firefox**: Calculation accuracy test

### Mobile Responsiveness Tests
- **Portrait orientation**: All elements visible and functional
- **Touch interactions**: Plate selection works smoothly
- **Small screens**: Text remains readable

## Error Handling Tests

### Edge Cases
1. **Zero plates selected**: Should show appropriate message
2. **Division by zero**: Service charge and VAT calculations
3. **Invalid numbers**: Input validation
4. **Missing restaurant data**: Graceful error handling

### Performance Tests
1. **Large number of plates**: 100+ plates per person
2. **Many participants**: 20+ people
3. **Rapid clicking**: Plate selection stress test

## Accessibility Tests

### ARIA Labels
1. **Screen reader compatibility**: All sections properly labeled
2. **Keyboard navigation**: Tab order correct
3. **Color contrast**: Text readable in all scenarios

## Integration Tests

### Data Flow Tests
1. **Restaurant selection → Calculator**: Data properly transferred
2. **Calculator → Summary**: All calculations preserved
3. **Back navigation**: State maintained correctly

### Local Storage Tests (if implemented)
1. **Session persistence**: Data saved between page reloads
2. **Data validation**: Corrupted data handled gracefully

## Automated Test Implementation

### Unit Test Framework
- **Framework**: Jest (recommended) or Mocha
- **Coverage target**: 90%+ for calculation functions
- **Mock data**: Restaurant configurations for testing

### UI Test Framework
- **Framework**: Cypress or Playwright
- **Browser coverage**: Chrome, Safari, Firefox
- **Mobile testing**: Device emulation

### CI/CD Integration
- **GitHub Actions**: Run tests on every commit
- **Test reports**: Generate coverage reports
- **Deployment gates**: Tests must pass before deployment

## Test Data Files

### Mock Restaurant Data
```javascript
const mockKatsuMidori = {
  restaurantName: "Katsu Midori",
  vatIncluded: true,
  vat: 0.07,
  serviceCharge: 0.1,
  plates: {
    red: { price: 40 },
    blue: { price: 50 },
    // ... etc
  }
};
```

### Test Scenarios Data
```javascript
const testCase1 = {
  restaurant: "katsu_midori",
  participants: 5,
  plateSelections: {
    red: 3,
    blue: 5,
    green: 11,
    yellow: 5,
    brown: 6,
    pink: 2,
    white: 5,
    gold: 1
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
```

## Success Criteria

### Unit Tests
- ✅ All calculation functions return expected results
- ✅ VAT calculations accurate to 2 decimal places
- ✅ Edge cases handled properly

### UI Tests
- ✅ User can complete full workflow without errors
- ✅ All test cases produce expected results
- ✅ Mobile and desktop experiences consistent

### Performance
- ✅ Page loads under 3 seconds
- ✅ Calculations complete under 100ms
- ✅ No memory leaks during extended use
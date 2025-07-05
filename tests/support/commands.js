/**
 * Cypress Support Commands
 * Custom commands for Kaiten Share Calculator testing
 */

// Import Cypress commands
import 'cypress-real-events/support';

// Custom command to select restaurant and verify navigation
Cypress.Commands.add('selectRestaurant', (restaurantId) => {
  cy.get(`[data-restaurant="${restaurantId}"]`, { timeout: 10000 })
    .should('be.visible')
    .click();
  
  cy.get('#calculator-page').should('be.visible');
  cy.get('#selected-restaurant').should('not.be.empty');
});

// Custom command to add multiple participants
Cypress.Commands.add('addParticipants', (totalCount) => {
  // Start from 2 since we already have participant 1
  for (let i = 2; i <= totalCount; i++) {
    cy.get('#add-participant').click();
    cy.get(`[data-participant="${i}"]`).should('be.visible');
  }
});

// Custom command to select participant
Cypress.Commands.add('selectParticipant', (participantId) => {
  cy.get(`[data-participant="${participantId}"]`).click();
  cy.get('#selected-participant-display').should('contain', participantId.toString());
});

// Custom command to add plates for current participant
Cypress.Commands.add('addPlates', (plateSelections) => {
  Object.entries(plateSelections).forEach(([plateColor, count]) => {
    for (let i = 0; i < count; i++) {
      cy.get(`[data-plate="${plateColor}"]`).click();
      
      // Wait a bit to ensure the click is registered
      cy.wait(100);
    }
  });
});

// Custom command to verify totals
Cypress.Commands.add('verifyTotals', (expectedTotals) => {
  if (expectedTotals.totalPlates !== undefined) {
    cy.get('#total-plates').should('contain', expectedTotals.totalPlates.toString());
  }
  
  if (expectedTotals.totalAmount !== undefined) {
    cy.get('#total-amount').should('contain', expectedTotals.totalAmount);
  }
});

// Custom command to navigate to summary and verify
Cypress.Commands.add('goToSummary', () => {
  cy.get('#show-summary').click();
  cy.get('#summary-page').should('be.visible');
});

// Custom command to verify summary calculations
Cypress.Commands.add('verifySummaryCalculations', (expectedResults) => {
  // Verify summary totals
  if (expectedResults.totalPlates) {
    cy.get('#summary-total-plates').should('contain', expectedResults.totalPlates.toString());
  }
  
  if (expectedResults.totalAmount) {
    cy.get('#summary-total-amount').should('contain', expectedResults.totalAmount);
  }
  
  // Verify grand total
  if (expectedResults.grandTotal) {
    cy.get('#grand-total').should('contain', expectedResults.grandTotal);
  }
});

// Custom command to verify plate breakdown table
Cypress.Commands.add('verifyPlateBreakdown', (expectedPlates) => {
  cy.get('#plate-breakdown-table-body').within(() => {
    Object.entries(expectedPlates).forEach(([plateColor, data]) => {
      cy.contains(data.label).parent().within(() => {
        cy.should('contain', data.count.toString());
        cy.should('contain', data.unitPrice);
        cy.should('contain', data.totalPrice);
      });
    });
  });
});

// Custom command to verify VAT calculations
Cypress.Commands.add('verifyVATCalculations', (expectedVAT) => {
  cy.get('#summary-table-body').within(() => {
    if (expectedVAT.subtotal) {
      cy.contains('ราคารวม VAT').parent().should('contain', expectedVAT.subtotal);
    }
    
    if (expectedVAT.serviceCharge) {
      cy.contains('Service Charge').parent().should('contain', expectedVAT.serviceCharge);
    }
    
    if (expectedVAT.vatAmount) {
      cy.contains('ถอด VAT').parent().should('contain', expectedVAT.vatAmount);
    }
    
    if (expectedVAT.netAmount) {
      cy.contains('ราคาสุทธิ').parent().should('contain', expectedVAT.netAmount);
    }
  });
});

// Custom command to complete test case workflow
Cypress.Commands.add('completeTestCase', (testCaseData) => {
  const { restaurant, participants, plateSelections, expectedResults } = testCaseData;
  
  // Select restaurant
  cy.selectRestaurant(restaurant);
  
  // Add participants if needed
  if (participants > 1) {
    cy.addParticipants(participants);
  }
  
  // Add plates (assuming all plates go to participant 1 for simplicity)
  cy.selectParticipant(1);
  cy.addPlates(plateSelections);
  
  // Verify calculator totals
  cy.verifyTotals({
    totalPlates: expectedResults.totalPlates,
    totalAmount: expectedResults.totalAmount
  });
  
  // Go to summary
  cy.goToSummary();
  
  // Verify summary calculations
  cy.verifySummaryCalculations(expectedResults);
});

// Custom command to test mobile responsiveness
Cypress.Commands.add('testMobileView', () => {
  cy.viewport('iphone-x');
  
  // Verify key elements are still accessible
  cy.get('#restaurant-list').should('be.visible');
  cy.get('[data-restaurant]').first().should('be.visible');
  
  // Test touch interactions
  cy.get('[data-restaurant]').first().realClick();
  cy.get('#calculator-page').should('be.visible');
  
  // Verify mobile-specific elements
  cy.get('#add-participant').should('have.css', 'min-height');
  cy.get('[data-plate]').first().should('have.css', 'min-height');
});

// Custom command to test keyboard navigation
Cypress.Commands.add('testKeyboardNavigation', () => {
  // Tab through elements
  cy.get('body').tab();
  cy.focused().should('be.visible');
  
  // Test Enter key
  cy.focused().type('{enter}');
});

// Custom command to wait for calculations to complete
Cypress.Commands.add('waitForCalculation', () => {
  cy.wait(500); // Wait for any debounced calculations
  cy.get('#total-amount').should('not.contain', 'NaN');
  cy.get('#total-amount').should('not.contain', 'undefined');
});

// Custom command to clear all plates
Cypress.Commands.add('clearAllPlates', () => {
  cy.get('#reset-all').click();
  cy.get('#total-plates').should('contain', '0');
  cy.get('#total-amount').should('contain', '฿0.00');
});

// Custom command to validate currency format
Cypress.Commands.add('validateCurrencyFormat', (selector) => {
  cy.get(selector).should('match', /฿[\d,]+\.\d{2}/);
});

// Custom command to test performance
Cypress.Commands.add('testPerformance', (actionCallback) => {
  const startTime = performance.now();
  
  actionCallback();
  
  cy.then(() => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    expect(duration).to.be.lessThan(1000); // Should complete in under 1 second
  });
});

// Custom command to simulate rapid clicking
Cypress.Commands.add('rapidClick', (selector, times = 10) => {
  for (let i = 0; i < times; i++) {
    cy.get(selector).click();
  }
});

// Custom command to test edge cases
Cypress.Commands.add('testEdgeCases', () => {
  // Test with zero plates
  cy.get('#show-summary').click();
  cy.get('#calculator-page').should('be.visible'); // Should stay on calculator
  
  // Test with very large numbers
  cy.rapidClick('[data-plate="red"]', 100);
  cy.waitForCalculation();
  cy.get('#total-plates').should('contain', '100');
  cy.validateCurrencyFormat('#total-amount');
});

// Add data attributes to elements for testing (if not already present)
Cypress.Commands.add('addTestDataAttributes', () => {
  cy.get('.restaurant-card').each(($el, index) => {
    cy.wrap($el).invoke('attr', 'data-restaurant', `restaurant-${index}`);
  });
  
  cy.get('.plate-button').each(($el, index) => {
    cy.wrap($el).invoke('attr', 'data-plate', `plate-${index}`);
  });
  
  cy.get('.participant-card').each(($el, index) => {
    cy.wrap($el).invoke('attr', 'data-participant', index + 1);
  });
});

// Custom assertions
Cypress.Commands.add('shouldHaveValidCalculation', () => {
  cy.get('#total-amount').should('not.contain', 'NaN');
  cy.get('#total-amount').should('not.contain', 'undefined');
  cy.get('#total-amount').should('match', /฿[\d,]+\.\d{2}/);
});

// Add support for code coverage
import '@cypress/code-coverage/support';
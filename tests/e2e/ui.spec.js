/**
 * End-to-End UI Tests for Kaiten Share Calculator
 * Tests complete user workflows and UI interactions
 */

describe('Kaiten Share Calculator - UI Tests', () => {
  
  beforeEach(() => {
    cy.visit('/'); // Assumes app is running on localhost
    cy.wait(2000); // Wait for loading to complete
  });

  describe('Restaurant Selection', () => {
    
    it('should display all restaurants on load', () => {
      cy.get('#restaurant-list').should('be.visible');
      cy.get('[data-restaurant="katsu_midori"]').should('be.visible');
      cy.get('[data-restaurant="sushiro"]').should('be.visible');
      cy.get('[data-restaurant="yijia_suki_mala"]').should('be.visible');
    });
    
    it('should navigate to calculator when restaurant is selected', () => {
      cy.get('[data-restaurant="katsu_midori"]').click();
      cy.get('#calculator-page').should('be.visible');
      cy.get('#selected-restaurant').should('contain', 'Katsu Midori');
    });
    
    it('should display correct plate options for Katsu Midori', () => {
      cy.get('[data-restaurant="katsu_midori"]').click();
      
      // Check that plate options are loaded
      cy.get('#plates-grid').should('be.visible');
      cy.get('[data-plate="red"]').should('be.visible');
      cy.get('[data-plate="blue"]').should('be.visible');
      cy.get('[data-plate="green"]').should('be.visible');
      cy.get('[data-plate="gold"]').should('be.visible');
    });
  });

  describe('Test Case 1: Katsu Midori Complete Workflow', () => {
    
    beforeEach(() => {
      // Setup: Select Katsu Midori restaurant
      cy.get('[data-restaurant="katsu_midori"]').click();
      cy.get('#calculator-page').should('be.visible');
    });
    
    it('should complete Test Case 1 with correct calculations', () => {
      // Step 1: Add 4 more participants (already have 1 by default)
      for (let i = 2; i <= 5; i++) {
        cy.get('#add-participant').click();
        cy.get(`[data-participant="${i}"]`).should('be.visible');
      }
      
      // Step 2: Select plates for participant 1 according to test case
      cy.get('[data-participant="1"]').click();
      
      // Add plates: red 3, blue 5, green 11, yellow 5, brown 6, pink 2, white 5, gold 1
      const plateSelections = {
        red: 3,
        blue: 5,
        green: 11,
        yellow: 5,
        brown: 6,
        pink: 2,
        white: 5,
        gold: 1
      };
      
      Object.entries(plateSelections).forEach(([plateColor, count]) => {
        for (let i = 0; i < count; i++) {
          cy.get(`[data-plate="${plateColor}"]`).click();
        }
      });
      
      // Step 3: Verify totals update correctly
      cy.get('#total-plates').should('contain', '38');
      cy.get('#total-amount').should('contain', '฿3,069.00');
      
      // Step 4: Navigate to summary
      cy.get('#show-summary').click();
      cy.get('#summary-page').should('be.visible');
      
      // Step 5: Verify summary calculations
      cy.get('#summary-total-plates').should('contain', '38');
      cy.get('#summary-total-amount').should('contain', '฿3,069.00');
      
      // Verify breakdown table
      cy.get('#plate-breakdown-table-body').within(() => {
        cy.contains('แดง').parent().should('contain', '3').should('contain', '฿120.00');
        cy.contains('น้ำเงิน').parent().should('contain', '5').should('contain', '฿250.00');
        cy.contains('เขียว').parent().should('contain', '11').should('contain', '฿660.00');
        cy.contains('ทอง').parent().should('contain', '1').should('contain', '฿150.00');
      });
      
      // Verify participant summary table
      cy.get('#summary-table-body').within(() => {
        // Check subtotal and service charge rows
        cy.contains('ราคารวม VAT').parent().should('contain', '฿2,790.00');
        cy.contains('Service Charge (10%)').parent().should('contain', '฿279.00');
        cy.contains('รวมก่อนถอด VAT').parent().should('contain', '฿3,069.00');
        cy.contains('ถอด VAT (7%)').parent().should('contain', '฿200.77');
        cy.contains('ราคาสุทธิ (หลังถอด VAT)').parent().should('contain', '฿2,868.23');
      });
      
      // Verify grand total
      cy.get('#grand-total').should('contain', '฿3,069.00');
    });
    
    it('should allow editing participant names', () => {
      // Click on participant card to edit name
      cy.get('[data-participant="1"]').within(() => {
        cy.get('input[type="text"]').clear().type('Alice');
      });
      
      // Navigate to summary to verify name appears
      cy.get('#show-summary').click();
      cy.get('#summary-table-body').should('contain', 'Alice');
    });
    
    it('should update totals in real-time', () => {
      // Start with 0 plates
      cy.get('#total-plates').should('contain', '0');
      cy.get('#total-amount').should('contain', '฿0.00');
      
      // Add one red plate
      cy.get('[data-plate="red"]').click();
      cy.get('#total-plates').should('contain', '1');
      cy.get('#total-amount').should('contain', '฿44.00'); // 40 + 4 service charge
      
      // Add one gold plate
      cy.get('[data-plate="gold"]').click();
      cy.get('#total-plates').should('contain', '2');
      cy.get('#total-amount').should('contain', '฿209.00'); // (40+150) + 19 service charge
    });
  });

  describe('Test Case 2: Sushiro Complete Workflow', () => {
    
    beforeEach(() => {
      // Setup: Select Sushiro restaurant
      cy.get('[data-restaurant="sushiro"]').click();
      cy.get('#calculator-page').should('be.visible');
    });
    
    it('should complete Test Case 2 with correct calculations', () => {
      // Test Case 2: 1 person, red 5, silver 3, gold 11, black 1, special70 3
      const plateSelections = {
        red: 5,
        silver: 3,
        gold: 11,
        black: 1,
        special70: 3
      };
      
      // Select plates for the default participant
      Object.entries(plateSelections).forEach(([plateColor, count]) => {
        for (let i = 0; i < count; i++) {
          cy.get(`[data-plate="${plateColor}"]`).click();
        }
      });
      
      // Verify totals
      cy.get('#total-plates').should('contain', '23');
      cy.get('#total-amount').should('contain', '฿1,309.00');
      
      // Navigate to summary
      cy.get('#show-summary').click();
      
      // Verify summary calculations
      cy.get('#summary-total-plates').should('contain', '23');
      cy.get('#summary-total-amount').should('contain', '฿1,309.00');
      
      // Verify VAT extraction calculation
      cy.get('#summary-table-body').within(() => {
        cy.contains('ราคารวม VAT').parent().should('contain', '฿1,190.00');
        cy.contains('Service Charge (10%)').parent().should('contain', '฿119.00');
        cy.contains('ถอด VAT (7%)').parent().should('contain', '฿85.75');
      });
    });
  });

  describe('Navigation and Back Buttons', () => {
    
    it('should navigate back to restaurant selection', () => {
      cy.get('[data-restaurant="katsu_midori"]').click();
      cy.get('#back-to-restaurants').click();
      cy.get('#restaurant-selection').should('be.visible');
    });
    
    it('should navigate back from summary to calculator', () => {
      cy.get('[data-restaurant="katsu_midori"]').click();
      cy.get('#show-summary').click();
      cy.get('#back-to-calculator').click();
      cy.get('#calculator-page').should('be.visible');
    });
    
    it('should maintain state when navigating back and forth', () => {
      cy.get('[data-restaurant="katsu_midori"]').click();
      
      // Add some plates
      cy.get('[data-plate="red"]').click();
      cy.get('[data-plate="gold"]').click();
      
      // Go to summary
      cy.get('#show-summary').click();
      cy.get('#summary-total-plates').should('contain', '2');
      
      // Go back to calculator
      cy.get('#back-to-calculator').click();
      cy.get('#total-plates').should('contain', '2'); // State preserved
    });
  });

  describe('Mobile Responsiveness', () => {
    
    beforeEach(() => {
      cy.viewport('iphone-x');
    });
    
    it('should display correctly on mobile devices', () => {
      // Check restaurant selection is responsive
      cy.get('#restaurant-list').should('be.visible');
      cy.get('[data-restaurant="katsu_midori"]').should('be.visible');
      
      // Navigate to calculator
      cy.get('[data-restaurant="katsu_midori"]').click();
      
      // Check calculator layout is responsive
      cy.get('#participants-section').should('be.visible');
      cy.get('#plates-section').should('be.visible');
      cy.get('#show-summary').should('be.visible');
    });
    
    it('should have touch-friendly buttons', () => {
      cy.get('[data-restaurant="katsu_midori"]').click();
      
      // Test plate buttons are clickable on mobile
      cy.get('[data-plate="red"]').should('have.css', 'min-height').and('match', /48px|3rem/);
      cy.get('#add-participant').should('have.css', 'min-height').and('match', /48px|3rem/);
    });
  });

  describe('Error Handling', () => {
    
    it('should show error when trying to view summary with no plates', () => {
      cy.get('[data-restaurant="katsu_midori"]').click();
      cy.get('#show-summary').click();
      
      // Should show alert or stay on calculator page
      cy.get('#calculator-page').should('be.visible');
    });
    
    it('should handle rapid clicking gracefully', () => {
      cy.get('[data-restaurant="katsu_midori"]').click();
      
      // Rapidly click plate buttons
      for (let i = 0; i < 10; i++) {
        cy.get('[data-plate="red"]').click();
      }
      
      cy.get('#total-plates').should('contain', '10');
    });
  });

  describe('Accessibility', () => {
    
    it('should be navigable with keyboard', () => {
      // Tab through restaurant selection
      cy.get('body').tab();
      cy.focused().should('match', '[data-restaurant]');
      
      // Enter to select restaurant
      cy.focused().type('{enter}');
      cy.get('#calculator-page').should('be.visible');
    });
    
    it('should have proper ARIA labels', () => {
      cy.get('#restaurant-list').should('have.attr', 'aria-label');
      cy.get('[data-restaurant="katsu_midori"]').click();
      cy.get('#plates-section').should('have.attr', 'aria-label').or('contain', 'เลือกจาน');
    });
  });

  describe('Performance', () => {
    
    it('should load quickly', () => {
      const start = performance.now();
      cy.visit('/');
      cy.get('#restaurant-list').should('be.visible').then(() => {
        const end = performance.now();
        expect(end - start).to.be.lessThan(3000); // Less than 3 seconds
      });
    });
    
    it('should handle large numbers of plates efficiently', () => {
      cy.get('[data-restaurant="katsu_midori"]').click();
      
      // Add many plates quickly
      for (let i = 0; i < 50; i++) {
        cy.get('[data-plate="red"]').click();
      }
      
      cy.get('#total-plates').should('contain', '50');
      cy.get('#total-amount').should('not.contain', 'NaN');
    });
  });

  describe('Cross-Browser Compatibility', () => {
    
    it('should work in different browsers', () => {
      // This test would be run with different browsers in CI
      cy.get('#restaurant-list').should('be.visible');
      cy.get('[data-restaurant="katsu_midori"]').click();
      cy.get('#calculator-page').should('be.visible');
      
      // Test basic functionality
      cy.get('[data-plate="red"]').click();
      cy.get('#total-plates').should('contain', '1');
    });
  });

  describe('Data Integrity', () => {
    
    it('should maintain calculation accuracy with decimal places', () => {
      cy.get('[data-restaurant="katsu_midori"]').click();
      
      // Add plates to get a total that requires decimal calculations
      cy.get('[data-plate="red"]').click(); // 40
      cy.get('[data-plate="blue"]').click(); // 50
      // Total: 90, Service charge: 9, Total with service: 99
      
      cy.get('#show-summary').click();
      
      // Verify VAT calculation precision
      cy.get('#summary-table-body').within(() => {
        cy.contains('ถอด VAT').parent().should('contain', '฿').and('match', /\d+\.\d{2}/);
      });
    });
    
    it('should handle edge case amounts correctly', () => {
      cy.get('[data-restaurant="katsu_midori"]').click();
      
      // Add just one cheap plate
      cy.get('[data-plate="red"]').click(); // 40 baht
      
      cy.get('#show-summary').click();
      
      // Should not show NaN or undefined
      cy.get('#summary-table-body').should('not.contain', 'NaN');
      cy.get('#summary-table-body').should('not.contain', 'undefined');
      cy.get('#grand-total').should('match', /฿\d+\.\d{2}/);
    });
  });
});

// Custom Cypress commands for common actions
Cypress.Commands.add('selectRestaurant', (restaurantId) => {
  cy.get(`[data-restaurant="${restaurantId}"]`).click();
  cy.get('#calculator-page').should('be.visible');
});

Cypress.Commands.add('addPlates', (plateSelections) => {
  Object.entries(plateSelections).forEach(([plateColor, count]) => {
    for (let i = 0; i < count; i++) {
      cy.get(`[data-plate="${plateColor}"]`).click();
    }
  });
});

Cypress.Commands.add('addParticipants', (count) => {
  for (let i = 2; i <= count; i++) {
    cy.get('#add-participant').click();
    cy.get(`[data-participant="${i}"]`).should('be.visible');
  }
});

Cypress.Commands.add('verifyCalculation', (expectedTotals) => {
  if (expectedTotals.totalPlates) {
    cy.get('#total-plates').should('contain', expectedTotals.totalPlates.toString());
  }
  if (expectedTotals.totalAmount) {
    cy.get('#total-amount').should('contain', expectedTotals.totalAmount);
  }
});
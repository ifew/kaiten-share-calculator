/**
 * Simple UI Test to verify basic functionality
 */

describe('Simple UI Test - Basic Functionality', () => {
  
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.wait(3000); // Wait for app to load
  });

  it('should load the application and display restaurants', () => {
    // Check that restaurants are displayed
    cy.get('#restaurant-list').should('be.visible');
    cy.get('.restaurant-card').should('have.length.greaterThan', 0);
    
    // Check for specific restaurants
    cy.contains('Katsu Midori').should('be.visible');
    cy.contains('Sushiro').should('be.visible');
  });

  it('should navigate to calculator when restaurant is selected', () => {
    // Click on Katsu Midori
    cy.contains('Katsu Midori').click();
    
    // Should navigate to calculator page
    cy.get('#calculator-page').should('be.visible');
    cy.get('#selected-restaurant').should('contain', 'Katsu Midori');
    
    // Should show initial state
    cy.get('#total-plates').should('contain', '0');
    cy.get('#total-amount').should('contain', '฿0.00');
  });

  it('should add plates and update totals', () => {
    // Navigate to Katsu Midori
    cy.contains('Katsu Midori').click();
    
    // Add some plates
    cy.get('[data-plate="red"]').click();
    cy.get('[data-plate="red"]').click();
    cy.get('[data-plate="blue"]').click();
    
    // Check totals update
    cy.get('#total-plates').should('contain', '3');
    // Red: 40*2 + Blue: 50*1 = 130, Service: 13, Total: 143
    cy.get('#total-amount').should('contain', '฿143.00');
  });

  it('should navigate to summary and show calculations', () => {
    // Setup: Add some plates
    cy.contains('Katsu Midori').click();
    cy.get('[data-plate="red"]').click();
    cy.get('[data-plate="gold"]').click();
    
    // Go to summary
    cy.get('#show-summary').click();
    cy.get('#summary-page').should('be.visible');
    
    // Check summary displays
    cy.get('#summary-total-plates').should('contain', '2');
    cy.get('#plate-breakdown-table-body').should('be.visible');
    cy.get('#summary-table-body').should('be.visible');
  });

  it('should handle participant management', () => {
    cy.contains('Katsu Midori').click();
    
    // Add a participant
    cy.get('#add-participant').click();
    cy.get('.participant-card').should('have.length', 2);
    
    // Select second participant
    cy.get('[data-participant="2"]').click();
    cy.get('[data-participant="2"]').should('have.class', 'active');
  });

  it('should calculate VAT correctly for Katsu Midori', () => {
    cy.contains('Katsu Midori').click();
    
    // Add exactly one red plate (฿40)
    cy.get('[data-plate="red"]').click();
    
    // Check total: 40 + 4 (service) = 44
    cy.get('#total-amount').should('contain', '฿44.00');
    
    cy.get('#show-summary').click();
    
    // Verify VAT calculation
    cy.get('#summary-table-body').within(() => {
      cy.contains('ราคารวม VAT').parent().should('contain', '฿40.00');
      cy.contains('Service Charge (10%)').parent().should('contain', '฿4.00');
      cy.contains('รวมก่อนถอด VAT').parent().should('contain', '฿44.00');
      cy.contains('ถอด VAT (7%)').parent().should('contain', '฿2.88'); // 44 - (44/1.07) = 2.88
    });
  });
});
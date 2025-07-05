/**
 * Debug test to check what elements are available
 */

describe('Debug Test - Check Elements', () => {
  
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.wait(3000);
  });

  it('should debug available elements', () => {
    // Check restaurant cards
    cy.get('.restaurant-card').should('exist');
    cy.get('.restaurant-card').then($cards => {
      console.log('Restaurant cards found:', $cards.length);
      $cards.each((index, card) => {
        console.log(`Card ${index}:`, card.textContent, card.getAttribute('data-restaurant'));
      });
    });
    
    // Click first restaurant card
    cy.get('.restaurant-card').first().click();
    cy.wait(2000);
    
    // Check if calculator page is visible
    cy.get('#calculator-page').should('be.visible');
    
    // Check plate elements
    cy.get('[data-plate]').should('exist');
    cy.get('[data-plate]').then($plates => {
      console.log('Plate elements found:', $plates.length);
      $plates.each((index, plate) => {
        console.log(`Plate ${index}:`, plate.getAttribute('data-plate'));
      });
    });
    
    // Check participant elements
    cy.get('[data-participant]').should('exist');
    cy.get('[data-participant]').then($participants => {
      console.log('Participant elements found:', $participants.length);
    });
  });
});
/**
 * Test Case 1: Katsu Midori Restaurant Validation
 * Validates the specific scenario: 5 people, various plates, expected results
 */

describe('Test Case 1: Katsu Midori Restaurant', () => {
  
  const testCase1Data = {
    restaurant: 'katsu_midori',
    participants: 5,
    plateSelections: {
      red: 3,    // ฿40 each = ฿120
      blue: 5,   // ฿50 each = ฿250  
      green: 11, // ฿60 each = ฿660
      yellow: 5, // ฿70 each = ฿350
      brown: 6,  // ฿80 each = ฿480
      pink: 2,   // ฿90 each = ฿180
      white: 5,  // ฿120 each = ฿600
      gold: 1    // ฿150 each = ฿150
    },
    expectedResults: {
      totalPlates: 38,
      subtotal: '฿2,790.00',
      serviceCharge: '฿279.00',
      totalBeforeVAT: '฿3,069.00',
      vatAmount: '฿200.77',
      netAmount: '฿2,868.23',
      finalTotal: '฿3,069.00'
    }
  };

  beforeEach(() => {
    cy.visit('/');
    cy.wait(2000); // Wait for app to load
  });

  it('should complete Test Case 1 with exact expected results', () => {
    // Step 1: Select Katsu Midori restaurant
    cy.get('.restaurant-card').contains('Katsu Midori').click();
    cy.get('#calculator-page').should('be.visible');
    cy.get('#selected-restaurant').should('contain', 'Katsu Midori');

    // Step 2: Add 4 more participants (total 5)
    for (let i = 2; i <= 5; i++) {
      cy.get('#add-participant').click();
      cy.get('.participant-card').should('have.length', i);
    }

    // Step 3: Select first participant and add all plates
    cy.get('.participant-card').first().click();
    cy.get('.participant-card').first().should('have.class', 'active');

    // Add plates according to test case
    Object.entries(testCase1Data.plateSelections).forEach(([plateColor, count]) => {
      cy.log(`Adding ${count} ${plateColor} plates`);
      
      for (let i = 0; i < count; i++) {
        cy.get(`.plate-button[data-plate-color="${plateColor}"]`)
          .or(`.plate-button:contains("${plateColor}")`)
          .click();
        
        // Small delay to ensure each click is processed
        cy.wait(50);
      }
    });

    // Step 4: Verify calculator totals
    cy.get('#total-plates', { timeout: 5000 }).should('contain', '38');
    cy.get('#total-amount').should('contain', '฿3,069.00');

    // Step 5: Navigate to summary
    cy.get('#show-summary').click();
    cy.get('#summary-page').should('be.visible');

    // Step 6: Verify summary totals
    cy.get('#summary-total-plates').should('contain', '38');
    cy.get('#summary-total-amount').should('contain', '฿3,069.00');

    // Step 7: Verify plate breakdown table
    cy.get('#plate-breakdown-table-body').within(() => {
      // Verify each plate type and quantity
      cy.contains('แดง').parent().should('contain', '3').should('contain', '฿40.00').should('contain', '฿120.00');
      cy.contains('น้ำเงิน').parent().should('contain', '5').should('contain', '฿50.00').should('contain', '฿250.00');
      cy.contains('เขียว').parent().should('contain', '11').should('contain', '฿60.00').should('contain', '฿660.00');
      cy.contains('เหลือง').parent().should('contain', '5').should('contain', '฿70.00').should('contain', '฿350.00');
      cy.contains('น้ำตาล').parent().should('contain', '6').should('contain', '฿80.00').should('contain', '฿480.00');
      cy.contains('ชมพู').parent().should('contain', '2').should('contain', '฿90.00').should('contain', '฿180.00');
      cy.contains('ขาว').parent().should('contain', '5').should('contain', '฿120.00').should('contain', '฿600.00');
      cy.contains('ทอง').parent().should('contain', '1').should('contain', '฿150.00').should('contain', '฿150.00');
      
      // Verify total row
      cy.contains('รวม').parent().should('contain', '38').should('contain', '฿2,790.00');
    });

    // Step 8: Verify participant summary table and VAT calculations
    cy.get('#summary-table-body').within(() => {
      // Verify subtotal (VAT included prices)
      cy.contains('ราคารวม VAT').parent().should('contain', '฿2,790.00');
      
      // Verify service charge (10% of subtotal)
      cy.contains('Service Charge (10%)').parent().should('contain', '฿279.00');
      
      // Verify total before VAT deduction
      cy.contains('รวมก่อนถอด VAT').parent().should('contain', '฿3,069.00');
      
      // Verify VAT deduction amount
      cy.contains('ถอด VAT (7%)').parent().should('contain', '฿200.77');
      
      // Verify net amount after VAT deduction
      cy.contains('ราคาสุทธิ (หลังถอด VAT)').parent().should('contain', '฿2,868.23');
    });

    // Step 9: Verify grand total
    cy.get('#grand-total').should('contain', '฿3,069.00');

    // Step 10: Verify participant individual calculations (assuming equal split)
    cy.get('#summary-table-body').within(() => {
      // Each participant should pay 1/5 of the total = ฿613.80
      cy.get('tr').not('.bg-gray-50').each(($row) => {
        cy.wrap($row).within(() => {
          cy.get('td').last().should('contain', '฿613.80');
        });
      });
    });
  });

  it('should maintain calculation accuracy with edge cases', () => {
    // Test with exact amounts to verify no rounding errors
    cy.get('.restaurant-card').contains('Katsu Midori').click();
    
    // Add just one of each plate type to test individual calculations
    const singlePlates = {
      red: 1,
      blue: 1,
      green: 1,
      yellow: 1,
      brown: 1,
      pink: 1,
      white: 1,
      gold: 1
    };

    Object.entries(singlePlates).forEach(([plateColor, count]) => {
      cy.get(`.plate-button[data-plate-color="${plateColor}"]`)
        .or(`.plate-button:contains("${plateColor}")`)
        .click();
    });

    // Expected: 40+50+60+70+80+90+120+150 = ฿660
    // Service charge: ฿66
    // Total: ฿726
    // VAT deduction: ฿726 ÷ 1.07 = ฿678.50, VAT = ฿47.50

    cy.get('#show-summary').click();
    
    cy.get('#summary-table-body').within(() => {
      cy.contains('ราคารวม VAT').parent().should('contain', '฿660.00');
      cy.contains('Service Charge (10%)').parent().should('contain', '฿66.00');
      cy.contains('รวมก่อนถอด VAT').parent().should('contain', '฿726.00');
    });
  });

  it('should handle participant name editing correctly', () => {
    cy.get('.restaurant-card').contains('Katsu Midori').click();
    
    // Add participants and give them names
    const participantNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];
    
    participantNames.forEach((name, index) => {
      if (index > 0) {
        cy.get('#add-participant').click();
      }
      
      cy.get('.participant-card').eq(index).within(() => {
        cy.get('input[type="text"]').clear().type(name);
      });
    });

    // Add some plates
    cy.get('[data-plate="red"]').click();
    
    // Go to summary and verify names appear
    cy.get('#show-summary').click();
    
    participantNames.forEach((name) => {
      cy.get('#summary-table-body').should('contain', name);
    });
  });

  it('should validate all calculation steps manually', () => {
    cy.get('.restaurant-card').contains('Katsu Midori').click();
    
    // Manual calculation verification
    const calculations = [
      { plate: 'red', count: 3, price: 40, total: 120 },
      { plate: 'blue', count: 5, price: 50, total: 250 },
      { plate: 'green', count: 11, price: 60, total: 660 },
      { plate: 'yellow', count: 5, price: 70, total: 350 },
      { plate: 'brown', count: 6, price: 80, total: 480 },
      { plate: 'pink', count: 2, price: 90, total: 180 },
      { plate: 'white', count: 5, price: 120, total: 600 },
      { plate: 'gold', count: 1, price: 150, total: 150 }
    ];

    let runningTotal = 0;
    
    calculations.forEach(({ plate, count, price, total }) => {
      // Add plates one by one and verify running total
      for (let i = 0; i < count; i++) {
        cy.get(`[data-plate="${plate}"]`).click();
        runningTotal += price;
        
        // Calculate expected display total (with service charge)
        const serviceCharge = runningTotal * 0.1;
        const expectedTotal = runningTotal + serviceCharge;
        
        cy.get('#total-amount').should('contain', `฿${expectedTotal.toFixed(2)}`);
      }
    });

    // Final verification
    cy.get('#total-plates').should('contain', '38');
    cy.get('#total-amount').should('contain', '฿3,069.00');
  });
});
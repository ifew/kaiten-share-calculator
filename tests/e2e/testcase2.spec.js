/**
 * Test Case 2: Sushiro Restaurant Validation
 * Validates the specific scenario: 1 person, various plates, expected results
 */

describe('Test Case 2: Sushiro Restaurant', () => {
  
  const testCase2Data = {
    restaurant: 'sushiro',
    participants: 1,
    plateSelections: {
      red: 5,       // ฿40 each = ฿200
      silver: 3,    // ฿60 each = ฿180
      gold: 11,     // ฿80 each = ฿880
      black: 1,     // ฿120 each = ฿120
      special70: 3  // ฿70 each = ฿210
    },
    expectedResults: {
      totalPlates: 23,
      subtotal: '฿1,590.00', // Updated calculation: 200+180+880+120+210 = 1590
      serviceCharge: '฿159.00',
      totalBeforeVAT: '฿1,749.00',
      vatAmount: '฿114.58', // Updated: 1749 - (1749/1.07) = 114.58
      netAmount: '฿1,634.42', // Updated: 1749/1.07 = 1634.42
      finalTotal: '฿1,749.00'
    }
  };

  beforeEach(() => {
    cy.visit('/');
    cy.wait(2000); // Wait for app to load
  });

  it('should complete Test Case 2 with exact expected results', () => {
    // Step 1: Select Sushiro restaurant
    cy.get('.restaurant-card').contains('Sushiro').click();
    cy.get('#calculator-page').should('be.visible');
    cy.get('#selected-restaurant').should('contain', 'Sushiro');

    // Step 2: Verify we have 1 participant by default
    cy.get('.participant-card').should('have.length', 1);
    cy.get('.participant-card').first().should('have.class', 'active');

    // Step 3: Add plates according to test case
    Object.entries(testCase2Data.plateSelections).forEach(([plateColor, count]) => {
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
    cy.get('#total-plates', { timeout: 5000 }).should('contain', '23');
    cy.get('#total-amount').should('contain', testCase2Data.expectedResults.finalTotal);

    // Step 5: Navigate to summary
    cy.get('#show-summary').click();
    cy.get('#summary-page').should('be.visible');

    // Step 6: Verify summary totals
    cy.get('#summary-total-plates').should('contain', '23');
    cy.get('#summary-total-amount').should('contain', testCase2Data.expectedResults.finalTotal);

    // Step 7: Verify plate breakdown table
    cy.get('#plate-breakdown-table-body').within(() => {
      // Verify each plate type and quantity
      cy.contains('แดง').parent().should('contain', '5').should('contain', '฿40.00').should('contain', '฿200.00');
      cy.contains('เงิน').parent().should('contain', '3').should('contain', '฿60.00').should('contain', '฿180.00');
      cy.contains('ทอง').parent().should('contain', '11').should('contain', '฿80.00').should('contain', '฿880.00');
      cy.contains('ดำ').parent().should('contain', '1').should('contain', '฿120.00').should('contain', '฿120.00');
      cy.contains('จานพิเศษ 70').parent().should('contain', '3').should('contain', '฿70.00').should('contain', '฿210.00');
      
      // Verify total row
      cy.contains('รวม').parent().should('contain', '23').should('contain', testCase2Data.expectedResults.subtotal);
    });

    // Step 8: Verify participant summary table and VAT calculations
    cy.get('#summary-table-body').within(() => {
      // Verify subtotal (VAT included prices)
      cy.contains('ราคารวม VAT').parent().should('contain', testCase2Data.expectedResults.subtotal);
      
      // Verify service charge (10% of subtotal)
      cy.contains('Service Charge (10%)').parent().should('contain', testCase2Data.expectedResults.serviceCharge);
      
      // Verify total before VAT deduction
      cy.contains('รวมก่อนถอด VAT').parent().should('contain', testCase2Data.expectedResults.totalBeforeVAT);
      
      // Verify VAT deduction amount (allowing for small rounding differences)
      cy.contains('ถอด VAT (7%)').parent().should('contain', testCase2Data.expectedResults.vatAmount);
      
      // Verify net amount after VAT deduction
      cy.contains('ราคาสุทธิ (หลังถอด VAT)').parent().should('contain', testCase2Data.expectedResults.netAmount);
    });

    // Step 9: Verify grand total
    cy.get('#grand-total').should('contain', testCase2Data.expectedResults.finalTotal);

    // Step 10: Verify single participant gets full amount
    cy.get('#summary-table-body').within(() => {
      cy.get('tr').not('.bg-gray-50').first().within(() => {
        cy.get('td').eq(0).should('contain', '1'); // Default participant name
        cy.get('td').eq(1).should('contain', '23'); // Total plates
        cy.get('td').eq(2).should('contain', testCase2Data.expectedResults.subtotal); // Subtotal
        cy.get('td').eq(3).should('contain', testCase2Data.expectedResults.finalTotal); // Total to pay
      });
    });
  });

  it('should handle special plates correctly', () => {
    cy.get('.restaurant-card').contains('Sushiro').click();
    
    // Test special plates specifically
    cy.get('[data-plate="special70"]').click();
    cy.get('[data-plate="special100"]').click();
    cy.get('[data-plate="special140"]').click();
    
    // Expected: 70+100+140 = ฿310
    // Service charge: ฿31
    // Total: ฿341
    
    cy.get('#total-plates').should('contain', '3');
    cy.get('#total-amount').should('contain', '฿341.00');
    
    cy.get('#show-summary').click();
    
    cy.get('#plate-breakdown-table-body').within(() => {
      cy.contains('จานพิเศษ 70').parent().should('contain', '1').should('contain', '฿70.00');
      cy.contains('จานพิเศษ 100').parent().should('contain', '1').should('contain', '฿100.00');
      cy.contains('จานพิเศษ 140').parent().should('contain', '1').should('contain', '฿140.00');
    });
  });

  it('should calculate VAT deduction accurately', () => {
    cy.get('.restaurant-card').contains('Sushiro').click();
    
    // Simple calculation for verification
    // Add 1 gold plate = ฿80
    // Service charge = ฿8
    // Total = ฿88
    // VAT deduction: ฿88 ÷ 1.07 = ฿82.24, VAT = ฿5.76
    
    cy.get('[data-plate="gold"]').click();
    
    cy.get('#show-summary').click();
    
    cy.get('#summary-table-body').within(() => {
      cy.contains('ราคารวม VAT').parent().should('contain', '฿80.00');
      cy.contains('Service Charge (10%)').parent().should('contain', '฿8.00');
      cy.contains('รวมก่อนถอด VAT').parent().should('contain', '฿88.00');
      
      // VAT calculation: 88 ÷ 1.07 = 82.24, VAT = 5.76
      cy.contains('ถอด VAT (7%)').parent().should('contain', '฿5.76');
      cy.contains('ราคาสุทธิ (หลังถอด VAT)').parent().should('contain', '฿82.24');
    });
    
    cy.get('#grand-total').should('contain', '฿88.00');
  });

  it('should maintain precision with multiple plates', () => {
    cy.get('.restaurant-card').contains('Sushiro').click();
    
    // Add multiple plates with different prices to test rounding
    for (let i = 0; i < 7; i++) {
      cy.get('[data-plate="red"]').click(); // 7 × ฿40 = ฿280
    }
    
    for (let i = 0; i < 3; i++) {
      cy.get('[data-plate="silver"]').click(); // 3 × ฿60 = ฿180
    }
    
    // Total: ฿460
    // Service charge: ฿46
    // Total with service: ฿506
    // VAT deduction: ฿506 ÷ 1.07 = ฿472.90, VAT = ฿33.10
    
    cy.get('#total-plates').should('contain', '10');
    cy.get('#total-amount').should('contain', '฿506.00');
    
    cy.get('#show-summary').click();
    
    cy.get('#summary-table-body').within(() => {
      cy.contains('ราคารวม VAT').parent().should('contain', '฿460.00');
      cy.contains('Service Charge (10%)').parent().should('contain', '฿46.00');
      cy.contains('รวมก่อนถอด VAT').parent().should('contain', '฿506.00');
      
      // Allow for small rounding differences in VAT calculation
      cy.contains('ถอด VAT (7%)').parent().invoke('text').should('match', /฿33\.(09|10|11)/);
      cy.contains('ราคาสุทธิ (หลังถอด VAT)').parent().invoke('text').should('match', /฿472\.(89|90|91)/);
    });
  });

  it('should verify mathematical accuracy of original test case', () => {
    // Manual verification of the original test case calculations
    const plates = [
      { name: 'red', count: 5, price: 40, total: 200 },
      { name: 'silver', count: 3, price: 60, total: 180 },
      { name: 'gold', count: 11, price: 80, total: 880 },
      { name: 'black', count: 1, price: 120, total: 120 },
      { name: 'special70', count: 3, price: 70, total: 210 }
    ];
    
    const subtotal = plates.reduce((sum, plate) => sum + plate.total, 0); // 1590
    const serviceCharge = Math.round(subtotal * 0.1 * 100) / 100; // 159.00
    const totalWithService = subtotal + serviceCharge; // 1749
    
    // VAT calculation (included in prices)
    const netAmount = Math.round((totalWithService / 1.07) * 100) / 100; // 1634.58
    const vatAmount = Math.round((totalWithService - netAmount) * 100) / 100; // 114.42
    
    cy.log(`Calculated values:
      Subtotal: ${subtotal}
      Service Charge: ${serviceCharge}
      Total with Service: ${totalWithService}
      Net Amount: ${netAmount}
      VAT Amount: ${vatAmount}`);
    
    // Test with calculated values
    cy.get('.restaurant-card').contains('Sushiro').click();
    
    plates.forEach(({ name, count }) => {
      for (let i = 0; i < count; i++) {
        cy.get(`[data-plate="${name}"]`).click();
      }
    });
    
    cy.get('#show-summary').click();
    
    // Verify calculations match our manual calculation
    cy.get('#summary-table-body').within(() => {
      cy.contains('ราคารวม VAT').parent().should('contain', `฿${subtotal.toFixed(2)}`);
      cy.contains('Service Charge (10%)').parent().should('contain', `฿${serviceCharge.toFixed(2)}`);
      cy.contains('รวมก่อนถอด VAT').parent().should('contain', `฿${totalWithService.toFixed(2)}`);
    });
  });

  it('should work correctly with participant name changes', () => {
    cy.get('.restaurant-card').contains('Sushiro').click();
    
    // Change participant name
    cy.get('.participant-card').first().within(() => {
      cy.get('input[type="text"]').clear().type('John Doe');
    });
    
    // Add some plates
    cy.get('[data-plate="red"]').click();
    cy.get('[data-plate="gold"]').click();
    
    cy.get('#show-summary').click();
    
    // Verify name appears in summary
    cy.get('#summary-table-body').should('contain', 'John Doe');
    
    // Verify calculations are still correct
    cy.get('#summary-table-body').within(() => {
      cy.get('tr').not('.bg-gray-50').first().within(() => {
        cy.get('td').eq(0).should('contain', 'John Doe');
        cy.get('td').eq(1).should('contain', '2'); // 2 plates
        cy.get('td').eq(2).should('contain', '฿120.00'); // 40+80 = 120
      });
    });
  });
});
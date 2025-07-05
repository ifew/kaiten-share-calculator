/**
 * Manual Test Verification Script
 * Run this in browser console to verify calculations
 */

console.log('=== KAITEN SHARE CALCULATOR TEST VERIFICATION ===');

// Test Case 1: Katsu Midori
console.log('\n=== TEST CASE 1: KATSU MIDORI ===');
const testCase1 = {
    plates: {
        red: { count: 3, price: 40 },
        blue: { count: 5, price: 50 },
        green: { count: 11, price: 60 },
        yellow: { count: 5, price: 70 },
        brown: { count: 6, price: 80 },
        pink: { count: 2, price: 90 },
        white: { count: 5, price: 120 },
        gold: { count: 1, price: 150 }
    }
};

let totalPlates1 = 0;
let subtotal1 = 0;

Object.values(testCase1.plates).forEach(plate => {
    totalPlates1 += plate.count;
    subtotal1 += plate.count * plate.price;
    console.log(`${plate.count} plates × ฿${plate.price} = ฿${plate.count * plate.price}`);
});

const serviceCharge1 = subtotal1 * 0.1;
const totalWithService1 = subtotal1 + serviceCharge1;
const netAmount1 = totalWithService1 / 1.07;
const vatAmount1 = totalWithService1 - netAmount1;

console.log(`Total Plates: ${totalPlates1}`);
console.log(`Subtotal: ฿${subtotal1.toFixed(2)}`);
console.log(`Service Charge (10%): ฿${serviceCharge1.toFixed(2)}`);
console.log(`Total Before VAT Deduction: ฿${totalWithService1.toFixed(2)}`);
console.log(`VAT Amount: ฿${vatAmount1.toFixed(2)}`);
console.log(`Net Amount: ฿${netAmount1.toFixed(2)}`);

// Test Case 2: Sushiro
console.log('\n=== TEST CASE 2: SUSHIRO ===');
const testCase2 = {
    plates: {
        red: { count: 5, price: 40 },
        silver: { count: 3, price: 60 },
        gold: { count: 11, price: 80 },
        black: { count: 1, price: 120 },
        special70: { count: 3, price: 70 }
    }
};

let totalPlates2 = 0;
let subtotal2 = 0;

Object.values(testCase2.plates).forEach(plate => {
    totalPlates2 += plate.count;
    subtotal2 += plate.count * plate.price;
    console.log(`${plate.count} plates × ฿${plate.price} = ฿${plate.count * plate.price}`);
});

const serviceCharge2 = subtotal2 * 0.1;
const totalWithService2 = subtotal2 + serviceCharge2;
const netAmount2 = totalWithService2 / 1.07;
const vatAmount2 = totalWithService2 - netAmount2;

console.log(`Total Plates: ${totalPlates2}`);
console.log(`Subtotal: ฿${subtotal2.toFixed(2)}`);
console.log(`Service Charge (10%): ฿${serviceCharge2.toFixed(2)}`);
console.log(`Total Before VAT Deduction: ฿${totalWithService2.toFixed(2)}`);
console.log(`VAT Amount: ฿${vatAmount2.toFixed(2)}`);
console.log(`Net Amount: ฿${netAmount2.toFixed(2)}`);

// Verification Results
console.log('\n=== VERIFICATION RESULTS ===');
console.log('Test Case 1 Expected vs Actual:');
console.log(`Plates: 38 vs ${totalPlates1} ${totalPlates1 === 38 ? '✅' : '❌'}`);
console.log(`Subtotal: ฿2790 vs ฿${subtotal1} ${subtotal1 === 2790 ? '✅' : '❌'}`);
console.log(`Service: ฿279 vs ฿${serviceCharge1} ${serviceCharge1 === 279 ? '✅' : '❌'}`);
console.log(`Total: ฿3069 vs ฿${totalWithService1} ${totalWithService1 === 3069 ? '✅' : '❌'}`);
console.log(`VAT: ฿200.77 vs ฿${vatAmount1.toFixed(2)} ${Math.abs(vatAmount1 - 200.77) < 0.01 ? '✅' : '❌'}`);

console.log('\nTest Case 2 Expected vs Actual:');
console.log(`Plates: 23 vs ${totalPlates2} ${totalPlates2 === 23 ? '✅' : '❌'}`);
console.log(`Subtotal: ฿1590 vs ฿${subtotal2} ${subtotal2 === 1590 ? '✅' : '❌'}`);
console.log(`Service: ฿159 vs ฿${serviceCharge2} ${serviceCharge2 === 159 ? '✅' : '❌'}`);
console.log(`Total: ฿1749 vs ฿${totalWithService2} ${totalWithService2 === 1749 ? '✅' : '❌'}`);
console.log(`VAT: ฿114.42 vs ฿${vatAmount2.toFixed(2)} ${Math.abs(vatAmount2 - 114.42) < 0.01 ? '✅' : '❌'}`);
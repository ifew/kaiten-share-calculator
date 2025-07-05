/**
 * Cypress Configuration for Kaiten Share Calculator
 */

const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // Base URL for the application
    baseUrl: 'http://localhost:3000',
    
    // Test files location
    specPattern: 'tests/e2e/**/*.spec.js',
    
    // Support file
    supportFile: 'tests/support/commands.js',
    
    // Video recording
    video: true,
    videosFolder: 'tests/videos',
    
    // Screenshots
    screenshotsFolder: 'tests/screenshots',
    
    // Viewport settings
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Test settings
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    
    // Browser settings
    chromeWebSecurity: false,
    
    // Setup and teardown
    setupNodeEvents(on, config) {
      // Task registration for custom commands
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        
        // Calculate expected results for test validation
        calculateExpectedResults(testData) {
          const { plateSelections, restaurant } = testData;
          
          // Calculate subtotal
          let subtotal = 0;
          Object.entries(plateSelections).forEach(([plateColor, count]) => {
            const platePrice = restaurant.plates[plateColor]?.price || 0;
            subtotal += platePrice * count;
          });
          
          // Calculate service charge
          const serviceCharge = subtotal * restaurant.serviceCharge;
          
          // Calculate VAT based on inclusion
          let vatAmount, netAmount, totalAmount;
          if (restaurant.vatIncluded) {
            const totalWithServiceCharge = subtotal + serviceCharge;
            netAmount = totalWithServiceCharge / (1 + restaurant.vat);
            vatAmount = totalWithServiceCharge - netAmount;
            totalAmount = totalWithServiceCharge;
          } else {
            vatAmount = subtotal * restaurant.vat;
            totalAmount = subtotal + serviceCharge + vatAmount;
            netAmount = totalAmount - vatAmount;
          }
          
          return {
            subtotal: Math.round(subtotal * 100) / 100,
            serviceCharge: Math.round(serviceCharge * 100) / 100,
            vatAmount: Math.round(vatAmount * 100) / 100,
            netAmount: Math.round(netAmount * 100) / 100,
            totalAmount: Math.round(totalAmount * 100) / 100,
            totalPlates: Object.values(plateSelections).reduce((sum, count) => sum + count, 0)
          };
        }
      });
      
      // Code coverage setup (if using)
      require('@cypress/code-coverage/task')(on, config);
      
      return config;
    },
  },
  
  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
    },
    specPattern: 'tests/component/**/*.spec.js',
  },
  
  // Environment variables
  env: {
    coverage: true,
    codeCoverage: {
      exclude: 'cypress/**/*.*',
    },
  },
  
  // Retry settings
  retries: {
    runMode: 2,
    openMode: 0,
  },
  
  // Experimental features
  experimentalStudio: true,
});
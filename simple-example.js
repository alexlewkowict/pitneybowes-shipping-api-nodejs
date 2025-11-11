/**
 * Simple working example demonstrating basic API calls
 */

const ShippingApi = require('./dist/PB.ShippingAPI');
const { initializeClient, config } = require('./auth');

/**
 * Validate an address
 */
async function main() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║         Pitney Bowes Shipping API - Simple Example          ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  try {
    // Initialize the API client with authentication
    await initializeClient(ShippingApi);
    
    // Example 1: Validate Address
    console.log('1. Validating Address...\n');
    const api = new ShippingApi.AddressValidationApi();
    const address = new ShippingApi.Address();
    
    address.addressLines = ['1600 Amphitheatre Parkway'];
    address.cityTown = 'Mountain View';
    address.stateProvince = 'CA';
    address.postalCode = '94043';
    address.countryCode = 'US';
    
    const opts = { 'xPBUnifiedErrorStructure': true };
    
    api.verifyAddress(address, opts, (error, data, response) => {
      if (error) {
        console.error('  ✗ Error:', error.message);
      } else {
        console.log('  ✓ Address Validated Successfully!\n');
        console.log('  Input Address:');
        console.log(`    ${address.addressLines.join(', ')}`);
        console.log(`    ${address.cityTown}, ${address.stateProvince} ${address.postalCode}\n`);
        
        console.log('  Validated Address:');
        console.log(`    ${data.addressLines ? data.addressLines.join(', ') : ''}`);
        console.log(`    ${data.cityTown}, ${data.stateProvince} ${data.postalCode}`);
        console.log(`    Status: ${data.status}`);
        
        if (data.status === 'VALIDATED_CHANGED') {
          console.log('\n  📝 Note: Address was validated with corrections');
        }
      }
    });
    
  } catch (error) {
    console.error('\n✗ An error occurred:', error.message);
    process.exit(1);
  }
}

main();


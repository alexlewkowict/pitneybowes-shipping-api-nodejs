/**
 * Complete working example using your Pitney Bowes credentials
 * This demonstrates the full authentication flow and API usage
 */

const ShippingApi = require('./dist/PB.ShippingAPI');
const { initializeClient, config } = require('./auth');

/**
 * Example 1: Validate an address
 */
async function validateAddress() {
  console.log('\n=== Address Validation Example ===\n');
  
  try {
    await initializeClient(ShippingApi);
    
    const api = new ShippingApi.AddressValidationApi();
    const address = new ShippingApi.Address();
    
    // Set address properties
    address.addressLines = ['27 Watervw Dr'];
    address.cityTown = 'Stamford';
    address.stateProvince = 'CT';
    address.postalCode = '06902';
    address.countryCode = 'US';
    
    const opts = {
      'xPBUnifiedErrorStructure': true,
      'minimalAddressValidation': false
    };
    
    return new Promise((resolve, reject) => {
      api.verifyAddress(address, opts, (error, data, response) => {
        if (error) {
          console.error('✗ Error validating address:', error);
          reject(error);
        } else {
          console.log('✓ Address validation successful!');
          console.log('\nValidated Address:');
          console.log(`  ${data.addressLines ? data.addressLines.join(', ') : ''}`);
          console.log(`  ${data.cityTown}, ${data.stateProvince} ${data.postalCode}`);
          console.log(`  Status: ${data.status}`);
          resolve(data);
        }
      });
    });
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

/**
 * Example 2: Get carrier service rules
 */
async function getCarrierRules() {
  console.log('\n=== Carrier Service Rules Example ===\n');
  
  try {
    await initializeClient(ShippingApi);
    
    const api = new ShippingApi.CarrierInfoApi();
    
    const opts = {
      'carrier': 'USPS',
      'originCountryCode': 'US',
      'destinationCountryCode': 'US'
    };
    
    return new Promise((resolve, reject) => {
      api.getCarrierServiceRules('USPS', 'US', 'US', opts, (error, data, response) => {
        if (error) {
          console.error('✗ Error getting carrier rules:', error);
          reject(error);
        } else {
          console.log('✓ Successfully retrieved carrier rules');
          
          // Check if data is an array
          if (Array.isArray(data)) {
            console.log(`  Found ${data.length} service rules`);
            
            // Display first few services
            console.log('\nAvailable Services:');
            data.slice(0, 5).forEach(rule => {
              console.log(`  - ${rule.brandedName} (${rule.serviceId})`);
            });
          } else {
            console.log('  Data received:', typeof data);
          }
          
          resolve(data);
        }
      });
    });
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

/**
 * Example 3: Get supported destination countries
 */
async function getSupportedCountries() {
  console.log('\n=== Supported Destination Countries ===\n');
  
  try {
    await initializeClient(ShippingApi);
    
    const api = new ShippingApi.CarrierInfoApi();
    
    const opts = {
      'carrier': 'USPS',
      'originCountryCode': 'US'
    };
    
    return new Promise((resolve, reject) => {
      api.getCarrierSupportedDestination('USPS', 'US', opts, (error, data, response) => {
        if (error) {
          console.error('✗ Error getting supported countries:', error);
          reject(error);
        } else {
          console.log('✓ Successfully retrieved supported countries');
          
          // Check if data is an array
          if (Array.isArray(data)) {
            console.log(`  Total countries: ${data.length}`);
            
            // Display first 10 countries
            console.log('\nSample Countries:');
            data.slice(0, 10).forEach(country => {
              console.log(`  - ${country.countryName} (${country.countryCode})`);
            });
          } else {
            console.log('  Data received:', typeof data);
          }
          
          resolve(data);
        }
      });
    });
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

/**
 * Example 4: Rate a parcel
 */
async function rateParcel() {
  console.log('\n=== Parcel Rating Example ===\n');
  
  try {
    await initializeClient(ShippingApi);
    
    const api = new ShippingApi.RateParcelsApi();
    
    // Create shipment object
    const shipment = new ShippingApi.Shipment();
    
    // From Address
    const fromAddress = new ShippingApi.Address();
    fromAddress.addressLines = ['27 Watervw Dr'];
    fromAddress.cityTown = 'Stamford';
    fromAddress.stateProvince = 'CT';
    fromAddress.postalCode = '06902';
    fromAddress.countryCode = 'US';
    fromAddress.name = 'Sender Name';
    fromAddress.company = 'Sender Company';
    fromAddress.phone = '203-555-1234';
    fromAddress.email = 'sender@example.com';
    shipment.fromAddress = fromAddress;
    
    // To Address
    const toAddress = new ShippingApi.Address();
    toAddress.addressLines = ['1 Federal St'];
    toAddress.cityTown = 'Boston';
    toAddress.stateProvince = 'MA';
    toAddress.postalCode = '02110';
    toAddress.countryCode = 'US';
    toAddress.name = 'Recipient Name';
    toAddress.company = 'Recipient Company';
    toAddress.phone = '617-555-5678';
    toAddress.email = 'recipient@example.com';
    shipment.toAddress = toAddress;
    
    // Parcel details
    const parcel = new ShippingApi.Parcel();
    
    // Weight
    const weight = new ShippingApi.ParcelWeight();
    weight.weight = 1;
    weight.unitOfMeasurement = 'OZ';
    parcel.weight = weight;
    
    // Dimensions
    const dimension = new ShippingApi.ParcelDimension();
    dimension.length = 5;
    dimension.width = 0.25;
    dimension.height = 4;
    dimension.unitOfMeasurement = 'IN';
    parcel.dimension = dimension;
    
    shipment.parcel = parcel;
    
    // Rate options - requesting rates for USPS
    const rate = new ShippingApi.Rate();
    rate.carrier = 'USPS';
    rate.parcelType = 'PKG';
    shipment.rates = [rate];
    
    const opts = {
      'xPBUnifiedErrorStructure': true,
      'xPBIntegratorCarrierId': config.carrierId // Required for Pre-sort configuration
    };
    
    return new Promise((resolve, reject) => {
      api.rateParcel(shipment, opts, (error, data, response) => {
        if (error) {
          console.error('✗ Error rating parcel:', error);
          reject(error);
        } else {
          console.log('✓ Rate calculation successful!');
          
          if (data.rates && data.rates.length > 0) {
            console.log('\nRate Details:');
            data.rates.forEach(rate => {
              console.log(`  Service: ${rate.serviceId} (${rate.parcelType})`);
              console.log(`  Base Charge: $${rate.baseCharge}`);
              console.log(`  Total Charge: $${rate.totalCarrierCharge}`);
              console.log(`  Currency: ${rate.currencyCode}`);
              
              if (rate.deliveryCommitment) {
                console.log(`  Estimated Delivery: ${rate.deliveryCommitment.minEstimatedNumberOfDays}-${rate.deliveryCommitment.maxEstimatedNumberOfDays} days`);
              }
            });
          }
          
          resolve(data);
        }
      });
    });
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

/**
 * Display configuration
 */
function displayConfiguration() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║  Pitney Bowes Shipping API - Sandbox Configuration           ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log(`\nEnvironment: ${config.environment.toUpperCase()}`);
  console.log(`Developer ID: ${config.developerId}`);
  console.log(`Merchant ID: ${config.merchantId}`);
  console.log(`Partner ID: ${config.partnerId}`);
  console.log(`\nPre-sort Configuration:`);
  console.log(`  Carrier: ${config.carrierName} (${config.carrierId})`);
  console.log(`  Shipment Group/Job: ${config.shipmentGroupId}`);
  console.log(`  Permit ID: ${config.permitId}`);
  console.log(`\nAPI Base URL: ${config[config.environment].baseUrl}`);
  console.log('');
}

/**
 * Main function to run examples
 */
async function main() {
  displayConfiguration();
  
  try {
    // Run examples sequentially
    await validateAddress();
    await getCarrierRules();
    await getSupportedCountries();
    await rateParcel();
    
    console.log('\n✓ All examples completed successfully!\n');
  } catch (error) {
    console.error('\n✗ An error occurred:', error.message);
    process.exit(1);
  }
}

// Run the examples
if (require.main === module) {
  main();
}

module.exports = {
  validateAddress,
  getCarrierRules,
  getSupportedCountries,
  rateParcel
};


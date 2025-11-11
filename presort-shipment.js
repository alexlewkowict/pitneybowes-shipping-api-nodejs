/**
 * PB Presort Shipment Example
 * Creates a post-paid label for PB Presort pickup
 * 
 * Reference: https://docs.shippingapi.pitneybowes.com/api/post-shipments-pb-presort.html
 */

const ShippingApi = require('./dist/PB.ShippingAPI');
const { initializeClient, config } = require('./auth');

/**
 * Generate a unique transaction ID
 */
function generateTransactionId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return `TX-${timestamp}-${random}`.substring(0, 25);
}

/**
 * Create a PB Presort Shipment
 */
async function createPresortShipment(options = {}) {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║           PB Presort Shipment Creation                      ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  try {
    await initializeClient(ShippingApi);
    
    const api = new ShippingApi.ShipmentApi();
    
    // Create shipment object
    const shipment = new ShippingApi.Shipment();
    
    // From Address
    const fromAddress = new ShippingApi.Address();
    fromAddress.company = options.fromCompany || 'Supplies';
    fromAddress.name = options.fromName || 'John Smith';
    fromAddress.phone = options.fromPhone || '303-555-0000';
    fromAddress.email = options.fromEmail || 'john@example.com';
    fromAddress.residential = false;
    fromAddress.addressLines = options.fromAddressLines || ['27 Watervw Dr'];
    fromAddress.cityTown = options.fromCity || 'Stamford';
    fromAddress.stateProvince = options.fromState || 'CT';
    fromAddress.postalCode = options.fromZip || '06902';
    fromAddress.countryCode = 'US';
    shipment.fromAddress = fromAddress;
    
    // To Address
    const toAddress = new ShippingApi.Address();
    toAddress.company = options.toCompany || 'Shop';
    toAddress.name = options.toName || 'Mary Jones';
    toAddress.phone = options.toPhone || '620-555-0000';
    toAddress.email = options.toEmail || 'mary@example.com';
    toAddress.residential = options.toResidential || false;
    toAddress.addressLines = options.toAddressLines || ['1 Federal St'];
    toAddress.cityTown = options.toCity || 'Boston';
    toAddress.stateProvince = options.toState || 'MA';
    toAddress.postalCode = options.toZip || '02110';
    toAddress.countryCode = 'US';
    shipment.toAddress = toAddress;
    
    // Parcel details
    const parcel = new ShippingApi.Parcel();
    
    // Weight
    const weight = new ShippingApi.ParcelWeight();
    weight.weight = options.weight || 3;
    weight.unitOfMeasurement = 'OZ';
    parcel.weight = weight;
    
    // Dimensions
    const dimension = new ShippingApi.ParcelDimension();
    dimension.length = options.length || 12;
    dimension.width = options.width || 0.25;
    dimension.height = options.height || 9;
    dimension.unitOfMeasurement = 'IN';
    parcel.dimension = dimension;
    
    shipment.parcel = parcel;
    
    // Rate - PB Presort specific
    const rate = new ShippingApi.Rate();
    rate.carrier = 'PBPRESORT';
    rate.serviceId = options.serviceId || 'STANDARD'; // STANDARD or FCM
    rate.parcelType = options.parcelType || 'LGENV'; // LGENV, PKG, LETTER, FLAT
    rate.currencyCode = 'USD';
    shipment.rates = [rate];
    
    // Document - Label specification
    const document = new ShippingApi.Document();
    document.size = options.labelSize || 'DOC_6X4';
    document.printDialogOption = 'NO_PRINT_DIALOG';
    document.type = 'SHIPPING_LABEL';
    document.contentType = 'URL'; // or BASE64
    document.fileFormat = 'PDF'; // or PNG, ZPL
    shipment.documents = [document];
    
    // Shipment Options - Required for PB Presort
    const shipmentOptions = [];
    
    // Required: Shipper ID
    shipmentOptions.push({
      name: 'SHIPPER_ID',
      value: options.shipperId || config.merchantId
    });
    
    // Required for STANDARD LGENV, FCM LETTER and FLAT
    if (['LGENV', 'LETTER', 'FLAT'].includes(rate.parcelType)) {
      shipmentOptions.push({
        name: 'PERMIT_NUMBER',
        value: options.permitNumber || config.permitId
      });
      
      shipmentOptions.push({
        name: 'PERMIT_CITY',
        value: options.permitCity || 'Boulder'
      });
      
      shipmentOptions.push({
        name: 'PERMIT_STATE',
        value: options.permitState || 'CO'
      });
    }
    
    // Optional: Minimal address validation
    shipmentOptions.push({
      name: 'MINIMAL_ADDRESS_VALIDATION',
      value: 'false'
    });
    
    // Optional: Print custom messages
    if (options.customMessage1) {
      shipmentOptions.push({
        name: 'PRINT_CUSTOM_MESSAGE_1',
        value: options.customMessage1
      });
    }
    
    if (options.customMessage2) {
      shipmentOptions.push({
        name: 'PRINT_CUSTOM_MESSAGE_2',
        value: options.customMessage2
      });
    }
    
    shipment.shipmentOptions = shipmentOptions;
    
    // Generate unique transaction ID
    const transactionId = generateTransactionId();
    
    // API options with required PB Presort headers
    const opts = {
      'xPBUnifiedErrorStructure': true,
      'xPBTransactionId': transactionId,
      'xPBShipmentGroupId': config.shipmentGroupId,
      'xPBIntegratorCarrierId': config.carrierId
    };
    
    console.log('Creating PB Presort Shipment...');
    console.log(`  Transaction ID: ${transactionId}`);
    console.log(`  Shipment Group: ${config.shipmentGroupId}`);
    console.log(`  Carrier ID: ${config.carrierId}`);
    console.log(`  Service: ${rate.serviceId} (${rate.parcelType})`);
    console.log('');
    
    return new Promise((resolve, reject) => {
      // Set a timeout for the API call
      const timeout = setTimeout(() => {
        reject(new Error('API request timed out after 30 seconds. The Pitney Bowes sandbox may be slow or your Pre-sort account may need additional configuration.'));
      }, 30000); // 30 second timeout
      
      api.createShipmentLabel(shipment, opts, (error, data, response) => {
        clearTimeout(timeout);
        
        if (error) {
          console.error('✗ Error creating shipment:', error.message);
          if (error.response && error.response.body) {
            console.error('  Error details:', JSON.stringify(error.response.body, null, 2));
          }
          reject(error);
        } else {
          console.log('✓ Shipment created successfully!\n');
          console.log('Shipment Details:');
          console.log(`  Shipment ID: ${data.shipmentId}`);
          console.log(`  Tracking Number: ${data.parcelTrackingNumber}`);
          console.log(`  Base Charge: $${data.rates[0].baseCharge}`);
          console.log(`  Total Charge: $${data.rates[0].totalCarrierCharge}`);
          console.log(`  Destination Zone: ${data.rates[0].destinationZone}`);
          
          if (data.documents && data.documents.length > 0) {
            console.log('\nLabel:');
            console.log(`  Type: ${data.documents[0].type}`);
            console.log(`  Format: ${data.documents[0].fileFormat}`);
            console.log(`  Size: ${data.documents[0].size}`);
            console.log(`  URL: ${data.documents[0].contents}`);
          }
          
          console.log('\nValidated Addresses:');
          console.log('  From:', data.fromAddress.addressLines.join(', '));
          console.log(`        ${data.fromAddress.cityTown}, ${data.fromAddress.stateProvince} ${data.fromAddress.postalCode}`);
          console.log('  To:  ', data.toAddress.addressLines.join(', '));
          console.log(`        ${data.toAddress.cityTown}, ${data.toAddress.stateProvince} ${data.toAddress.postalCode}`);
          
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
 * Example usage with different parcel types
 */
async function runExamples() {
  try {
    // Example 1: Standard Large Envelope (LGENV)
    console.log('\n=== Example 1: Standard Large Envelope ===');
    await createPresortShipment({
      serviceId: 'STANDARD',
      parcelType: 'LGENV',
      weight: 3,
      length: 12,
      width: 0.25,
      height: 9,
      permitNumber: 'SHFL',
      permitCity: 'Stamford',
      permitState: 'CT'
    });
    
    // Example 2: Standard Package (PKG)
    // console.log('\n=== Example 2: Standard Package ===');
    // await createPresortShipment({
    //   serviceId: 'STANDARD',
    //   parcelType: 'PKG',
    //   weight: 8,
    //   length: 10,
    //   width: 6,
    //   height: 4
    // });
    
  } catch (error) {
    console.error('Example failed:', error.message);
  }
}

// Run if called directly
if (require.main === module) {
  runExamples();
}

module.exports = {
  createPresortShipment,
  generateTransactionId
};


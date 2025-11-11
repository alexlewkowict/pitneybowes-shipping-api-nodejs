/**
 * Direct API call to PB Presort (bypasses the SDK)
 * Uses direct HTTP calls which we know work
 */

const https = require('https');
const { getAccessToken, config } = require('./auth');

/**
 * Generate a unique transaction ID
 */
function generateTransactionId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return `TX-${timestamp}-${random}`.substring(0, 25);
}

/**
 * Make direct API call to create shipment
 */
async function createPresortShipmentDirect(options = {}) {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║           PB Presort Shipment (Direct API)                  ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  try {
    // Get OAuth token
    console.log('🔐 Obtaining access token...');
    const accessToken = await getAccessToken();
    console.log('✓ Access token obtained\n');

    // Build the request payload
    const payload = {
      fromAddress: {
        company: options.fromCompany || 'Supplies',
        name: options.fromName || 'John Smith',
        phone: options.fromPhone || '303-555-0000',
        email: options.fromEmail || 'john@example.com',
        residential: false,
        addressLines: [options.fromAddress || '27 Watervw Dr'],
        cityTown: options.fromCity || 'Stamford',
        stateProvince: options.fromState || 'CT',
        postalCode: options.fromZip || '06902',
        countryCode: 'US'
      },
      toAddress: {
        company: options.toCompany || 'Shop',
        name: options.toName || 'Mary Jones',
        phone: options.toPhone || '617-555-0000',
        email: options.toEmail || 'mary@example.com',
        residential: options.toResidential || false,
        addressLines: [options.toAddress || '1 Federal St'],
        cityTown: options.toCity || 'Boston',
        stateProvince: options.toState || 'MA',
        postalCode: options.toZip || '02110',
        countryCode: 'US'
      },
      parcel: {
        weight: {
          unitOfMeasurement: 'OZ',
          weight: parseFloat(options.weight || 3)
        },
        dimension: {
          unitOfMeasurement: 'IN',
          length: parseFloat(options.length || 12),
          width: parseFloat(options.width || 0.25),
          height: parseFloat(options.height || 9)
        }
      },
      rates: [{
        carrier: 'PBPRESORT',
        serviceId: options.serviceId || 'STANDARD',
        parcelType: options.parcelType || 'LGENV',
        currencyCode: 'USD'
      }],
      documents: [{
        size: options.labelSize || 'DOC_6X4',
        printDialogOption: 'NO_PRINT_DIALOG',
        type: 'SHIPPING_LABEL',
        contentType: 'URL',
        fileFormat: options.labelFormat || 'PDF'
      }],
      shipmentOptions: [
        { name: 'SHIPPER_ID', value: options.shipperId || config.merchantId },
        { name: 'PERMIT_NUMBER', value: options.permitNumber || config.permitId },
        { name: 'PERMIT_CITY', value: options.permitCity || 'Stamford' },
        { name: 'PERMIT_STATE', value: options.permitState || 'CT' },
        { name: 'MINIMAL_ADDRESS_VALIDATION', value: 'false' }
      ]
    };

    // Add custom messages if provided
    if (options.customMessage1) {
      payload.shipmentOptions.push({ name: 'PRINT_CUSTOM_MESSAGE_1', value: options.customMessage1 });
    }
    if (options.customMessage2) {
      payload.shipmentOptions.push({ name: 'PRINT_CUSTOM_MESSAGE_2', value: options.customMessage2 });
    }

    const transactionId = generateTransactionId();
    const postData = JSON.stringify(payload);

    console.log('📦 Creating shipment...');
    console.log(`  Transaction ID: ${transactionId}`);
    console.log(`  Service: ${payload.rates[0].serviceId} (${payload.rates[0].parcelType})`);
    console.log('');

    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api-sandbox.pitneybowes.com',
        port: 443,
        path: '/shippingservices/v1/shipments',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          'Authorization': `Bearer ${accessToken}`,
          'X-PB-TransactionId': transactionId,
          'X-PB-ShipmentGroupId': config.shipmentGroupId,
          'X-PB-Integrator-CarrierId': config.carrierId,
          'X-PB-UnifiedErrorStructure': 'true'
        },
        timeout: 30000 // 30 second timeout
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(data);

            if (res.statusCode === 200 || res.statusCode === 201) {
              console.log('✓ Shipment created successfully!\n');
              console.log('Shipment Details:');
              console.log(`  Shipment ID: ${response.shipmentId}`);
              console.log(`  Tracking Number: ${response.parcelTrackingNumber}`);
              console.log(`  Base Charge: $${response.rates[0].baseCharge}`);
              console.log(`  Total Charge: $${response.rates[0].totalCarrierCharge}`);
              console.log(`  Destination Zone: ${response.rates[0].destinationZone}`);
              
              if (response.documents && response.documents.length > 0) {
                console.log('\nLabel:');
                console.log(`  Format: ${response.documents[0].fileFormat}`);
                console.log(`  Size: ${response.documents[0].size}`);
                console.log(`  URL: ${response.documents[0].contents}`);
              }
              
              console.log('\nValidated Addresses:');
              console.log('  From:', response.fromAddress.addressLines.join(', '));
              console.log(`        ${response.fromAddress.cityTown}, ${response.fromAddress.stateProvince} ${response.fromAddress.postalCode}`);
              console.log('  To:  ', response.toAddress.addressLines.join(', '));
              console.log(`        ${response.toAddress.cityTown}, ${response.toAddress.stateProvince} ${response.toAddress.postalCode}`);
              
              resolve(response);
            } else {
              console.error('✗ Error creating shipment');
              console.error(`  Status: ${res.statusCode}`);
              console.error(`  Response:`, JSON.stringify(response, null, 2));
              reject(new Error(response.errors ? response.errors[0].errorDescription : 'Unknown error'));
            }
          } catch (err) {
            console.error('✗ Error parsing response:', err.message);
            reject(err);
          }
        });
      });

      req.on('error', (err) => {
        console.error('✗ Request error:', err.message);
        reject(err);
      });

      req.on('timeout', () => {
        req.destroy();
        console.error('✗ Request timed out after 30 seconds');
        reject(new Error('Request timed out'));
      });

      req.write(postData);
      req.end();
    });

  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  createPresortShipmentDirect()
    .then(() => console.log('\n✓ Complete!'))
    .catch(err => {
      console.error('\n✗ Failed:', err.message);
      process.exit(1);
    });
}

module.exports = { createPresortShipmentDirect };


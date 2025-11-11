/**
 * Vercel Serverless Function for PB Presort Shipment Creation
 */

const https = require('https');

// Configuration from environment variables
const config = {
  apiKey: process.env.PB_API_KEY || '0oa2jnd4gabhQa7I30h8',
  apiSecret: process.env.PB_API_SECRET || 'DHaJjDfPA_ZNKWman1CXRFYApYc1NdFa0vE6QYtpytNVEVK99XlvdBTHL1eZqSqZ',
  developerId: process.env.PB_DEVELOPER_ID || '85771237',
  merchantId: process.env.PB_MERCHANT_ID || '3800270633',
  carrierId: process.env.PB_CARRIER_ID || '987654321',
  shipmentGroupId: process.env.PB_SHIPMENT_GROUP_ID || '500002',
  permitId: process.env.PB_PERMIT_ID || 'PBPS',
  authUrl: 'https://api-sandbox.pitneybowes.com/oauth/token'
};

/**
 * Get OAuth2 access token
 */
async function getAccessToken() {
  return new Promise((resolve, reject) => {
    const credentials = Buffer.from(`${config.apiKey}:${config.apiSecret}`).toString('base64');
    const postData = 'grant_type=client_credentials';

    const options = {
      hostname: 'api-sandbox.pitneybowes.com',
      port: 443,
      path: '/oauth/token',
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.access_token) {
            resolve(response.access_token);
          } else {
            reject(new Error('No access token in response'));
          }
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

/**
 * Generate a unique transaction ID
 */
function generateTransactionId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return `TX-${timestamp}-${random}`.substring(0, 25);
}

/**
 * Create PB Presort shipment
 */
async function createShipment(body) {
  const accessToken = await getAccessToken();

  const payload = {
    fromAddress: {
      company: body.fromCompany || 'Supplies',
      name: body.fromName || 'John Smith',
      phone: body.fromPhone || '303-555-0000',
      email: body.fromEmail || 'john@example.com',
      residential: false,
      addressLines: [body.fromAddress || '27 Watervw Dr'],
      cityTown: body.fromCity || 'Stamford',
      stateProvince: body.fromState || 'CT',
      postalCode: body.fromZip || '06902',
      countryCode: 'US'
    },
    toAddress: {
      company: body.toCompany || 'Shop',
      name: body.toName || 'Mary Jones',
      phone: body.toPhone || '617-555-0000',
      email: body.toEmail || 'mary@example.com',
      residential: body.toResidential || false,
      addressLines: [body.toAddress || '1 Federal St'],
      cityTown: body.toCity || 'Boston',
      stateProvince: body.toState || 'MA',
      postalCode: body.toZip || '02110',
      countryCode: 'US'
    },
    parcel: {
      weight: {
        unitOfMeasurement: 'OZ',
        weight: parseFloat(body.weight || 3)
      },
      dimension: {
        unitOfMeasurement: 'IN',
        length: parseFloat(body.length || 12),
        width: parseFloat(body.width || 0.25),
        height: parseFloat(body.height || 9)
      }
    },
    rates: [{
      carrier: 'PBPRESORT',
      serviceId: body.serviceId || 'STANDARD',
      parcelType: body.parcelType || 'LGENV',
      currencyCode: 'USD'
    }],
    documents: [{
      size: body.labelSize || 'DOC_6X4',
      printDialogOption: 'NO_PRINT_DIALOG',
      type: 'SHIPPING_LABEL',
      contentType: 'URL',
      fileFormat: body.labelFormat || 'PDF'
    }],
    shipmentOptions: [
      { name: 'SHIPPER_ID', value: body.shipperId || config.merchantId },
      { name: 'PERMIT_NUMBER', value: body.permitNumber || config.permitId },
      { name: 'PERMIT_CITY', value: body.permitCity || 'Stamford' },
      { name: 'PERMIT_STATE', value: body.permitState || 'CT' },
      { name: 'MINIMAL_ADDRESS_VALIDATION', value: 'false' }
    ]
  };

  if (body.customMessage1) {
    payload.shipmentOptions.push({ name: 'PRINT_CUSTOM_MESSAGE_1', value: body.customMessage1 });
  }
  if (body.customMessage2) {
    payload.shipmentOptions.push({ name: 'PRINT_CUSTOM_MESSAGE_2', value: body.customMessage2 });
  }

  const transactionId = generateTransactionId();
  const postData = JSON.stringify(payload);

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
      timeout: 30000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (res.statusCode === 200 || res.statusCode === 201) {
            resolve(response);
          } else {
            reject(new Error(response.errors ? response.errors[0].errorDescription : 'Unknown error'));
          }
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Vercel serverless function handler
 */
module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const result = await createShipment(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Shipment creation failed:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.toString()
    });
  }
};


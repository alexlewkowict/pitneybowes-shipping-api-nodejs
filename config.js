/**
 * Pitney Bowes API Configuration
 * Sandbox Environment Credentials
 */

module.exports = {
  // OAuth2 Credentials
  apiKey: '0oa2jnd4gabhQa7I30h8',
  apiSecret: 'DHaJjDfPA_ZNKWman1CXRFYApYc1NdFa0vE6QYtpytNVEVK99XlvdBTHL1eZqSqZ',
  
  // Account Configuration
  developerId: '85771237',
  merchantId: '3800270633',
  partnerId: '793833492',
  
  // Pre-sort Configuration
  carrierId: '987654321',
  carrierName: 'PBPresort',
  shipmentGroupId: '500002', // Job number
  permitId: 'PBPS',
  
  // API Endpoints
  sandbox: {
    baseUrl: 'https://api-sandbox.pitneybowes.com/shippingservices',
    authUrl: 'https://api-sandbox.pitneybowes.com/oauth/token'
  },
  
  production: {
    baseUrl: 'https://api.pitneybowes.com/shippingservices',
    authUrl: 'https://api.pitneybowes.com/oauth/token'
  },
  
  // Current environment
  environment: 'sandbox'
};


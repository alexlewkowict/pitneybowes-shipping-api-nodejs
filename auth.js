/**
 * OAuth2 Authentication Helper
 * Obtains access token using client credentials flow
 */

const request = require('superagent');
const config = require('./config');

/**
 * Get OAuth2 access token
 * @returns {Promise<string>} Access token
 */
async function getAccessToken() {
  try {
    const authUrl = config[config.environment].authUrl;
    
    // Create Basic Auth credentials
    const credentials = Buffer.from(`${config.apiKey}:${config.apiSecret}`).toString('base64');
    
    const response = await request
      .post(authUrl)
      .set('Authorization', `Basic ${credentials}`)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('grant_type=client_credentials');
    
    if (response.body && response.body.access_token) {
      console.log('✓ Successfully obtained access token');
      return response.body.access_token;
    } else {
      throw new Error('No access token in response');
    }
  } catch (error) {
    console.error('Error obtaining access token:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response body:', error.response.body);
    }
    throw error;
  }
}

/**
 * Initialize API client with authentication
 * @param {Object} ShippingApi - The ShippingApi module
 * @returns {Promise<Object>} Configured API client
 */
async function initializeClient(ShippingApi) {
  const accessToken = await getAccessToken();
  
  const defaultClient = ShippingApi.ApiClient.instance;
  defaultClient.basePath = config[config.environment].baseUrl;
  
  // Configure OAuth2 authentication
  const oAuth2ClientCredentials = defaultClient.authentications['oAuth2ClientCredentials'];
  oAuth2ClientCredentials.accessToken = accessToken;
  
  console.log('✓ API client initialized');
  console.log(`  Base URL: ${defaultClient.basePath}`);
  console.log(`  Developer ID: ${config.developerId}`);
  
  return defaultClient;
}

module.exports = {
  getAccessToken,
  initializeClient,
  config
};


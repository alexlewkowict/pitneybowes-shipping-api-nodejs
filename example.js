/**
 * Example usage of the Pitney Bowes Shipping API Node.js SDK
 * 
 * This example demonstrates how to use the SDK locally after building it.
 */

var ShippingApi = require('./dist/PB.ShippingAPI');

// Configure the API client
var defaultClient = ShippingApi.ApiClient.instance;

// Configure OAuth2 access token for authorization
var oAuth2ClientCredentials = defaultClient.authentications['oAuth2ClientCredentials'];
oAuth2ClientCredentials.accessToken = "YOUR_ACCESS_TOKEN_HERE";

// Example 1: Address Validation
function validateAddress() {
  var api = new ShippingApi.AddressValidationApi();
  var address = new ShippingApi.Address();
  
  // Set address properties
  address.addressLines = ['1234 Main St'];
  address.cityTown = 'San Francisco';
  address.stateProvince = 'CA';
  address.postalCode = '94105';
  address.countryCode = 'US';
  
  var opts = {
    'xPBUnifiedErrorStructure': true,
    'minimalAddressValidation': true
  };
  
  var callback = function(error, data, response) {
    if (error) {
      console.error('Error validating address:', error);
    } else {
      console.log('Address validation successful:', data);
    }
  };
  
  api.verifyAddress(address, opts, callback);
}

// Example 2: Get Carrier Service Rules
function getCarrierRules() {
  var api = new ShippingApi.CarrierInfoApi();
  
  var opts = {
    'carrier': 'USPS',
    'originCountryCode': 'US',
    'destinationCountryCode': 'US'
  };
  
  var callback = function(error, data, response) {
    if (error) {
      console.error('Error getting carrier rules:', error);
    } else {
      console.log('Carrier rules:', JSON.stringify(data, null, 2));
    }
  };
  
  api.getCarrierServiceRules(opts, callback);
}

// Example 3: Rate a Parcel
function rateParcel() {
  var api = new ShippingApi.RateParcelsApi();
  
  // Create shipment object
  var shipment = new ShippingApi.Shipment();
  
  // From Address
  var fromAddress = new ShippingApi.Address();
  fromAddress.addressLines = ['1234 Main St'];
  fromAddress.cityTown = 'San Francisco';
  fromAddress.stateProvince = 'CA';
  fromAddress.postalCode = '94105';
  fromAddress.countryCode = 'US';
  shipment.fromAddress = fromAddress;
  
  // To Address
  var toAddress = new ShippingApi.Address();
  toAddress.addressLines = ['5678 Oak Ave'];
  toAddress.cityTown = 'New York';
  toAddress.stateProvince = 'NY';
  toAddress.postalCode = '10001';
  toAddress.countryCode = 'US';
  shipment.toAddress = toAddress;
  
  // Parcel details
  var parcel = new ShippingApi.Parcel();
  var weight = new ShippingApi.ParcelWeight();
  weight.weight = 1;
  weight.unitOfMeasurement = 'OZ';
  parcel.weight = weight;
  shipment.parcel = parcel;
  
  // Rate options
  var rate = new ShippingApi.Rate();
  rate.carrier = 'USPS';
  rate.serviceId = 'PM';
  rate.parcelType = 'PKG';
  shipment.rates = [rate];
  
  var opts = {
    'xPBUnifiedErrorStructure': true
  };
  
  var callback = function(error, data, response) {
    if (error) {
      console.error('Error rating parcel:', error);
    } else {
      console.log('Rate calculation successful:', JSON.stringify(data, null, 2));
    }
  };
  
  api.rateParcel(shipment, opts, callback);
}

// To use these examples, uncomment the function you want to test:
// validateAddress();
// getCarrierRules();
// rateParcel();

console.log('Pitney Bowes Shipping API SDK is ready to use!');
console.log('Please set your access token and uncomment one of the example functions above.');
console.log('API Sandbox Base URL: https://api-sandbox.pitneybowes.com/shippingservices');


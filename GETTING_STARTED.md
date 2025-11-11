# 🚀 Getting Started - Pitney Bowes Shipping API

## You're All Set! 🎉

Your Pitney Bowes Shipping API SDK is now fully configured and ready to use with your sandbox credentials.

## Quick Start (30 seconds)

Run your first API call:

```bash
node simple-example.js
```

You should see output like:
```
✓ Successfully obtained access token
✓ API client initialized
✓ Address Validated Successfully!
```

## Your Configuration

Your sandbox account is configured with:
- **Developer ID**: 85771237
- **Merchant ID**: 3800270633
- **Partner ID**: 793833492
- **Pre-sort Carrier**: PBPresort (987654321)
- **Environment**: Sandbox

All credentials are securely stored in `config.js`.

## What's Working

✅ **Address Validation** - Verify and correct mailing addresses  
✅ **Carrier Service Rules** - Get USPS service rules and requirements  
✅ **Supported Countries** - List of 233 international destinations  
✅ **OAuth2 Authentication** - Automatic token management  
✅ **All 833 Tests Passing** - SDK fully functional

## Example Files

### `simple-example.js` 
Quick start with address validation - **Start here!**
```bash
node simple-example.js
```

### `example-with-auth.js`
Comprehensive examples of multiple APIs
```bash
node example-with-auth.js
```

### `config.js`
Your API credentials and configuration

### `auth.js`
OAuth2 authentication helper (handles tokens automatically)

## Code Example

Here's how to use the SDK in your own code:

```javascript
const ShippingApi = require('./dist/PB.ShippingAPI');
const { initializeClient } = require('./auth');

async function validateAddress() {
  // Initialize with automatic authentication
  await initializeClient(ShippingApi);
  
  // Create API instance
  const api = new ShippingApi.AddressValidationApi();
  
  // Create address object
  const address = new ShippingApi.Address();
  address.addressLines = ['1600 Amphitheatre Parkway'];
  address.cityTown = 'Mountain View';
  address.stateProvince = 'CA';
  address.postalCode = '94043';
  address.countryCode = 'US';
  
  // Call API
  api.verifyAddress(address, { xPBUnifiedErrorStructure: true }, 
    (error, data, response) => {
      if (error) {
        console.error('Error:', error);
      } else {
        console.log('Validated:', data);
      }
    }
  );
}

validateAddress();
```

## Available APIs

Your SDK includes these APIs (all documented in `docs/` folder):

| API | Purpose | Status |
|-----|---------|--------|
| **AddressValidationApi** | Validate/correct addresses | ✅ Working |
| **CarrierInfoApi** | Carrier rules & facilities | ✅ Working |
| **ShipmentApi** | Create/manage shipments | 📦 Ready |
| **RateParcelsApi** | Calculate rates | ⚠️ Needs config |
| **TrackingApi** | Track packages | 📦 Ready |
| **ManifestsApi** | End-of-day manifests | 📦 Ready |
| **PickupApi** | Schedule pickups | 📦 Ready |
| **ParcelProtectionApi** | Insurance quotes | 📦 Ready |
| **CrossBorderQuotesApi** | International quotes | 📦 Ready |
| **TransactionReportsApi** | Transaction reports | 📦 Ready |

✅ = Tested and working  
📦 = Ready to use (not yet tested)  
⚠️ = May need additional Pitney Bowes configuration

## Documentation

- **Setup Guide**: `SETUP_GUIDE.md` - Detailed configuration info
- **API Docs**: `docs/` - 139 markdown files with full API documentation
- **Original README**: `README.md` - SDK installation and usage
- **Online Docs**: https://shipping.pitneybowes.com/

## Common Operations

### Validate an Address
```bash
node simple-example.js
```

### Get USPS Service Rules
See `example-with-auth.js` - `getCarrierRules()` function

### List Supported Countries
See `example-with-auth.js` - `getSupportedCountries()` function

## Development

```bash
# Install dependencies
npm install

# Build from source
npm run build

# Run all tests (833 tests)
npm test
```

## Next Steps

1. ✅ Run `node simple-example.js` to test
2. 📖 Read `SETUP_GUIDE.md` for detailed info
3. 📚 Explore `docs/` for API documentation
4. 🔨 Integrate into your application
5. 🧪 Try other API endpoints from examples

## Need Help?

- **Full Setup Info**: See `SETUP_GUIDE.md`
- **API Documentation**: Check `docs/` folder
- **Pitney Bowes Support**: https://shipping.pitneybowes.com/
- **Online API Docs**: https://shipping.pitneybowes.com/api/

## Summary

You have:
- ✅ All dependencies installed
- ✅ Project built successfully
- ✅ Credentials configured
- ✅ Authentication working
- ✅ API calls tested
- ✅ Example code ready

**Everything is ready to go! Start with `node simple-example.js`** 🚀


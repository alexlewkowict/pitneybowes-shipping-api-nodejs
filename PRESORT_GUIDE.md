# PB Presort Shipment Guide

## 🚀 Quick Start

### Option 1: Command Line Test

Run the automated example:

```bash
node presort-shipment.js
```

### Option 2: Web UI (Recommended)

Start the testing server:

```bash
node presort-server.js
```

Then open your browser to: **http://localhost:3000**

You'll get a beautiful UI to create and test PB Presort shipments!

## 📋 What is PB Presort?

PB Presort is a post-paid label service for parcels that are part of a Pitney Bowes Presort pickup. Key features:

- ✅ **No upfront charges** - Postage charged after use
- ✅ **Domestic only** - US destinations including territories
- ✅ **IMb/IMpb tracking** - Intelligent Mail barcodes
- ✅ **Standard & First Class** - Multiple service levels

**Documentation**: [PB Presort API Reference](https://docs.shippingapi.pitneybowes.com/api/post-shipments-pb-presort.html)

## 🔧 Your Configuration

Your PB Presort account is already configured:

- **Developer ID**: 85771237
- **Merchant ID**: 3800270633
- **Carrier ID (Mailer ID)**: 987654321
- **Job Number (Shipment Group)**: 500002
- **Permit ID**: PBPS
- **Carrier**: PBPresort

## 📦 Available Services

### Service Types

| Service ID | Description | Use Case |
|------------|-------------|----------|
| **STANDARD** | Standard Mail | Marketing materials, catalogs |
| **FCM** | First Class Mail | Time-sensitive mail |

### Parcel Types

| Parcel Type | Description | Barcode | Max Weight |
|-------------|-------------|---------|------------|
| **LGENV** | Large Envelope | IMb | 13 oz |
| **PKG** | Package | IMpb | 25 lbs |
| **LETTER** | Letter | IMb | 3.5 oz |
| **FLAT** | Flat | IMb | 13 oz |

## 🎯 Required Headers

PB Presort shipments require these special headers:

```javascript
{
  'X-PB-TransactionId': 'unique-transaction-id',
  'X-PB-ShipmentGroupId': '500002',          // Your Job Number
  'X-PB-Integrator-CarrierId': '987654321',  // Your Mailer ID
  'X-PB-UnifiedErrorStructure': true
}
```

## 📝 Required Fields

### All Parcel Types

- Shipper ID
- From/To Addresses
- Weight & Dimensions
- Service ID & Parcel Type

### LGENV, LETTER, FLAT (Additional)

- Permit Number
- Permit City
- Permit State

## 💻 Code Example

```javascript
const { createPresortShipment } = require('./presort-shipment');

// Create a Standard Large Envelope shipment
const result = await createPresortShipment({
  // Service configuration
  serviceId: 'STANDARD',
  parcelType: 'LGENV',
  labelSize: 'DOC_6X4',
  labelFormat: 'PDF',
  
  // Permit information
  shipperId: '3800270633',
  permitNumber: 'PBPS',
  permitCity: 'Boulder',
  permitState: 'CO',
  
  // From address
  fromName: 'John Smith',
  fromCompany: 'Supplies',
  fromAddressLines: ['4750 Walnut Street'],
  fromCity: 'Boulder',
  fromState: 'CO',
  fromZip: '80301',
  
  // To address
  toName: 'Mary Jones',
  toCompany: 'Shop',
  toAddressLines: ['4588 W Fulton'],
  toCity: 'Garden City',
  toState: 'KS',
  toZip: '67846',
  
  // Parcel details
  weight: 3,        // ounces
  length: 12,       // inches
  width: 0.25,      // inches
  height: 9,        // inches
  
  // Optional
  customMessage1: 'Order #12345',
  customMessage2: 'Thank you!'
});

console.log('Shipment ID:', result.shipmentId);
console.log('Tracking:', result.parcelTrackingNumber);
console.log('Label URL:', result.documents[0].contents);
```

## 🌐 Testing UI Features

The web UI (`presort-ui.html`) provides:

- ✅ **Pre-filled defaults** - Your configuration already loaded
- ✅ **Form validation** - Required fields marked
- ✅ **Real-time payload** - See the API request before sending
- ✅ **Beautiful interface** - Easy to use
- ✅ **Responsive design** - Works on any device

### Using the UI

1. **Start the server**:
   ```bash
   node presort-server.js
   ```

2. **Open browser**: http://localhost:3000

3. **Fill in the form** (or use defaults)

4. **Click "Create Shipment"**

5. **Get your label**! The response includes:
   - Shipment ID
   - Tracking number
   - Label URL (PDF/PNG/ZPL)
   - Validated addresses

## 📤 API Request Structure

```json
{
  "fromAddress": {
    "company": "Supplies",
    "name": "John Smith",
    "addressLines": ["4750 Walnut Street"],
    "cityTown": "Boulder",
    "stateProvince": "CO",
    "postalCode": "80301",
    "countryCode": "US"
  },
  "toAddress": {
    "company": "Shop",
    "name": "Mary Jones",
    "addressLines": ["4588 W Fulton"],
    "cityTown": "Garden City",
    "stateProvince": "KS",
    "postalCode": "67846",
    "countryCode": "US"
  },
  "parcel": {
    "weight": {
      "unitOfMeasurement": "OZ",
      "weight": 3
    },
    "dimension": {
      "unitOfMeasurement": "IN",
      "length": 12,
      "width": 0.25,
      "height": 9
    }
  },
  "rates": [{
    "carrier": "PBPRESORT",
    "serviceId": "STANDARD",
    "parcelType": "LGENV",
    "currencyCode": "USD"
  }],
  "documents": [{
    "size": "DOC_6X4",
    "type": "SHIPPING_LABEL",
    "contentType": "URL",
    "fileFormat": "PDF"
  }],
  "shipmentOptions": [
    { "name": "SHIPPER_ID", "value": "3800270633" },
    { "name": "PERMIT_NUMBER", "value": "PBPS" },
    { "name": "PERMIT_CITY", "value": "Boulder" },
    { "name": "PERMIT_STATE", "value": "CO" }
  ]
}
```

## 📥 API Response Structure

```json
{
  "shipmentId": "PBPRESORT2200122647812392",
  "parcelTrackingNumber": "0070698765432100221106510123814",
  "rates": [{
    "carrier": "PBPRESORT",
    "serviceId": "STANDARD",
    "parcelType": "LGENV",
    "baseCharge": 0.0,
    "totalCarrierCharge": 0.0,
    "destinationZone": "4"
  }],
  "documents": [{
    "contents": "https://.../label.pdf",
    "fileFormat": "PDF",
    "size": "DOC_6X4",
    "type": "SHIPPING_LABEL"
  }],
  "fromAddress": { /* validated address */ },
  "toAddress": { /* validated address */ }
}
```

## ⚠️ Important Notes

### Limitations

1. **Domestic Only** - PB Presort is for US destinations only
2. **No Rating** - Use PB Presort rate charts instead
3. **No Refunds** - Void requests will fail
4. **No Future Dates** - FUTURE_SHIPMENT_DATE not supported
5. **Tracking Delay** - Events appear after Shipping Services File upload

### Address Validation

- Addresses are automatically validated and corrected
- Use `MINIMAL_ADDRESS_VALIDATION: false` for full validation (recommended)
- With minimal validation, shipper is 100% responsible for delivery issues

### Label Types

- **LGENV**: Has IMb (Intelligent Mail barcode)
- **PKG**: Has IMpb (Intelligent Mail package barcode)
- **LETTER/FLAT**: Have IMb

## 🔍 Tracking

Track shipments using the Tracking API:

```javascript
const api = new ShippingApi.TrackingApi();
api.getTrackingDetails(
  trackingNumber,
  'USPS',  // Must be USPS for PB Presort
  opts,
  callback
);
```

**Note**: Tracking may take time to show after label creation.

## 🎨 Label Formats

### Size Options
- `DOC_6X4` - 6x4 inch label
- `DOC_8X11` - 8.5x11 inch label

### Format Options
- `PDF` - Portable Document Format
- `PNG` - Image format
- `ZPL` - Zebra printer format

### Content Type
- `URL` - Returns web link to label
- `BASE64` - Returns encoded string

## 📁 Project Files

- **`presort-shipment.js`** - Core shipment creation logic
- **`presort-ui.html`** - Beautiful web interface
- **`presort-server.js`** - Express server for UI
- **`PRESORT_GUIDE.md`** - This guide (you are here)

## 🆘 Troubleshooting

### "Invalid X-PB-Integrator-CarrierId"
- Verify Carrier ID: 987654321
- Check configuration in `config.js`

### "Invalid X-PB-ShipmentGroupId"
- Verify Job Number: 500002
- Check configuration in `config.js`

### "Invalid Permit"
- Required for LGENV, LETTER, FLAT
- Not required for PKG
- Check permit number, city, and state

### "Address validation failed"
- Ensure valid US address
- Check ZIP code format
- Use full address details

## 🔗 Resources

- **API Documentation**: https://docs.shippingapi.pitneybowes.com/api/post-shipments-pb-presort.html
- **PB Presort Overview**: https://docs.shippingapi.pitneybowes.com/carriers/pb-presort.html
- **Error Codes**: See `docs/` folder
- **Support**: Pitney Bowes Developer Portal

## ✅ Quick Checklist

Before creating a shipment, ensure you have:

- [ ] Valid US addresses (from and to)
- [ ] Parcel weight and dimensions
- [ ] Correct service ID (STANDARD or FCM)
- [ ] Correct parcel type (LGENV, PKG, LETTER, FLAT)
- [ ] Shipper ID configured
- [ ] Permit info (if using LGENV, LETTER, or FLAT)
- [ ] Unique transaction ID

## 🎉 You're Ready!

Everything is configured and ready to go. Choose your method:

**Quick Test**:
```bash
node presort-shipment.js
```

**Interactive UI**:
```bash
node presort-server.js
# Open http://localhost:3000
```

Happy shipping! 📦


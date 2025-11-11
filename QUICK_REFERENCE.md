# PB Presort Quick Reference Card

## 🚀 Start Testing UI

```bash
node presort-server.js
# Open: http://localhost:8080
```

## 💻 Command Line Test

```bash
node presort-shipment.js
```

## 📋 Your Credentials

| Setting | Value |
|---------|-------|
| **Developer ID** | 85771237 |
| **Merchant ID** | 3800270633 |
| **Carrier ID** | 987654321 |
| **Job Number** | 500002 |
| **Permit ID** | PBPS |
| **Environment** | Sandbox |

## 📦 Service Matrix

| Service | Parcel Type | Barcode | Max Weight | Permit Required |
|---------|-------------|---------|------------|-----------------|
| **STANDARD** | LGENV | IMb | 13 oz | Yes |
| **STANDARD** | PKG | IMpb | 25 lbs | No |
| **FCM** | LETTER | IMb | 3.5 oz | Yes |
| **FCM** | FLAT | IMb | 13 oz | Yes |

## 🏷️ Label Options

### Sizes
- `DOC_6X4` - 6x4 inches
- `DOC_8X11` - 8.5x11 inches

### Formats
- `PDF` - Portable Document Format
- `PNG` - Image format
- `ZPL` - Zebra printer format

## 🔑 Required Headers

```javascript
{
  'X-PB-TransactionId': 'unique-id-here',
  'X-PB-ShipmentGroupId': '500002',
  'X-PB-Integrator-CarrierId': '987654321',
  'X-PB-UnifiedErrorStructure': true
}
```

## 📝 Minimal Code Example

```javascript
const { createPresortShipment } = require('./presort-shipment');

const result = await createPresortShipment({
  serviceId: 'STANDARD',
  parcelType: 'LGENV',
  fromName: 'John Smith',
  fromAddress: ['4750 Walnut St'],
  fromCity: 'Boulder',
  fromState: 'CO',
  fromZip: '80301',
  toName: 'Mary Jones',
  toAddress: ['4588 W Fulton'],
  toCity: 'Garden City',
  toState: 'KS',
  toZip: '67846',
  weight: 3,
  length: 12,
  width: 0.25,
  height: 9
});
```

## ✅ Pre-Shipment Checklist

- [ ] Valid US addresses (domestic only)
- [ ] Weight and dimensions entered
- [ ] Correct service ID (STANDARD or FCM)
- [ ] Correct parcel type (LGENV, PKG, LETTER, FLAT)
- [ ] Permit info (if using LGENV, LETTER, or FLAT)

## 🎯 Response Fields

```javascript
{
  shipmentId: "PBPRESORT2200122647812392",
  parcelTrackingNumber: "0070698765432100221106510123814",
  documents: [{
    contents: "https://.../label.pdf",
    fileFormat: "PDF",
    size: "DOC_6X4"
  }],
  rates: [{
    baseCharge: 0.0,
    totalCarrierCharge: 0.0,
    destinationZone: "4"
  }]
}
```

## ⚠️ Key Limitations

- ❌ **Domestic Only** - US destinations only
- ❌ **No Rating API** - Use rate charts
- ❌ **No Refunds** - Void requests fail
- ❌ **No Future Dates** - Same-day only
- ⏰ **Tracking Delay** - Wait for file upload

## 🔍 Track Shipment

```javascript
const api = new ShippingApi.TrackingApi();
api.getTrackingDetails(
  trackingNumber,
  'USPS',  // Required
  opts,
  callback
);
```

## 📁 Project Files

| File | Purpose |
|------|---------|
| `presort-shipment.js` | Core logic |
| `presort-ui.html` | Web interface |
| `presort-server.js` | Express server |
| `PRESORT_GUIDE.md` | Full documentation |

## 🆘 Common Errors

### "Invalid X-PB-Integrator-CarrierId"
**Fix**: Check config.js - should be `987654321`

### "Invalid X-PB-ShipmentGroupId"
**Fix**: Check config.js - should be `500002`

### "Invalid Permit"
**Fix**: Required for LGENV, LETTER, FLAT. Not for PKG.

### "Address validation failed"
**Fix**: Ensure valid US address with correct ZIP

## 📞 Support Resources

- **Local Guide**: `PRESORT_GUIDE.md`
- **API Docs**: https://docs.shippingapi.pitneybowes.com/api/post-shipments-pb-presort.html
- **PB Presort**: https://docs.shippingapi.pitneybowes.com/carriers/pb-presort.html

## 🎉 Quick Start

**Option 1 - Web UI**:
```bash
node presort-server.js
# Open http://localhost:8080
```

**Option 2 - CLI**:
```bash
node presort-shipment.js
```

---

**Documentation**: Based on [PB Presort API Reference](https://docs.shippingapi.pitneybowes.com/api/post-shipments-pb-presort.html)


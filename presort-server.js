/**
 * Simple Express server for PB Presort UI
 * Handles the actual API calls from the browser
 */

const express = require('express');
const path = require('path');
const { createPresortShipmentDirect } = require('./presort-direct');

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Serve the UI
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'presort-ui.html'));
});

// API endpoint to create shipment
app.post('/api/create-shipment', async (req, res) => {
  // Set a timeout for the API call
  req.setTimeout(60000); // 60 seconds
  
  try {
    console.log('\n📦 Received shipment request from UI');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const options = {
      // Service config
      serviceId: req.body.serviceId,
      parcelType: req.body.parcelType,
      labelSize: req.body.labelSize,
      labelFormat: req.body.labelFormat,
      
      // Permit info
      shipperId: req.body.shipperId,
      permitNumber: req.body.permitNumber,
      permitCity: req.body.permitCity,
      permitState: req.body.permitState,
      
      // From address
      fromCompany: req.body.fromCompany,
      fromName: req.body.fromName,
      fromPhone: req.body.fromPhone,
      fromEmail: req.body.fromEmail,
      fromAddressLines: [req.body.fromAddress],
      fromCity: req.body.fromCity,
      fromState: req.body.fromState,
      fromZip: req.body.fromZip,
      
      // To address
      toCompany: req.body.toCompany,
      toName: req.body.toName,
      toPhone: req.body.toPhone,
      toEmail: req.body.toEmail,
      toAddressLines: [req.body.toAddress],
      toCity: req.body.toCity,
      toState: req.body.toState,
      toZip: req.body.toZip,
      toResidential: req.body.toResidential || false,
      
      // Parcel
      weight: parseFloat(req.body.weight),
      length: parseFloat(req.body.length),
      width: parseFloat(req.body.width),
      height: parseFloat(req.body.height),
      
      // Optional
      customMessage1: req.body.customMessage1,
      customMessage2: req.body.customMessage2
    };
    
    const result = await createPresortShipmentDirect(options);
    
    res.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('❌ Shipment creation failed:', error.message);
    console.error('Stack:', error.stack);
    
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.body || error.toString()
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║  🚀 PB Presort Testing Server Running                         ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

  📱 Open your browser to: http://localhost:${PORT}
  
  🔧 Configuration:
     Developer ID: 85771237
     Carrier ID: 987654321
     Job Number: 500002
  
  📖 Documentation:
     https://docs.shippingapi.pitneybowes.com/api/post-shipments-pb-presort.html
  
  Press Ctrl+C to stop the server
  
`);
});


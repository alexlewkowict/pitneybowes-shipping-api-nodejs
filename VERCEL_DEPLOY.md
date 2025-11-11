# Vercel Deployment Guide

## 🚀 Quick Deploy

Your project is now configured for Vercel deployment!

### Project Structure

```
pitneybowes-shipping-api-nodejs/
├── api/
│   └── create-shipment.js    # Serverless function
├── public/
│   └── index.html             # PB Presort UI
├── vercel.json                # Vercel configuration
└── .vercelignore              # Files to exclude
```

## 📦 What Gets Deployed

- **Frontend**: PB Presort testing UI at `/`
- **API**: Shipment creation endpoint at `/api/create-shipment`

## 🔧 Environment Variables (Optional)

You can set these in Vercel dashboard if you want to override defaults:

| Variable | Default | Description |
|----------|---------|-------------|
| `PB_API_KEY` | `0oa2jnd4gabhQa7I30h8` | Pitney Bowes API Key |
| `PB_API_SECRET` | `DHaJj...` | Pitney Bowes API Secret |
| `PB_DEVELOPER_ID` | `85771237` | Developer ID |
| `PB_MERCHANT_ID` | `3800270633` | Merchant ID |
| `PB_CARRIER_ID` | `987654321` | Carrier/Mailer ID |
| `PB_SHIPMENT_GROUP_ID` | `500002` | Job Number |
| `PB_PERMIT_ID` | `PBPS` | Permit ID |

**Note**: Credentials are currently hardcoded in `api/create-shipment.js`. For production, set these as Vercel environment variables.

## 🌐 Deploy Steps

### Option 1: GitHub Integration (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push origin master
   ```

2. **Import to Vercel**:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect the configuration
   - Click "Deploy"

3. **Done!** Your app will be live at `your-project.vercel.app`

### Option 2: Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **For production**:
   ```bash
   vercel --prod
   ```

## 📋 After Deployment

Your deployed app will have:

- **UI**: `https://your-project.vercel.app/`
- **API**: `https://your-project.vercel.app/api/create-shipment`

The UI will automatically connect to the API endpoint.

## 🔒 Security Notes

### For Production Deployment:

1. **Move credentials to environment variables**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all the `PB_*` variables
   - Redeploy

2. **Update `api/create-shipment.js`**:
   ```javascript
   // Remove defaults, require env vars
   const config = {
     apiKey: process.env.PB_API_KEY,
     apiSecret: process.env.PB_API_SECRET,
     // ... etc, without defaults
   };
   
   // Add validation
   if (!config.apiKey || !config.apiSecret) {
     throw new Error('Missing required environment variables');
   }
   ```

## 🧪 Testing Deployed App

Once deployed, test it:

1. **Open the URL**: `https://your-project.vercel.app`
2. **Fill the form** with shipment details
3. **Click "Create Shipment"**
4. **Get your label** in 2-3 seconds!

## 🐛 Troubleshooting

### Build fails with "No Output Directory"
✅ **Fixed!** - `vercel.json` and `public/` directory are now configured

### API returns 500 error
- Check Vercel function logs in dashboard
- Verify environment variables are set
- Check API credentials are valid

### CORS errors
✅ **Fixed!** - CORS headers are configured in `api/create-shipment.js`

## 📊 Monitoring

View logs in Vercel Dashboard:
- Go to your project
- Click "Functions" tab
- Select `api/create-shipment`
- View real-time logs

## 🔄 Updating

To update the deployed app:

```bash
# Make changes
git add .
git commit -m "Update message"
git push

# Vercel auto-deploys on push!
```

## 💰 Cost

- **Hobby Plan** (Free): 
  - Perfect for this project
  - 100 GB bandwidth/month
  - 100 GB-hours serverless execution
  
- This project uses minimal resources

## 🎉 Success!

Your PB Presort testing UI is now deployed and accessible from anywhere!

**Next Steps**:
1. Push your code to GitHub
2. Connect to Vercel
3. Deploy
4. Share the URL with your team!

---

**Documentation**: Based on Vercel serverless functions
**Support**: https://vercel.com/docs


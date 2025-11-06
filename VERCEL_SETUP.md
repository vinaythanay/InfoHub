# Vercel Deployment Configuration Guide

## Step-by-Step Vercel Setup

### 1. Root Directory
- **Keep as:** `./` (root of the project)

### 2. Build and Output Settings

#### For Frontend (Client):
Since your frontend is in the `client/` folder, you have two options:

**Option A: Configure Client Directory (Recommended)**
- **Root Directory:** `./client`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

**Option B: Use Root with Custom Build**
- **Root Directory:** `./`
- **Build Command:** `cd client && npm run build`
- **Output Directory:** `client/dist`
- **Install Command:** `cd client && npm install`

### 3. Environment Variables

Add these environment variables in Vercel:

#### Required:
```
OPENWEATHER_API_KEY=5b2c4a1e2bcab5f9cf78d4a3dd7edb24
```

#### Optional (for frontend):
```
VITE_API_URL=https://your-vercel-app.vercel.app
```

### 4. Framework Preset
- Select: **Vite** (or "Other" if Vite is not available)

### 5. API Routes Configuration

Your `api/` folder will automatically be deployed as serverless functions. The `vercel.json` file should handle the routing.

---

## Quick Setup Steps:

1. **Go to your Vercel project settings**
2. **Root Directory:** Leave as `./` or set to `./client`
3. **Build Command:** 
   - If Root is `./`: `cd client && npm run build`
   - If Root is `./client`: `npm run build`
4. **Output Directory:** 
   - If Root is `./`: `client/dist`
   - If Root is `./client`: `dist`
5. **Install Command:** 
   - If Root is `./`: `cd client && npm install`
   - If Root is `./client`: `npm install`
6. **Environment Variables:**
   - Click "Add New"
   - Key: `OPENWEATHER_API_KEY`
   - Value: `5b2c4a1e2bcab5f9cf78d4a3dd7edb24`
   - Click "Save"

---

## Alternative: Using vercel.json (Already Configured)

Your project already has a `vercel.json` file that should handle the configuration automatically. If you're using this approach:

1. **Root Directory:** `./`
2. **Build Command:** Leave empty (vercel.json handles it)
3. **Output Directory:** Leave empty (vercel.json handles it)
4. **Environment Variables:** Still add `OPENWEATHER_API_KEY`

---

## Testing After Deployment

After deployment, check:
1. Frontend loads correctly
2. API routes work: `https://your-app.vercel.app/api/weather?city=Mumbai`
3. Currency conversion: `https://your-app.vercel.app/api/currency?amount=1000`
4. Quotes: `https://your-app.vercel.app/api/quote`

---

## Troubleshooting

### If build fails:
- Check that all dependencies are in `package.json`
- Verify the build command path is correct
- Check Vercel build logs for errors

### If API routes don't work:
- Ensure `api/index.js` exists
- Check environment variables are set
- Verify `vercel.json` configuration

### If frontend can't connect to API:
- The components now automatically use relative URLs in production (fixed)
- No need to set `VITE_API_URL` unless you want to use a different API server
- Relative URLs (`/api/...`) work automatically on Vercel

---

## Recommended Final Configuration:

**Root Directory:** `./client`  
**Build Command:** `npm run build`  
**Output Directory:** `dist`  
**Install Command:** `npm install`  
**Framework Preset:** Vite  

**Environment Variables:**
- `OPENWEATHER_API_KEY` = `5b2c4a1e2bcab5f9cf78d4a3dd7edb24`

This is the simplest configuration for a Vite + React frontend.



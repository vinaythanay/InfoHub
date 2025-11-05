# Quick Setup Guide

## Prerequisites
- Node.js v18+ installed
- npm or yarn package manager

## Local Development Setup

### 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file (copy from .env.example)
# Windows: copy .env.example .env
# Mac/Linux: cp .env.example .env

# Edit .env and add your OpenWeatherMap API key (optional - app works without it)
# PORT=3001
# OPENWEATHER_API_KEY=your_key_here

# Start the server
npm start
```

Backend will run on: `http://localhost:3001`

### 2. Frontend Setup

Open a new terminal:

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

### 3. Test the Application

1. Open `http://localhost:5173` in your browser
2. Click on different tabs (Weather, Currency, Quotes)
3. Test each module:
   - **Weather**: Search for a city
   - **Currency**: Enter an amount in INR
   - **Quotes**: Click "New Quote" for a new quote

## API Keys (Optional)

### OpenWeatherMap API Key
1. Go to https://openweathermap.org/api
2. Sign up for a free account
3. Get your API key
4. Add it to `server/.env` file

**Note**: The app works without the API key using fallback data.

## Deployment to Vercel

1. **Push code to GitHub**

2. **Go to Vercel Dashboard**
   - Visit https://vercel.com
   - Sign up/Login
   - Click "New Project"

3. **Import Repository**
   - Connect your GitHub account
   - Select the InfoHub-Challenge repository
   - Click "Import"

4. **Configure Project**
   - Root Directory: Leave as is (or set to project root)
   - Framework Preset: Other
   - Build Command: `cd client && npm run build`
   - Output Directory: `client/dist`

5. **Environment Variables**
   - Add `OPENWEATHER_API_KEY` (if you have one)

6. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete

7. **Configure API Routes**
   - After deployment, you may need to configure API routes
   - In Vercel project settings, ensure `/api/*` routes point to serverless functions

## Troubleshooting

### Port Already in Use
Change the PORT in `server/.env`:
```
PORT=3002
```

### CORS Errors
- Ensure backend is running
- Check that frontend is using correct API URL
- In development, Vite proxy handles this automatically

### API Not Working
- Check network connection
- Verify API keys (if using)
- App will use fallback data if APIs fail

## Project Structure

```
InfoHub-Challenge/
├── server/           # Backend API
│   ├── server.js    # Express server
│   └── package.json
├── client/          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   └── App.jsx
│   └── package.json
└── README.md        # Full documentation
```

## Need Help?

Refer to the main README.md for detailed documentation.

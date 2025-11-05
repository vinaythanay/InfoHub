# Weather API Setup - Troubleshooting

## ❌ Current Issue: Invalid API Key

Your current API key (`5b2c4a1e2bcab5f9cf78d4a3dd7edb24`) is returning a **401 Unauthorized** error, which means:
- The API key is invalid or expired
- The API key hasn't been activated yet (new keys need 10-15 minutes to activate)
- The API key might have been revoked

## ✅ Solution: Get a New API Key

### Step 1: Get Your API Key

1. **Visit**: https://openweathermap.org/api
2. **Sign up** for a free account (or log in if you have one)
3. **Navigate to**: "API keys" section in your account
4. **Create a new key** or copy an existing active key
5. **Wait 10-15 minutes** for the key to activate (if it's a new key)

### Step 2: Update Your `.env` File

Replace the API key in `server/.env`:

```env
PORT=3001
OPENWEATHER_API_KEY=your_new_api_key_here
```

### Step 3: Restart Your Server

After updating the `.env` file, restart your server:

```bash
cd server
npm start
```

## 🔍 How to Verify Your API Key Works

Test your API key directly:

```bash
# Replace YOUR_API_KEY with your actual key
curl "https://api.openweathermap.org/data/2.5/weather?q=Mumbai&appid=YOUR_API_KEY&units=metric"
```

If you get weather data, your key is working! ✅

If you get a 401 error, your key is invalid. ❌

## 📝 Important Notes

1. **City Names**: Use specific city names, not state names
   - ✅ Good: "Mumbai", "Delhi", "Shimla", "Bangalore"
   - ❌ Bad: "Himachal Pradesh", "Maharashtra", "Karnataka"

2. **API Key Activation**: New keys take 10-15 minutes to activate

3. **Free Tier Limits**: 
   - 60 calls/minute
   - 1,000,000 calls/month
   - Perfect for development!

## 🐛 Debugging

The improved code now logs errors to help you debug:

- Check your server console for error messages
- Look for messages like:
  - `⚠️  No API key found` - API key not loaded
  - `❌ Weather API Error: 401` - Invalid API key
  - `❌ Weather API Error: 404` - City not found

## ✅ After Fixing

Once you have a valid API key:
- Different cities will show different weather data
- Real-time weather information from OpenWeatherMap
- No more fallback data (unless API is down)


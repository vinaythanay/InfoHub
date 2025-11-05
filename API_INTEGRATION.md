# External API Integration Guide

This document describes the external APIs used in the InfoHub application and how to configure them.

## 🌐 APIs Used

### 1. Weather API - OpenWeatherMap

**Endpoint**: `https://api.openweathermap.org/data/2.5/weather`

**Purpose**: Fetch real-time weather data for any city worldwide.

**Features**:
- Current temperature in Celsius
- Weather description
- Humidity percentage
- Wind speed in km/h
- Weather icons

**API Key Required**: ✅ Yes (but optional - app works with fallback data)

**How to Get API Key**:
1. Visit https://openweathermap.org/api
2. Sign up for a free account
3. Navigate to "API keys" section
4. Copy your API key
5. Add it to your `.env` file: `OPENWEATHER_API_KEY=your_key_here`

**Free Tier Limits**:
- 60 calls/minute
- 1,000,000 calls/month
- Perfect for development and small projects

**Fallback Behavior**: 
If API key is missing or API fails, the app returns fallback weather data (28°C, Partly cloudy, 65% humidity, 12 km/h wind speed).

---

### 2. Currency Exchange API - ExchangeRate-API

**Endpoint**: `https://api.exchangerate-api.com/v4/latest/INR`

**Purpose**: Get real-time exchange rates for currency conversion (INR → USD/EUR).

**Features**:
- Live exchange rates
- No API key required (completely free!)
- Updates daily
- Supports 160+ currencies

**API Key Required**: ❌ No

**Free Tier**:
- No rate limits for basic usage
- Free forever
- No registration required

**Fallback Behavior**:
If API fails, the app uses fallback rates:
- USD: 0.0120 (1 INR = $0.012)
- EUR: 0.0110 (1 INR = €0.011)

---

### 3. Quotes API - Quotable.io

**Endpoint**: `https://api.quotable.io/random?tags=motivational`

**Purpose**: Fetch random motivational quotes.

**Features**:
- Random motivational quotes
- Includes author attribution
- No API key required
- Large database of quotes

**API Key Required**: ❌ No

**Free Tier**:
- No rate limits
- Free forever
- No registration required

**Fallback Behavior**:
If API fails, the app uses a local list of 8 curated motivational quotes from famous personalities.

---

## 🔧 Configuration

### For Local Development (`server/server.js`)

1. Create a `.env` file in the `server/` directory:
   ```env
   PORT=3001
   OPENWEATHER_API_KEY=your_openweather_api_key_here
   ```

2. The currency and quotes APIs work without any configuration!

### For Vercel Deployment (`api/index.js`)

1. In Vercel Dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add: `OPENWEATHER_API_KEY` with your API key value

2. The currency and quotes APIs work automatically!

---

## 📡 API Endpoints

### Weather
```
GET /api/weather?city=Mumbai
```

**Response**:
```json
{
  "city": "Mumbai",
  "temperature": 28,
  "description": "partly cloudy",
  "humidity": 65,
  "windSpeed": 12,
  "icon": "02d"
}
```

### Currency
```
GET /api/currency?amount=1000
```

**Response**:
```json
{
  "amount": 1000,
  "from": "INR",
  "conversions": {
    "usd": 12.00,
    "eur": 11.00
  },
  "rates": {
    "usd": "0.0120",
    "eur": "0.0110"
  }
}
```

### Quotes
```
GET /api/quote
```

**Response**:
```json
{
  "text": "The only way to do great work is to love what you do.",
  "author": "Steve Jobs"
}
```

---

## 🛡️ Error Handling

All APIs have robust error handling:

1. **Timeout Protection**: All API calls have a 5-second timeout
2. **Fallback Data**: If external APIs fail, the app uses fallback data
3. **Graceful Degradation**: App continues to work even if APIs are unavailable
4. **User-Friendly Messages**: Clear error messages for users

---

## 📊 API Status & Reliability

| API | Status | Reliability | Notes |
|-----|--------|-------------|-------|
| OpenWeatherMap | ✅ Active | High | Requires API key (free tier available) |
| ExchangeRate-API | ✅ Active | High | Free, no API key needed |
| Quotable.io | ✅ Active | High | Free, no API key needed |

---

## 🔄 Alternative APIs (If Needed)

### Weather Alternatives:
- **WeatherAPI.com** - Free tier: 1M calls/month
- **Weatherbit.io** - Free tier: 500 calls/day
- **AccuWeather** - Limited free tier

### Currency Alternatives:
- **Fixer.io** - Free tier: 100 requests/month
- **CurrencyLayer** - Free tier: 1,000 requests/month
- **ExchangeRate-API** (current) - Unlimited free tier ✅

### Quotes Alternatives:
- **ZenQuotes API** - Free, no key needed
- **Forismatic API** - Free, no key needed
- Local quotes array (current fallback) ✅

---

## ✅ Summary

✅ **Weather**: OpenWeatherMap (requires free API key, optional)  
✅ **Currency**: ExchangeRate-API (free, no key needed)  
✅ **Quotes**: Quotable.io (free, no key needed)  

All three APIs are properly integrated with:
- ✅ Error handling
- ✅ Fallback mechanisms
- ✅ Timeout protection
- ✅ Graceful degradation

The app works perfectly even without the OpenWeatherMap API key using fallback data!


// Vercel serverless function wrapper for Express app
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Simple in-memory cache (Note: In serverless, this resets between invocations)
// For production, consider using Redis or a database
const weatherCache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

const getCachedWeather = (key) => {
  const cached = weatherCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedWeather = (key, data) => {
  weatherCache.set(key, {
    data,
    timestamp: Date.now()
  });
};

// Middleware
app.use(cors());
app.use(express.json());

// Default location for weather
const DEFAULT_CITY = 'Mumbai';

// Fallback quotes
const FALLBACK_QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" }
];

// Weather API endpoint
app.get('/api/weather', async (req, res) => {
  try {
    const city = req.query.city;
    const lat = req.query.lat;
    const lon = req.query.lon;
    
    // Check cache first
    const cacheKey = city ? `city:${city}` : `coord:${lat},${lon}`;
    const cached = getCachedWeather(cacheKey);
    if (cached) {
      return res.json(cached);
    }
    
    // Validate - need either city or coordinates
    if ((!city || city.trim().length === 0) && (!lat || !lon)) {
      return res.status(400).json({ 
        error: 'Invalid city name',
        message: 'Please provide a valid city name or coordinates.'
      });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    // Convert lat/lon to numbers if they're strings
    const latitude = lat ? parseFloat(lat) : null;
    const longitude = lon ? parseFloat(lon) : null;
    
    // Check if we have valid coordinates
    const hasCoordinates = latitude && longitude && !isNaN(latitude) && !isNaN(longitude);
    
    if (!apiKey) {
      console.log('⚠️  No API key found - using fallback data');
      return res.json({
        city: hasCoordinates ? 'Your Location' : (city || DEFAULT_CITY),
        temperature: 28,
        description: 'Partly cloudy',
        humidity: 65,
        windSpeed: 12,
        icon: '02d',
        note: 'API key not configured - using fallback data'
      });
    }

    try {
      const params = { appid: apiKey, units: 'metric' };
      if (hasCoordinates) {
        params.lat = latitude;
        params.lon = longitude;
      } else {
        params.q = (city || DEFAULT_CITY).trim();
      }
      
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
        params,
        timeout: 5000
      });

      const data = response.data;
      
      const weatherData = {
        city: data.name,
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6),
        icon: data.weather[0].icon
      };
      
      // Cache the result
      setCachedWeather(cacheKey, weatherData);
      res.json(weatherData);
    } catch (apiError) {
      // Log the actual error for debugging
      console.error('❌ Weather API Error:', {
        city: city,
        status: apiError.response?.status,
        statusText: apiError.response?.statusText,
        message: apiError.message,
        data: apiError.response?.data
      });

      // Check if it's a "city not found" error (404)
      if (apiError.response?.status === 404 || apiError.response?.status === 400) {
        return res.status(404).json({ 
          error: 'Invalid city name',
          message: `City "${city}" not found. Please try a different city name.`,
          suggestion: 'Try using a specific city name (e.g., "Shimla" instead of "Himachal Pradesh")'
        });
      }

      // Check if it's an invalid API key error (401)
      if (apiError.response?.status === 401) {
        return res.status(401).json({ 
          error: 'Invalid API key',
          message: 'Invalid API key. Please check your OpenWeatherMap API key configuration.'
        });
      }

      // Check for network/timeout errors
      if (apiError.code === 'ECONNABORTED' || apiError.code === 'ETIMEDOUT') {
        return res.status(408).json({ 
          error: 'Failed to fetch data',
          message: 'Request timeout. Please check your internet connection and try again.'
        });
      }

      // Check for network errors
      if (apiError.code === 'ENOTFOUND' || apiError.code === 'ECONNREFUSED') {
        return res.status(503).json({ 
          error: 'Failed to fetch data',
          message: 'Unable to connect to weather service. Please try again later.'
        });
      }

      // Fallback if API fails for other reasons
      res.status(500).json({ 
        error: 'Failed to fetch data',
        message: 'Unable to fetch weather data. Please try again later.',
        note: 'Using fallback data due to API unavailability'
      });
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch data',
      message: 'An unexpected error occurred. Please try again later.'
    });
  }
});

app.get('/api/currency', async (req, res) => {
  try {
    const amount = parseFloat(req.query.amount);
    
    if (!amount || isNaN(amount) || amount < 0) {
      return res.status(400).json({ 
        error: 'Invalid amount',
        message: 'Please provide a valid positive amount (INR).'
      });
    }

    try {
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/INR', {
        timeout: 5000
      });

      const rates = response.data.rates;
      const usdRate = rates.USD;
      const eurRate = rates.EUR;

      res.json({
        amount: amount,
        from: 'INR',
        conversions: {
          usd: parseFloat((amount * usdRate).toFixed(2)),
          eur: parseFloat((amount * eurRate).toFixed(2))
        },
        rates: {
          usd: usdRate.toFixed(4),
          eur: eurRate.toFixed(4)
        }
      });
    } catch (apiError) {
      console.error('❌ Currency API Error:', apiError.message);
      
      // Fallback rates if API fails
      const fallbackUsdRate = 0.012;
      const fallbackEurRate = 0.011;
      
      res.json({
        amount: amount,
        from: 'INR',
        conversions: {
          usd: parseFloat((amount * fallbackUsdRate).toFixed(2)),
          eur: parseFloat((amount * fallbackEurRate).toFixed(2))
        },
        rates: {
          usd: fallbackUsdRate.toFixed(4),
          eur: fallbackEurRate.toFixed(4)
        },
        note: 'Using fallback rates due to API unavailability',
        error: 'Failed to fetch data'
      });
    }
  } catch (error) {
    console.error('❌ Unexpected currency error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch data',
      message: 'Could not fetch currency conversion. Please try again later.'
    });
  }
});

app.get('/api/quote', async (req, res) => {
  try {
    try {
      const response = await axios.get('https://api.quotable.io/random?tags=motivational', {
        timeout: 5000
      });

      res.json({
        text: response.data.content,
        author: response.data.author
      });
    } catch (apiError) {
      // Fallback to local quotes if API fails (silently)
      const randomQuote = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
      res.json({
        text: randomQuote.text,
        author: randomQuote.author
      });
    }
  } catch (error) {
    console.error('❌ Unexpected quotes error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch data',
      message: 'Could not fetch quote. Please try again later.'
    });
  }
});

// Weather Forecast endpoint (3-day forecast)
app.get('/api/weather/forecast', async (req, res) => {
  try {
    const city = req.query.city || DEFAULT_CITY;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (!apiKey) {
      return res.json({ error: 'API key not configured' });
    }

    // Check cache
    const cacheKey = `forecast:${city}`;
    const cached = getCachedWeather(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
        params: { q: city.trim(), appid: apiKey, units: 'metric', cnt: 24 },
        timeout: 5000
      });

      // Process forecast data - group by day and take first 3 days
      const forecastData = response.data.list;
      const dailyForecast = [];
      
      // Group forecasts by day
      const forecastsByDay = {};
      forecastData.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toDateString();
        
        if (!forecastsByDay[dayKey]) {
          forecastsByDay[dayKey] = [];
        }
        forecastsByDay[dayKey].push(item);
      });

      // Get first 3 days
      const days = Object.keys(forecastsByDay).slice(0, 3);
      days.forEach(dayKey => {
        const dayForecasts = forecastsByDay[dayKey];
        const dayData = dayForecasts[0];
        
        dailyForecast.push({
          date: dayKey,
          day: new Date(dayKey).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          temperature: Math.round(dayData.main.temp),
          description: dayData.weather[0].description,
          icon: dayData.weather[0].icon,
          humidity: dayData.main.humidity,
          windSpeed: Math.round(dayData.wind.speed * 3.6)
        });
      });

      const forecastResult = {
        city: response.data.city.name,
        forecast: dailyForecast
      };
      
      setCachedWeather(cacheKey, forecastResult);
      res.json(forecastResult);
    } catch (apiError) {
      res.json({ error: 'Could not fetch forecast' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch forecast' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'InfoHub API is running' });
});

module.exports = app;

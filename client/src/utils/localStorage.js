// Utility functions for localStorage management

export const StorageKeys = {
  FAVORITE_CITIES: 'infohub_favorite_cities',
  FAVORITE_QUOTES: 'infohub_favorite_quotes',
  CONVERSION_HISTORY: 'infohub_conversion_history',
  LAST_WEATHER: 'infohub_last_weather',
  LAST_CITY: 'infohub_last_city',
  LAST_FORECAST: 'infohub_last_forecast',
  LAST_CONVERSION: 'infohub_last_conversion',
  LAST_QUOTE: 'infohub_last_quote'
}

// Generic storage functions
export const getStorageItem = (key, defaultValue = []) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error)
    return defaultValue
  }
}

export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error)
    return false
  }
}

export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error)
    return false
  }
}

// Favorite Cities
export const getFavoriteCities = () => {
  return getStorageItem(StorageKeys.FAVORITE_CITIES, [])
}

export const addFavoriteCity = (city) => {
  const cities = getFavoriteCities()
  if (!cities.includes(city)) {
    cities.push(city)
    setStorageItem(StorageKeys.FAVORITE_CITIES, cities)
    return true
  }
  return false
}

export const removeFavoriteCity = (city) => {
  const cities = getFavoriteCities()
  const filtered = cities.filter(c => c !== city)
  setStorageItem(StorageKeys.FAVORITE_CITIES, filtered)
  return true
}

export const isFavoriteCity = (city) => {
  const cities = getFavoriteCities()
  return cities.includes(city)
}

// Favorite Quotes
export const getFavoriteQuotes = () => {
  return getStorageItem(StorageKeys.FAVORITE_QUOTES, [])
}

export const addFavoriteQuote = (quote) => {
  const quotes = getFavoriteQuotes()
  // Check if quote already exists (by text and author)
  const exists = quotes.some(q => q.text === quote.text && q.author === quote.author)
  if (!exists) {
    quotes.push({
      ...quote,
      savedAt: new Date().toISOString()
    })
    setStorageItem(StorageKeys.FAVORITE_QUOTES, quotes)
    return true
  }
  return false
}

export const removeFavoriteQuote = (quote) => {
  const quotes = getFavoriteQuotes()
  const filtered = quotes.filter(q => !(q.text === quote.text && q.author === quote.author))
  setStorageItem(StorageKeys.FAVORITE_QUOTES, filtered)
  return true
}

export const isFavoriteQuote = (quote) => {
  const quotes = getFavoriteQuotes()
  return quotes.some(q => q.text === quote.text && q.author === quote.author)
}

// Conversion History
export const getConversionHistory = () => {
  return getStorageItem(StorageKeys.CONVERSION_HISTORY, [])
}

export const addConversionHistory = (conversion) => {
  const history = getConversionHistory()
  // Add timestamp
  const entry = {
    ...conversion,
    timestamp: new Date().toISOString()
  }
  // Add to beginning of array (most recent first)
  history.unshift(entry)
  // Keep only last 50 entries
  const limited = history.slice(0, 50)
  setStorageItem(StorageKeys.CONVERSION_HISTORY, limited)
  return true
}

export const clearConversionHistory = () => {
  setStorageItem(StorageKeys.CONVERSION_HISTORY, [])
  return true
}

// Last Weather Data
export const getLastWeather = () => {
  return getStorageItem(StorageKeys.LAST_WEATHER, null)
}

export const saveLastWeather = (weather) => {
  setStorageItem(StorageKeys.LAST_WEATHER, weather)
  return true
}

export const getLastCity = () => {
  return localStorage.getItem(StorageKeys.LAST_CITY) || ''
}

export const saveLastCity = (city) => {
  localStorage.setItem(StorageKeys.LAST_CITY, city)
  return true
}

export const getLastForecast = () => {
  return getStorageItem(StorageKeys.LAST_FORECAST, null)
}

export const saveLastForecast = (forecast) => {
  setStorageItem(StorageKeys.LAST_FORECAST, forecast)
  return true
}

// Last Conversion Data
export const getLastConversion = () => {
  return getStorageItem(StorageKeys.LAST_CONVERSION, null)
}

export const saveLastConversion = (conversion) => {
  setStorageItem(StorageKeys.LAST_CONVERSION, conversion)
  return true
}

// Last Quote Data
export const getLastQuote = () => {
  return getStorageItem(StorageKeys.LAST_QUOTE, null)
}

export const saveLastQuote = (quote) => {
  setStorageItem(StorageKeys.LAST_QUOTE, quote)
  return true
}


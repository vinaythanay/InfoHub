import { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  getFavoriteCities, 
  addFavoriteCity, 
  removeFavoriteCity, 
  isFavoriteCity,
  getLastWeather,
  saveLastWeather,
  getLastCity,
  saveLastCity,
  getLastForecast,
  saveLastForecast
} from '../utils/localStorage'
import { celsiusToFahrenheit, getWeatherEmoji } from '../utils/weatherUtils'

const WeatherModule = () => {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [favoriteCities, setFavoriteCities] = useState([])
  const [showFavorites, setShowFavorites] = useState(false)
  const [temperatureUnit, setTemperatureUnit] = useState(() => {
    return localStorage.getItem('infohub_temp_unit') || 'celsius'
  })
  const [locationEnabled, setLocationEnabled] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  const fetchForecast = async (cityName) => {
    try {
      const response = await axios.get(`${API_URL}/api/weather/forecast`, {
        params: { city: cityName },
      })
      if (response.data && !response.data.error) {
        setForecast(response.data)
        // Save forecast to localStorage
        saveLastForecast(response.data)
      }
    } catch (err) {
      // Forecast is optional, so we don't show errors
      console.log('Forecast not available')
    }
  }

  useEffect(() => {
    setFavoriteCities(getFavoriteCities())
    localStorage.setItem('infohub_temp_unit', temperatureUnit)
  }, [temperatureUnit])

  // Load last viewed weather on mount
  useEffect(() => {
    const lastWeather = getLastWeather()
    const lastCity = getLastCity()
    const lastForecast = getLastForecast()
    
    if (lastWeather && lastCity) {
      // Restore last viewed weather
      setWeather(lastWeather)
      setCity(lastCity)
      if (lastForecast) {
        setForecast(lastForecast)
      }
    }
  }, [])

  // Get user location on mount (only if no saved data)
  useEffect(() => {
    const lastWeather = getLastWeather()
    
    // Only try location if we don't have saved weather data
    if (!lastWeather && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            setLocationEnabled(true)
            setLoading(true)
            setError(null)
            
            // Fetch weather by coordinates - ensure they're numbers
            const response = await axios.get(`${API_URL}/api/weather`, {
              params: { 
                lat: latitude.toString(), 
                lon: longitude.toString() 
              },
            })
            
            if (response.data && !response.data.error) {
              setWeather(response.data)
              setCity(response.data.city)
              // Save to localStorage
              saveLastWeather(response.data)
              saveLastCity(response.data.city)
              // Fetch forecast for the detected city
              if (response.data.city) {
                fetchForecast(response.data.city)
              }
            } else {
              setError('Could not fetch weather for your location')
            }
          } catch (err) {
            console.error('Could not fetch weather by location:', err)
            setError('Failed to fetch weather for your location')
          } finally {
            setLoading(false)
          }
        },
        (error) => {
          console.log('Location access denied or unavailable:', error)
          // Don't show error if user denies - just silently continue
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    }
  }, [])

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError('Invalid city name')
      setWeather(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(`${API_URL}/api/weather`, {
        params: { city: city.trim() },
      })
      
      // Check if response has an error
      if (response.data.error) {
        const errorMsg = response.data.message || response.data.error
        const suggestion = response.data.suggestion
        setError(errorMsg + (suggestion ? ` ${suggestion}` : ''))
        setWeather(null)
      } else if (response.data.note) {
        // Show note about fallback data but still display the weather
        setWeather(response.data)
        setError(response.data.note)
        // Save to localStorage
        saveLastWeather(response.data)
        if (response.data.city) {
          saveLastCity(response.data.city)
        }
        // Try to fetch forecast
        if (response.data.city) {
          fetchForecast(response.data.city)
        }
      } else {
        setWeather(response.data)
        setError(null)
        // Save to localStorage
        saveLastWeather(response.data)
        if (response.data.city) {
          saveLastCity(response.data.city)
        } else if (city.trim()) {
          saveLastCity(city.trim())
        }
        // Fetch forecast if we have a city
        if (city.trim()) {
          fetchForecast(city.trim())
        } else if (response.data.city) {
          fetchForecast(response.data.city)
        }
      }
    } catch (err) {
      // Handle different types of errors
      let errorMessage = 'Failed to fetch data'
      
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error
        if (err.response.data.message) {
          errorMessage = err.response.data.message
        }
        if (err.response.data.suggestion) {
          errorMessage += ` ${err.response.data.suggestion}`
        }
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.message) {
        if (err.message.includes('timeout') || err.message.includes('Network Error')) {
          errorMessage = 'Failed to fetch data. Please check your internet connection.'
        } else {
          errorMessage = 'Failed to fetch data. Please try again.'
        }
      }
      
      setError(errorMessage)
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    fetchWeather()
  }

  const handleToggleFavorite = () => {
    if (!weather?.city) return
    
    const cityName = weather.city
    if (isFavoriteCity(cityName)) {
      removeFavoriteCity(cityName)
    } else {
      addFavoriteCity(cityName)
    }
    setFavoriteCities(getFavoriteCities())
  }

  const handleFavoriteClick = async (favCity) => {
    setCity(favCity)
    // Use the city directly for the API call
    setLoading(true)
    setError(null)
    
    try {
      const response = await axios.get(`${API_URL}/api/weather`, {
        params: { city: favCity },
      })
      
      if (response.data.error) {
        const errorMsg = response.data.message || response.data.error
        const suggestion = response.data.suggestion
        setError(errorMsg + (suggestion ? ` ${suggestion}` : ''))
        setWeather(null)
      } else if (response.data.note) {
        setWeather(response.data)
        setError(response.data.note)
      } else {
        setWeather(response.data)
        setError(null)
        // Save to localStorage
        saveLastWeather(response.data)
        saveLastCity(favCity)
        // Fetch forecast
        if (response.data.city) {
          fetchForecast(response.data.city)
        }
      }
    } catch (err) {
      let errorMessage = 'Failed to fetch data'
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error
        if (err.response.data.message) {
          errorMessage = err.response.data.message
        }
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      }
      setError(errorMessage)
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFavorite = (favCity, e) => {
    e.stopPropagation()
    removeFavoriteCity(favCity)
    setFavoriteCities(getFavoriteCities())
  }

  const getTemperature = (temp) => {
    return temperatureUnit === 'fahrenheit' ? celsiusToFahrenheit(temp) : temp
  }

  const getTemperatureUnit = () => {
    return temperatureUnit === 'fahrenheit' ? '°F' : '°C'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">
          Weather Information
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTemperatureUnit('celsius')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              temperatureUnit === 'celsius'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            °C
          </button>
          <button
            onClick={() => setTemperatureUnit('fahrenheit')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              temperatureUnit === 'fahrenheit'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            °F
          </button>
        </div>
      </div>

      {locationEnabled && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
          📍 Weather detected from your location
        </div>
      )}

      <div className="mb-6">
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? 'Loading...' : 'Search'}
            </button>
          </div>
        </form>
        
        {/* Favorite Cities Toggle */}
        {favoriteCities.length > 0 && (
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
          >
            <span>⭐</span>
            <span>Favorite Cities ({favoriteCities.length})</span>
            <span>{showFavorites ? '▼' : '▶'}</span>
          </button>
        )}
        
        {/* Favorite Cities List */}
        {showFavorites && favoriteCities.length > 0 && (
          <div className="mt-3 p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-wrap gap-2">
              {favoriteCities.map((favCity) => (
                <div
                  key={favCity}
                  onClick={() => handleFavoriteClick(favCity)}
                  className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all border border-gray-200 hover:border-blue-300"
                >
                  <span className="text-blue-600">⭐</span>
                  <span className="text-gray-700 font-medium">{favCity}</span>
                  <button
                    onClick={(e) => handleRemoveFavorite(favCity, e)}
                    className="text-red-500 hover:text-red-700 ml-1"
                    title="Remove from favorites"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className={`mb-4 p-4 rounded-lg border ${
          error.includes('fallback') || error.includes('note') 
            ? 'bg-yellow-50 border-yellow-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <p className={error.includes('fallback') || error.includes('note') ? 'text-yellow-800' : 'text-red-700'}>
            {error}
          </p>
          {error.includes('fallback') || error.includes('note') ? (
            <p className="text-yellow-700 text-sm mt-2">
              ⚠️ Using fallback data. Check your API key configuration or try again later.
            </p>
          ) : (
            <button
              onClick={fetchWeather}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {weather && !loading && (
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">{weather.city}</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-lg transition-all ${
                  isFavoriteCity(weather.city)
                    ? 'bg-yellow-400 text-yellow-900'
                    : 'bg-white/20 hover:bg-white/30'
                }`}
                title={isFavoriteCity(weather.city) ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFavoriteCity(weather.city) ? '⭐' : '☆'}
              </button>
              {weather.icon && (
                <img
                  src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                  alt={weather.description}
                  className="w-16 h-16"
                />
              )}
            </div>
          </div>
          <div className="text-5xl font-bold mb-2">
            {getTemperature(weather.temperature)}{getTemperatureUnit()}
            <span className="text-2xl ml-2 opacity-75">
              {getWeatherEmoji(weather.icon)}
            </span>
          </div>
          <div className="text-xl mb-6 capitalize">{weather.description}</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/20 rounded-lg p-3">
              <div className="text-sm opacity-90">Humidity</div>
              <div className="text-xl font-semibold">{weather.humidity}%</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <div className="text-sm opacity-90">Wind Speed</div>
              <div className="text-xl font-semibold">{weather.windSpeed} km/h</div>
            </div>
          </div>
        </div>
      )}

      {/* 3-Day Forecast */}
      {forecast && forecast.forecast && forecast.forecast.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">3-Day Forecast</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {forecast.forecast.map((day, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-300 to-blue-500 dark:from-blue-600 dark:to-blue-800 rounded-xl p-4 text-white"
              >
                <div className="text-sm font-semibold mb-2">{day.day}</div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">{getWeatherEmoji(day.icon)}</span>
                  <span className="text-2xl font-bold">
                    {getTemperature(day.temperature)}{getTemperatureUnit()}
                  </span>
                </div>
                <div className="text-sm capitalize mb-2">{day.description}</div>
                <div className="text-xs opacity-90">
                  💧 {day.humidity}% | 💨 {day.windSpeed} km/h
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default WeatherModule


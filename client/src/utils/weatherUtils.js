// Weather utility functions

export const celsiusToFahrenheit = (celsius) => {
  return Math.round((celsius * 9/5) + 32)
}

export const fahrenheitToCelsius = (fahrenheit) => {
  return Math.round((fahrenheit - 32) * 5/9)
}

export const getWeatherEmoji = (iconCode) => {
  const emojiMap = {
    '01d': '☀️', // clear sky day
    '01n': '🌙', // clear sky night
    '02d': '⛅', // few clouds day
    '02n': '☁️', // few clouds night
    '03d': '☁️', // scattered clouds
    '03n': '☁️',
    '04d': '☁️', // broken clouds
    '04n': '☁️',
    '09d': '🌧️', // shower rain
    '09n': '🌧️',
    '10d': '🌦️', // rain day
    '10n': '🌧️', // rain night
    '11d': '⛈️', // thunderstorm
    '11n': '⛈️',
    '13d': '❄️', // snow
    '13n': '❄️',
    '50d': '🌫️', // mist
    '50n': '🌫️'
  }
  return emojiMap[iconCode] || '🌤️'
}


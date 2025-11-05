import { useState, useEffect } from 'react'
import WeatherModule from './components/WeatherModule'
import CurrencyConverter from './components/CurrencyConverter'
import QuoteGenerator from './components/QuoteGenerator'
import { useTheme } from './components/ThemeProvider'
import TimeWidget from './components/TimeWidget'

function App() {
  // Restore last active tab from localStorage, default to 'weather'
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('infohub_active_tab') || 'weather'
  })
  const { theme, toggleTheme } = useTheme()

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('infohub_active_tab', activeTab)
  }, [activeTab])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Theme Toggle and Time Widget */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1"></div>
          <h1 className="text-4xl md:text-5xl font-bold text-center flex-1 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            InfoHub
          </h1>
          <div className="flex items-center gap-4 flex-1 justify-end">
            <TimeWidget />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white dark:bg-gray-700 shadow-md hover:shadow-lg transition-all"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('weather')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === 'weather'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md'
            }`}
          >
            🌤️ Weather
          </button>
          <button
            onClick={() => setActiveTab('currency')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === 'currency'
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md'
            }`}
          >
            💱 Currency
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === 'quotes'
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md'
            }`}
          >
            💬 Quotes
          </button>
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'weather' && <WeatherModule />}
          {activeTab === 'currency' && <CurrencyConverter />}
          {activeTab === 'quotes' && <QuoteGenerator />}
        </div>
      </div>
    </div>
  )
}

export default App


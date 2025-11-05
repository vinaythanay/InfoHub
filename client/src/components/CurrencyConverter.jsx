import { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  getConversionHistory, 
  addConversionHistory, 
  clearConversionHistory,
  getLastConversion,
  saveLastConversion
} from '../utils/localStorage'

const CurrencyConverter = () => {
  const [amount, setAmount] = useState('')
  const [conversion, setConversion] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  useEffect(() => {
    setHistory(getConversionHistory())
    // Restore last conversion on mount
    const lastConversion = getLastConversion()
    if (lastConversion) {
      setConversion(lastConversion)
      setAmount(lastConversion.amount.toString())
    }
  }, [])

  const convertCurrency = async (value) => {
    if (!value || value <= 0 || isNaN(value)) {
      setError('Invalid amount')
      setConversion(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(`${API_URL}/api/currency`, {
        params: { amount: value },
      })
      
      // Check if response has an error
      if (response.data.error) {
        setError(response.data.message || response.data.error)
        setConversion(null)
      } else {
        setConversion(response.data)
        // Save to history
        addConversionHistory(response.data)
        setHistory(getConversionHistory())
        // Save as last conversion
        saveLastConversion(response.data)
        // Show note if using fallback data
        if (response.data.note) {
          setError(response.data.note)
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
      } else if (err.message) {
        if (err.message.includes('timeout') || err.message.includes('Network Error')) {
          errorMessage = 'Failed to fetch data. Please check your internet connection.'
        } else {
          errorMessage = 'Failed to fetch data. Please try again.'
        }
      }
      
      setError(errorMessage)
      setConversion(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    convertCurrency(parseFloat(amount))
  }

  const handleQuickAmount = (value) => {
    setAmount(value.toString())
    convertCurrency(value)
  }

  const handleHistoryClick = (historyItem) => {
    setAmount(historyItem.amount.toString())
    setConversion(historyItem)
  }

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all conversion history?')) {
      clearConversionHistory()
      setHistory([])
    }
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 transition-colors">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        Currency Converter
      </h2>

      {/* Conversion History Toggle */}
      {history.length > 0 && (
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-2"
          >
            <span>📊</span>
            <span>Conversion History ({history.length})</span>
            <span>{showHistory ? '▼' : '▶'}</span>
          </button>
          {showHistory && (
            <button
              onClick={handleClearHistory}
              className="text-xs text-red-600 hover:text-red-700"
            >
              Clear All
            </button>
          )}
        </div>
      )}
      
      {/* History List */}
      {showHistory && history.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg max-h-64 overflow-y-auto">
          <div className="space-y-2">
            {history.map((item, index) => (
              <div
                key={index}
                onClick={() => handleHistoryClick(item)}
                className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all border border-gray-200 hover:border-green-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-800">
                      ₹{item.amount.toLocaleString()} = ${item.conversions.usd.toFixed(2)} / €{item.conversions.eur.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {item.timestamp && formatDate(item.timestamp)}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    Rates: ${item.rates.usd} / €{item.rates.eur}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount in INR
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount..."
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? 'Converting...' : 'Convert'}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleQuickAmount(100)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            ₹100
          </button>
          <button
            type="button"
            onClick={() => handleQuickAmount(500)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            ₹500
          </button>
          <button
            type="button"
            onClick={() => handleQuickAmount(1000)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            ₹1,000
          </button>
          <button
            type="button"
            onClick={() => handleQuickAmount(5000)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            ₹5,000
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => convertCurrency(parseFloat(amount))}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      )}

      {conversion && !loading && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-6 text-white">
            <div className="text-sm opacity-90 mb-2">Exchange Rates</div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm opacity-90">USD Rate</div>
                <div className="text-2xl font-bold">${conversion.rates.usd}</div>
              </div>
              <div>
                <div className="text-sm opacity-90">EUR Rate</div>
                <div className="text-2xl font-bold">€{conversion.rates.eur}</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-6 text-white">
              <div className="text-sm opacity-90 mb-2">USD Conversion</div>
              <div className="text-3xl font-bold">
                ${conversion.conversions.usd.toFixed(2)}
              </div>
              <div className="text-sm mt-2">
                ₹{conversion.amount.toLocaleString()} = ${conversion.conversions.usd.toFixed(2)}
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl p-6 text-white">
              <div className="text-sm opacity-90 mb-2">EUR Conversion</div>
              <div className="text-3xl font-bold">
                €{conversion.conversions.eur.toFixed(2)}
              </div>
              <div className="text-sm mt-2">
                ₹{conversion.amount.toLocaleString()} = €{conversion.conversions.eur.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CurrencyConverter


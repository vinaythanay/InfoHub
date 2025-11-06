import { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  getFavoriteQuotes, 
  addFavoriteQuote, 
  removeFavoriteQuote, 
  isFavoriteQuote,
  getLastQuote,
  saveLastQuote
} from '../utils/localStorage'

const QuoteGenerator = () => {
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [favoriteQuotes, setFavoriteQuotes] = useState([])
  const [showFavorites, setShowFavorites] = useState(false)

  // Use relative URL in production (Vercel), or explicit API URL if set
  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001' : '')

  const fetchQuote = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(`${API_URL}/api/quote`)
      
      // Always show quote if we have one (even if it's fallback data)
      if (response.data.text && response.data.author) {
        setQuote(response.data)
        // Save as last quote
        saveLastQuote(response.data)
        // Show note as warning if using fallback data
        if (response.data.note) {
          setError(response.data.note)
        } else {
          setError(null)
        }
      } else if (response.data.error) {
        // Only show error if we don't have a quote
        setError(response.data.message || response.data.error)
        setQuote(null)
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
      setQuote(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setFavoriteQuotes(getFavoriteQuotes())
    // Restore last quote on mount
    const lastQuote = getLastQuote()
    if (lastQuote) {
      setQuote(lastQuote)
      setLoading(false)
    } else {
      // Only fetch new quote if no saved quote exists
      fetchQuote()
    }
  }, [])

  const handleToggleFavorite = () => {
    if (!quote?.text || !quote?.author) return
    
    if (isFavoriteQuote(quote)) {
      removeFavoriteQuote(quote)
    } else {
      addFavoriteQuote(quote)
    }
    setFavoriteQuotes(getFavoriteQuotes())
  }

  const handleFavoriteClick = (favQuote) => {
    setQuote(favQuote)
    setError(null)
  }

  const handleRemoveFavorite = (favQuote, e) => {
    e.stopPropagation()
    removeFavoriteQuote(favQuote)
    setFavoriteQuotes(getFavoriteQuotes())
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">
          Motivational Quotes
        </h2>
        {favoriteQuotes.length > 0 && (
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2"
          >
            <span>💜</span>
            <span>Favorites ({favoriteQuotes.length})</span>
            <span>{showFavorites ? '▼' : '▶'}</span>
          </button>
        )}
      </div>

      {/* Favorite Quotes List */}
      {showFavorites && favoriteQuotes.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg max-h-64 overflow-y-auto">
          <div className="space-y-3">
            {favoriteQuotes.map((favQuote, index) => (
              <div
                key={index}
                onClick={() => handleFavoriteClick(favQuote)}
                className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all border border-gray-200 hover:border-purple-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-gray-800 italic mb-2">"{favQuote.text}"</p>
                    <p className="text-sm text-gray-600">— {favQuote.author}</p>
                  </div>
                  <button
                    onClick={(e) => handleRemoveFavorite(favQuote, e)}
                    className="text-red-500 hover:text-red-700 text-lg font-bold"
                    title="Remove from favorites"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className={`mb-4 p-4 rounded-lg border ${
          error.includes('fallback') || error.includes('local quote') || error.includes('note')
            ? 'bg-yellow-50 border-yellow-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <p className={error.includes('fallback') || error.includes('local quote') || error.includes('note') ? 'text-yellow-800' : 'text-red-700'}>
            {error}
          </p>
          {!error.includes('fallback') && !error.includes('local quote') && !error.includes('note') && (
            <button
              onClick={fetchQuote}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      )}

      {quote && !loading && (
        <div className="bg-gradient-to-br from-purple-400 via-pink-400 to-purple-600 rounded-xl p-8 md:p-12 text-white text-center relative">
          <button
            onClick={handleToggleFavorite}
            className={`absolute top-4 right-4 p-2 rounded-lg transition-all ${
              isFavoriteQuote(quote)
                ? 'bg-yellow-400 text-yellow-900'
                : 'bg-white/20 hover:bg-white/30'
            }`}
            title={isFavoriteQuote(quote) ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavoriteQuote(quote) ? '💜' : '🤍'}
          </button>
          <div className="text-6xl mb-6">"</div>
          <p className="text-xl md:text-2xl font-medium mb-6 leading-relaxed">
            {quote.text}
          </p>
          <div className="text-lg md:text-xl font-semibold opacity-90">
            — {quote.author}
          </div>
          <div className="text-6xl mt-6">"</div>
        </div>
      )}

      {quote && !loading && (
        <div className="mt-6 text-center">
          <button
            onClick={fetchQuote}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-md"
          >
            New Quote
          </button>
        </div>
      )}
    </div>
  )
}

export default QuoteGenerator


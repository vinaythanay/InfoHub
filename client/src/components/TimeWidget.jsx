import { useState, useEffect } from 'react'

const TimeWidget = () => {
  const [time, setTime] = useState(new Date())
  const [showTimezones, setShowTimezones] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date, timezone = 'local') => {
    if (timezone === 'local') {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      })
    }

    return date.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const timezones = [
    { name: 'New York', tz: 'America/New_York' },
    { name: 'London', tz: 'Europe/London' },
    { name: 'Tokyo', tz: 'Asia/Tokyo' },
    { name: 'Mumbai', tz: 'Asia/Kolkata' },
    { name: 'Sydney', tz: 'Australia/Sydney' }
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setShowTimezones(!showTimezones)}
        className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        🕐 {formatTime(time)} {formatDate(time)}
      </button>

      {showTimezones && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50">
          <div className="space-y-2">
            <div className="pb-2 border-b border-gray-200 dark:border-gray-700">
              <div className="font-semibold text-gray-800 dark:text-gray-200">Local Time</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {formatTime(time)} - {formatDate(time)}
              </div>
            </div>
            {timezones.map((tz) => {
              const tzDate = new Date(time.toLocaleString('en-US', { timeZone: tz.tz }))
              return (
                <div key={tz.tz} className="py-2">
                  <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                    {tz.name}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {formatTime(tzDate, tz.tz)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default TimeWidget


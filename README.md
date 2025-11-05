# InfoHub 

A beautiful single-page application that brings together three everyday utilities: Weather Information, Currency Conversion, and Motivational Quotes.

## 🌟 Features

- **Weather Information**: Get real-time weather data for any city worldwide
- **Currency Converter**: Convert INR to USD/EUR with live exchange rates
- **Motivational Quotes**: Get inspired with random motivational quotes

## 🚀 Tech Stack

### Frontend
- React 18+ with Vite
- Tailwind CSS for styling
- Axios for API calls

### Backend
- Node.js with Express
- Axios for external API calls
- CORS enabled for cross-origin requests

## 📁 Project Structure

```
InfoHub-Challenge/
├── client/                      # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── WeatherModule.jsx
│   │   │   ├── CurrencyConverter.jsx
│   │   │   └── QuoteGenerator.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
└── server/                      # Node.js/Express Backend
    ├── server.js               # Main server file with API endpoints
    ├── package.json
    └── .env.example
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Add your OpenWeatherMap API key to `.env`:
   ```
   PORT=3001
   OPENWEATHER_API_KEY=your_api_key_here
   ```
   
   > **Note**: Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
   
   > The app works without the API key too - it will use mock data as fallback.

5. Start the server:
   ```bash
   npm start
   ```

   The server will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (optional, for custom API URL):
   ```
   VITE_API_URL=http://localhost:3001
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   The app will run on `http://localhost:5173`

## 📡 API Endpoints

### GET `/api/weather?city=Mumbai`
Returns weather information for a specified city.

**Query Parameters:**
- `city` (optional): City name (default: Mumbai)

**Response:**
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

### GET `/api/currency?amount=1000`
Converts INR to USD and EUR.

**Query Parameters:**
- `amount` (required): Amount in INR to convert

**Response:**
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

### GET `/api/quote`
Returns a random motivational quote.

**Response:**
```json
{
  "text": "The only way to do great work is to love what you do.",
  "author": "Steve Jobs"
}
```

## 🎨 Features Highlights

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Loading States**: Beautiful loading animations for better UX
- **Error Handling**: Graceful error messages with retry options
- **Fallback Data**: Works even when external APIs are unavailable
- **Modern UI**: Clean, modern interface with Tailwind CSS
- **Tab Navigation**: Easy navigation between different modules

## 🚀 Deployment

### Deploying to Vercel

1. **Push your code to GitHub**

2. **Import project to Vercel**:
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure environment variables**:
   - Add `OPENWEATHER_API_KEY` in Vercel's environment variables

4. **Deploy**:
   - Vercel will automatically detect and deploy your app

### Alternative: Deploy Separately

**Frontend (Vercel)**:
- Build command: `cd client && npm run build`
- Output directory: `client/dist`

**Backend (Railway/Render/Heroku)**:
- Set environment variables
- Deploy as Node.js application

## 📝 Notes

- The currency API uses a free service (ExchangeRate-API) that doesn't require an API key
- The quotes API uses Quotable.io (free, no API key needed)
- Weather API requires OpenWeatherMap API key (free tier available)
- All APIs have fallback mechanisms if external services are unavailable

## 🐛 Troubleshooting

**Port already in use:**
- Change the PORT in server `.env` file

**CORS errors:**
- Make sure the backend is running
- Check that the API_URL in client matches the backend URL

**API not working:**
- Check your API keys in `.env`
- Verify internet connection
- The app will use fallback data if APIs fail

## 👨‍💻 Development

### Running both frontend and backend

**Terminal 1 (Backend):**
```bash
cd server
npm start
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

## 📄 License

This project is created for ByteXL Coding Challenge.

---

Built with ❤️ for ByteXL

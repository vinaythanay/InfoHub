# Troubleshooting - Blank Page Issue

## Quick Fixes

### 1. Check if Dev Server is Running

Open a terminal and run:
```bash
cd client
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 2. Check Browser Console

Press `F12` in your browser to open Developer Tools, then:
- Check the **Console** tab for JavaScript errors
- Check the **Network** tab to see if files are loading
- Look for red error messages

### 3. Common Issues

#### Issue: "Cannot find module" or import errors
**Solution**: Install dependencies
```bash
cd client
npm install
```

#### Issue: Port 5173 already in use
**Solution**: Kill the process or use a different port
```bash
# Windows PowerShell
Get-Process -Name node | Stop-Process

# Or use different port
npm run dev -- --port 5174
```

#### Issue: ThemeProvider or TimeWidget errors
**Solution**: Check if files exist
- `client/src/components/ThemeProvider.jsx`
- `client/src/components/TimeWidget.jsx`
- `client/src/utils/localStorage.js`
- `client/src/utils/weatherUtils.js`

#### Issue: CORS errors
**Solution**: Make sure backend server is running
```bash
cd server
npm start
```

### 4. Verify File Structure

Make sure these files exist:
```
client/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── components/
    │   ├── WeatherModule.jsx
    │   ├── CurrencyConverter.jsx
    │   ├── QuoteGenerator.jsx
    │   ├── ThemeProvider.jsx
    │   └── TimeWidget.jsx
    └── utils/
        ├── localStorage.js
        └── weatherUtils.js
```

### 5. Clear Cache and Reinstall

```bash
cd client
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### 6. Check Browser Compatibility

- Use Chrome, Firefox, or Edge (latest versions)
- Make sure JavaScript is enabled
- Try incognito/private mode to rule out extensions

### 7. Check for JavaScript Errors

Look for these common errors in browser console:
- `Uncaught ReferenceError: ... is not defined`
- `Uncaught SyntaxError: ...`
- `Failed to resolve module ...`
- `Cannot read property ... of undefined`

## Quick Diagnostic Commands

```bash
# Check if node_modules exists
cd client
dir node_modules

# Check if dependencies are installed
npm list --depth=0

# Rebuild everything
npm run build
npm run preview
```

## Still Not Working?

1. Check the terminal where `npm run dev` is running for errors
2. Check browser console (F12) for JavaScript errors
3. Verify all files exist (use the file structure above)
4. Try accessing `http://localhost:5173` in a different browser
5. Restart your computer and try again


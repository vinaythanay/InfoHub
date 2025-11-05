# Quick Fix for Blank Page

## Steps to Fix:

### Step 1: Stop any running dev servers
Press `Ctrl+C` in any terminal windows running `npm run dev`

### Step 2: Start the dev server
Open a new terminal and run:
```bash
cd client
npm run dev
```

Wait for it to show:
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

### Step 3: Open browser
1. Go to `http://localhost:5173`
2. Press `F12` to open Developer Tools
3. Check the **Console** tab for any red errors

### Step 4: If you see errors in console

**Error: "Cannot find module" or import errors**
```bash
cd client
npm install
npm run dev
```

**Error: "useTheme must be used within ThemeProvider"**
- This means ThemeProvider is not wrapping the app properly
- Check `client/src/main.jsx` - it should wrap App with ThemeProvider

**Error: "Failed to fetch" or CORS errors**
- Start the backend server:
```bash
cd server
npm start
```

### Step 5: Hard refresh the browser
- Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Or clear browser cache

### Step 6: Check if files are loading
In browser DevTools (F12):
1. Go to **Network** tab
2. Refresh the page
3. Look for:
   - `index.html` - should be 200 OK
   - `main.jsx` - should be 200 OK
   - Any files with red status (404 or errors)

## Most Common Issues:

1. **Dev server not running** → Run `npm run dev` in client folder
2. **Backend not running** → Run `npm start` in server folder  
3. **JavaScript error** → Check browser console (F12)
4. **Cached old version** → Hard refresh (Ctrl+Shift+R)


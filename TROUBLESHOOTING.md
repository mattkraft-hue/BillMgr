# Troubleshooting GitHub Pages Deployment

## Issue: App Stuck on "Loading Secure Environment"

### Quick Fixes

1. **Hard Refresh** (Most Common Fix)
   - Windows: `Ctrl + Shift + R` or `Ctrl + F5`
   - Mac: `Cmd + Shift + R`
   - This clears cached files

2. **Clear Browser Cache**
   - Chrome: Settings → Privacy → Clear browsing data
   - Firefox: Settings → Privacy → Clear Data
   - Safari: Safari → Clear History
   - Select "Cached images and files"

3. **Try Different Browser**
   - Chrome (recommended)
   - Firefox
   - Safari
   - Edge

4. **Check Browser Console**
   - Press `F12` to open Developer Tools
   - Click "Console" tab
   - Look for red error messages
   - Take screenshot and check errors below

---

## Common Errors and Solutions

### Error: "Failed to load resource: net::ERR_FILE_NOT_FOUND"

**Cause**: Missing files on GitHub Pages

**Solution**:
1. Check all files are uploaded to GitHub:
   - index.html
   - app.js
   - service-worker.js
   - manifest.json
2. Verify GitHub Pages is enabled:
   - Go to Settings → Pages
   - Branch should be "main" or "master"
   - Folder should be "/ (root)"
3. Wait 2-5 minutes after upload
4. Hard refresh page

### Error: "React is not defined" or "ReactDOM is not defined"

**Cause**: CDN libraries not loading

**Solution**:
1. Check internet connection
2. Try different network (CDN might be blocked)
3. Disable browser extensions (ad blockers)
4. Check browser console for blocked resources
5. Try incognito/private mode

### Error: "XLSX is not defined"

**Cause**: SheetJS library not loaded

**Impact**: Excel export/import won't work, but app should still function

**Solution**:
1. Hard refresh (Ctrl+Shift+R)
2. Check if https://cdn.sheetjs.com is accessible
3. Excel features will be disabled but app works otherwise

### Error: "BCBABillingTracker is not defined"

**Cause**: app.js failed to compile or load

**Solution**:
1. Check app.js file exists in repository
2. Verify app.js is valid JavaScript
3. Check browser console for syntax errors
4. Re-upload app.js to GitHub
5. Clear cache and refresh

### Error: "Unexpected token" or "SyntaxError"

**Cause**: Babel not compiling JSX properly

**Solution**:
1. Make sure app.js uses `type="text/babel"` in script tag
2. Verify Babel Standalone is loading:
   ```
   https://unpkg.com/@babel/standalone/babel.min.js
   ```
3. Check network tab in DevTools
4. Try different Babel CDN version

---

## Checking GitHub Pages Status

### Verify Deployment

1. **Go to repository**: https://github.com/mattkraft-hue/BillMgr
2. **Click "Actions" tab**
3. **Look for "pages build and deployment"**
4. **Should show green checkmark** ✅
5. **If red X** ❌:
   - Click on failed workflow
   - Read error message
   - Common fixes:
     - Re-enable GitHub Pages
     - Check file names (case-sensitive)
     - Verify branch name

### Check Files Are Uploaded

1. **Go to repository main page**
2. **Verify these files exist**:
   ```
   ✓ index.html
   ✓ app.js
   ✓ service-worker.js
   ✓ manifest.json
   ✓ README.md
   ```
3. **Click on index.html**
4. **Should see HTML content**
5. **Click on app.js**
6. **Should see JavaScript code**

### Verify GitHub Pages URL

**Your URL**: https://mattkraft-hue.github.io/BillMgr/

**Test**:
1. Visit URL
2. Should NOT get 404 error
3. If 404:
   - Check Settings → Pages
   - Verify "Your site is published at..."
   - Wait 5 minutes and try again

---

## Browser-Specific Issues

### Chrome

**Issue**: Site not loading
- Clear cache: `chrome://settings/clearBrowserData`
- Disable extensions
- Try Incognito: `Ctrl+Shift+N`

**Issue**: CORS errors
- GitHub Pages handles CORS automatically
- If seeing CORS errors, check URL is correct
- Don't access via `file://` protocol

### Firefox

**Issue**: Tracking protection blocking
- Shield icon in address bar
- Click → Turn off "Enhanced Tracking Protection"
- Refresh page

### Safari

**Issue**: Security settings blocking
- Safari → Preferences → Privacy
- Uncheck "Prevent cross-site tracking" (temporarily)
- Refresh page

**Issue**: Service worker issues
- Safari → Develop → Clear Caches
- Or use Chrome instead

---

## Network Issues

### Slow Loading

**Symptoms**:
- Loading screen for 30+ seconds
- Eventually times out

**Solutions**:
1. Check internet speed
2. CDN libraries are large (~2MB total)
3. Wait for full load (first time takes longer)
4. Subsequent loads are cached (faster)

### Blocked Resources

**Check if CDN URLs are accessible**:
1. Open browser console (F12)
2. Look for "blocked" or "failed to load"
3. Try accessing CDN directly:
   - https://unpkg.com/react@18/umd/react.production.min.js
   - https://unpkg.com/react-dom@18/umd/react-dom.production.min.js
4. If blocked:
   - VPN or proxy might be blocking
   - Corporate firewall blocking
   - Try different network

---

## File Size Issues

### Large app.js File

**Symptoms**:
- Slow to load
- Babel compilation takes time

**Current Size**: ~100-150 KB

**Solutions**:
1. Wait for initial load (10-30 seconds)
2. Cached after first load (instant next time)
3. Use production build (future optimization)

---

## Testing Locally

### Before Deploying to GitHub

1. **Create local test**:
   ```bash
   # Navigate to folder with files
   cd /path/to/files
   
   # Python 3
   python -m http.server 8000
   
   # Node.js
   npx serve
   ```

2. **Open browser**:
   - Visit: http://localhost:8000
   - Should work exactly like GitHub Pages

3. **If works locally but not on GitHub**:
   - Issue is with GitHub Pages deployment
   - Check Actions tab for errors
   - Verify all files uploaded correctly

---

## Step-by-Step Debugging

### When App Won't Load

1. **Open browser DevTools** (F12)
2. **Check Console tab**:
   - Any red errors?
   - What's the last successful log?
   
3. **Check Network tab**:
   - Click "Network"
   - Refresh page (F5)
   - All files should show "200" status
   - If any show "404" or "Failed":
     - Note which files
     - Re-upload to GitHub

4. **Check Elements tab**:
   - Look for `<div id="root">`
   - Should contain app content
   - If empty → React didn't render

5. **Check Sources tab**:
   - Left sidebar → File tree
   - Verify all files present:
     - index.html
     - app.js
     - React libraries
     - Babel

---

## Getting Help

### Information to Provide

When asking for help, include:

1. **Browser and version**:
   - Chrome 120, Firefox 121, etc.

2. **URL you're accessing**:
   - https://mattkraft-hue.github.io/BillMgr/

3. **Error messages**:
   - Screenshot of browser console (F12)
   - Full error text

4. **What you see**:
   - Stuck on loading?
   - Blank page?
   - Error message?

5. **What you tried**:
   - Hard refresh?
   - Different browser?
   - Cleared cache?

### Where to Get Help

1. **GitHub Issues**:
   - https://github.com/mattkraft-hue/BillMgr/issues
   - Create new issue with details above

2. **Check Deployment Log**:
   - Repository → Actions tab
   - Click latest workflow
   - Read build log

---

## Quick Checklist

Before asking for help, verify:

- [ ] All files uploaded to GitHub
- [ ] GitHub Pages enabled (Settings → Pages)
- [ ] Waited 5 minutes after upload
- [ ] Hard refreshed page (Ctrl+Shift+R)
- [ ] Tried different browser
- [ ] Cleared browser cache
- [ ] Checked browser console for errors (F12)
- [ ] URL is correct: https://mattkraft-hue.github.io/BillMgr/
- [ ] Internet connection working
- [ ] Not using VPN/proxy that blocks CDNs

---

## Advanced Fixes

### If Nothing Works

1. **Delete and re-upload all files**:
   - Go to repository
   - Delete index.html, app.js, etc.
   - Re-upload fresh copies
   - Wait 5 minutes

2. **Disable and re-enable GitHub Pages**:
   - Settings → Pages
   - Source: None (save)
   - Wait 1 minute
   - Source: Deploy from branch (save)
   - Wait 5 minutes

3. **Create fresh repository**:
   - Create new repository
   - Upload all files
   - Enable Pages
   - Test new URL

4. **Use GitHub Desktop**:
   - Clone repository
   - Add files locally
   - Commit and push
   - Often fixes upload issues

---

## Success Indicators

### App Loaded Successfully

You should see:
1. ✅ Blue gradient login screen
2. ✅ "Create Account" button visible
3. ✅ No console errors (F12)
4. ✅ Can create account and log in
5. ✅ Can add clients/providers

### Console Logs

When working properly, console shows:
```
✅ Persistent storage initialized
✅ All libraries loaded successfully
✅ BCBA Billing Tracker loaded successfully!
```

---

## Still Stuck?

If app still won't load after trying everything:

1. **Take screenshots**:
   - Loading screen
   - Browser console (F12)
   - GitHub Pages settings

2. **Create GitHub Issue**:
   - Go to: https://github.com/mattkraft-hue/BillMgr/issues
   - Click "New Issue"
   - Title: "App stuck on loading screen"
   - Attach screenshots
   - List what you tried

3. **Temporary workaround**:
   - Use JSON export/import instead of Excel (temporarily)
   - Core app functionality should work
   - Excel features can be added later

---

**Most Common Solution**: Hard refresh (Ctrl+Shift+R) and wait 30 seconds! 🎉

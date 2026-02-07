# 🚀 GitHub Pages Deployment Guide

Complete step-by-step guide to deploy your BCBA Billing Tracker to GitHub Pages.

## 📋 Prerequisites

- GitHub account (free)
- Git installed on your computer (optional but recommended)
- The app files downloaded

## 🎯 Method 1: GitHub Web Interface (Easiest - No Git Required)

### Step 1: Create GitHub Repository

1. **Log in to GitHub**: Go to [github.com](https://github.com) and sign in
2. **Create new repository**:
   - Click the "+" icon in top right
   - Select "New repository"
3. **Repository settings**:
   - **Name**: `bcba-billing-tracker` (or your choice)
   - **Description**: "Secure billing tracker for BCBA professionals"
   - **Public** or **Private** (both work with GitHub Pages)
   - ✅ Check "Add a README file"
   - Click **"Create repository"**

### Step 2: Upload Files

1. **In your repository**, click **"Add file"** → **"Upload files"**
2. **Drag and drop** these files:
   ```
   index.html
   app.js
   service-worker.js
   manifest.json
   README.md
   AUTHENTICATION-GUIDE.md
   ENCRYPTION-GUIDE.md
   MOBILE-OPTIMIZATION.md
   STORAGE-README.md
   ```
3. **Commit changes**:
   - Scroll down
   - Commit message: "Initial deployment"
   - Click **"Commit changes"**

### Step 3: Enable GitHub Pages

1. **Go to Settings**:
   - Click "Settings" tab in your repository
2. **Navigate to Pages**:
   - Scroll down left sidebar
   - Click "Pages"
3. **Configure deployment**:
   - **Source**: Deploy from a branch
   - **Branch**: `main` (or `master`)
   - **Folder**: `/ (root)`
   - Click **"Save"**

### Step 4: Wait for Deployment

1. **GitHub builds your site** (takes 1-2 minutes)
2. **Refresh the Pages settings page**
3. **You'll see**: "Your site is live at `https://YOUR-USERNAME.github.io/bcba-billing-tracker/`"
4. **Click the URL** to visit your app!

### Step 5: Access Your App

Your app is now live at:
```
https://YOUR-USERNAME.github.io/bcba-billing-tracker/
```

**Replace `YOUR-USERNAME` with your GitHub username!**

---

## 🎯 Method 2: Using Git (Command Line)

### Step 1: Install Git

**Windows**: Download from [git-scm.com](https://git-scm.com)  
**Mac**: `brew install git` or download from git-scm.com  
**Linux**: `sudo apt install git` or `sudo yum install git`

### Step 2: Create Local Repository

```bash
# Create project directory
mkdir bcba-billing-tracker
cd bcba-billing-tracker

# Copy all app files to this directory
# (index.html, app.js, service-worker.js, manifest.json, *.md files)

# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit"
```

### Step 3: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. **Repository name**: `bcba-billing-tracker`
3. **Don't** initialize with README (you have one already)
4. Click **"Create repository"**

### Step 4: Push to GitHub

```bash
# Add GitHub remote (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/bcba-billing-tracker.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 5: Enable GitHub Pages

Same as Method 1, Step 3 above.

---

## 🎯 Method 3: Using GitHub Desktop (Easiest Git Method)

### Step 1: Install GitHub Desktop

Download from [desktop.github.com](https://desktop.github.com)

### Step 2: Create Repository

1. **Open GitHub Desktop**
2. **File** → **New Repository**
3. **Name**: `bcba-billing-tracker`
4. **Local Path**: Choose where to save
5. Click **"Create Repository"**

### Step 3: Add Files

1. **Copy all app files** to the repository folder
2. **GitHub Desktop** will show changes
3. **Commit**:
   - Summary: "Initial deployment"
   - Click **"Commit to main"**
4. **Publish**:
   - Click **"Publish repository"**
   - Choose Public or Private
   - Click **"Publish Repository"**

### Step 4: Enable GitHub Pages

Same as Method 1, Step 3 above.

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] App loads at `https://YOUR-USERNAME.github.io/bcba-billing-tracker/`
- [ ] Login screen appears (blue gradient)
- [ ] Can create account
- [ ] Can log in
- [ ] Can add clients
- [ ] Can log sessions
- [ ] Can enable encryption
- [ ] Can export data
- [ ] Can log out
- [ ] Mobile responsive (test on phone)

---

## 📱 Install as PWA

After deployment, you can install the app:

### On iPhone/iPad:
1. Open in **Safari**
2. Tap **Share** button
3. Tap **"Add to Home Screen"**
4. Name it **"BCBA Tracker"**
5. Tap **"Add"**
6. App appears on home screen!

### On Android:
1. Open in **Chrome**
2. Tap **menu** (⋮)
3. Tap **"Install app"** or **"Add to Home screen"**
4. Tap **"Install"**
5. App appears in app drawer!

### On Desktop:
1. Visit the URL in Chrome
2. Look for **install icon** in address bar
3. Click **"Install"**
4. App opens in own window!

---

## 🔧 Updating Your App

### Method 1: GitHub Web Interface

1. Go to your repository
2. Click on file to edit (e.g., `app.js`)
3. Click **pencil icon** to edit
4. Make changes
5. Scroll down, click **"Commit changes"**
6. Wait 1-2 minutes
7. Refresh your live site

### Method 2: Git Command Line

```bash
# Make changes to files
# Then:
git add .
git commit -m "Description of changes"
git push

# Wait 1-2 minutes, then refresh live site
```

### Method 3: GitHub Desktop

1. Make changes to files
2. GitHub Desktop shows changes
3. Commit with description
4. Click **"Push origin"**
5. Wait 1-2 minutes, refresh live site

---

## 🎨 Customization

### Change App Name
Edit `manifest.json`:
```json
{
  "name": "Your Practice Name - BCBA Tracker",
  "short_name": "Your Tracker"
}
```

### Change Theme Color
Edit `manifest.json` and `index.html`:
```json
"theme_color": "#YOUR-COLOR"
```

### Add Your Logo
Replace the SVG icons in `manifest.json` with actual image files.

---

## 🌐 Custom Domain (Optional)

### Step 1: Buy Domain
Purchase domain from:
- Namecheap
- GoDaddy  
- Google Domains
- Cloudflare

### Step 2: Configure DNS

Add these DNS records:
```
Type: A
Name: @
Value: 185.199.108.153

Type: A
Name: @
Value: 185.199.109.153

Type: A  
Name: @
Value: 185.199.110.153

Type: A
Name: @
Value: 185.199.111.153

Type: CNAME
Name: www
Value: YOUR-USERNAME.github.io
```

### Step 3: Configure GitHub

1. Repository Settings → Pages
2. **Custom domain**: `yourdomain.com`
3. ✅ Check **"Enforce HTTPS"**
4. Wait 24 hours for DNS propagation

---

## 🐛 Troubleshooting

### 404 Error
**Problem**: Site shows 404 Not Found

**Solutions**:
- Wait 2-5 minutes after enabling Pages
- Check repository is Public (or Pro account for Private)
- Verify branch name is correct
- Check `index.html` is in root directory

### Blank Page
**Problem**: Site loads but shows blank page

**Solutions**:
- Check browser console (F12) for errors
- Verify all files uploaded correctly
- Check file names match exactly (case-sensitive)
- Clear browser cache and reload

### Storage Errors
**Problem**: "Storage not defined" errors

**Solutions**:
- Check browser supports localStorage
- Enable third-party cookies
- Try different browser
- Check browser in private/incognito mode

### App Not Installing
**Problem**: Can't install as PWA

**Solutions**:
- Use HTTPS (GitHub Pages uses HTTPS automatically)
- Check `manifest.json` is valid
- Check `service-worker.js` is registered
- Try different browser (Chrome, Edge, Safari)

### Changes Not Showing
**Problem**: Updated code but site unchanged

**Solutions**:
- Wait 2-5 minutes for GitHub to rebuild
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Try incognito/private mode

---

## 📞 Getting Help

### GitHub Issues
- Check [Issues page](https://github.com/YOUR-USERNAME/bcba-billing-tracker/issues)
- Search for similar problems
- Create new issue if needed

### GitHub Documentation
- [GitHub Pages docs](https://docs.github.com/en/pages)
- [Troubleshooting Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/troubleshooting-404-errors-for-github-pages-sites)

### Community
- Stack Overflow (tag: github-pages)
- GitHub Community Forum

---

## 🎉 Success!

Congratulations! Your BCBA Billing Tracker is now:

✅ **Live on the internet**  
✅ **Accessible from any device**  
✅ **Installable as an app**  
✅ **Secure and encrypted**  
✅ **Free to use forever**

Share the URL with colleagues or keep it private for personal use!

---

## 📝 Quick Commands Reference

```bash
# Clone your repo
git clone https://github.com/YOUR-USERNAME/bcba-billing-tracker.git

# Make changes
cd bcba-billing-tracker
# Edit files...

# Update deployment
git add .
git commit -m "Update message"
git push

# Check deployment status
# Visit: https://github.com/YOUR-USERNAME/bcba-billing-tracker/actions
```

---

**Need help?** Check the troubleshooting section above or create an issue in the repository!

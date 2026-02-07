# 🔑 Complete GitHub Setup Guide

## Overview
This guide covers everything you need to set up GitHub, create access tokens (keys), and deploy your BCBA Billing Tracker.

---

## Part 1: GitHub Account Setup

### Step 1: Create GitHub Account (If you don't have one)

1. **Go to**: https://github.com/signup
2. **Enter your email**: (use a work email if possible)
3. **Create password**: Strong password (12+ characters)
4. **Choose username**: `mattkraft-hue` (you already have this!)
5. **Verify account**: Check email for verification code
6. **Complete setup**: Choose free plan

### Step 2: Verify You're Logged In

1. **Go to**: https://github.com
2. **Top right**: Should see your profile picture/icon
3. **Click your icon** → Should see dropdown menu
4. **If not logged in**: Click "Sign in" and enter credentials

---

## Part 2: Personal Access Token (PAT) - The "Key"

### What is a Personal Access Token?

Think of it as a **special password** that:
- Lets you push code from your computer to GitHub
- Is more secure than using your regular password
- Can be revoked if compromised
- Has specific permissions (scopes)

### When Do You Need It?

You need a PAT when:
- Pushing code via command line/terminal
- Using Git on your computer
- Using GitHub Desktop
- **NOT needed** for web interface (browser uploads)

---

## Part 3: Creating a Personal Access Token

### Step-by-Step Instructions

**1. Go to Token Settings**

Click this direct link:
👉 **https://github.com/settings/tokens/new**

Or navigate manually:
1. Click your **profile icon** (top right)
2. Click **Settings**
3. Scroll down left sidebar
4. Click **Developer settings** (bottom)
5. Click **Personal access tokens** → **Tokens (classic)**
6. Click **Generate new token** → **Generate new token (classic)**

**2. Configure Your Token**

Fill in the form:

**Note** (description):
```
BCBA Billing Tracker Deployment
```

**Expiration**:
- Choose: `90 days` (recommended)
- Or: `No expiration` (less secure but convenient)

**Select Scopes** (permissions):

✅ Check these boxes:
- **repo** (Full control of private repositories)
  - This automatically checks all sub-boxes under "repo"
  - You need this to push code

That's it! You only need the **repo** scope.

**3. Generate Token**

1. Scroll to bottom
2. Click **"Generate token"** (green button)

**4. COPY THE TOKEN IMMEDIATELY**

⚠️ **CRITICAL**: You'll see a long string like:
```
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**COPY IT NOW!** You won't be able to see it again!

Click the 📋 (copy) icon next to it.

**5. Save Your Token Securely**

Save it in one of these places:
- **Password manager** (1Password, LastPass, etc.) - BEST
- **Secure note** on your computer
- **Written down** in a secure location
- **Encrypted file**

**Never:**
- ❌ Email it to yourself
- ❌ Post it online
- ❌ Share it with anyone
- ❌ Commit it to code

---

## Part 4: Using Your Personal Access Token

### Method 1: Via Web Interface (NO TOKEN NEEDED!)

**This is the easiest way - you DON'T need a token!**

1. **Go to**: https://github.com/mattkraft-hue/BillMgr
2. **Click "Add file"** → **"Upload files"**
3. **Drag and drop** your files
4. **Click "Commit changes"**
5. **Done!** No token needed!

### Method 2: Via Git Command Line (TOKEN NEEDED)

**When Git asks for credentials:**

```bash
# You'll see this prompt:
Username for 'https://github.com': mattkraft-hue
Password for 'https://mattkraft-hue@github.com': 
```

**Enter:**
- **Username**: `mattkraft-hue`
- **Password**: Paste your **Personal Access Token** (NOT your GitHub password!)

**Example Session:**
```bash
cd BillMgr
git add .
git commit -m "Update files"
git push

# Prompts:
Username: mattkraft-hue
Password: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# (paste token here)
```

### Method 3: Via GitHub Desktop (NO TYPING TOKEN!)

**GitHub Desktop handles authentication automatically:**

1. **Download**: https://desktop.github.com
2. **Install and open**
3. **Sign in**: File → Options → Accounts → Sign in
4. **Browser opens**: Click "Authorize"
5. **Done!** No need to paste tokens manually

---

## Part 5: Common Token Issues

### Issue: "Invalid username or password"

**Cause**: Entered your GitHub password instead of token

**Solution**: Use the **Personal Access Token**, not your password
- Token looks like: `ghp_xxxxxxxxxxxx...`
- Password is your regular GitHub password

### Issue: "403 Forbidden"

**Cause**: Token doesn't have right permissions

**Solution**: 
1. Create new token
2. Make sure **repo** scope is checked
3. Delete old token if needed

### Issue: "I lost my token!"

**Solution**:
1. You can't recover it
2. Create a new one: https://github.com/settings/tokens/new
3. Delete the old one (optional but recommended)

### Issue: "Token expired"

**Solution**:
1. Create new token (same process)
2. Update anywhere you stored the old one
3. Use new token next time you push

---

## Part 6: Deploying Without Git (Easiest!)

### You DON'T Need Tokens for Web Upload!

**Easiest method - no tokens, no command line:**

1. **Download all files** to your computer
2. **Go to**: https://github.com/mattkraft-hue/BillMgr
3. **Click "Add file"** → **"Upload files"**
4. **Drag these files** into the upload area:
   ```
   index.html
   app.js
   diagnostic.html
   service-worker.js
   manifest.json
   README.md
   (all other .md files)
   ```
5. **Scroll down**
6. **Commit message**: "Deploy BCBA Billing Tracker"
7. **Click "Commit changes"**
8. **Wait 2 minutes**
9. **Visit**: https://mattkraft-hue.github.io/BillMgr/
10. **Done!** 🎉

**No tokens needed!** This is the recommended method.

---

## Part 7: GitHub Pages Setup

### Enable GitHub Pages (Required for Live Site)

1. **Go to**: https://github.com/mattkraft-hue/BillMgr/settings/pages

   Or navigate:
   - Go to repository: https://github.com/mattkraft-hue/BillMgr
   - Click **Settings** tab
   - Scroll down left sidebar
   - Click **Pages**

2. **Under "Build and deployment"**:
   - **Source**: Deploy from a branch
   - **Branch**: `main` (or `master`)
   - **Folder**: `/ (root)`
   - Click **Save**

3. **Wait 2-5 minutes**

4. **Refresh the page**

5. **You'll see**: 
   ```
   ✅ Your site is published at https://mattkraft-hue.github.io/BillMgr/
   ```

6. **Click the URL** to visit your live site!

---

## Part 8: Updating Your Site

### Via Web Interface (Recommended)

**To update a single file:**
1. Go to repository
2. Click on the file (e.g., `index.html`)
3. Click **pencil icon** (✏️) to edit
4. Make changes
5. Scroll down
6. Click **Commit changes**
7. Wait 2 minutes
8. Site updates automatically!

**To upload new files:**
1. Go to repository
2. Click **Add file** → **Upload files**
3. Drag new files
4. Click **Commit changes**
5. Done!

### Via Git (If you prefer command line)

```bash
# Navigate to your local folder
cd /path/to/BillMgr

# Make your changes to files

# Add changes
git add .

# Commit changes
git commit -m "Description of what you changed"

# Push to GitHub (will ask for username and token)
git push

# Username: mattkraft-hue
# Password: (paste your token)

# Wait 2 minutes, site updates!
```

---

## Part 9: Security Best Practices

### Protecting Your Token

**DO:**
- ✅ Store in password manager
- ✅ Use expiration (90 days)
- ✅ Create separate tokens for different purposes
- ✅ Revoke tokens you're not using
- ✅ Only give minimum necessary permissions

**DON'T:**
- ❌ Share with anyone
- ❌ Post in code or GitHub
- ❌ Email to yourself
- ❌ Save in plain text files
- ❌ Use same token everywhere

### Revoking a Token

**If compromised or lost:**

1. **Go to**: https://github.com/settings/tokens
2. **Find the token** in the list
3. **Click "Delete"**
4. **Confirm deletion**
5. **Create new token** if needed

Token is immediately invalid - safe!

---

## Part 10: Quick Reference

### Important URLs

| Purpose | URL |
|---------|-----|
| Your Repository | https://github.com/mattkraft-hue/BillMgr |
| Your Live Site | https://mattkraft-hue.github.io/BillMgr/ |
| Create Token | https://github.com/settings/tokens/new |
| Manage Tokens | https://github.com/settings/tokens |
| Pages Settings | https://github.com/mattkraft-hue/BillMgr/settings/pages |
| Upload Files | https://github.com/mattkraft-hue/BillMgr/upload/main |

### Quick Commands

```bash
# Clone repository
git clone https://github.com/mattkraft-hue/BillMgr.git

# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your message"

# Push to GitHub
git push

# Pull latest changes
git pull
```

### Token Format

Your token will look like:
```
ghp_1234567890abcdefghijklmnopqrstuvwxyzABCD
```

- Starts with `ghp_`
- About 40 characters long
- Mix of letters and numbers

---

## Part 11: Troubleshooting

### "Authentication failed"

**Try:**
1. Make sure you're using the **token**, not your password
2. Check token hasn't expired
3. Create a new token
4. Make sure **repo** scope is checked

### "Permission denied"

**Try:**
1. Check you're pushing to the right repository
2. Verify token has **repo** scope
3. Check repository exists
4. Make sure you own the repository

### "Repository not found"

**Try:**
1. Check repository name is exactly: `BillMgr`
2. Verify URL: `https://github.com/mattkraft-hue/BillMgr.git`
3. Make sure you're logged in
4. Check repository isn't deleted

---

## Part 12: Alternative - GitHub Desktop (No Tokens!)

### Why Use GitHub Desktop?

- ✅ No command line needed
- ✅ No typing tokens
- ✅ Visual interface
- ✅ Easy to use

### Setup GitHub Desktop

1. **Download**: https://desktop.github.com
2. **Install** the application
3. **Open GitHub Desktop**
4. **Sign in**:
   - File → Options → Accounts
   - Click "Sign in to GitHub.com"
   - Browser opens, click "Authorize"
5. **Clone repository**:
   - File → Clone Repository
   - Find `mattkraft-hue/BillMgr`
   - Click "Clone"
   - Choose location on computer
6. **Make changes**:
   - Edit files in the cloned folder
   - GitHub Desktop shows changes automatically
7. **Commit & Push**:
   - Write commit message
   - Click "Commit to main"
   - Click "Push origin"
8. **Done!** Site updates automatically

**No tokens to remember!**

---

## Summary: Two Ways to Deploy

### Method 1: Web Interface (Easiest - NO TOKENS!)

1. Go to https://github.com/mattkraft-hue/BillMgr
2. Click "Add file" → "Upload files"
3. Drag files
4. Click "Commit changes"
✅ **Recommended for most users!**

### Method 2: Git Command Line (For developers)

1. Create Personal Access Token
2. Clone repository
3. Make changes
4. Push (enter username and token)
⚠️ **Only if you're comfortable with command line**

---

## 🎯 Quick Start Right Now

**To deploy your BCBA Tracker immediately:**

1. **Make sure you're logged into GitHub**: https://github.com
2. **Go to your repository**: https://github.com/mattkraft-hue/BillMgr
3. **Click "Add file"** → **"Upload files"**
4. **Drag all the files** I gave you
5. **Click "Commit changes"**
6. **Wait 2 minutes**
7. **Visit**: https://mattkraft-hue.github.io/BillMgr/

**No tokens, no command line, no complexity!**

---

## Need Help?

- **GitHub Docs**: https://docs.github.com
- **Create Issue**: https://github.com/mattkraft-hue/BillMgr/issues
- **GitHub Support**: https://support.github.com

**You're all set!** 🚀

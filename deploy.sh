#!/bin/bash

# BCBA Billing Tracker - Automated Deployment Script
# For repository: https://github.com/mattkraft-hue/BillMgr

echo "=========================================="
echo "BCBA Billing Tracker - Deployment Script"
echo "=========================================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed!"
    echo "Please install Git first:"
    echo "  - Windows: https://git-scm.com/download/win"
    echo "  - Mac: brew install git"
    echo "  - Linux: sudo apt-get install git"
    exit 1
fi

echo "✅ Git is installed"
echo ""

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found!"
    echo "Please run this script from the directory containing all the app files."
    exit 1
fi

echo "✅ Found app files"
echo ""

# Initialize git if needed
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
    echo ""
fi

# Add remote if not exists
if ! git remote get-url origin &> /dev/null; then
    echo "🔗 Adding GitHub remote..."
    git remote add origin https://github.com/mattkraft-hue/BillMgr.git
    echo "✅ Remote added"
    echo ""
fi

# Add all files
echo "📁 Adding files to Git..."
git add .
echo "✅ Files added"
echo ""

# Commit
echo "💾 Creating commit..."
git commit -m "Deploy BCBA Billing Tracker - Initial deployment"
echo "✅ Commit created"
echo ""

# Get current branch name
BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "📍 Current branch: $BRANCH"
echo ""

# Push to GitHub
echo "🚀 Pushing to GitHub..."
echo ""
echo "⚠️  You will be prompted for your GitHub credentials"
echo "    Username: mattkraft-hue"
echo "    Password: Use a Personal Access Token (not your GitHub password!)"
echo ""
echo "    Don't have a token? Create one at:"
echo "    https://github.com/settings/tokens/new"
echo "    Required scopes: repo"
echo ""
read -p "Press Enter to continue..."

git push -u origin $BRANCH

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "✅ SUCCESS! Files pushed to GitHub!"
    echo "=========================================="
    echo ""
    echo "📋 Next Steps:"
    echo ""
    echo "1. Enable GitHub Pages:"
    echo "   Visit: https://github.com/mattkraft-hue/BillMgr/settings/pages"
    echo ""
    echo "2. Configure:"
    echo "   - Source: Deploy from a branch"
    echo "   - Branch: $BRANCH"
    echo "   - Folder: / (root)"
    echo "   - Click 'Save'"
    echo ""
    echo "3. Wait 2 minutes, then visit:"
    echo "   https://mattkraft-hue.github.io/BillMgr/"
    echo ""
    echo "=========================================="
else
    echo ""
    echo "❌ Push failed!"
    echo ""
    echo "Common issues:"
    echo "1. Wrong credentials - Use Personal Access Token, not password"
    echo "2. Token lacks 'repo' permission"
    echo "3. Repository doesn't exist yet"
    echo ""
    echo "See DEPLOYMENT-GUIDE.md for detailed help"
fi

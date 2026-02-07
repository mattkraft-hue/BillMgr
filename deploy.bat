@echo off
REM BCBA Billing Tracker - Windows Deployment Script
REM For repository: https://github.com/mattkraft-hue/BillMgr

echo ==========================================
echo BCBA Billing Tracker - Deployment Script
echo ==========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed!
    echo Please install Git from: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo [OK] Git is installed
echo.

REM Check if we're in the right directory
if not exist "index.html" (
    echo ERROR: index.html not found!
    echo Please run this script from the directory containing all the app files.
    pause
    exit /b 1
)

echo [OK] Found app files
echo.

REM Initialize git if needed
if not exist ".git" (
    echo Initializing Git repository...
    git init
    echo [OK] Git initialized
    echo.
)

REM Add remote if not exists
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo Adding GitHub remote...
    git remote add origin https://github.com/mattkraft-hue/BillMgr.git
    echo [OK] Remote added
    echo.
)

REM Add all files
echo Adding files to Git...
git add .
echo [OK] Files added
echo.

REM Commit
echo Creating commit...
git commit -m "Deploy BCBA Billing Tracker - Initial deployment"
echo [OK] Commit created
echo.

REM Get current branch name
for /f "tokens=*" %%i in ('git rev-parse --abbrev-ref HEAD') do set BRANCH=%%i
echo Current branch: %BRANCH%
echo.

REM Push to GitHub
echo Pushing to GitHub...
echo.
echo WARNING: You will be prompted for your GitHub credentials
echo          Username: mattkraft-hue
echo          Password: Use a Personal Access Token (not your GitHub password!)
echo.
echo          Don't have a token? Create one at:
echo          https://github.com/settings/tokens/new
echo          Required scopes: repo
echo.
pause

git push -u origin %BRANCH%

if errorlevel 1 (
    echo.
    echo ==========================================
    echo ERROR: Push failed!
    echo ==========================================
    echo.
    echo Common issues:
    echo 1. Wrong credentials - Use Personal Access Token, not password
    echo 2. Token lacks 'repo' permission
    echo 3. Repository doesn't exist yet
    echo.
    echo See DEPLOYMENT-GUIDE.md for detailed help
    pause
    exit /b 1
)

echo.
echo ==========================================
echo SUCCESS! Files pushed to GitHub!
echo ==========================================
echo.
echo Next Steps:
echo.
echo 1. Enable GitHub Pages:
echo    Visit: https://github.com/mattkraft-hue/BillMgr/settings/pages
echo.
echo 2. Configure:
echo    - Source: Deploy from a branch
echo    - Branch: %BRANCH%
echo    - Folder: / (root)
echo    - Click 'Save'
echo.
echo 3. Wait 2 minutes, then visit:
echo    https://mattkraft-hue.github.io/BillMgr/
echo.
echo ==========================================
pause

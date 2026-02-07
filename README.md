# BCBA Billing Tracker

> Secure billing management for BCBA professionals in Indiana

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Deploy](https://img.shields.io/badge/Deploy-GitHub%20Pages-success)](https://pages.github.com/)

## 🚀 Live Demo

Visit the live app: `https://YOUR-USERNAME.github.io/bcba-billing-tracker/`

## 📱 Features

### 🔐 Secure Authentication
- **Multi-user support** - Each user has their own isolated account
- **SHA-256 password hashing** - Passwords never stored in plain text
- **Data isolation** - Users can only access their own data
- **Persistent login** - Stay logged in between sessions

### 🔒 Military-Grade Encryption
- **AES-256-GCM encryption** - Same encryption used by governments
- **Optional per-user** - Enable encryption for sensitive client data
- **PBKDF2 key derivation** - 100,000 iterations for brute-force resistance
- **Zero-knowledge architecture** - Passwords never stored

### 📊 Comprehensive Tracking
- **Client management** - Track clients with IDs, prior auth, diagnosis codes
- **Session logging** - Real-time timer or manual entry
- **CPT codes** - All Indiana BCBA billing codes (97151, 97153, 97155, 97156, 97158)
- **Supervision tracking** - Automatic 10% supervision compliance monitoring
- **Provider management** - Track BCBAs, BCaBAs, and RBTs with NPI numbers

### 📱 Mobile-Optimized
- **PWA (Progressive Web App)** - Install on any device
- **Works offline** - All data stored locally
- **Touch-optimized UI** - Large buttons, bottom sheet modals
- **iOS Safe Area** - Respects notch and home indicator
- **Smooth animations** - 60fps performance

### 📈 Reports & Analytics
- **Daily summaries** - Sessions, units, minutes
- **CPT code breakdown** - Track billing by code
- **Supervision compliance** - Real-time monitoring
- **Export data** - Download JSON backups

## 🛠️ Technology Stack

- **Frontend**: React 18
- **Styling**: Tailwind CSS
- **Icons**: Lucide Icons
- **Storage**: localStorage (persistent)
- **Encryption**: Web Crypto API
- **Deployment**: GitHub Pages

## 📦 Installation

### Option 1: Use Live App (Recommended)
Simply visit the live URL and use the app directly in your browser. Install as PWA for app-like experience.

### Option 2: Deploy Your Own

1. **Fork this repository**
   ```bash
   # Click "Fork" button on GitHub
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Navigate to "Pages" section
   - Source: Deploy from branch
   - Branch: `main` or `master`
   - Folder: `/ (root)`
   - Click Save

3. **Access your deployment**
   - URL: `https://YOUR-USERNAME.github.io/REPO-NAME/`
   - Wait 1-2 minutes for deployment

### Option 3: Run Locally

```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/bcba-billing-tracker.git
cd bcba-billing-tracker

# Serve with any static server
# Python 3
python -m http.server 8000

# Node.js
npx serve

# Then open: http://localhost:8000
```

## 📖 Usage

### First Time Setup

1. **Open the app** in your browser
2. **Create account** - Tap "Create Account" on login screen
3. **Fill in details**:
   - Full Name: "Jane Smith, BCBA"
   - Username: "janesmith" (unique)
   - Password: At least 8 characters
   - Email: Optional
4. **Start tracking!**

### Daily Workflow

1. **Log in** with your username and password
2. **Add clients** - Settings → Add Client
3. **Add providers** - Settings → Add Provider  
4. **Log sessions** - Home → Log Session → Start Timer
5. **End session** - Tap "End Session" when done
6. **Review reports** - Reports tab for analytics
7. **Log out** - Settings → Log Out (especially on shared devices)

### Enable Encryption (Recommended)

1. Go to **Settings** → **Data Encryption**
2. Tap **"Enable Encryption"**
3. Set a **strong password** (different from login!)
4. All future data automatically encrypted
5. On next launch, enter encryption password

## 🔒 Security & Privacy

### Data Storage
- **100% Local** - No cloud storage, no servers
- **Per-user isolation** - Each user's data completely separate
- **Encrypted at rest** - Optional AES-256-GCM encryption
- **No tracking** - No analytics, no cookies, no tracking

### HIPAA Compliance
This app provides technical safeguards for HIPAA compliance:
- ✅ Encryption at rest (when enabled)
- ✅ Access controls (password protection)
- ✅ Audit trails (session logs)
- ✅ Data isolation (multi-user)

**Note**: Full HIPAA compliance also requires organizational policies, training, and BAAs where applicable.

### Best Practices
- Use strong, unique passwords
- Enable encryption for sensitive data
- Export backups regularly
- Log out on shared devices
- Keep device encrypted and locked

## 📤 Data Export/Import

### Export Your Data
Settings → Data Management → Export Data
- Downloads JSON file: `bcba-export-YYYY-MM-DD.json`
- Contains all your clients, sessions, providers
- Decrypted (plain text) - store securely!

### Import Data
Settings → Data Management → Import Data
- Select previously exported JSON file
- Replaces current data
- Backup first!

## 🌟 Features in Detail

### CPT Codes Supported
- **97151** - Behavior ID Assessment
- **97153** - Direct ABA Therapy (RBT)
- **97155** - Protocol Modification (BCBA)
- **97156** - Family Guidance
- **97158** - Group Treatment

### Supervision Tracking
- Automatic 10% calculation
- Real-time compliance monitoring
- Visual progress indicator
- RBT-to-BCBA ratio tracking

### Session Timer
- Real-time countdown (HH:MM:SS)
- Survives app refresh
- Automatic unit calculation
- 15-minute billing units

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🆘 Support

### Common Issues

**Can't log in?**
- Check username and password
- Username is case-insensitive
- Password is case-sensitive

**Forgot password?**
- No recovery available (security feature)
- Create new account or restore from backup

**Data not saving?**
- Check browser storage permissions
- Try different browser
- Clear cache and reload

**App won't install?**
- Use Chrome, Edge, or Safari
- Check device storage space
- Try "Add to Home Screen" manually

### Documentation
- [Authentication Guide](AUTHENTICATION-GUIDE.md)
- [Encryption Guide](ENCRYPTION-GUIDE.md)
- [Mobile Optimization](MOBILE-OPTIMIZATION.md)
- [Storage Guide](STORAGE-README.md)

## 🗺️ Roadmap

- [ ] Biometric authentication (Face ID/Touch ID)
- [ ] Password change functionality
- [ ] Account recovery options
- [ ] Export to CSV/Excel
- [ ] Backup to cloud (encrypted)
- [ ] Dark mode
- [ ] Offline sync between devices
- [ ] Push notifications
- [ ] Voice input for session notes

## 👨‍💻 Development

### File Structure
```
bcba-billing-tracker/
├── index.html              # Main HTML file
├── app.js                  # React app component
├── service-worker.js       # PWA service worker
├── manifest.json           # PWA manifest
├── README.md              # This file
├── AUTHENTICATION-GUIDE.md
├── ENCRYPTION-GUIDE.md
└── MOBILE-OPTIMIZATION.md
```

### Local Development
```bash
# Make changes to app.js or index.html
# Test locally
python -m http.server 8000

# Commit and push
git add .
git commit -m "Your changes"
git push origin main

# GitHub Pages auto-deploys
```

## ⚖️ Disclaimer

This app is provided as-is for billing tracking purposes. Users are responsible for:
- Compliance with HIPAA and state regulations
- Proper data backup and security
- Password management
- Organizational policies

Always consult with your HIPAA compliance officer and legal counsel.

## 🙏 Acknowledgments

- Built for BCBA professionals in Indiana
- Complies with Indiana BCBA billing requirements
- Encryption via Web Crypto API
- Icons by Lucide

---

**Made with ❤️ for BCBA professionals**

*Secure your billing. Protect your clients. Track with confidence.*

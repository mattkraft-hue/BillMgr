# BCBA Billing Tracker - Persistent Storage Guide

## Overview
The BCBA Billing Tracker app now includes **full persistent storage** capabilities. All your data is automatically saved and will persist between sessions, even if you close the app or refresh the browser.

## What Gets Saved

### Automatically Saved Data
The following data is automatically saved to persistent storage:

1. **Clients** - All client information including:
   - Name, Client ID
   - Prior Authorization Numbers
   - Diagnosis Codes
   - Creation dates

2. **Sessions** - Complete session history:
   - Start and end times
   - Duration and billing units
   - CPT codes
   - Provider information
   - Location
   - Session notes
   - Completion status

3. **Providers** - Staff information:
   - Name and credentials
   - Provider type (BCBA, BCaBA, RBT)
   - NPI numbers
   - Creation dates

4. **Active Sessions** - In-progress session tracking:
   - If you start a session timer and close the app, it will resume when you reopen it
   - Session data is preserved including start time and all details

## How It Works

### Automatic Saving
- **Real-time**: Data saves immediately when you:
  - Add a new client
  - Add a new provider
  - Start a session timer
  - Complete a session
  - Log a manual session

- **Visual Feedback**: You'll see a "Data saved ✓" notification appear briefly at the top of the screen confirming your data was saved

### Loading Data
- **On App Start**: All your data automatically loads when you open the app
- **No Setup Required**: Storage works immediately with no configuration needed

## Data Management Features

### Export Data
**Purpose**: Create a backup of all your data

**How to use**:
1. Go to Settings tab
2. Tap "Export Data"
3. Confirm the export
4. A JSON file will download with format: `bcba-export-YYYY-MM-DD.json`

**What's included**:
- All clients, sessions, and providers
- Export timestamp
- Complete data structure

**Use cases**:
- Regular backups
- Transferring data between devices
- Long-term archival
- Sharing data with billing software

### Import Data
**Purpose**: Restore data from a previous export

**How to use**:
1. Go to Settings tab
2. Tap "Import Data"
3. Select your exported JSON file
4. Confirm to replace current data

**Important Notes**:
- ⚠️ Import will REPLACE your current data
- Make sure to export current data first if you want to keep it
- Only use files exported from this app

### Clear All Data
**Purpose**: Completely reset the app

**How to use**:
1. Go to Settings tab
2. Tap "Clear All Data"
3. Confirm twice (safety measure)

**What gets deleted**:
- All clients
- All sessions
- All providers
- Active session timers

**Important**:
- ⚠️ This action is PERMANENT and cannot be undone
- Export your data first if you might need it later

## Storage Location

### Web Version
- Data stored in browser's persistent storage API
- Specific to this app and domain
- Survives browser refreshes and app restarts
- NOT shared between different browsers (Chrome vs Safari)
- NOT automatically synced between devices

### Future Mobile Version
When converted to a native iOS app:
- Data will be stored in the device's local database
- Will persist across app updates
- Backed up with iCloud (if user has it enabled)
- Separate from web version

## Best Practices

### Regular Backups
**Recommended**: Export your data weekly or after significant work
- Schedule: End of each week
- Store exports in a safe location (cloud drive, email to yourself)
- Keep multiple versions (last 3-4 weeks)

### Data Safety
1. **Before Major Actions**: Export before:
   - Clearing data
   - Importing new data
   - Major app updates

2. **Multiple Devices**: If using multiple devices:
   - Export from one device
   - Import to the other
   - Keep one as "primary" for data entry

3. **Long-term Storage**:
   - Keep monthly exports for billing records
   - Organize by month/quarter
   - Follow your organization's data retention policy

## Troubleshooting

### Data Not Saving
**If you see "Save failed ✗"**:
1. Check browser storage permissions
2. Clear browser cache (be careful - might lose data)
3. Try a different browser
4. Export immediately if data is critical

### Data Not Loading
**If app starts empty but you had data**:
1. Check if you're using the same browser
2. Verify you didn't clear browser data
3. Look for exported backup files
4. Contact support if issue persists

### Lost Data
**If data disappears**:
1. Check browser history for when you last used the app
2. Look for automatic browser backups
3. Check exported JSON files
4. Import from most recent export

### Storage Limits
- Each data type can store up to 5MB
- Typical usage: ~100 clients + 1000 sessions = ~500KB
- You're unlikely to hit limits with normal use

## Privacy & Security

### Data Security
- **Local Only**: Data stored only on your device
- **Not Cloud-Synced**: No automatic upload to servers
- **HIPAA Considerations**: 
  - For web version: Browser storage may not be HIPAA compliant
  - For production use: Consider native iOS app with encrypted storage
  - Never use on shared/public computers

### Data Privacy
- No personal data is transmitted
- Export files contain ALL client data - handle securely
- Follow HIPAA guidelines for PHI (Protected Health Information)
- Use device encryption (enable on iPhone/iPad)
- Set device passcode/biometric lock

## Technical Details

### Storage Technology
- Uses `window.storage` API
- Key-value pairs stored as JSON
- Hierarchical key structure: `bcba-clients`, `bcba-sessions`, etc.

### Data Structure
```json
{
  "clients": [...],
  "sessions": [...],
  "providers": [...],
  "exportDate": "2025-02-06T10:30:00.000Z"
}
```

### Migration Path
When converting to iOS native app:
1. Export data from web version
2. Install iOS app
3. Import data via JSON file
4. Verify all data transferred correctly

## Support & Questions

### Common Questions

**Q: Will my data sync between my phone and computer?**
A: No, data is stored locally on each device. Use Export/Import to transfer.

**Q: What happens if I delete the app?**
A: Web version: Data stays in browser. Native app: Data deleted unless backed up.

**Q: Can I access my data offline?**
A: Yes! All data is local and works without internet.

**Q: Is my data encrypted?**
A: Web version uses browser storage (not encrypted). For sensitive data, use the native iOS app when available.

## Version History

### v1.0 - Initial Release
- Full persistent storage implementation
- Auto-save for all data types
- Active session preservation
- Export/Import functionality
- Clear data option
- Save notifications

---

**Need Help?** Keep this README handy for reference. Export your data regularly to stay safe!

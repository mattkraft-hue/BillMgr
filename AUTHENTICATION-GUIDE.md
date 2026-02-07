# BCBA Billing Tracker - Authentication & Multi-User Guide

## Overview
The BCBA Billing Tracker now includes **secure user authentication** and **multi-user support**. Each user has their own separate account with isolated data - users can only access their own clients, sessions, and providers.

## 🔐 Authentication Features

### User Accounts
- **Separate accounts** for each user
- **Secure password hashing** (SHA-256)
- **Data isolation** - users only see their own data
- **Optional encryption** per user
- **Persistent login** - stays logged in between sessions

### Account Information
Each account stores:
- Username (unique identifier)
- Full name
- Email (optional)
- Hashed password (for security)
- Creation date

## 🚀 Getting Started

### Creating Your First Account

**Step 1: Launch the App**
- Open the BCBA Billing Tracker
- You'll see the login screen

**Step 2: Create Account**
1. Tap "Create Account"
2. Fill in required information:
   - **Full Name** (e.g., "Jane Smith, BCBA")
   - **Username** (e.g., "janesmith")
   - **Password** (minimum 8 characters)
   - **Email** (optional but recommended)
3. Confirm your password
4. Tap "Create Account"

**Step 3: Start Using the App**
- You're automatically logged in
- Start adding clients, providers, and sessions
- All your data is private to your account

### Username Requirements
- **Minimum length**: 3 characters
- **Allowed characters**: Letters, numbers (no spaces)
- **Case insensitive**: "JohnDoe" = "johndoe"
- **Must be unique**: No two users can have same username

### Password Requirements
- **Minimum length**: 8 characters
- **Recommended**: 12+ characters
- **Best practice**: Mix of uppercase, lowercase, numbers, symbols
- **Stored securely**: Only hash is stored, never plain text

## 🔑 Logging In

### Standard Login
1. Enter your username
2. Enter your password
3. Tap "Log In"
4. Access your data

### Auto-Login
- App remembers you between sessions
- You stay logged in until you log out
- Secure on your personal device

### If You Forget Your Password
**⚠️ WARNING**: There is NO password recovery!
- Passwords are hashed and cannot be retrieved
- If you forget your password, you cannot access your data
- **Prevention**: Write down your password securely

**If Forgotten**:
1. Create a new account with different username
2. Lose access to old account data
3. **Best Practice**: Export data regularly as backup

## 👥 Multi-User Support

### Multiple Users on Same Device

**Use Cases**:
- Shared clinic device
- Multiple BCBAs/RBTs using same tablet
- Supervisor and supervisees
- Practice with multiple clinicians

**How It Works**:
1. User A logs in, adds clients, sessions
2. User A logs out
3. User B logs in
4. User B sees ONLY their own data
5. User B cannot see User A's data

### Data Isolation

**What's Separate**:
- ✅ Clients (each user has own client list)
- ✅ Sessions (tracked separately per user)
- ✅ Providers (user-specific provider list)
- ✅ Active timers (per user)
- ✅ Encryption settings (per user)
- ✅ Encryption passwords (per user)

**What's Shared**:
- None - all data is completely isolated

### Storage Structure
```
User: janesmith
  ├─ bcba-janesmith-clients
  ├─ bcba-janesmith-sessions
  ├─ bcba-janesmith-providers
  ├─ bcba-janesmith-active-session
  ├─ bcba-janesmith-encryption-enabled
  └─ bcba-janesmith-password-hash

User: johnsmith
  ├─ bcba-johnsmith-clients
  ├─ bcba-johnsmith-sessions
  ├─ bcba-johnsmith-providers
  ├─ bcba-johnsmith-active-session
  ├─ bcba-johnsmith-encryption-enabled
  └─ bcba-johnsmith-password-hash
```

## 🔒 Security Features

### Password Security
**Hashing**:
- Passwords hashed with SHA-256
- Original password NEVER stored
- Hash cannot be reversed to get password
- Brute force resistant

**Login Verification**:
1. You enter password
2. App hashes your input
3. Compares with stored hash
4. Grants access only if match

### Session Security
**Auto-Logout**:
- Currently: Manual logout only
- Future: Auto-logout after inactivity

**Logout Protection**:
- Confirms before logging out
- Clears all data from memory
- Prevents accidental data exposure

### Combined with Encryption
**Double Protection**:
- Layer 1: Login password (account access)
- Layer 2: Encryption password (data encryption)
- Both can be same or different

**Recommended Setup**:
- Use DIFFERENT passwords for login and encryption
- Login: Controls account access
- Encryption: Protects data at rest

## 📤 Data Export/Import

### Exporting Your Data
**How to Export**:
1. Log in to your account
2. Go to Settings
3. Tap "Export Data"
4. File downloads: `bcba-export-YYYY-MM-DD.json`

**What Gets Exported**:
- All your clients
- All your sessions
- All your providers
- Export timestamp

**Important Notes**:
- Export is decrypted (plain JSON)
- Include your username in export
- Store export file securely
- Only you can import to your account

### Importing Data
**How to Import**:
1. Log in to your account
2. Go to Settings
3. Tap "Import Data"
4. Select your export file
5. Confirm to replace current data

**Important**:
- Imports only to YOUR account
- Replaces your current data
- Cannot import another user's data directly
- Backup current data before importing

### Transferring Data Between Users
**Not Directly Supported**, but you can:
1. User A exports data
2. User A shares file securely with User B
3. User B logs in
4. User B imports the file
5. Data is now in User B's account

## 🔧 Account Management

### Logging Out
**How to Logout**:
1. Go to Settings
2. Scroll to "Account" section
3. Tap "Log Out"
4. Confirm logout

**What Happens**:
- Cleared from memory
- Removed from current user storage
- Login screen shows
- Data remains safely stored for when you log back in

### Account Information
**View Your Account**:
- Settings → Account section
- Shows: Name, Username, Email
- See when account was created

### Changing Password
**Currently Not Supported Directly**

**Workaround**:
1. Export all your data
2. Create new account with new password
3. Import your data to new account
4. Delete old account (clear browser storage)

**Future Feature**:
- Change password in Settings
- Requires current password
- Updates hash securely

### Deleting Account
**How to Delete**:
1. Export data if you want to keep it
2. Log out
3. Clear browser storage/data
4. Account data removed

**OR**:
1. Go to Settings → Data Management
2. Tap "Clear All Data"
3. This deletes YOUR account's data
4. Other users unaffected

## 🏢 Organization Use

### Clinic Setup
**Scenario**: 5 BCBAs sharing one iPad

**Setup**:
1. BCBA #1 creates account "drsmith"
2. BCBA #2 creates account "drajohnson"
3. BCBA #3 creates account "drlee"
4. BCBA #4 creates account "drchen"
5. BCBA #5 creates account "drpatel"

**Usage**:
- Each clinician logs in with own username
- Tracks their own clients/sessions
- Logs out when done
- Next clinician logs in
- Complete data privacy

### Best Practices for Clinics
**Security**:
- Each user has unique password
- Users log out when leaving device
- Device has passcode/biometric lock
- Regular data exports for each user

**Compliance**:
- Each user responsible for own data
- Audit trail shows who logged what
- Session logs track by user
- HIPAA-compliant if following guidelines

### RBT Supervision
**Setup**:
- Supervisor (BCBA) has account
- Each RBT has own account
- RBTs log their own sessions
- BCBA can review through exports/reports

## 📊 User Account Statistics

### Dashboard Shows
- Today's sessions (YOUR sessions only)
- Active clients (YOUR clients only)
- Supervision compliance (YOUR data only)
- Recent sessions (YOUR sessions only)

### Reports Show
- YOUR session data only
- YOUR CPT code breakdown
- YOUR supervision hours
- YOUR billing units

## 🔍 Troubleshooting

### Can't Log In
**Possible Issues**:
1. Wrong username or password
2. Caps Lock enabled
3. Username/password typo

**Solutions**:
- Try again carefully
- Check Caps Lock
- Remember username is case-insensitive
- Try copying/pasting username

### Forgot Username
**Recovery**:
- No built-in recovery
- Check any exports you made (username in metadata)
- Check email you used (if recorded)
- May need to create new account

### Forgot Password
**⚠️ No Recovery Available**
- Password cannot be retrieved
- Must create new account
- Import old data if you have exports

### Account Already Exists
**Error**: "Username already exists"

**Solutions**:
- Choose different username
- Add numbers: "janesmith" → "janesmith2"
- Add credentials: "janesmith" → "janesmithbcba"

### Data Not Showing After Login
**Possible Causes**:
1. Logged into wrong account
2. Data not yet created
3. Data encrypted (need encryption password)

**Solutions**:
- Verify username is correct
- Check if encryption is enabled
- Import backup if data was lost

### Multiple Accounts on Same Device
**Issue**: Confused which account is which

**Solution**:
- Use descriptive usernames
- Add full name in account creation
- Keep track of usernames/passwords
- Use password manager

## 🛡️ Security Best Practices

### For Individual Users
**DO**:
- ✅ Use strong unique password
- ✅ Enable encryption for sensitive data
- ✅ Log out on shared devices
- ✅ Export data regularly
- ✅ Keep password secure (password manager)

**DON'T**:
- ❌ Share your password
- ❌ Use same password as other accounts
- ❌ Leave device unlocked
- ❌ Forget to log out on shared devices

### For Organizations
**Policies**:
- Require strong passwords
- Mandatory logout after use
- Regular data exports
- Device encryption enabled
- Security awareness training

**Compliance**:
- Document user accounts
- Maintain access logs
- Regular security audits
- Incident response plan
- Data retention policy

## 🔄 Workflow Examples

### Solo Practitioner
```
1. Create account
2. Enable encryption
3. Add clients
4. Log sessions daily
5. Export weekly backups
6. Review reports monthly
```

### Clinic with Multiple BCBAs
```
1. Each BCBA creates account
2. Each enables own encryption
3. Log in/out as needed
4. Track own caseload
5. Export for billing
6. Coordinate through other means
```

### BCBA with RBT Team
```
1. BCBA has supervisor account
2. Each RBT has account
3. RBTs log direct sessions
4. BCBA logs supervision
5. Export data for reviews
6. Aggregate billing centrally
```

## 📝 Technical Details

### Authentication Flow
```
1. User enters username + password
2. App checks bcba-user-{username}
3. Hashes entered password
4. Compares with stored hash
5. If match: Load user data
6. If no match: Show error
```

### Data Access Control
```
- User logged in as "janesmith"
- App loads: bcba-janesmith-clients
- App loads: bcba-janesmith-sessions
- App saves: bcba-janesmith-providers
- Another user cannot access these keys
```

### Session Persistence
```
- On login: bcba-current-user set
- On app load: Check bcba-current-user
- If exists: Auto-login
- If not: Show login screen
- On logout: Delete bcba-current-user
```

## 🔮 Future Enhancements

### Planned Features
- Password change in Settings
- Account recovery options
- Email verification
- Two-factor authentication (2FA)
- Biometric login (Face ID/Touch ID)
- Account activity log
- Session timeout/auto-lock
- Admin/supervisor roles
- Shared client lists (with permissions)

### Requested Features
Submit feature requests through feedback

---

## Quick Reference

### Creating Account
Settings → Create Account → Fill form → Create

### Logging In
Enter username → Enter password → Log In

### Logging Out
Settings → Account → Log Out

### Data Export
Settings → Data Management → Export Data

### Enable Encryption
Settings → Data Encryption → Enable → Set Password

### Check Account Info
Settings → Account Section

---

**Remember**: 
- Your username and password are YOUR responsibility
- No password recovery available
- Export data regularly for backup
- Log out on shared devices
- Keep passwords secure!

# Excel Import/Export Guide

## Overview
The BCBA Billing Tracker now supports **Excel (.xlsx) import and export** for easy data management, billing submissions, and integration with other software.

## 📊 Excel Export

### What Gets Exported

When you export to Excel, you get a complete workbook with **4 sheets**:

#### 1. **Sessions Sheet**
Complete session log with all details:
- Date, Start Time, End Time
- Client Name, Client ID
- Provider Name, Provider Type
- CPT Code, Location
- Duration (minutes), Units billed
- Session notes, Status

#### 2. **Clients Sheet**
All client information:
- Name
- Client ID
- Prior Authorization Number
- Diagnosis Code
- Created Date

#### 3. **Providers Sheet**
Provider roster:
- Name
- Type (BCBA, BCaBA, RBT)
- NPI Number
- Credentials
- Created Date

#### 4. **Summary Sheet**
Quick statistics:
- Total sessions, units, minutes
- Total clients and providers
- RBT sessions count
- Supervision sessions count
- Supervision compliance percentage
- Export metadata (date, user)

### How to Export

1. **Go to Settings** tab
2. **Scroll to "Data Management"** section
3. **Click "Export to Excel"**
4. **Confirm** the export
5. **File downloads** automatically: `bcba-export-username-YYYY-MM-DD.xlsx`

### Export Use Cases

**Monthly Billing**:
- Export at month end
- Review Sessions sheet
- Submit to billing department
- Archive for records

**Audit Preparation**:
- Export all historical data
- Summary sheet shows compliance
- Sessions sheet has complete audit trail

**Data Analysis**:
- Open in Excel/Google Sheets
- Create pivot tables
- Generate custom reports
- Track trends over time

**Backup**:
- Regular Excel exports
- Store securely
- Restore if needed

## 📥 Excel Import

### What You Can Import

The app can import Excel files in the same format as exports:
- **Clients** from "Clients" sheet
- **Providers** from "Providers" sheet
- **Sessions** from "Sessions" sheet

### How Import Works

**Important**: Import **adds** to existing data (doesn't replace)

1. **Go to Settings** → **Data Management**
2. **Click "Import from Excel"**
3. **Select your .xlsx file**
4. **Review** the import preview
5. **Confirm** to add data

### Import Process

The app will:
1. Read each sheet
2. Create new clients and providers
3. Match sessions to clients/providers by name
4. Generate new IDs for all records
5. Add to your existing database

### Import Requirements

**Clients Sheet**:
- Required: "Name" column
- Optional: Client ID, Prior Auth, Diagnosis

**Providers Sheet**:
- Required: "Name" column
- Optional: Type, NPI, Credentials

**Sessions Sheet**:
- Required: "Client Name", "Provider", "CPT Code"
- Must match existing or imported client/provider names
- Sessions without matches are skipped

### Import Use Cases

**Migrating Data**:
- Export from old system
- Format as BCBA Tracker Excel
- Import to new account

**Bulk Entry**:
- Create Excel template
- Fill in multiple sessions
- Import all at once

**Team Collaboration**:
- RBTs fill Excel offline
- BCBA imports sessions
- Review and approve

**Data Recovery**:
- Import from backup Excel
- Restore deleted data
- Merge multiple exports

## 📋 Excel Template

### Creating a Compatible Excel File

You can create your own Excel files to import. Use this format:

#### Clients Sheet:
```
| Name          | Client ID | Prior Auth Number | Diagnosis Code | Created Date |
|---------------|-----------|-------------------|----------------|--------------|
| John Doe      | JD001     | PA123456         | F84.0          | 1/1/2025     |
| Jane Smith    | JS002     | PA789012         | F84.0          | 1/1/2025     |
```

#### Providers Sheet:
```
| Name          | Type  | NPI Number | Credentials | Created Date |
|---------------|-------|------------|-------------|--------------|
| Dr. Smith     | BCBA  | 1234567890 | BCBA, PhD   | 1/1/2025     |
| Mary Johnson  | RBT   | 0987654321 |             | 1/1/2025     |
```

#### Sessions Sheet:
```
| Date     | Start Time | End Time | Client Name | Provider    | CPT Code | Location | Duration (min) | Units | Notes      |
|----------|------------|----------|-------------|-------------|----------|----------|----------------|-------|------------|
| 1/15/25  | 9:00 AM    | 10:00 AM | John Doe    | Mary Johnson| 97153    | Home     | 60             | 4     | Good session|
| 1/15/25  | 10:15 AM   | 11:00 AM | Jane Smith  | Mary Johnson| 97153    | School   | 45             | 3     |            |
```

## 🔄 Excel vs JSON

### When to Use Excel

**Use Excel when**:
- ✅ Submitting for billing
- ✅ Sharing with non-technical staff
- ✅ Creating reports for stakeholders
- ✅ Analyzing data in Excel/Sheets
- ✅ Printing records
- ✅ Bulk data entry

**Excel Advantages**:
- Human-readable format
- Opens in Excel, Google Sheets, Numbers
- Easy to edit and review
- Familiar to most users
- Professional appearance

### When to Use JSON

**Use JSON when**:
- ✅ Complete system backup
- ✅ Transferring between accounts
- ✅ Developer/technical use
- ✅ Exact data replication
- ✅ Automation/scripting

**JSON Advantages**:
- Preserves exact IDs and relationships
- Smaller file size
- Faster import/export
- No data loss
- Technical precision

## 💡 Best Practices

### For Exports

**Regular Backups**:
- Export weekly to Excel
- Export monthly to JSON
- Store both formats securely

**Naming Convention**:
```
bcba-export-username-2025-01-15.xlsx
bcba-backup-username-2025-01.json
```

**Archive Organization**:
```
Backups/
├── 2025/
│   ├── January/
│   │   ├── bcba-export-2025-01-07.xlsx
│   │   ├── bcba-export-2025-01-14.xlsx
│   │   └── bcba-export-2025-01-21.xlsx
│   └── February/
```

### For Imports

**Before Importing**:
- Export current data first (backup!)
- Review Excel file for errors
- Check client/provider names match exactly
- Verify CPT codes are valid

**After Importing**:
- Review imported records
- Check totals make sense
- Verify no duplicates
- Export again to confirm

**Import Safely**:
- Import to test account first
- Small batches (50-100 records)
- Review before adding more
- Keep original Excel file

## 🛠️ Troubleshooting

### Import Fails

**Error: "Can't read file"**
- File must be .xlsx format (not .xls)
- File not corrupted
- Close file in Excel before importing

**Error: "No data found"**
- Check sheet names match exactly
- Sheets must be: "Clients", "Providers", "Sessions"
- Column headers must match exactly

**Sessions Not Importing**
- Client names must match exactly (case-sensitive)
- Provider names must match exactly
- Clients and providers must exist or be in import file

### Export Issues

**No data in export**
- Make sure you have data to export
- Check you're logged into correct account
- Try exporting just clients first

**Can't open exported file**
- File might be blocked by Excel
- Try right-click → Properties → Unblock
- Open in Google Sheets instead

### Data Mismatch

**Dates Wrong**
- Check your system timezone
- Excel may interpret dates differently
- Use format: MM/DD/YYYY or YYYY-MM-DD

**Missing Sessions**
- Check Status column (only "completed" may show)
- Verify date range
- Check client/provider was not deleted

## 📊 Excel Tips

### Formulas

Add columns for analysis:
```excel
=SUM(K:K)                    // Total units
=AVERAGE(J:J)                // Average duration
=COUNTIF(H:H,"97153")        // Count specific CPT
```

### Pivot Tables

Create reports:
1. Select Sessions data
2. Insert → Pivot Table
3. Rows: Client Name
4. Values: Sum of Units
5. Filter: Date range

### Conditional Formatting

Highlight important data:
- Color-code CPT codes
- Highlight long sessions (>90 min)
- Flag missing information
- Show supervision compliance

## 🔐 Security

### Excel File Security

**Protect Sensitive Data**:
- Password-protect Excel files
- Encrypt before emailing
- Store on secure drives
- Delete when no longer needed

**HIPAA Compliance**:
- Excel files contain PHI
- Follow your organization's policies
- Secure transmission methods
- Proper disposal procedures

**Best Practices**:
- Don't email unencrypted
- Use secure file sharing (OneDrive, SharePoint)
- Enable Excel password protection
- Track who has access

### Password Protecting Excel

1. Open Excel file
2. File → Info → Protect Workbook
3. Encrypt with Password
4. Enter strong password
5. Save file

**Remember**: Lost passwords cannot be recovered!

## 🎯 Quick Reference

### Export
Settings → Data Management → Export to Excel → Confirm

### Import  
Settings → Data Management → Import from Excel → Select File → Confirm

### File Format
`.xlsx` (Excel 2007+)

### Sheets
- Sessions (required for session data)
- Clients (required for client import)
- Providers (required for provider import)
- Summary (informational only, not imported)

### Import Behavior
**Adds** to existing data (does not replace)

### Column Requirements
- **Clients**: Name (required)
- **Providers**: Name (required)
- **Sessions**: Client Name, Provider, CPT Code (required)

---

## 📞 Support

For issues with Excel import/export:
1. Check file format (.xlsx)
2. Verify sheet names and column headers
3. Try with small sample first
4. Export current data to see correct format
5. Contact support with error details

---

**Excel import/export makes BCBA Billing Tracker compatible with your existing workflows while maintaining all the security and features of the app!**

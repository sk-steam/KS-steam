# KS Steam - Download & Launcher Integration Guide 📥

## Overview

Your KS Steam application now supports downloading the entire website for offline use on PC and integration with Windows launchers. This guide explains how to use these features.

---

## 🎯 Features

### 1. **Website Download**
Download the complete KS Steam application in various package formats:
- **Full Version** - Complete website with all resources (~500MB)
- **Minimal Version** - Essential files only (~150MB)  
- **For Launcher** - Optimized for Windows launchers (~200MB)
- **Portable Version** - Standalone with built-in resources (~600MB)

### 2. **Data Management**
- 💾 Export user data as backup
- 📂 Import data from previous backups
- 🗑️ Clear browser cache
- ⚠️ Delete all personal data (with confirmation)

### 3. **Download History**
Track all previous downloads with timestamps

---

## 📥 How to Download

### Step 1: Open Settings
1. Click "Profile" in navigation
2. Scroll down and select "Settings" in sidebar
3. Look for the "📥 Завантажити для ПК" section

### Step 2: Choose Package Type
Select one of 4 available packages:

#### **Full Version** ✅
```
Best for: Complete offline experience
Includes: All CSS, JS, images, data
Size: ~500MB
Use when: You want everything
```

#### **Minimal Version** 🏃
```
Best for: Quick download
Includes: Essential HTML/CSS/JS only
Size: ~150MB
Use when: You want just the app
```

#### **For Launcher** 🎮
```
Best for: Windows launcher integration
Includes: Launcher config files
Size: ~200MB
Use when: Installing via launcher
```

#### **Portable Version** 🚀
```
Best for: No internet needed
Includes: Everything bundled
Size: ~600MB
Use when: Air-gapped computer
```

### Step 3: Download & Install

#### Option A: Direct Browser Opening
```
1. Unzip downloaded file
2. Find 'index.html'
3. Double-click or drag to browser
4. App will open in browser
```

#### Option B: Launcher Installation
```
1. Unzip file to launcher apps folder:
   C:\Program Files\KS Launcher\apps\ks-steam

2. Open KS Launcher

3. Menu → Add Application

4. Select 'launcher-config.json'

5. Click Launch
```

#### Option C: Local Server (Recommended)
```
Windows:
1. Open Command Prompt in extracted folder
2. Run: python -m http.server 8000
3. Open: http://localhost:8000

macOS/Linux:
1. Open Terminal in extracted folder
2. Run: python3 -m http.server 8000
3. Open: http://localhost:8000
```

---

## 💾 Data Management

### Export Backup
```
Why: Save your user data, games, friends list
Where: Settings → Управління даними → Експортувати дані
Result: Downloads JSON file with all your data
```

### Import Backup
```
Why: Restore data from previous export
Where: Settings → Управління даними → Імпортувати дані
Process: Select the backup JSON file
Result: Data restored, page reloads
```

### Clear Cache
```
Why: Remove temporary files, free space
Where: Settings → Управління даними → Очистити кеш
Result: Browser cache and service workers cleared
```

### Delete All Data
```
⚠️ WARNING: This cannot be undone!

Step 1: Click "Видалити всі дані"
Step 2: Confirm dialog (Yes/No)
Step 3: Enter "ВИДАЛИТИ" as verification
Step 4: All data permanently deleted
```

---

## 🔧 Installation on Windows Launcher

### For KS Launcher Users

#### Step-by-Step

1. **Download Package**
   - Go to Settings → Download for Launcher
   - Click Download button
   - Wait for download to complete

2. **Extract Files**
   - Right-click downloaded ZIP
   - Select "Extract All..."
   - Choose folder: `C:\Program Files\KS Launcher\apps\ks-steam`

3. **Register with Launcher**
   - Open KS Launcher
   - Click Menu → Add Application
   - Navigate to extracted folder
   - Select `launcher-config.json`
   - Click Open/Add

4. **Launch Application**
   - Find "KS Steam" in launcher
   - Click Launch
   - Application opens in window

5. **Enjoy!**
   - All features work the same
   - Your data syncs automatically
   - Launcher handles updates

### Configuration File (launcher-config.json)

```json
{
  "name": "KS Steam",
  "version": "2.0",
  "description": "KS Steam - Gaming Platform",
  "entry": "index.html",
  "type": "electron",
  "window": {
    "width": 1400,
    "height": 900,
    "minWidth": 1024,
    "minHeight": 768
  },
  "settings": {
    "allowExit": true,
    "autoUpdate": true,
    "launcherIntegration": true
  }
}
```

---

## 📊 Package Contents

### Full Version Contents

```
KS-Steam-full-2026-05-24/
├── index.html                          # Main app
├── launcher-config.json                # Launcher config
├── INSTALL.md                          # Installation guide
├── README-LAUNCHER.md                  # Launcher guide
│
├── css/
│   ├── neon-theme.css                 # Design system
│   ├── animations.css                 # Animations
│   ├── components.css                 # Components
│   ├── steam_clone.css                # Legacy CSS
│   └── library.css                    # Library CSS
│
├── js/
│   ├── core/
│   │   └── app.js                     # Main app
│   ├── modules/
│   │   ├── auth.js                    # Authentication
│   │   ├── games.js                   # Games
│   │   ├── user.js                    # Users
│   │   ├── ui.js                      # UI helpers
│   │   ├── profile.js                 # Profile
│   │   ├── library.js                 # Library
│   │   ├── download.js                # Download
│   │   └── download-ui.js             # Download UI
│   └── i18n/
│       └── i18n.js                    # Translations
│
├── data/
│   └── games.json                     # Games database
│
└── assets/
    └── (images and resources)
```

### Minimal Version (subset of Full)

```
KS-Steam-minimal-2026-05-24/
├── index.html
├── css/
│   └── neon-theme.css                 # Only main CSS
├── js/
│   ├── core/app.js
│   ├── modules/ (all modules)
│   └── i18n/i18n.js
└── INSTALL.md
```

---

## 🚀 Usage Scenarios

### Scenario 1: Play Offline
```
1. Download "Portable Version"
2. Extract to any folder
3. Open index.html
4. Play without internet!
```

### Scenario 2: Install on Launcher
```
1. Download "For Launcher" version
2. Extract to launcher apps folder
3. Add to launcher via config
4. Launch from launcher with one click
```

### Scenario 3: Backup & Restore
```
1. Go to Settings → Export Data
2. Save backup file somewhere safe
3. Later, go to Settings → Import Data
4. Select saved file
5. All data restored!
```

### Scenario 4: Fresh Start
```
1. Go to Settings
2. Click "Delete All Data"
3. Confirm twice
4. All data deleted
5. Start fresh!
```

---

## 🔒 Security Notes

### Data Storage
- **LocalStorage**: Browser stores user data locally
- **Exported Data**: Backup files contain all user data
- **No Cloud**: Data never leaves your computer (unless you upload)

### Backup Security
- Backup files are plain JSON
- **WARNING**: Don't share backup files (contains passwords!)
- Store backups in secure location
- Keep multiple copies

### When Importing
- Only import files from trusted sources
- Never import from strangers
- Verify file integrity before importing

---

## 🐛 Troubleshooting

### Download Not Starting
```
Solution:
1. Check internet connection
2. Disable ad blocker
3. Try different browser
4. Check storage space (~500MB+)
```

### File Size Different
```
Normal: Size varies based on resources
Options:
- Minimal: ~150MB
- Full: ~500MB
- Portable: ~600MB
```

### Can't Open After Extract
```
Solution:
1. Ensure index.html exists
2. Check file permissions
3. Try opening with Python server
4. Check browser compatibility
```

### Launcher Can't Find Files
```
Solution:
1. Verify extraction location
2. Check launcher-config.json exists
3. Ensure proper folder structure
4. Try re-adding application
```

### Data Lost After Import
```
Prevention:
1. Export backup first
2. Verify backup file exists
3. Check import dialog
4. Keep original backup
```

---

## 📱 Supported Platforms

### Operating Systems
- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Linux (Ubuntu, Fedora, etc.)
- ✅ Chrome OS

### Browsers
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Brave
- ✅ Opera

### Launchers
- ✅ KS Launcher 2.0+
- ⏳ Epic Games Launcher (planned)
- ⏳ Steam (planned)

---

## 📞 Support & Help

### Common Questions

**Q: Where are my files stored?**
A: All local data in browser localStorage at: %APPDATA%\{Browser}\Local Storage

**Q: Can I delete after downloading?**
A: Yes! Downloaded files are independent copies.

**Q: Can I use on multiple computers?**
A: Yes! Just extract and run on each computer.

**Q: Does it work offline?**
A: Yes with Portable version! Minimal/Full need internet for some features.

**Q: How often should I backup?**
A: After significant progress or weekly minimum.

**Q: Can I move the app folder?**
A: Yes! App is portable and works from any location.

---

## 🎯 Next Steps

1. **Test Download**: Try downloading one version
2. **Try Offline**: Extract and test locally
3. **Backup Data**: Export your data regularly
4. **Explore Launcher**: Install with Windows launcher
5. **Share**: Let others know about download feature!

---

## 📊 Download Statistics

- **Total Downloads**: Can be tracked in settings
- **Package Popularity**: Most used versions displayed
- **Storage Saved**: Estimated size per version
- **Last Downloaded**: Date of last package download

---

**Last Updated:** May 24, 2026
**Status:** ✅ Feature Complete & Tested
**Version:** 2.0+Download Support

---

🎮 **Happy downloading and enjoy KS Steam offline!**

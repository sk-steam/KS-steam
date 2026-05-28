# KS Steam Launcher Integration - Testing Guide

## 🚀 Launcher Detection

The application now automatically detects if it's running in KS Launcher mode using multiple methods:

### Detection Methods (in order):
1. **Cookie Detection**: Check for `launcher=true` cookie
2. **URL Parameter**: Check for `?launcher=true` URL parameter
3. **Fallback**: Default to browser mode if neither exists

### How Launcher Can Set This:

**Method 1: Cookie (Recommended)**
```javascript
// In launcher's JavaScript before loading KS Steam
document.cookie = "launcher=true; path=/";
```

**Method 2: URL Parameter**
```
file:///path/to/index-new.html?launcher=true
```

## 🎨 UI Indicators

When running in launcher mode:
- A glowing indicator appears in the top-right corner: "🚀 Launcher Mode"
- Console shows: "✅ Running in KS Launcher mode"

## 📦 Modifications System

### Available Modifications
1. **KS Steam Enhancements** - v1.0.0
   - Enhancements for KS Steam Launcher
   - Additional features and optimization

2. **Dark Theme Pro** - v2.1.0
   - Extended dark theme with additional styles
   - More customization options

3. **Game Library Manager** - v1.5.2
   - Manage game library organization
   - Download management utilities

### Installation
- Click "Install" button on any modification
- Data stored in `localStorage['kssteam_installed_mods']`
- Format: Array of installed mod objects with enabled status

## 🌐 Internationalization (i18n)

### Languages Supported:
- **English** (en) - Default
- **Ukrainian** (uk) - Full Ukrainian translation

### Translation System:
- Inline translations loaded from `EN_TRANSLATIONS` and `UK_TRANSLATIONS` objects
- No external JSON files needed for core translations
- Triggered by language selector in Settings
- Uses `data-i18n` attributes in HTML

### Example i18n keys:
```
settings.title - "Settings" / "Налаштування"
settings.appearance - "Appearance" / "Зовнішній вигляд"
mods.title - "Modifications for KS Steam" / "Модифікації для KS Steam"
launcher.mode - "Launcher Mode" / "Режим лаунчера"
```

## 📋 Settings Section Now Includes:

1. **Appearance**
   - Language selector (en/uk)
   - Theme selector (dark/light)
   - Notifications toggle

2. **Download for PC**
   - Full Version
   - Minimal Version
   - For Launcher
   - Portable Version

3. **Modifications Section** ⭐ NEW
   - Display of available modifications
   - Installation management
   - Version display

4. **Data Management**
   - Export user data
   - Import user data
   - Clear cache
   - Delete all data

## 🔍 Testing Checklist

- [ ] Language switching works (English ↔ Ukrainian)
- [ ] Settings labels appear in selected language
- [ ] Modifications section displays 3 available mods
- [ ] Install button works on modifications
- [ ] Launcher mode indicator appears when cookie is set
- [ ] Console shows correct initialization messages
- [ ] All new Ukrainian translations display correctly

## 📂 File Structure Updates

Modified files:
- ✅ `js/i18n/i18n.js` - Updated translation loading
- ✅ `js/core/app.js` - Added launcher detection
- ✅ `js/modules/games.js` - Added mod filtering
- ✅ `js/modules/download-ui.js` - Added mod display
- ✅ `data/games.json` - Added 3 modifications
- ✅ `index-new.html` - Added modifications section
- ✅ All translations added to i18n.js

## 🔗 API Reference

### Launcher Detection
```javascript
app.isLauncher          // Boolean
app.launcherInfo        // {isLauncher, version, platform}
app.detectLauncher()    // Function to re-detect
```

### Modifications
```javascript
gamesService.getModifications()      // Get all mods
gamesService.getLauncherMods()       // Get launcher-specific mods
installModification(modId)            // Install a mod
```

### Language
```javascript
i18n.currentLang                      // Current language
i18n.changeTo(lang)                   // Change language
i18n.t(key, defaultValue)             // Translate string
```

---

**Version**: 2.0 (Neon Refactor)  
**Last Updated**: 2026-05-24

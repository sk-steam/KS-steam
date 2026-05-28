# KS Steam - Launcher Integration API 🎮

## Overview

This document describes how to integrate KS Steam with third-party launchers (Windows, Epic Games, Steam, etc.).

---

## 📋 Configuration

### launcher-config.json

```json
{
  "name": "KS Steam",
  "version": "2.0",
  "author": "KS Games",
  "description": "KS Steam - Next generation gaming platform",
  "entry": "index.html",
  "type": "electron",
  
  "window": {
    "width": 1400,
    "height": 900,
    "minWidth": 1024,
    "minHeight": 768,
    "maxWidth": 1920,
    "maxHeight": 1080,
    "resizable": true,
    "fullscreenable": true,
    "frame": true
  },

  "settings": {
    "allowExit": true,
    "autoUpdate": true,
    "launcherIntegration": true,
    "offlineMode": true,
    "enableNotifications": true,
    "enableAnalytics": false,
    "dataDirectory": "%APPDATA%/KS-Steam"
  },

  "requirements": {
    "minOS": "Windows 10",
    "minRAM": "512MB",
    "minStorage": "200MB",
    "browsers": ["Chrome", "Firefox", "Edge", "Safari"]
  },

  "urls": {
    "website": "https://ks-gaming.com",
    "support": "https://ks-gaming.com/support",
    "updates": "https://ks-gaming.com/updates"
  }
}
```

---

## 🔌 API Endpoints (IPC Communication)

### Launcher → App Commands

```javascript
// Launch game
window.postMessage({
  command: 'launch-game',
  gameId: 123
}, '*');

// Get user data
window.postMessage({
  command: 'get-user-data'
}, '*');

// Update settings
window.postMessage({
  command: 'update-settings',
  settings: { theme: 'dark' }
}, '*');

// Minimize app
window.postMessage({
  command: 'minimize'
}, '*');

// Close app
window.postMessage({
  command: 'close-app'
}, '*');
```

### App → Launcher Events

```javascript
// Send user data
window.parent.postMessage({
  event: 'user-data',
  data: { username: 'user', level: 1 }
}, '*');

// Notify update available
window.parent.postMessage({
  event: 'update-available',
  version: '2.1'
}, '*');

// Game launch complete
window.parent.postMessage({
  event: 'game-launched',
  gameId: 123,
  timestamp: Date.now()
}, '*');

// Error notification
window.parent.postMessage({
  event: 'error',
  message: 'Game launch failed',
  code: 'LAUNCH_ERROR'
}, '*');
```

---

## 🎮 Game Launch Protocol

### Integration Points

```typescript
// Launcher calls KS Steam to launch game
interface LaunchRequest {
  command: 'launch-game',
  gameId: number,
  userId: string,
  gameData?: {
    title: string,
    path?: string,
    args?: string[]
  }
}

// KS Steam responds with status
interface LaunchResponse {
  success: boolean,
  gameId: number,
  pid?: number,
  message?: string,
  error?: string
}
```

### Implementation

```javascript
// In js/modules/download.js (extended)

class LauncherBridge {
  /**
   * Initialize launcher communication
   */
  static init() {
    window.addEventListener('message', (event) => {
      if (event.origin !== window.location.origin) return;
      
      const { command, data } = event.data;
      
      switch (command) {
        case 'launch-game':
          this.launchGame(data);
          break;
        case 'get-stats':
          this.sendStats();
          break;
        case 'minimize':
          this.minimize();
          break;
        case 'close':
          this.close();
          break;
      }
    });
  }

  /**
   * Launch game from library
   */
  static launchGame(gameData) {
    const { gameId } = gameData;
    const game = gamesService.getGameById(gameId);
    
    if (!game) {
      this.sendError('Game not found', 'GAME_NOT_FOUND');
      return;
    }

    // Update user stats
    if (app.user) {
      userService.addGameToLibrary(app.user.id, gameId);
    }

    // Send launch event
    window.parent.postMessage({
      event: 'game-launched',
      gameId,
      title: game.title,
      timestamp: Date.now()
    }, '*');
  }

  /**
   * Send user statistics
   */
  static sendStats() {
    const stats = {
      gamesOwned: app.user?.games?.length || 0,
      playtime: app.user?.playtime || 0,
      level: app.user?.level || 1,
      friends: app.user?.friends?.length || 0
    };

    window.parent.postMessage({
      event: 'stats',
      data: stats
    }, '*');
  }

  /**
   * Send error to launcher
   */
  static sendError(message, code) {
    window.parent.postMessage({
      event: 'error',
      message,
      code
    }, '*');
  }
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    LauncherBridge.init();
  });
} else {
  LauncherBridge.init();
}
```

---

## 📦 Data Directory Structure

### Windows Launcher Data

```
%APPDATA%\KS Launcher\apps\ks-steam\
├── index.html
├── launcher-config.json
├── css/
├── js/
├── data/
│   └── games.json
├── user-data/
│   ├── profiles.json
│   ├── library.json
│   └── settings.json
└── cache/
    ├── images/
    └── temp/
```

### User Data File (user-data/profiles.json)

```json
{
  "profiles": [
    {
      "id": 1234567890,
      "username": "player123",
      "email": "player@example.com",
      "level": 5,
      "playtime": 250,
      "friends": [1234567891, 1234567892],
      "games": [1, 2, 3],
      "lastLogin": "2026-05-24T10:30:00Z"
    }
  ]
}
```

---

## 🔄 Update System

### Version Checking

```javascript
class UpdateManager {
  /**
   * Check for updates
   */
  static async checkForUpdates() {
    try {
      const response = await fetch('/updates/version.json');
      const data = await response.json();
      
      if (data.version > this.getCurrentVersion()) {
        window.parent.postMessage({
          event: 'update-available',
          version: data.version,
          size: data.size,
          changes: data.changes
        }, '*');
      }
    } catch (error) {
      console.error('Update check failed:', error);
    }
  }

  /**
   * Get current version
   */
  static getCurrentVersion() {
    return '2.0.0';
  }

  /**
   * Download and install update
   */
  static async installUpdate(version) {
    window.parent.postMessage({
      event: 'update-installing',
      version
    }, '*');

    // Download and extract logic
    // Then notify completion
    window.parent.postMessage({
      event: 'update-complete',
      version,
      restartRequired: true
    }, '*');
  }
}
```

---

## 🔐 Security Considerations

### Sandbox Restrictions

```javascript
// Don't allow:
- Direct filesystem access (except allowed dirs)
- System command execution
- Registry modification
- Network requests to arbitrary URLs

// Allow:
- Local HTTP requests
- Launcher communication via postMessage
- Data storage in specified directory
- Console logging
```

### Data Protection

```javascript
// Encryption for sensitive data
class DataEncryption {
  /**
   * Encrypt user password
   */
  static encryptPassword(password) {
    // Client-side hashing (simple)
    return btoa(password); // Base64
    
    // Production: use proper encryption library
  }

  /**
   * Secure backup
   */
  static createSecureBackup(userData) {
    // Don't store passwords in backups
    const safe = { ...userData };
    delete safe.password;
    return safe;
  }
}
```

---

## 📊 Analytics & Tracking

### Events to Track

```javascript
const Analytics = {
  // User events
  userRegistered: () => {},
  userLoggedIn: () => {},
  userLoggedOut: () => {},
  profileUpdated: () => {},

  // Game events
  gameLibraryAdded: (gameId) => {},
  gameLaunched: (gameId) => {},
  gameCompleted: (gameId) => {},
  gameFavorited: (gameId) => {},

  // Launcher events
  launcherOpened: () => {},
  launcherClosed: () => {},
  updateInstalled: (version) => {},
  settingsChanged: () => {}
};
```

---

## 🚀 Deployment Checklist

### Pre-Launch
- [ ] Test on Windows 10/11
- [ ] Test on macOS
- [ ] Test on Linux
- [ ] Verify launcher integration
- [ ] Security audit
- [ ] Performance testing
- [ ] Backup system working
- [ ] Update system functional

### Launch
- [ ] Version 2.0 released
- [ ] Download packages available
- [ ] Launcher config validated
- [ ] Documentation published
- [ ] Support team ready
- [ ] Analytics enabled
- [ ] Update server running

### Post-Launch
- [ ] Monitor user feedback
- [ ] Fix reported issues
- [ ] Optimize performance
- [ ] Plan future versions
- [ ] Community engagement
- [ ] Regular backups
- [ ] Security updates

---

## 📞 Integration Support

### For Launcher Developers

**Contact:** integration@ks-gaming.com
**Documentation:** https://ks-gaming.com/launcher-api
**Issues:** https://github.com/ks-gaming/steam/issues

### Required Information

When requesting integration:
1. Launcher name & version
2. Integration type (embedded/native)
3. Expected user count
4. Custom requirements
5. Timeline

### SLA (Service Level Agreement)

- Response time: 24 hours
- Issue resolution: 72 hours
- Integration testing: 1 week
- Production deployment: 2 weeks

---

## 📝 Changelog

### Version 2.0 (May 2026)
- ✅ Initial launcher integration
- ✅ Download system
- ✅ Data export/import
- ✅ Launcher config support

### Version 2.1 (Planned)
- ⏳ Auto-updates
- ⏳ Cloud sync
- ⏳ Achievement system
- ⏳ Multiplayer features

---

## 🎯 Future Roadmap

### Q3 2026
- Epic Games Launcher integration
- Steam launcher integration
- Discord integration

### Q4 2026
- Cloud save sync
- Achievement system
- Multiplayer infrastructure

### 2027
- Mobile app (iOS/Android)
- Cross-platform features
- Advanced analytics

---

**Last Updated:** May 24, 2026
**Status:** ✅ Ready for Integration
**Version:** 2.0

---

🔌 **Ready to integrate KS Steam with your launcher!**

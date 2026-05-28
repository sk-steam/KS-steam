# KS Steam - Refactor Guide 🚀

## Overview
Complete refactor of KS Steam with modern neon design, comprehensive animations, clean modular code structure, and full English/Ukrainian support.

---

## 🎨 Design System

### Color Palette
```
Primary Neons:
- Cyan: #00d9ff (main accent)
- Pink: #ff006e (highlights)
- Purple: #b537f2 (accents)
- Lime: #39ff14 (success)
- Orange: #ff6600 (warnings)
- Blue: #0080ff (secondary)

Backgrounds:
- Dark BG: #0a0e27
- Darker: #050812
- Surface: #1a1f3a
- Surface Light: #383f57
```

### CSS Files Structure
```
css/
├── neon-theme.css      # Core theme, colors, typography
├── animations.css      # All animations and transitions
├── components.css      # Reusable UI components
├── steam_clone.css     # Legacy (being phased out)
└── library.css         # Legacy (being phased out)
```

---

## 📁 New Project Structure

### JavaScript Organization
```
js/
├── core/
│   └── app.js              # Main app controller, state management
├── modules/
│   ├── auth.js             # Authentication (login, register)
│   ├── games.js            # Game data and rendering
│   ├── user.js             # User profile management
│   ├── ui.js               # UI utilities and helpers
│   ├── profile.js          # Profile display
│   └── library.js          # Game library management
├── i18n/
│   └── i18n.js             # Internationalization (EN/UK)
└── utils/                  # Additional utilities (empty, ready to expand)
```

---

## 🚀 Getting Started

### 1. Using the New Version
Replace the old `index.html` with the new `index-new.html`:
```bash
mv index-new.html index.html
```

### 2. Testing the Application
1. Open in browser
2. Click "Register" to create account
3. Login with created account
4. Navigate through sections

### 3. Switching Languages
Click language selector in Settings (bottom right)
- English (default)
- Українська (Ukrainian)

---

## 📚 Module Documentation

### App.js - Core Application
Main controller handling navigation, user state, and settings.

**Key Methods:**
```javascript
app.init()                          // Initialize app
app.navigateToSection(sectionId)   // Navigate to page section
app.openModal(modalId)              // Show modal
app.closeModal(modalId)             // Hide modal
app.logout()                        // Logout user
app.isLoggedIn()                    // Check login status
app.getUser()                       // Get current user
```

**Global Functions:**
```javascript
navigateTo(sectionId)               // Navigate to section
openModal(modalId)                  // Open modal
closeModal(modalId)                 // Close modal
logout()                            // Logout
```

### Auth.js - Authentication
Handles user registration and login with validation.

**Key Methods:**
```javascript
authService.login(username, password)           // Login user
authService.register(userData)                  // Register new user
authService.validate(data, type)                // Validate form data
authService.hashPassword(password)              // Hash password

// HTML Functions:
handleLogin()                       // Submit login form
handleRegister()                    // Submit register form
showNotification(message, type)     // Show notification toast
```

### Games.js - Game Management
Load, search, filter, and display games.

**Key Methods:**
```javascript
gamesService.loadGames()            // Load games from data/games.json
gamesService.getAllGames()          // Get all games
gamesService.getGameById(id)        // Get single game
gamesService.searchGames(query)     // Search games
gamesService.filterByTag(tag)       // Filter by tag
gamesService.sortGames(games, type) // Sort games
gamesService.renderGameCard(game)   // Render game HTML

// HTML Functions:
renderFeaturedGames()               // Render featured games
showGameDetails(gameId)             // Show game details
```

### User.js - User Profile
Manage user data, games, and statistics.

**Key Methods:**
```javascript
userService.getUserProfile(userId)  // Get user data
userService.updateProfile(userId, updates)  // Update user
userService.addGameToLibrary(userId, gameId)  // Add game
userService.addFriend(userId, friendId)  // Add friend
userService.getUserStats(userId)    // Get user statistics
userService.formatPlaytime(hours)   // Format playtime
```

### UI.js - UI Utilities
Helper methods for common UI operations.

**Key Methods:**
```javascript
UIService.showToast(message, type, duration)  // Show toast notification
UIService.showLoading(message)      // Show loading spinner
UIService.hideLoading()             // Hide loading spinner
UIService.updateAvatar(username)    // Update avatar display
UIService.updateUserName(username)  // Update name display
UIService.disableButton(btn, msg)   // Disable button
UIService.enableButton(btn, text)   // Enable button
UIService.shakeElement(element)     // Shake element
UIService.animateEntrance(el, anim) // Animate element
UIService.updateProgress(id, %, color)  // Update progress bar
```

### Profile.js - User Profile Display
Display and edit user profile information.

**Key Methods:**
```javascript
ProfileService.displayProfile(user)      // Show profile
ProfileService.editProfile(id, updates)  // Edit profile
ProfileService.changePassword(id, old, new)  // Change password
ProfileService.getProfileData(id)        // Get profile data
```

### Library.js - Game Library
Manage user game library and favorites.

**Key Methods:**
```javascript
LibraryService.getUserLibrary(userId)    // Get user games
LibraryService.addGameToLibrary(userId, gameId)  // Add to library
LibraryService.removeGameFromLibrary(userId, gameId)  // Remove
LibraryService.displayLibrary(userId)    // Display library
LibraryService.toggleFavorite(userId, gameId)  // Toggle favorite
LibraryService.getFavoriteGames(userId)  // Get favorites
LibraryService.markAsInstalled(userId, gameId)  // Mark installed
LibraryService.uninstallGame(userId, gameId)  // Mark uninstalled
```

### i18n.js - Internationalization
Handle language switching and translations.

**Key Methods:**
```javascript
i18n.init(language)                 // Initialize i18n
i18n.changeTo(language)             // Change language
i18n.t(key, defaultValue)           // Get translation
i18n.updatePageLanguage()           // Update page text
i18n.formatDate(date, style)        // Format date
i18n.formatNumber(number, options)  // Format number
i18n.formatCurrency(amount, currency)  // Format currency
```

---

## 🎬 Animation Classes

### Fade Animations
```html
<div class="animate-fadeIn">...</div>
<div class="animate-fadeInUp">...</div>
<div class="animate-fadeInDown">...</div>
<div class="animate-fadeInLeft">...</div>
<div class="animate-fadeInRight">...</div>
```

### Slide Animations
```html
<div class="animate-slideInUp">...</div>
<div class="animate-slideInDown">...</div>
<div class="animate-slideInLeft">...</div>
<div class="animate-slideInRight">...</div>
```

### Other Animations
```html
<div class="animate-pulse">...</div>          <!-- Pulse effect -->
<div class="animate-glow">...</div>           <!-- Cyan glow -->
<div class="animate-bounce">...</div>         <!-- Bounce -->
<div class="animate-float">...</div>          <!-- Float up/down -->
<div class="animate-rotate">...</div>         <!-- 360° rotation -->
<div class="animate-scaleIn">...</div>        <!-- Scale in from small -->
<div class="animate-shimmer">...</div>        <!-- Shimmer effect -->
<div class="animate-flicker">...</div>        <!-- Flicker effect -->
```

### Hover Effects
```html
<div class="hover-scale">...</div>            <!-- Scale on hover -->
<div class="hover-scale-lg">...</div>         <!-- Large scale -->
<div class="hover-lift">...</div>             <!-- Lift on hover -->
<div class="hover-glow-cyan">...</div>        <!-- Cyan glow hover -->
<div class="hover-glow-pink">...</div>        <!-- Pink glow hover -->
<div class="hover-rotate">...</div>           <!-- Rotate on hover -->
```

### Stagger Animations
```html
<div class="stagger-children">
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
</div>
```

---

## 🌐 Internationalization

### Adding Translations
Edit `js/i18n/i18n.js`:

```javascript
const EN_TRANSLATIONS = {
    'nav.store': 'Store',
    'nav.library': 'Library',
    // ... more translations
};

const UK_TRANSLATIONS = {
    'nav.store': 'Магазин',
    'nav.library': 'Бібліотека',
    // ... more translations
};
```

### Using Translations in HTML
```html
<button data-i18n="auth.login">Login</button>
<input placeholder="Enter email" data-i18n-placeholder="auth.email">
<img title="User Profile" data-i18n-title="profile.title">
```

### Using Translations in JavaScript
```javascript
const text = i18n.t('nav.store');           // Get translation
const date = i18n.formatDate(new Date());   // Format date
const price = i18n.formatCurrency(9.99);    // Format currency
```

---

## 💾 Local Storage

Application uses localStorage for data:
```javascript
// User data
localStorage.getItem('kssteam_user')        // Current logged-in user
localStorage.getItem('kssteam_users')       // All registered users
localStorage.getItem('kssteam_settings')    // User settings
```

**User Object Structure:**
```javascript
{
    id: 1234567890,
    username: "username",
    email: "user@example.com",
    password: "hashed_password",
    level: 1,
    playtime: 0,
    friends: [userId1, userId2],
    games: [gameId1, gameId2],
    favorites: [gameId1],
    installed: [gameId1],
    createdAt: "2024-01-15T10:30:00Z"
}
```

---

## 🔧 Customization Guide

### Changing Colors
Edit CSS variables in `css/neon-theme.css`:
```css
:root {
    --neon-cyan: #00d9ff;      /* Change cyan */
    --neon-pink: #ff006e;      /* Change pink */
    --neon-bg-dark: #0a0e27;   /* Change background */
}
```

### Adding New Animations
Edit `css/animations.css`:
```css
@keyframes customAnimation {
    from { /* start */ }
    to { /* end */ }
}

.animate-customAnimation {
    animation: customAnimation 0.6s ease-out;
}
```

### Adding New Features
Create new module in `js/modules/`:
```javascript
class MyService {
    static myMethod() {
        // Implementation
    }
}
```

Then import in `index-new.html`:
```html
<script src="js/modules/mymodule.js" defer></script>
```

---

## 🧪 Testing

### Test Account
```
Username: testuser
Email: test@example.com
Password: testpass123
```

Or register a new account directly in the app.

### Test Features
1. ✅ Register new account
2. ✅ Login/Logout
3. ✅ Navigate sections
4. ✅ Switch languages
5. ✅ View profile
6. ✅ Browse games
7. ✅ Check notifications
8. ✅ Mobile responsiveness

---

## 📱 Responsive Design

All components are mobile-responsive:
- Desktop: Full layout with sidebar
- Tablet: Adjusted grid
- Mobile: Single column, hidden sidebar

---

## 🐛 Troubleshooting

### Games Not Loading
1. Check if `data/games.json` exists
2. Check browser console for errors
3. App uses demo games if file missing

### Translations Not Working
1. Verify language JSON loads correctly
2. Check console for load errors
3. Use `i18n.t('key')` to debug

### Modals Not Showing
1. Ensure modal ID matches function call
2. Check CSS z-index
3. Verify `modal-overlay` has `active` class

---

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Review memory file for architecture notes
3. Inspect Network tab for load errors
4. Check localStorage for data issues

---

## 🎯 Future Improvements

Phase 2 (Optimization & Cleanup):
- [ ] Remove unused old CSS files
- [ ] Consolidate duplicate utilities
- [ ] Add data/games.json with real games
- [ ] Implement backend API integration
- [ ] Add Windows launcher integration
- [ ] Implement achievement system
- [ ] Add social features
- [ ] Performance optimization

---

**Last Updated:** 2024-01-15
**Version:** 2.0 (Neon Refactor)

# KS Steam - Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER INTERFACE LAYER                       │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              index-new.html (English)                    │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌──────────────────┐  │  │
│  │  │   Header    │ │  Sidebar    │ │  Main Content    │  │  │
│  │  │   + Nav     │ │  + Sections │ │  + Pages + Modals│  │  │
│  │  └─────────────┘ └─────────────┘ └──────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
          │                    │                     │
          ▼                    ▼                     ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   CSS LAYER      │  │ ANIMATION LAYER  │  │ COMPONENT LAYER  │
│                  │  │                  │  │                  │
│ • neon-theme.css │  │animations.css    │  │components.css    │
│   - Colors       │  │- 20+ animations  │  │- Headers         │
│   - Typography   │  │- Transitions     │  │- Cards           │
│   - Styles       │  │- Effects         │  │- Forms           │
│                  │  │- Loaders         │  │- Modals          │
└──────────────────┘  └──────────────────┘  └──────────────────┘
          │
          └─────────────────┬──────────────────────┘
                            │
         ┌──────────────────▼───────────────────────┐
         │     APPLICATION LOGIC LAYER              │
         │                                          │
         │  ┌────────────────────────────────────┐ │
         │  │     js/core/app.js                │ │
         │  │  • State Management               │ │
         │  │  • Navigation Control             │ │
         │  │  • User Session                   │ │
         │  │  • Settings Management            │ │
         │  └────────────────────────────────────┘ │
         │                                          │
         │  ┌────────────────────────────────────┐ │
         │  │   js/modules/ (Feature Modules)   │ │
         │  │                                   │ │
         │  │  ┌──────────────────────────────┐ │ │
         │  │  │  auth.js                     │ │ │
         │  │  │  - Login/Register            │ │ │
         │  │  │  - Validation                │ │ │
         │  │  │  - User Management           │ │ │
         │  │  └──────────────────────────────┘ │ │
         │  │                                   │ │
         │  │  ┌──────────────────────────────┐ │ │
         │  │  │  games.js                    │ │ │
         │  │  │  - Load Games                │ │ │
         │  │  │  - Search/Filter             │ │ │
         │  │  │  - Render Cards              │ │ │
         │  │  └──────────────────────────────┘ │ │
         │  │                                   │ │
         │  │  ┌──────────────────────────────┐ │ │
         │  │  │  user.js                     │ │ │
         │  │  │  - Profile Management        │ │ │
         │  │  │  - Friend System             │ │ │
         │  │  │  - Statistics                │ │ │
         │  │  └──────────────────────────────┘ │ │
         │  │                                   │ │
         │  │  ┌──────────────────────────────┐ │ │
         │  │  │  library.js                  │ │ │
         │  │  │  - Game Library              │ │ │
         │  │  │  - Favorites                 │ │ │
         │  │  │  - Installation Tracking     │ │ │
         │  │  └──────────────────────────────┘ │ │
         │  │                                   │ │
         │  │  ┌──────────────────────────────┐ │ │
         │  │  │  profile.js                  │ │ │
         │  │  │  - Display Profile           │ │ │
         │  │  │  - Edit Profile              │ │ │
         │  │  │  - Change Password           │ │ │
         │  │  └──────────────────────────────┘ │ │
         │  │                                   │ │
         │  │  ┌──────────────────────────────┐ │ │
         │  │  │  ui.js                       │ │ │
         │  │  │  - Toast Notifications       │ │ │
         │  │  │  - Loading States            │ │ │
         │  │  │  - UI Helpers                │ │ │
         │  │  └──────────────────────────────┘ │ │
         │  └──────────────────────────────────┘ │
         │                                          │
         └──────────────────────────────────────────┘
                            │
         ┌──────────────────▼───────────────────────┐
         │  INTERNATIONALIZATION LAYER              │
         │                                          │
         │  ┌────────────────────────────────────┐ │
         │  │     js/i18n/i18n.js               │ │
         │  │  • Translation Engine             │ │
         │  │  • Language Switching             │ │
         │  │  • Date/Number Formatting         │ │
         │  │  • 300+ Translation Strings       │ │
         │  │                                   │ │
         │  │  Languages Supported:             │ │
         │  │  • English (default)              │ │
         │  │  • Українська (Ukrainian)         │ │
         │  └────────────────────────────────────┘ │
         │                                          │
         └──────────────────────────────────────────┘
                            │
         ┌──────────────────▼───────────────────────┐
         │  DATA PERSISTENCE LAYER                  │
         │                                          │
         │  ┌────────────────────────────────────┐ │
         │  │    Browser localStorage            │ │
         │  │                                   │ │
         │  │  • kssteam_user                   │ │
         │  │    └─ Current logged-in user      │ │
         │  │                                   │ │
         │  │  • kssteam_users                  │ │
         │  │    └─ All registered users        │ │
         │  │       ├─ username                 │ │
         │  │       ├─ password (hashed)        │ │
         │  │       ├─ games[]                  │ │
         │  │       ├─ favorites[]              │ │
         │  │       ├─ friends[]                │ │
         │  │       └─ stats                    │ │
         │  │                                   │ │
         │  │  • kssteam_settings               │ │
         │  │    ├─ language                    │ │
         │  │    ├─ theme                       │ │
         │  │    └─ notifications               │ │
         │  │                                   │ │
         │  │  • data/games.json                │ │
         │  │    └─ Game catalog (external)     │ │
         │  └────────────────────────────────────┘ │
         │                                          │
         └──────────────────────────────────────────┘
```

## Data Flow Diagram

```
USER ACTION
    │
    ▼
┌─────────────────────────┐
│  Event Listener in HTML │
│  (onclick, onchange)    │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Call Module Method         │
│  e.g., handleLogin()        │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Validate Input             │
│  Check for errors           │
└──────────┬──────────────────┘
           │
           ├─ Error ────┐
           │            │
           │            ▼
           │    ┌──────────────────┐
           │    │ Show Notification│
           │    │ (Error Message)  │
           │    └──────────────────┘
           │
           │ Valid
           ▼
┌─────────────────────────────┐
│  Process Data               │
│  Update State               │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Save to localStorage       │
│  (Persist Data)             │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Update UI                  │
│  Render Changes             │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Apply Animations           │
│  Smooth Transitions         │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ Show Success Notification   │
│ (Optional Toast)            │
└──────────┬──────────────────┘
           │
           ▼
        DONE
```

## Component Interaction Map

```
┌─────────────────────────────────────────────────────┐
│                    APP (State)                      │
│  • currentUser                                      │
│  • settings                                         │
│  • games[]                                          │
└─────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
  ┌────────────┐      ┌────────────┐      ┌────────────┐
  │ AuthService│      │GamesService│      │UserService │
  │            │      │            │      │            │
  │ • login()  │      │• loadGames │      │• getProfile│
  │ • register │      │• search()  │      │• updatePro │
  │ • validate │      │• filter()  │      │• addFriend │
  └────────────┘      └────────────┘      └────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
  ┌────────────┐      ┌────────────┐      ┌────────────┐
  │ UIService  │      │LibraryServ │      │ProfileServ │
  │            │      │            │      │            │
  │ • showToast│      │ • display()│      │• display() │
  │ • showLoad │      │ • add()    │      │• edit()    │
  │ • updateUI │      │ • remove() │      │• stats()   │
  └────────────┘      └────────────┘      └────────────┘
         │                    │                    │
         └─────────┬──────────┴─────────┬──────────┘
                   │                    │
                   ▼                    ▼
         ┌──────────────────────────────────┐
         │    i18n (Translation Engine)    │
         │                                  │
         │ • t(key) → string               │
         │ • changeTo(lang)                │
         │ • formatDate/Currency           │
         └──────────────────────────────────┘
                   │
                   ▼
         ┌──────────────────────────────────┐
         │    localStorage (Persistence)    │
         │                                  │
         │ • kssteam_user                  │
         │ • kssteam_users                 │
         │ • kssteam_settings              │
         └──────────────────────────────────┘
```

## Development Workflow

```
┌────────────────────────────────────────────┐
│  1. User Opens Application                 │
│     ├─ HTML loads                          │
│     ├─ CSS stylesheets applied             │
│     └─ JavaScript modules initialized      │
└─────────────┬────────────────────────────┘
              │
┌─────────────▼────────────────────────────┐
│  2. App Core Initializes (app.js)        │
│     ├─ Load user from localStorage       │
│     ├─ Initialize i18n                   │
│     ├─ Setup event listeners             │
│     ├─ Load games data                   │
│     └─ Update UI                         │
└─────────────┬────────────────────────────┘
              │
┌─────────────▼────────────────────────────┐
│  3. Render Initial UI                    │
│     ├─ Apply CSS theme                   │
│     ├─ Show header & navigation           │
│     ├─ Display store page                │
│     └─ Load featured games               │
└─────────────┬────────────────────────────┘
              │
┌─────────────▼────────────────────────────┐
│  4. User Interaction                     │
│     ├─ Click buttons                     │
│     ├─ Fill forms                        │
│     ├─ Navigate sections                 │
│     └─ Switch languages                  │
└─────────────┬────────────────────────────┘
              │
┌─────────────▼────────────────────────────┐
│  5. Process & Update                     │
│     ├─ Call appropriate service          │
│     ├─ Validate data                     │
│     ├─ Save to localStorage              │
│     └─ Update UI with new state          │
└─────────────┬────────────────────────────┘
              │
┌─────────────▼────────────────────────────┐
│  6. Animate & Notify                     │
│     ├─ Apply CSS animations              │
│     ├─ Show toast notifications          │
│     └─ Update visual feedback            │
└────────────────────────────────────────────┘
```

## Technology Stack

```
Frontend:
├─ HTML5
├─ CSS3 (with animations, gradients, filters)
├─ JavaScript (Vanilla ES6+)
└─ No external frameworks

Storage:
├─ localStorage (browser-based)
└─ JSON (data format)

Development:
├─ Node.js / npm (optional)
├─ Git (version control)
└─ VS Code (IDE)

Browser Support:
├─ Chrome 90+
├─ Firefox 88+
├─ Safari 14+
├─ Edge 90+
└─ Mobile browsers (iOS, Android)
```

## Key Design Principles

1. **Modularity** - Each feature in its own module
2. **Separation of Concerns** - Logic, UI, and data separated
3. **DRY** - Don't Repeat Yourself (reusable components)
4. **Progressive Enhancement** - Core features work without JS
5. **Accessibility** - WCAG compliance (future improvement)
6. **Performance** - Lightweight, fast loading
7. **Security** - Validation, hashing (client-side for now)
8. **Scalability** - Easy to add new features

---

**Last Updated:** January 15, 2024
**Status:** ✅ Architecture Complete

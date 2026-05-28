/**
 * KS STEAM v2.0 - DEVELOPER API REFERENCE
 * Complete guide for launcher integration and extension
 */

// ============================================
// APPLICATION CORE API
// ============================================

/**
 * Global App Instance
 * Main application controller with all system features
 */
window.app

// Properties:
app.isLauncher              // Boolean: true if running in launcher
app.launcherInfo            // Object: {isLauncher, version, platform}
app.user                    // Object: Current logged-in user or null
app.settings                // Object: User settings {language, theme, notifications}
app.games                   // Array: Loaded games/modifications
app.isInitialized           // Boolean: App ready flag

// Methods:
app.init()                  // Initialize app (called automatically)
app.detectLauncher()        // Re-detect launcher mode
app.changeLanguage(lang)    // Change language ('en' or 'uk')
app.navigateToSection(id)   // Navigate to section (store/library/etc)
app.isLoggedIn()            // Check if user logged in
app.logout()                // Logout user

// Example:
console.log(`Is Launcher: ${app.isLauncher}`);
await app.changeLanguage('uk');

// ============================================
// INTERNATIONALIZATION API
// ============================================

/**
 * Global i18n Instance
 * Handles all translations and language switching
 */
window.i18n

// Properties:
i18n.currentLang            // String: Current language ('en' or 'uk')
i18n.translations           // Object: {en: {...}, uk: {...}}
i18n.supportedLanguages     // Array: ['en', 'uk']

// Methods:
i18n.init(language)         // Initialize i18n with language
i18n.changeTo(lang)         // Change language (triggers page update)
i18n.t(key, defaultValue)   // Get translation by key
i18n.detectLanguage()       // Detect browser/saved language
i18n.formatDate(date)       // Format date for current language
i18n.formatNumber(number)   // Format number for current language
i18n.formatCurrency(amount) // Format currency

// Translation Keys Available:
// All keys use dot notation: 'nav.store', 'settings.language', etc.
// See EN_TRANSLATIONS and UK_TRANSLATIONS objects for full list

// Examples:
console.log(i18n.t('settings.title'));        // "Settings" or "Налаштування"
i18n.changeTo('uk');
console.log(i18n.t('mods.title'));            // "Модифікації для KS Steam"

// ============================================
// GAMES SERVICE API
// ============================================

/**
 * Global Games Service
 * Manages games, modifications, and game data
 */
window.gamesService

// Properties:
gamesService.games          // Array: All games and modifications
gamesService.filteredGames  // Array: Currently filtered games

// Methods - Basic:
gamesService.getAllGames()              // Get all games
gamesService.getGameById(id)            // Get game by ID
gamesService.searchGames(query)         // Search by title/desc
gamesService.sortGames(array, sortBy)   // Sort by price/rating/date

// Methods - Modifications:
gamesService.getGamesByType(type)       // Filter by type (game/mod)
gamesService.getModifications()         // Get all modifications
gamesService.getLauncherMods()          // Get launcher-specific mods
gamesService.getFeaturedGames(limit)    // Get featured games
gamesService.getBestSellers(limit)      // Get top-rated games

// Methods - UI:
gamesService.renderGameCard(game)       // Generate card HTML
gamesService.renderStars(rating)        // Generate star rating HTML

// Example - Get Launcher Mods:
const launcherMods = gamesService.getLauncherMods();
console.log(`${launcherMods.length} launcher modifications available`);

// Example - Get Specific Mod:
const mod = gamesService.getGameById('KS Steam Enhancements');
console.log(`${mod.title} v${mod.version}`);

// ============================================
// DOWNLOAD & MODIFICATIONS API
// ============================================

/**
 * Download Service
 * Handles downloads and data management
 */
window.downloadService

// Methods:
downloadService.downloadPackage(type)   // Download package (full/minimal/launcher/portable)
downloadService.getPackageInfo()        // Get package descriptions
downloadService.getDownloadHistory()    // Get download history
downloadService.preparePackageFiles()   // Prepare files for download
downloadService.exportUserData()        // Export user data to JSON
downloadService.importUserData(file)    // Import user data from JSON

// Example:
await downloadService.exportUserData();

/**
 * Download UI Manager
 * Displays download options and modifications
 */
window.downloadUIManager

// Methods:
downloadUIManager.init()                // Initialize UI
downloadUIManager.renderPackageOptions()// Show download packages
downloadUIManager.renderDownloadHistory()// Show history
downloadUIManager.renderModifications() // Show modifications

/**
 * Global Functions for Modifications
 */

// Install a modification
installModification(modId)
// Stores in localStorage: kssteam_installed_mods
// Format: [{id, title, version, installedDate, enabled}, ...]

// Clear cache
clearCache()

// Delete all data
deleteAllData()

// Example - Install a modification:
installModification('Dark Theme Pro');

// Example - Check installed mods:
const installed = JSON.parse(localStorage.getItem('kssteam_installed_mods') || '[]');
console.log(`Installed: ${installed.length} modifications`);

// ============================================
// UI SERVICE API
// ============================================

/**
 * UI Service
 * Handles user interface updates and interactions
 */
window.UIService

// Methods:
UIService.showToast(message, type)      // Show notification (success/error/info)
UIService.showModal(title, content)     // Show modal dialog
UIService.hideModal()                   // Hide current modal
UIService.showLoader()                  // Show loading spinner
UIService.hideLoader()                  // Hide loading spinner

// Types: 'success', 'error', 'info', 'warning'

// Example:
UIService.showToast('Settings saved!', 'success');

// ============================================
// MODAL MANAGEMENT
// ============================================

// Global Functions
openModal(modalId)          // Open modal by ID
closeModal(modalId)         // Close modal by ID
navigateTo(sectionId)       // Navigate to section
logout()                    // Logout and return to store

// Modal IDs:
// 'loginModal'
// 'registerModal'
// Any custom modal with id="modalId"

// Example:
openModal('loginModal');
closeModal('loginModal');
navigateTo('library');

// ============================================
// LAUNCHER INTEGRATION PATTERN
// ============================================

/**
 * Example: Setting up launcher integration
 */

// 1. Set launcher cookie before loading KS Steam
document.cookie = "launcher=true; path=/";

// 2. Load KS Steam HTML/JS
// <script src="index-new.html"></script>

// 3. Access launcher info
if (app.isLauncher) {
    console.log('✅ Running in launcher context');
    console.log(`Version: ${app.launcherInfo.version}`);
    console.log(`Platform: ${app.launcherInfo.platform}`);
}

// 4. Get available modifications for launcher
const mods = gamesService.getLauncherMods();
console.log(`${mods.length} launcher mods available`);

// 5. User can install modifications
mods.forEach(mod => {
    console.log(`- ${mod.title} (${mod.version})`);
});

// 6. Track installed modifications
const installed = JSON.parse(
    localStorage.getItem('kssteam_installed_mods') || '[]'
);

// ============================================
// LOCALIZATION PATTERN
// ============================================

/**
 * Example: Working with translations
 */

// 1. Detect and set language
if (navigator.language.startsWith('uk')) {
    await i18n.changeTo('uk');
}

// 2. Add data-i18n attribute to HTML elements
// <label data-i18n="settings.language">Language</label>

// 3. Get translation in JavaScript
const title = i18n.t('settings.title', 'Settings');

// 4. Format date for current language
const dateStr = i18n.formatDate(new Date());

// 5. Format number for current language
const numberStr = i18n.formatNumber(1000);

// 6. Format currency for current language
const priceStr = i18n.formatCurrency(9.99, 'USD');

// ============================================
// STORAGE API
// ============================================

/**
 * Data stored in localStorage (persistent)
 */

// User data
localStorage.kssteam_user               // {username, email, level, ...}
localStorage.kssteam_users              // All registered users

// Settings
localStorage.kssteam_settings           // {language, theme, notifications}

// Downloads
localStorage.kssteam_download_history   // Array of downloads

// Modifications
localStorage.kssteam_installed_mods     // Array of installed mods

// Language preference
localStorage.kssteam_language           // 'en' or 'uk'

// Example - Check stored data:
console.log(JSON.parse(localStorage.kssteam_settings));
console.log(JSON.parse(localStorage.kssteam_installed_mods || '[]'));

// ============================================
// CONSOLE TEST SUITE
// ============================================

/**
 * Available test commands in browser console
 * (loaded from js/test-utilities.js)
 */

testHelp()                  // Show all available test commands

// Launcher tests
enableLauncherMode()        // Set launcher cookie
disableLauncherMode()       // Clear launcher cookie
checkLauncherStatus()       // Check launcher status

// Modification tests
listModifications()         // List all available mods
listInstalledMods()         // List installed mods
testInstallMod(modId)       // Test installing a mod
clearInstalledMods()        // Clear all installed mods

// Language tests
testLanguages()             // Test language switching
listTranslations(lang)      // List all translations

// Data tests
testExportData()            // Test export functionality
showStorageData()           // Show all localStorage data
clearAllAppData()           // Clear all app data

// Comprehensive test
runAllTests()               // Run complete test suite

// ============================================
// COMMON PATTERNS
// ============================================

/**
 * Pattern 1: Check if launcher
 */
if (app.isLauncher) {
    // Launcher-specific code
    const mods = gamesService.getLauncherMods();
} else {
    // Browser-only code
}

/**
 * Pattern 2: Translate and update UI
 */
const elements = document.querySelectorAll('[data-i18n]');
elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = i18n.t(key);
});

/**
 * Pattern 3: Handle modifications
 */
async function handleModInstall(modId) {
    const mod = gamesService.getGameById(modId);
    if (!mod) return;
    
    installModification(modId);
    
    // Verify installation
    const installed = JSON.parse(
        localStorage.getItem('kssteam_installed_mods') || '[]'
    );
    console.log(`Installed: ${installed.length} mods`);
}

/**
 * Pattern 4: Listen for language changes
 */
const languageSelect = document.getElementById('languageSelect');
languageSelect.addEventListener('change', (e) => {
    app.changeLanguage(e.target.value);
});

// ============================================
// DEBUGGING TIPS
// ============================================

// 1. Check if everything loaded
console.log({
    app: typeof app !== 'undefined',
    i18n: typeof i18n !== 'undefined',
    gamesService: typeof gamesService !== 'undefined',
    downloadService: typeof downloadService !== 'undefined'
});

// 2. Check launcher detection
app.detectLauncher();
console.log(app.isLauncher);

// 3. Check translations
console.log(`Languages: ${Object.keys(i18n.translations).join(', ')}`);
console.log(`Current: ${i18n.currentLang}`);

// 4. Check modifications
console.log(gamesService.getModifications());

// 5. Check stored data
for (let key in localStorage) {
    if (key.startsWith('kssteam_')) {
        console.log(`${key}: ${localStorage[key].substring(0, 50)}...`);
    }
}

// ============================================
// COMMON ERRORS & SOLUTIONS
// ============================================

// Error: app is undefined
// Solution: Wait for page to load
window.addEventListener('load', () => {
    console.log(app);  // Now defined
});

// Error: Translations not loading
// Solution: Check i18n initialized
if (i18n.currentLang) {
    console.log('i18n ready');
} else {
    console.log('i18n not initialized');
}

// Error: Modifications not showing
// Solution: Check games loaded
console.log(`Games loaded: ${gamesService.games.length}`);
console.log(`Mods available: ${gamesService.getModifications().length}`);

// ============================================
// VERSION INFORMATION
// ============================================

/*
 * KS Steam v2.0 - Neon Refactor + Launcher Integration
 * 
 * Key Features:
 * ✓ Full Ukrainian localization support
 * ✓ Launcher mode detection via cookie
 * ✓ Modification system with 3 available mods
 * ✓ Persistent localStorage data
 * ✓ Complete test suite
 * 
 * Last Updated: 2026-05-24
 * API Stability: Stable (v1.0)
 */

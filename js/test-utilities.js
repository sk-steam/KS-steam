/**
 * KS Steam Launcher Test Utilities
 * Run these commands in browser console to test launcher features
 */

// ============================================
// LAUNCHER MODE TESTING
// ============================================

/**
 * Enable launcher mode for testing
 */
function enableLauncherMode() {
    // Set launcher cookie
    document.cookie = "launcher=true; path=/";
    console.log('✅ Launcher cookie set. Reload page to see launcher mode indicator.');
    console.log('🔄 Reloading...');
    setTimeout(() => location.reload(), 1000);
}

/**
 * Disable launcher mode for testing
 */
function disableLauncherMode() {
    // Clear launcher cookie
    document.cookie = "launcher=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    console.log('❌ Launcher cookie removed. Reload page to disable launcher mode.');
    console.log('🔄 Reloading...');
    setTimeout(() => location.reload(), 1000);
}

/**
 * Check launcher status
 */
function checkLauncherStatus() {
    console.log('=== KS STEAM LAUNCHER STATUS ===');
    console.log(`Is Launcher: ${app.isLauncher}`);
    console.log(`Launcher Info:`, app.launcherInfo);
    
    // Check cookie
    const cookies = document.cookie.split(';');
    const launcherCookie = cookies.find(c => c.trim().startsWith('launcher='));
    console.log(`Cookie: ${launcherCookie || 'Not set'}`);
    
    // Check URL param
    const urlParams = new URLSearchParams(window.location.search);
    console.log(`URL Param: launcher=${urlParams.get('launcher') || 'Not set'}`);
}

// ============================================
// INTERNATIONALIZATION TESTING
// ============================================

/**
 * Test language switching
 */
async function testLanguages() {
    console.log('=== LANGUAGE SWITCHING TEST ===');
    
    // Switch to Ukrainian
    console.log('📝 Switching to Ukrainian...');
    await i18n.changeTo('uk');
    console.log('✅ Ukrainian selected');
    console.log(`Current language: ${i18n.currentLang}`);
    
    // Test some translations
    console.log(`settings.title: ${i18n.t('settings.title')}`);
    console.log(`mods.title: ${i18n.t('mods.title')}`);
    console.log(`launcher.mode: ${i18n.t('launcher.mode')}`);
    
    // Switch back to English
    console.log('📝 Switching to English...');
    await i18n.changeTo('en');
    console.log('✅ English selected');
    console.log(`Current language: ${i18n.currentLang}`);
}

/**
 * List all translations
 */
function listTranslations(lang = 'en') {
    console.log(`=== ${lang.toUpperCase()} TRANSLATIONS ===`);
    const translations = i18n.translations[lang];
    const keys = Object.keys(translations).sort();
    
    keys.forEach(key => {
        console.log(`  ${key}: "${translations[key]}"`);
    });
    
    console.log(`Total: ${keys.length} translations`);
}

// ============================================
// MODIFICATIONS TESTING
// ============================================

/**
 * List all available modifications
 */
function listModifications() {
    console.log('=== AVAILABLE MODIFICATIONS ===');
    const mods = gamesService.getModifications();
    
    mods.forEach((mod, idx) => {
        console.log(`\n${idx + 1}. ${mod.title}`);
        console.log(`   ID: ${mod.id}`);
        console.log(`   Version: ${mod.version}`);
        console.log(`   Type: ${mod.type}`);
        console.log(`   For Launcher: ${mod.forLauncher}`);
        console.log(`   Description: ${mod.description}`);
    });
    
    console.log(`\nTotal: ${mods.length} modifications`);
}

/**
 * List installed modifications
 */
function listInstalledMods() {
    const installed = JSON.parse(localStorage.getItem('kssteam_installed_mods') || '[]');
    console.log('=== INSTALLED MODIFICATIONS ===');
    
    if (installed.length === 0) {
        console.log('No modifications installed yet.');
        return;
    }
    
    installed.forEach((mod, idx) => {
        console.log(`\n${idx + 1}. ${mod.title}`);
        console.log(`   ID: ${mod.id}`);
        console.log(`   Version: ${mod.version}`);
        console.log(`   Installed: ${mod.installedDate}`);
        console.log(`   Enabled: ${mod.enabled}`);
    });
    
    console.log(`\nTotal: ${installed.length} installed`);
}

/**
 * Test installing a modification
 */
function testInstallMod(modId) {
    console.log(`\n📦 Testing installation of mod: ${modId}`);
    const mod = gamesService.getGameById(modId);
    
    if (!mod) {
        console.error(`❌ Modification not found: ${modId}`);
        return;
    }
    
    // Use the installation function
    installModification(modId);
    console.log('Check the notifications for result');
}

/**
 * Clear all installed modifications (for testing)
 */
function clearInstalledMods() {
    if (confirm('Clear all installed modifications? This cannot be undone.')) {
        localStorage.removeItem('kssteam_installed_mods');
        console.log('✅ All installed modifications cleared');
    }
}

// ============================================
// DATA TESTING
// ============================================

/**
 * Test data export
 */
async function testExportData() {
    console.log('📤 Testing data export...');
    try {
        await downloadService.exportUserData();
        console.log('✅ Export complete. Check your downloads folder.');
    } catch (error) {
        console.error('❌ Export failed:', error);
    }
}

/**
 * Show all localStorage data
 */
function showStorageData() {
    console.log('=== LOCAL STORAGE DATA ===');
    const data = {};
    
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            try {
                data[key] = JSON.parse(localStorage[key]);
            } catch (e) {
                data[key] = localStorage[key];
            }
        }
    }
    
    console.table(data);
}

/**
 * Clear all app data
 */
function clearAllAppData() {
    if (confirm('Clear ALL app data? User account, settings, mods, etc. This cannot be undone.')) {
        localStorage.removeItem('kssteam_user');
        localStorage.removeItem('kssteam_users');
        localStorage.removeItem('kssteam_settings');
        localStorage.removeItem('kssteam_download_history');
        localStorage.removeItem('kssteam_installed_mods');
        console.log('✅ All app data cleared');
        location.reload();
    }
}

// ============================================
// QUICK TESTS
// ============================================

/**
 * Run all tests
 */
function runAllTests() {
    console.clear();
    console.log('🚀 RUNNING ALL TESTS\n');
    
    console.log('1. Launcher Status:');
    checkLauncherStatus();
    
    console.log('\n2. Available Modifications:');
    listModifications();
    
    console.log('\n3. Installed Modifications:');
    listInstalledMods();
    
    console.log('\n4. i18n Status:');
    console.log(`Current Language: ${i18n.currentLang}`);
    console.log(`Available Languages: ${Object.keys(i18n.translations).join(', ')}`);
    
    console.log('\n5. App Status:');
    console.log(`App Initialized: ${app.isInitialized}`);
    console.log(`User Logged In: ${app.isLoggedIn()}`);
    console.log(`Games Loaded: ${app.games.length}`);
    
    console.log('\n✅ All tests completed');
}

// ============================================
// HELP
// ============================================

/**
 * Show available test commands
 */
function testHelp() {
    console.clear();
    console.log('🧪 KS STEAM TEST UTILITIES\n');
    
    console.log('LAUNCHER TESTING:');
    console.log('  enableLauncherMode()      - Enable launcher mode');
    console.log('  disableLauncherMode()     - Disable launcher mode');
    console.log('  checkLauncherStatus()     - Check current status\n');
    
    console.log('LANGUAGE TESTING:');
    console.log('  testLanguages()           - Test language switching');
    console.log('  listTranslations("uk")    - List all translations\n');
    
    console.log('MODIFICATIONS TESTING:');
    console.log('  listModifications()       - Show available mods');
    console.log('  listInstalledMods()       - Show installed mods');
    console.log('  testInstallMod("id")      - Test installing a mod');
    console.log('  clearInstalledMods()      - Clear all installed mods\n');
    
    console.log('DATA TESTING:');
    console.log('  testExportData()          - Test data export');
    console.log('  showStorageData()         - Show all localStorage');
    console.log('  clearAllAppData()         - Clear all app data\n');
    
    console.log('QUICK COMMANDS:');
    console.log('  runAllTests()             - Run all tests');
    console.log('  testHelp()                - Show this help\n');
}

// Show help on load
console.log('💡 Type testHelp() to see available test commands');

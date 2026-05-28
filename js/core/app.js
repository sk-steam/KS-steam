/**
 * KS Steam - Core Application
 * Main application controller and state management
 */

class KSSteamApp {
    constructor() {
        this.user = null;
        this.settings = this.loadSettings();
        this.games = [];
        this.isInitialized = false;
        this.isLauncher = this.detectLauncher();
        this.launcherInfo = {
            isLauncher: this.isLauncher,
            version: '1.0.0',
            platform: 'windows'
        };
    }

    /**
     * Detect if running in launcher using cookie or parameter
     */
    detectLauncher() {
        // Check for launcher cookie
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'launcher' && value === 'true') {
                console.log('✅ Running in KS Launcher mode');
                return true;
            }
        }
        
        // Check URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('launcher') === 'true') {
            console.log('✅ Running in KS Launcher mode (URL param)');
            return true;
        }
        
        return false;
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log('\n═══════════════════════════════════════');
            console.log('🚀 Initializing KS Steam...');
            console.log('═══════════════════════════════════════');
            
            // Load user from storage
            this.loadUser();
            
            // Initialize i18n
            if (typeof i18n !== 'undefined') {
                await i18n.init(this.settings.language || 'en');
            }
            
            console.log('📍 Setting up event listeners...');
            // Setup event listeners
            this.setupEventListeners();
            
            console.log('📚 Loading games...');
            // Load games data
            await this.loadGames();
            
            console.log('🎨 Updating UI...');
            // Update UI
            this.updateUI();
            
            // Show launcher indicator if in launcher mode
            if (this.isLauncher) {
                this.showLauncherIndicator();
            }
            
            this.isInitialized = true;
            
            // Check if there's a hash in the URL and navigate to it
            const hash = window.location.hash.substring(1);
            if (hash && hash !== 'null' && hash !== '') {
                console.log(`📍 Navigating to hash: ${hash}`);
                this.navigateToSection(hash);
            } else {
                // Default to store section
                console.log('📍 No hash, showing store section');
                this.navigateToSection('store');
            }
            
            console.log('═══════════════════════════════════════');
            console.log('✅ KS Steam initialized successfully');
            console.log('═══════════════════════════════════════\n');
        } catch (error) {
            console.error('❌ Failed to initialize KS Steam:', error);
        }
    }

    /**
     * Show launcher indicator in UI
     */
    showLauncherIndicator() {
        const header = document.querySelector('.header');
        if (header) {
            const indicator = document.createElement('div');
            indicator.className = 'launcher-indicator';
            indicator.innerHTML = '🚀 <span data-i18n="launcher.mode">Launcher Mode</span>';
            indicator.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: linear-gradient(135deg, #00d9ff 0%, #ff006e 100%);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                z-index: 10000;
                box-shadow: 0 0 20px rgba(0, 217, 255, 0.5);
            `;
            document.body.appendChild(indicator);
        }
    }

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        console.log('🔧 Setting up event listeners...');

        // Modal buttons
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal('loginModal');
            });
        }
        if (registerBtn) {
            registerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal('registerModal');
            });
        }

        // Language selector
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                e.preventDefault();
                this.changeLanguage(e.target.value);
            });
        }

        // Tab buttons
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleTabSwitch(e);
            });
        });

        console.log('✅ Event listeners setup complete');
    }


    /**
     * Handle tab switching
     */
    handleTabSwitch(event) {
        const tabName = event.target.getAttribute('data-tab');
        const parent = event.target.closest('.tabs').nextElementSibling;

        // Hide all tabs
        parent.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        // Show selected tab
        const tabContent = parent.querySelector(`#tab-${tabName}`);
        if (tabContent) {
            tabContent.classList.add('active');
        }

        // Update active button
        event.target.parentElement.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
    }
    navigateToSection(sectionId) {
        console.log(`\n🔄 Navigating to section: ${sectionId}`);
        
        // Validate section exists
        const targetSection = document.getElementById(sectionId);
        if (!targetSection) {
            console.error(`❌ Section not found: #${sectionId}`);
            console.log('Available sections:', Array.from(document.querySelectorAll('section[id]')).map(s => s.id));
            return;
        }

        console.log(`✅ Found target section: #${sectionId}`);

        // Hide ALL sections at once
        const allSections = document.querySelectorAll('section[id]');
        console.log(`Hiding ${allSections.length} sections...`);
        
        allSections.forEach(section => {
            section.style.display = 'none';
            section.classList.remove('animate-fadeIn');
        });

        // Show selected section
        console.log(`✅ Showing: #${sectionId}`);
        targetSection.style.display = 'block';
        targetSection.classList.add('animate-fadeIn');

        // Verify it's visible
        const computed = window.getComputedStyle(targetSection);
        console.log(`Display is now: ${computed.display}`);

        // Update active nav links
        const navLinks = document.querySelectorAll('[data-section]');
        console.log(`Updating ${navLinks.length} navigation elements...`);
        
        navLinks.forEach(link => {
            const linkSection = link.getAttribute('data-section');
            if (linkSection === sectionId) {
                link.classList.add('active');
                console.log(`  ✅ Active: ${link.textContent.trim()}`);
            } else {
                link.classList.remove('active');
            }
        });

        // Load content for specific sections
        this.loadSectionContent(sectionId);

        // Scroll to top
        window.scrollTo(0, 0);
        
        console.log(`✅ Navigation to ${sectionId} complete\n`);
    }

    /**
     * Load dynamic content for sections
     */
    loadSectionContent(sectionId) {
        // Only load if we have games
        if (!window.gamesService || !this.games.length) return;

        switch (sectionId) {
            case 'featured':
                this.loadFeaturedGames();
                break;
            case 'bestsellers':
                this.loadBestSellers();
                break;
            case 'new':
                this.loadNewGames();
                break;
        }
    }

    /**
     * Load featured games
     */
    loadFeaturedGames() {
        const container = document.getElementById('featuredGamesGrid');
        if (!container || !window.gamesService) return;

        const featured = gamesService.getFeaturedGames(6);
        container.innerHTML = featured
            .map(game => gamesService.renderGameCard(game))
            .join('');

        // Add click handlers
        container.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', () => {
                const gameId = card.getAttribute('data-game-id');
                // Can add game detail modal here
                console.log('Clicked game:', gameId);
            });
        });
    }

    /**
     * Load best sellers
     */
    loadBestSellers() {
        const container = document.getElementById('bestsellersGrid');
        if (!container || !window.gamesService) return;

        const bestsellers = gamesService.getBestSellers(6);
        container.innerHTML = bestsellers
            .map(game => gamesService.renderGameCard(game))
            .join('');

        // Add click handlers
        container.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', () => {
                const gameId = card.getAttribute('data-game-id');
                console.log('Clicked game:', gameId);
            });
        });
    }

    /**
     * Load new games
     */
    loadNewGames() {
        const container = document.getElementById('newGamesGrid');
        if (!container || !window.gamesService) return;

        const allGames = gamesService.getAllGames();
        const newGames = allGames.slice(-6).reverse();
        
        container.innerHTML = newGames
            .map(game => gamesService.renderGameCard(game))
            .join('');

        // Add click handlers
        container.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', () => {
                const gameId = card.getAttribute('data-game-id');
                console.log('Clicked game:', gameId);
            });
        });
    }

    /**
     * Handle tab switching
     */
    handleTabSwitch(event) {
        const tabName = event.target.getAttribute('data-tab');
        const parent = event.target.closest('.tabs').nextElementSibling;

        // Hide all tabs
        parent.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        // Show selected tab
        const tabContent = parent.querySelector(`#tab-${tabName}`);
        if (tabContent) {
            tabContent.classList.add('active');
        }

        // Update active button
        event.target.parentElement.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
    }

    /**
     * Load user from storage
     */
    loadUser() {
        const userStr = localStorage.getItem('kssteam_user');
        if (userStr) {
            this.user = JSON.parse(userStr);
        }
    }

    /**
     * Save user to storage
     */
    saveUser() {
        localStorage.setItem('kssteam_user', JSON.stringify(this.user));
    }

    /**
     * Load settings from storage
     */
    loadSettings() {
        const settingsStr = localStorage.getItem('kssteam_settings');
        return settingsStr ? JSON.parse(settingsStr) : {
            language: 'en',
            theme: 'dark',
            notifications: true
        };
    }

    /**
     * Save settings to storage
     */
    saveSettings() {
        localStorage.setItem('kssteam_settings', JSON.stringify(this.settings));
    }

    /**
     * Change language
     */
    async changeLanguage(lang) {
        this.settings.language = lang;
        this.saveSettings();
        
        if (typeof i18n !== 'undefined') {
            await i18n.changeTo(lang);
        }
    }

    /**
     * Load games data
     */
    async loadGames() {
        try {
            const response = await fetch('data/games.json');
            const data = await response.json();
            this.games = data.games || [];
            
            // Also update gamesService if available
            if (window.gamesService) {
                window.gamesService.games = this.games;
                window.gamesService.filteredGames = [...this.games];
            }
            
            console.log(`✅ Loaded ${this.games.length} games/modifications`);
            return this.games;
        } catch (error) {
            console.error('Failed to load games:', error);
            this.games = [];
            return [];
        }
    }

    /**
     * Update UI based on user state
     */
    updateUI() {
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const userProfile = document.getElementById('userProfileBtn');
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');

        if (this.user) {
            // User is logged in
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'none';
            if (userProfile) {
                userProfile.style.display = 'flex';
                document.getElementById('userAvatar').textContent = this.user.username.charAt(0).toUpperCase();
                document.getElementById('userName').textContent = this.user.username;
            }
            if (sidebar) sidebar.style.display = 'block';
        } else {
            // User is not logged in
            if (loginBtn) loginBtn.style.display = 'block';
            if (registerBtn) registerBtn.style.display = 'block';
            if (userProfile) userProfile.style.display = 'none';
            if (sidebar) sidebar.style.display = 'none';
            if (mainContent) mainContent.classList.add('full');
        }
    }

    /**
     * Open a modal
     */
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Close a modal
     */
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    /**
     * Get current user
     */
    getUser() {
        return this.user;
    }

    /**
     * Check if user is logged in
     */
    isLoggedIn() {
        return this.user !== null;
    }

    /**
     * Logout user
     */
    logout() {
        this.user = null;
        localStorage.removeItem('kssteam_user');
        this.updateUI();
        this.navigateToSection('store');
    }
}

// Global app instance
const app = new KSSteamApp();

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🚀 DOMContentLoaded - initializing app');
        app.init();
    });
} else {
    console.log('🚀 DOM already loaded - initializing app');
    app.init();
}

// Global helper functions for HTML
function openModal(modalId) {
    if (app) app.openModal(modalId);
}

function closeModal(modalId) {
    if (app) app.closeModal(modalId);
}

function navigateTo(sectionId) {
    console.log(`\n🧭 navigateTo called: ${sectionId}`);
    if (app) {
        window.location.hash = sectionId;
        app.navigateToSection(sectionId);
    } else {
        console.error('App not initialized');
    }
    return false;
}

function logout() {
    if (app) app.logout();
}

function exportData() {
    if (downloadService) downloadService.exportUserData();
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && downloadService) {
            downloadService.importUserData(file);
        }
    });
    input.click();
}

// Logout button listener - setup after DOM ready
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
});

// Setup user profile menu
document.addEventListener('DOMContentLoaded', () => {
    const userProfileBtn = document.getElementById('userProfileBtn');
    if (userProfileBtn) {
        userProfileBtn.addEventListener('click', () => {
            app.navigateToSection('profile');
        });
    }
});

// Expose navigation function for manual testing
window.gotoSection = function(sectionId) {
    console.log(`\n🧪 Manual navigation test to: ${sectionId}`);
    if (app) {
        window.location.hash = sectionId;
        app.navigateToSection(sectionId);
    } else {
        console.error('App not initialized');
    }
};

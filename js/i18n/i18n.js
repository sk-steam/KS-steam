/**
 * i18n - Internationalization Module
 * Handles language switching and translations
 */

class I18n {
    constructor() {
        this.currentLang = this.detectLanguage();
        this.supportedLanguages = ['en', 'uk'];
        this.translations = {
            'en': EN_TRANSLATIONS,
            'uk': UK_TRANSLATIONS
        };
    }

    /**
     * Detect system language from browser or localStorage
     */
    detectLanguage() {
        // Check localStorage first
        const saved = localStorage.getItem('kssteam_language');
        if (saved && ['en', 'uk'].includes(saved)) {
            return saved;
        }
        // Check browser language
        const browserLang = navigator.language.substring(0, 2).toLowerCase();
        if (browserLang === 'uk') {
            return 'uk';
        }
        return 'en';
    }

    /**
     * Initialize i18n
     */
    async init(language = null) {
        if (!language) {
            language = this.detectLanguage();
        }
        this.currentLang = language;
        localStorage.setItem('kssteam_language', language);
        this.updatePageLanguage();
    }

    /**
     * Load translations (already in memory)
     */
    async loadTranslations(lang) {
        // Translations are already loaded from EN_TRANSLATIONS and UK_TRANSLATIONS
        return true;
    }

    /**
     * Get translation string
     */
    t(key, defaultValue = '') {
        const keys = key.split('.');
        let value = this.translations[this.currentLang] || {};

        for (const k of keys) {
            value = value[k];
            if (value === undefined) {
                // Fallback to English
                value = this.getFromDefault('en', key);
                break;
            }
        }

        return value || defaultValue || key;
    }

    /**
     * Get value from default language
     */
    getFromDefault(lang, key) {
        const keys = key.split('.');
        let value = this.translations[lang] || {};

        for (const k of keys) {
            value = value[k];
            if (value === undefined) {
                return key;
            }
        }

        return value;
    }

    /**
     * Change language
     */
    async changeTo(language) {
        if (!this.supportedLanguages.includes(language)) {
            console.warn(`Language ${language} not supported`);
            return;
        }

        this.currentLang = language;
        localStorage.setItem('kssteam_language', language);
        this.updatePageLanguage();
    }

    /**
     * Update all page text with translations
     */
    updatePageLanguage() {
        document.documentElement.lang = this.currentLang;

        // Update elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key, element.textContent);
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key, element.placeholder);
        });

        // Update titles
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key, element.title);
        });
    }

    /**
     * Format date
     */
    formatDate(date, style = 'short') {
        const formatter = new Intl.DateTimeFormat(this.currentLang, {
            year: 'numeric',
            month: style === 'short' ? '2-digit' : 'long',
            day: '2-digit'
        });
        return formatter.format(new Date(date));
    }

    /**
     * Format number
     */
    formatNumber(number, options = {}) {
        const formatter = new Intl.NumberFormat(this.currentLang, options);
        return formatter.format(number);
    }

    /**
     * Format currency
     */
    formatCurrency(amount, currency = 'USD') {
        const formatter = new Intl.NumberFormat(this.currentLang, {
            style: 'currency',
            currency: currency
        });
        return formatter.format(amount);
    }
}

// Create global i18n instance
const i18n = new I18n();

// Create English translations object
const EN_TRANSLATIONS = {
    // Navigation
    'nav.store': 'Store',
    'nav.library': 'Library',
    'nav.community': 'Community',
    'nav.profile': 'Profile',

    // Sidebar
    'sidebar.discover': 'Discover',
    'sidebar.store': 'Store',
    'sidebar.featured': 'Featured',
    'sidebar.bestsellers': 'Best Sellers',
    'sidebar.new': 'New',
    'sidebar.library': 'Library',
    'sidebar.myLibrary': 'My Library',
    'sidebar.wishlist': 'Wishlist',
    'sidebar.friends': 'Friends',
    'sidebar.account': 'Account',
    'sidebar.profile': 'Profile',
    'sidebar.settings': 'Settings',
    'sidebar.support': 'Support',

    // Authentication
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.logout': 'Logout',
    'auth.email': 'Email or Username',
    'auth.password': 'Password',
    'auth.enterEmail': 'Enter your email or username',
    'auth.enterPassword': 'Enter your password',
    'auth.rememberMe': 'Remember me',
    'auth.username': 'Username',
    'auth.confirmPassword': 'Confirm Password',
    'auth.agreeTerms': 'I agree to the terms and conditions',

    // Store
    'store.title': 'Welcome to KS Steam',
    'store.subtitle': 'Discover amazing games and join the community',
    'store.featured': 'Featured Games',
    'store.featuredDesc': 'Check out the latest and greatest games',
    'store.bestsellers': 'Best Sellers',
    'store.bestsellersDesc': 'Play the most popular games right now',
    'store.community': 'Join Community',
    'store.communityDesc': 'Connect with players worldwide',
    'store.explore': 'Explore',
    'store.browse': 'Browse',
    'store.connect': 'Connect',

    // Library
    'library.title': 'My Library',
    'library.subtitle': 'Your games collection',
    'library.all': 'All Games',
    'library.installed': 'Installed',
    'library.favourites': 'Favorites',

    // Community
    'community.title': 'Community',
    'community.subtitle': 'Connect with other players',
    'community.forums': 'Forums',
    'community.forumsDesc': 'Discuss games and share experiences',
    'community.groups': 'Groups',
    'community.groupsDesc': 'Join groups based on your interests',

    // Profile
    'profile.title': 'My Profile',
    'profile.member': 'Member since 2024',
    'profile.stats': 'Statistics',
    'profile.gamesOwned': 'Games Owned:',
    'profile.playtime': 'Total Playtime:',
    'profile.friends': 'Friends:',
    'profile.level': 'Level:',

    // Settings
    'settings.title': 'Settings',
    'settings.appearance': 'Appearance',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.dark': 'Dark (Neon)',
    'settings.light': 'Light',
    'settings.notifications': 'Notifications',
    'settings.enableNotifications': 'Enable notifications',

    // Download
    'download.title': 'Download for PC',
    'download.description': 'Select a version to download and install on your computer',
    'download.full': 'Full Version',
    'download.fullDesc': 'Complete website with all resources',
    'download.minimal': 'Minimal Version',
    'download.minimalDesc': 'Only necessary files',
    'download.launcher': 'For Launcher',
    'download.launcherDesc': 'Optimized for Windows launcher',
    'download.portable': 'Portable Version',
    'download.portableDesc': 'Standalone version without internet',
    'download.exportData': 'Export Data',
    'download.importData': 'Import Data',
    'download.clearCache': 'Clear Cache',
    'download.deleteData': 'Delete All Data',
    'download.history': 'Download History',
    'download.dataManagement': 'Data Management',

    // Modifications
    'mods.title': 'Modifications for KS Steam',
    'mods.noAvailable': 'No modifications available',

    // Launcher
    'launcher.mode': 'Launcher Mode',

    // Common
    'common.visit': 'Visit',
    'common.join': 'Join',
    'common.save': 'Save Changes',
    'common.cancel': 'Cancel'
};

// Create Ukrainian translations object
const UK_TRANSLATIONS = {
    // Navigation
    'nav.store': 'Магазин',
    'nav.library': 'Бібліотека',
    'nav.community': 'Спільнота',
    'nav.profile': 'Профіль',

    // Sidebar
    'sidebar.discover': 'Відкрити',
    'sidebar.store': 'Магазин',
    'sidebar.featured': 'Вирізнено',
    'sidebar.bestsellers': 'Бестселери',
    'sidebar.new': 'Нові',
    'sidebar.library': 'Бібліотека',
    'sidebar.myLibrary': 'Моя Бібліотека',
    'sidebar.wishlist': 'Список бажань',
    'sidebar.friends': 'Друзі',
    'sidebar.account': 'Акаунт',
    'sidebar.profile': 'Профіль',
    'sidebar.settings': 'Налаштування',
    'sidebar.support': 'Підтримка',

    // Authentication
    'auth.login': 'Увійти',
    'auth.register': 'Реєстрація',
    'auth.logout': 'Вихід',
    'auth.email': 'Електронна пошта або ім\'я користувача',
    'auth.password': 'Пароль',
    'auth.enterEmail': 'Введіть вашу електронну пошту або ім\'я користувача',
    'auth.enterPassword': 'Введіть ваш пароль',
    'auth.rememberMe': 'Запам\'ятати мене',
    'auth.username': 'Ім\'я користувача',
    'auth.confirmPassword': 'Підтвердіть пароль',
    'auth.agreeTerms': 'Я згоден з умовами та положеннями',

    // Store
    'store.title': 'Ласкаво просимо до KS Steam',
    'store.subtitle': 'Відкрийте для себе дивовижні ігри та приєднайтесь до спільноти',
    'store.featured': 'Вирізнені ігри',
    'store.featuredDesc': 'Ознайомтеся з останніми та найкращими іграми',
    'store.bestsellers': 'Бестселери',
    'store.bestsellersDesc': 'Грайте в найпопулярніші ігри прямо зараз',
    'store.community': 'Приєднатися до спільноти',
    'store.communityDesc': 'Спілкуйтеся з гравцями з усього світу',
    'store.explore': 'Дослідити',
    'store.browse': 'Переглянути',
    'store.connect': 'Підключитися',

    // Library
    'library.title': 'Моя Бібліотека',
    'library.subtitle': 'Ваша колекція ігор',
    'library.all': 'Усі ігри',
    'library.installed': 'Встановлено',
    'library.favourites': 'Улюблені',

    // Community
    'community.title': 'Спільнота',
    'community.subtitle': 'Спілкуйтеся з іншими гравцями',
    'community.forums': 'Форуми',
    'community.forumsDesc': 'Обговорюйте ігри та діліться враженнями',
    'community.groups': 'Групи',
    'community.groupsDesc': 'Приєднуйтеся до груп за своїми інтересами',

    // Profile
    'profile.title': 'Мій Профіль',
    'profile.member': 'Член з 2024 р.',
    'profile.stats': 'Статистика',
    'profile.gamesOwned': 'Ігор у власності:',
    'profile.playtime': 'Загальний час гри:',
    'profile.friends': 'Друзі:',
    'profile.level': 'Рівень:',

    // Settings
    'settings.title': 'Налаштування',
    'settings.appearance': 'Зовнішній вигляд',
    'settings.language': 'Мова',
    'settings.theme': 'Тема',
    'settings.dark': 'Темна (Неон)',
    'settings.light': 'Світла',
    'settings.notifications': 'Сповіщення',
    'settings.enableNotifications': 'Увімкнути сповіщення',

    // Download
    'download.title': 'Завантажити для ПК',
    'download.description': 'Виберіть версію для завантаження та встановлення на комп\'ютер',
    'download.full': 'Повна версія',
    'download.fullDesc': 'Весь сайт з усіма ресурсами',
    'download.minimal': 'Мінімальна версія',
    'download.minimalDesc': 'Тільки необхідні файли',
    'download.launcher': 'Для лаунчера',
    'download.launcherDesc': 'Оптимізована для Windows лаунчера',
    'download.portable': 'Портативна версія',
    'download.portableDesc': 'Автономна версія без інтернету',
    'download.exportData': 'Експортувати дані',
    'download.importData': 'Імпортувати дані',
    'download.clearCache': 'Очистити кеш',
    'download.deleteData': 'Видалити всі дані',
    'download.history': 'Історія завантажень',
    'download.dataManagement': 'Управління даними',

    // Modifications
    'mods.title': 'Модифікації для KS Steam',
    'mods.noAvailable': 'Немає доступних модифікацій',

    // Launcher
    'launcher.mode': 'Режим лаунчера',

    // Common
    'common.visit': 'Відвідати',
    'common.join': 'Приєднатися',
    'common.save': 'Зберегти зміни',
    'common.cancel': 'Скасувати'
};

// Store translations
i18n.translations = {
    'en': EN_TRANSLATIONS,
    'uk': UK_TRANSLATIONS
};

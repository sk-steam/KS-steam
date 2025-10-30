class Settings {
    static categories = {
        account: 'Аккаунт',
        customize: 'Кастомізація',
        balance: 'Баланс',
        extensions: 'Доповнення',
        language: 'Мова'
    };

    static openSettings(category = 'account') {
        const settingsContent = document.getElementById('settingsContent');
        if (!settingsContent) return;

        // Update tabs
        document.querySelectorAll('.settings-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.category === category) {
                tab.classList.add('active');
            }
        });

        // Update content
        switch(category) {
            case 'account':
                this.showAccountSettings();
                break;
            case 'customize':
                this.showCustomizeSettings();
                break;
            case 'balance':
                this.showBalanceSettings();
                break;
            case 'extensions':
                document.getElementById('settingsContent').innerHTML = Extensions.showExtensionsSettings();
                break;
            case 'language':
                document.getElementById('settingsContent').innerHTML = this.showLanguageSettings();
                break;
        }

        Modal.open('profileSettingsModal');
    }

    static showAccountSettings() {
        const user = Profile.getUserData();
        const currentLang = localStorage.getItem('language') || 'uk';
        
        document.getElementById('settingsContent').innerHTML = `
            <h3>Налаштування акаунту</h3>
            <div class="settings-form">
                <div class="avatar-upload">
                    <div class="avatar-preview">
                        <img id="avatarPreview" src="${user?.avatar || 'asset/defolt-ava.jpg'}" alt="Avatar Preview">
                    </div>
                    <input type="file" id="settingsAvatar" accept="image/*" onchange="Profile.previewAvatar(event)">
                </div>
                <input type="text" id="settingsUsername" placeholder="Новий логін" value="${user?.username || ''}">
                <input type="email" id="settingsEmail" placeholder="Новий email" value="${user?.email || ''}">
                <input type="password" id="settingsPassword" placeholder="Новий пароль">
                
                <div class="settings-section">
                    <label>Мова інтерфейсу:</label>
                    <select id="languageSelect" onchange="Settings.changeLanguage(this.value)">
                        <option value="uk" ${currentLang === 'uk' ? 'selected' : ''}>Українська</option>
                        <option value="en" ${currentLang === 'en' ? 'selected' : ''}>English</option>
                    </select>
                </div>
            </div>
        `;
    }

    static showCustomizeSettings() {
        document.getElementById('settingsContent').innerHTML = `
            <h3>Налаштування інтерфейсу</h3>
            <div class="settings-form">
                <div class="setting-item">
                    <label>Тема інтерфейсу</label>
                    <select id="themeSelect">
                        <option value="dark">Темна</option>
                        <option value="light">Світла</option>
                    </select>
                </div>
            </div>
        `;
    }

    static showBalanceSettings() {
        document.getElementById('settingsContent').innerHTML = `
            <h3>Управління балансом</h3>
            <div class="settings-form">
                <div class="balance-info">
                    <p>Поточний баланс: <span class="balance-amount">0,00$</span></p>
                </div>
                <button class="profile-btn primary" disabled>Поповнити баланс</button>
                <p class="notice">Функція поповнення балансу в розробці</p>
            </div>
        `;
    }

    static showLanguageSettings() {
        const currentLang = localStorage.getItem('language') || 'uk';
        return `
            <h3>${Lang.get('settings.language')}</h3>
            <div class="settings-form">
                <select id="languageSelect" onchange="Settings.changeLanguage(this.value)">
                    <option value="uk" ${currentLang === 'uk' ? 'selected' : ''}>Українська</option>
                    <option value="en" ${currentLang === 'en' ? 'selected' : ''}>English</option>
                </select>
            </div>
        `;
    }

    static changeLanguage(lang) {
        localStorage.setItem('language', lang);
        Lang.init();
        window.location.reload();
    }
}

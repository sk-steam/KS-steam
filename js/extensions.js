class Extensions {
    static installedExtensions = JSON.parse(localStorage.getItem('installedExtensions') || '[]');

    static addExtension(extension) {
        if (!this.installedExtensions.some(e => e.id === extension.id)) {
            this.installedExtensions.push(extension);
            this.saveExtensions();
            return true;
        }
        return false;
    }

    static removeExtension(extensionId) {
        this.installedExtensions = this.installedExtensions.filter(e => e.id !== extensionId);
        this.saveExtensions();
    }

    static saveExtensions() {
        localStorage.setItem('installedExtensions', JSON.stringify(this.installedExtensions));
    }

    static showExtensionsSettings() {
        return `
            <h3>Доповнення</h3>
            <div class="extensions-form">
                <div class="extension-add">
                    <input type="text" id="extensionUrl" placeholder="Введіть посилання на доповнення">
                    <button onclick="Extensions.installFromUrl()" class="extension-btn">Додати</button>
                </div>
                <div class="extensions-list">
                    <h4>Встановлені доповнення</h4>
                    ${this.renderInstalledExtensions()}
                </div>
            </div>
        `;
    }

    static renderInstalledExtensions() {
        if (this.installedExtensions.length === 0) {
            return '<p class="empty-message">Немає встановлених доповнень</p>';
        }

        return this.installedExtensions.map(ext => `
            <div class="extension-item">
                <div class="extension-info">
                    <span class="extension-name">${ext.name}</span>
                    <span class="extension-description">${ext.description}</span>
                </div>
                <button onclick="Extensions.removeExtension('${ext.id}')" class="remove-extension">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    static async installFromUrl() {
        const url = document.getElementById('extensionUrl').value.trim();
        if (!url) {
            alert('Введіть URL доповнення');
            return;
        }

        // Перевірка відомих URL доповнень
        const knownExtensions = {
            'https://sk-steam.mau/testing-moduls': {
                id: 'test-extension-1',
                name: 'Тестове доповнення',
                description: 'Демонстраційне доповнення для тестування функціоналу',
                version: '1.0.0'
            },
            'https://steamrip.com/': {
                id: 'steamrip-lib',
                name: 'SteamRip Library',
                description: 'Додає можливість імпорту ігор з SteamRip',
                version: '1.0.0',
                features: ['library-import']
            }
        };

        const extension = knownExtensions[url];
        if (extension) {
            if (this.addExtension({...extension, url})) {
                document.getElementById('extensionUrl').value = '';
                Settings.openSettings('extensions');
                alert(`Доповнення "${extension.name}" успішно встановлено!`);
                
                // Активуємо функціонал доповнення
                if (extension.id === 'steamrip-lib') {
                    this.activateSteamRipExtension();
                }
            } else {
                alert('Це доповнення вже встановлено');
            }
            return;
        }

        alert('Помилка: Невідоме доповнення. Доступні доповнення:\n- https://sk-steam.mau/testing-moduls\n- https://steamrip.com/');
    }

    static activateSteamRipExtension() {
        // Додаємо кнопку імпорту в бібліотеку
        const librarySection = document.getElementById('libraryGames');
        if (librarySection && !document.getElementById('steamrip-import')) {
            const importBtn = document.createElement('button');
            importBtn.id = 'steamrip-import';
            importBtn.className = 'profile-btn primary';
            importBtn.innerHTML = 'Імпорт з SteamRip';
            importBtn.onclick = () => this.handleSteamRipImport();
            
            librarySection.parentElement.insertBefore(importBtn, librarySection);
        }
    }

    static handleSteamRipImport() {
        alert('Функція імпорту з SteamRip в розробці');
    }
}

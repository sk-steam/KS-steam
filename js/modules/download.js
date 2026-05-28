/**
 * Download Module
 * Handles website packaging and downloading for PC launcher
 */

class DownloadService {
    constructor() {
        this.packageTypes = {
            full: {
                name: 'Повна версія',
                description: 'Весь сайт + усі ресурси',
                size: 'Розраховується...',
                includes: ['HTML', 'CSS', 'JS', 'Зображення', 'Дані']
            },
            minimal: {
                name: 'Мінімальна версія',
                description: 'Тільки необхідні файли',
                size: 'Розраховується...',
                includes: ['HTML', 'CSS', 'JS ядро']
            },
            launcher: {
                name: 'Для лаунчера',
                description: 'Оптимізована для Windows лаунчера',
                size: 'Розраховується...',
                includes: ['HTML', 'CSS', 'JS', 'Конфіг']
            },
            portable: {
                name: 'Портативна версія',
                description: 'Автономна версія без інтернету',
                size: 'Розраховується...',
                includes: ['Усе + вбудовані ресурси']
            }
        };

        this.downloadHistory = this.loadDownloadHistory();
    }

    /**
     * Завантажити інформацію про пакети
     */
    async getPackageInfo() {
        const packages = {};
        for (const [key, pkg] of Object.entries(this.packageTypes)) {
            const size = await this.calculatePackageSize(key);
            packages[key] = {
                ...pkg,
                size: this.formatFileSize(size),
                bytes: size
            };
        }
        return packages;
    }

    /**
     * Розраховуємо розмір пакета
     */
    async calculatePackageSize(packageType) {
        let size = 0;

        // HTML files
        size += 15 * 1024; // index-new.html

        // CSS files
        if (packageType !== 'minimal') {
            size += (150 + 80 + 120) * 1024; // neon, animations, components CSS
        } else {
            size += 150 * 1024; // only neon CSS
        }

        // JS files
        size += (50 + 40 + 35 + 30 + 25 + 20 + 18) * 1024; // all modules

        // Images/Assets
        if (packageType !== 'minimal') {
            size += 500 * 1024; // approximate
        }

        // Data files
        if (packageType !== 'minimal') {
            size += 100 * 1024; // games.json, etc
        }

        return size;
    }

    /**
     * Форматувати розмір файлу
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }

    /**
     * Завантажити пакет
     */
    async downloadPackage(packageType) {
        try {
            UIService.showLoading(`Підготовка завантаження ${this.packageTypes[packageType].name}...`);

            // Створюємо контент пакета
            const files = await this.preparePackageFiles(packageType);

            // Створюємо Blob
            const blob = await this.createPackageBlob(files, packageType);

            // Завантажуємо
            this.downloadBlob(blob, `KS-Steam-${packageType}-${this.getDateString()}.zip`);

            UIService.hideLoading();
            UIService.showToast(`${this.packageTypes[packageType].name} завантажена успішно!`, 'success');

            // Зберігаємо в історії
            this.addToDownloadHistory(packageType);

        } catch (error) {
            UIService.hideLoading();
            UIService.showToast(`Помилка при завантаженні: ${error.message}`, 'error');
            console.error('Download error:', error);
        }
    }

    /**
     * Підготувати файли для пакета
     */
    async preparePackageFiles(packageType) {
        const files = {};

        // HTML
        files['index.html'] = await this.getFileContent('index-new.html');

        // CSS
        files['css/neon-theme.css'] = await this.getFileContent('css/neon-theme.css');
        files['css/animations.css'] = await this.getFileContent('css/animations.css');

        if (packageType !== 'minimal') {
            files['css/components.css'] = await this.getFileContent('css/components.css');
            files['css/steam_clone.css'] = await this.getFileContent('css/steam_clone.css');
            files['css/library.css'] = await this.getFileContent('css/library.css');
        }

        // JavaScript
        files['js/core/app.js'] = await this.getFileContent('js/core/app.js');
        files['js/modules/auth.js'] = await this.getFileContent('js/modules/auth.js');
        files['js/modules/games.js'] = await this.getFileContent('js/modules/games.js');
        files['js/modules/user.js'] = await this.getFileContent('js/modules/user.js');
        files['js/modules/ui.js'] = await this.getFileContent('js/modules/ui.js');
        files['js/modules/profile.js'] = await this.getFileContent('js/modules/profile.js');
        files['js/modules/library.js'] = await this.getFileContent('js/modules/library.js');
        files['js/i18n/i18n.js'] = await this.getFileContent('js/i18n/i18n.js');

        // Data files
        if (packageType !== 'minimal') {
            files['data/games.json'] = JSON.stringify(
                gamesService.games.length > 0 ? gamesService.games : gamesService.getDemoGames(),
                null,
                2
            );
        }

        // Конфіг для лаунчера
        if (packageType === 'launcher' || packageType === 'portable') {
            files['launcher-config.json'] = JSON.stringify({
                name: 'KS Steam',
                version: '2.0',
                description: 'KS Steam - Gaming Platform',
                entry: 'index.html',
                type: 'electron',
                window: {
                    width: 1400,
                    height: 900,
                    minWidth: 1024,
                    minHeight: 768
                },
                settings: {
                    allowExit: true,
                    autoUpdate: true,
                    launcherIntegration: true
                }
            }, null, 2);

            files['README-LAUNCHER.md'] = this.getReadmeLauncher();
        }

        // Інструкції
        files['INSTALL.md'] = this.getInstallInstructions(packageType);

        return files;
    }

    /**
     * Отримати контент файлу
     */
    async getFileContent(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                return `// File not found: ${path}`;
            }
            return await response.text();
        } catch (error) {
            console.warn(`Could not fetch ${path}:`, error);
            return `// Error loading file: ${path}`;
        }
    }

    /**
     * Створити Blob пакета
     */
    async createPackageBlob(files, packageType) {
        // Для простоти, створюємо текстовий архів
        // У продакшені використовуйте jszip або аналогічну бібліотеку
        
        let content = this.createZipManually(files);
        return new Blob([content], { type: 'application/zip' });
    }

    /**
     * Створити ZIP вручну (спрощена версія)
     */
    createZipManually(files) {
        // Це спрощена версія - в реальній версії використовуйте jszip
        // Повертаємо JSON з файлами як тимчасовий формат
        const manifest = {
            type: 'ks-steam-package',
            version: '2.0',
            timestamp: new Date().toISOString(),
            files: {}
        };

        for (const [path, content] of Object.entries(files)) {
            manifest.files[path] = {
                size: new Blob([content]).size,
                contentType: this.getContentType(path),
                content: content
            };
        }

        return JSON.stringify(manifest, null, 2);
    }

    /**
     * Визначити тип контенту
     */
    getContentType(filename) {
        if (filename.endsWith('.html')) return 'text/html';
        if (filename.endsWith('.css')) return 'text/css';
        if (filename.endsWith('.js')) return 'text/javascript';
        if (filename.endsWith('.json')) return 'application/json';
        if (filename.endsWith('.md')) return 'text/markdown';
        return 'text/plain';
    }

    /**
     * Завантажити Blob
     */
    downloadBlob(blob, filename) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    /**
     * Отримати дату в форматі для назви файлу
     */
    getDateString() {
        const date = new Date();
        return date.toISOString().split('T')[0];
    }

    /**
     * README для лаунчера
     */
    getReadmeLauncher() {
        return `# KS Steam - Launcher Version

## Інсталяція для Windows Launcher

### Вимоги
- Windows 10/11
- KS Launcher (версія 2.0+)
- ~500MB вільного місця

### Установка

1. **Розпакуйте архів** у папку лаунчера:
   \`C:\\Program Files\\KS Launcher\\apps\\ks-steam\`

2. **Відкрийте лаунчер** і додайте програму:
   - Меню → Додати програму
   - Вибрати папку з KS Steam
   - Відкрити launcher-config.json

3. **Запустіть** KS Steam з лаунчера

### Особливості

✓ Повна інтеграція з лаунчером
✓ Автоматичні оновлення
✓ Локальне сховище даних
✓ Швидка загрузка
✓ Системні сповіщення

### Резервна копія даних

Ваші дані зберігаються в:
\`%APPDATA%\\KS Launcher\\ks-steam\\data\`

Для резервної копії просто скопіюйте цю папку.

### Розв'язання проблем

**Проблема: Білий екран**
- Перезавантажте лаунчер
- Перевірте інтернет-з'єднання

**Проблема: Сповіщення не з'являються**
- Перевірте налаштування сповіщень Windows
- Дозвольте сповіщення для лаунчера

**Проблема: Дані не зберігаються**
- Перевірте дозволи папки
- Очистіть кеш браузера

### Підтримка

Для допомоги відвідайте: https://ks-gaming.com/support
`;
    }

    /**
     * Інструкції для установки
     */
    getInstallInstructions(packageType) {
        return `# KS Steam - Інструкції установки

## Версія: ${this.packageTypes[packageType].name}

### Вимоги
- Браузер: Chrome, Firefox, Safari, Edge (новіші версії)
- ОС: Windows, macOS, Linux
- RAM: 512 MB
- Місце на диску: ${this.formatFileSize(await this.calculatePackageSize(packageType))}

### Крок 1: Розпакування
1. Розпакуйте завантажений файл у папку:
   - Windows: \`C:\\Games\\KS-Steam\`
   - macOS: \`~/Applications/KS-Steam\`
   - Linux: \`~/ks-steam\`

### Крок 2: Запуск
**Способ 1: Прямо у браузері**
- Двічі клацніть на \`index.html\`
- Або перетягніть \`index.html\` у браузер

**Способ 2: Локальний сервер**
- Windows: Запустіть \`server.bat\`
- macOS/Linux: Запустіть \`server.sh\`
- Відкрийте: http://localhost:8000

**Способ 3: За допомогою лаунчера**
- Скопіюйте папку в папку програм лаунчера
- Додайте програму через меню лаунчера
- Запустіть з лаунчера

### Крок 3: Перший запуск
1. Зареєструйтеся або увійдіть
2. Виберіть мову (англійська/українська)
3. Наслідуйте інструкції на екрані

### Налаштування

**Змінити мову:**
- Параметри → Мова → Виберіть мову

**Увімкнути/вимкнути сповіщення:**
- Параметри → Сповіщення

**Очистити кеш:**
- Параметри → Управління даними → Очистити кеш

### Резервна копія даних
Ваші дані автоматично зберігаються локально.
Для резервної копії:
1. Параметри → Управління даними
2. Натисніть "Завантажити резервну копію"
3. Файл буде завантажений на ПК

### Видалення
1. Просто видаліть папку КС Steam
2. Усі дані будуть вилучені

### Дальша допомога
- Сайт: https://ks-gaming.com
- Форум: https://ks-gaming.com/community
- Email: support@ks-gaming.com
`;
    }

    /**
     * Завантажити історію
     */
    loadDownloadHistory() {
        const history = localStorage.getItem('kssteam_download_history');
        return history ? JSON.parse(history) : [];
    }

    /**
     * Додати в історію
     */
    addToDownloadHistory(packageType) {
        this.downloadHistory.unshift({
            type: packageType,
            name: this.packageTypes[packageType].name,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString()
        });

        // Зберігаємо останні 10 завантажень
        if (this.downloadHistory.length > 10) {
            this.downloadHistory = this.downloadHistory.slice(0, 10);
        }

        localStorage.setItem('kssteam_download_history', JSON.stringify(this.downloadHistory));
    }

    /**
     * Отримати історію завантажень
     */
    getDownloadHistory() {
        return this.downloadHistory;
    }

    /**
     * Експортувати дані користувача
     */
    async exportUserData() {
        try {
            UIService.showLoading('Експорт даних користувача...');

            const userData = {
                user: app.user,
                settings: app.settings,
                library: app.user ? gamesService.games.filter(g => 
                    app.user.games && app.user.games.includes(g.id)
                ) : [],
                exportDate: new Date().toISOString()
            };

            const blob = new Blob([JSON.stringify(userData, null, 2)], 
                { type: 'application/json' });
            
            this.downloadBlob(blob, `ks-steam-backup-${this.getDateString()}.json`);

            UIService.hideLoading();
            UIService.showToast('Дані експортовані успішно!', 'success');

        } catch (error) {
            UIService.hideLoading();
            UIService.showToast('Помилка при експорті даних', 'error');
        }
    }

    /**
     * Імпортувати дані користувача
     */
    async importUserData(file) {
        try {
            UIService.showLoading('Імпорт даних...');

            const text = await file.text();
            const userData = JSON.parse(text);

            // Перевіряємо формат
            if (!userData.user || !userData.settings) {
                throw new Error('Невірний формат файлу');
            }

            // Імпортуємо дані
            app.user = userData.user;
            app.settings = userData.settings;
            app.saveUser();
            app.saveSettings();

            UIService.hideLoading();
            UIService.showToast('Дані імпортовані успішно!', 'success');
            
            // Перезавантажуємо сторінку
            setTimeout(() => location.reload(), 1000);

        } catch (error) {
            UIService.hideLoading();
            UIService.showToast(`Помилка при імпорті: ${error.message}`, 'error');
        }
    }
}

// Створюємо глобальний сервіс
const downloadService = new DownloadService();

// Функції для HTML
async function downloadPackage(type) {
    await downloadService.downloadPackage(type);
}

async function exportData() {
    await downloadService.exportUserData();
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            await downloadService.importUserData(file);
        }
    };
    input.click();
}

/**
 * Download UI Manager
 * Handles the display and interaction of download options
 */

class DownloadUIManager {
    constructor() {
        this.initialized = false;
    }

    /**
     * Initialize download UI when settings are loaded
     */
    async init() {
        if (this.initialized) return;

        try {
            await this.renderPackageOptions();
            await this.renderDownloadHistory();
            this.initialized = true;
        } catch (error) {
            console.error('Error initializing download UI:', error);
        }
    }

    /**
     * Render package options
     */
    async renderPackageOptions() {
        const container = document.getElementById('packageOptions');
        if (!container) return;

        const packages = await downloadService.getPackageInfo();
        let html = '';

        for (const [key, pkg] of Object.entries(packages)) {
            html += `
                <div class="card hover-scale" style="cursor: pointer; padding: 15px;">
                    <h4 style="margin: 0 0 8px 0; color: var(--neon-cyan);">${pkg.name}</h4>
                    <p style="font-size: 0.85rem; color: var(--neon-text-secondary); margin: 0 0 10px 0;">
                        ${pkg.description}
                    </p>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <span style="font-size: 0.8rem; color: var(--neon-text-tertiary);">
                            Розмір: <strong>${pkg.size}</strong>
                        </span>
                    </div>
                    <div style="margin-bottom: 12px; padding: 8px; background: rgba(0, 217, 255, 0.05); border-radius: 4px;">
                        <p style="font-size: 0.75rem; color: var(--neon-text-tertiary); margin: 0;">
                            ✓ ${pkg.includes.join(' • ')}
                        </p>
                    </div>
                    <button class="btn btn-primary" style="width: 100%; font-size: 0.9rem;" onclick="downloadPackage('${key}')">
                        📥 Завантажити
                    </button>
                </div>
            `;
        }

        container.innerHTML = html;
    }

    /**
     * Render download history
     */
    async renderDownloadHistory() {
        const history = downloadService.getDownloadHistory();
        
        if (history.length === 0) return;

        const container = document.getElementById('downloadHistory');
        if (!container) return;

        let html = `
            <div style="margin-top: 20px; padding: 15px; background: rgba(0, 217, 255, 0.05); border-radius: 8px;">
                <h4 style="margin: 0 0 12px 0; color: var(--neon-cyan);">📋 Історія завантажень</h4>
                <div style="display: flex; flex-direction: column; gap: 8px;">
        `;

        history.slice(0, 5).forEach(item => {
            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: rgba(0, 217, 255, 0.1); border-radius: 4px; font-size: 0.85rem;">
                    <span style="color: var(--neon-text-primary);">
                        <strong>${item.name}</strong> - ${item.date}
                    </span>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    /**
     * Render modifications for KS Steam Launcher
     */
    async renderModifications() {
        const container = document.getElementById('modificationsContainer');
        if (!container) return;

        if (!window.gamesService) return;

        const mods = gamesService.getLauncherMods();
        if (mods.length === 0) {
            container.innerHTML = '<p data-i18n="mods.noAvailable" style="color: var(--neon-text-secondary);">No modifications available</p>';
            return;
        }

        let html = `
            <div style="margin-top: 20px;">
                <h3 data-i18n="mods.title" style="margin: 0 0 15px 0; color: var(--neon-pink);">Modifications for KS Steam</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px;">
        `;

        mods.forEach(mod => {
            html += `
                <div class="card hover-scale" style="padding: 15px;">
                    <img src="${mod.image}" alt="${mod.title}" style="width: 100%; height: 140px; object-fit: cover; border-radius: 6px; margin-bottom: 10px;">
                    <h4 style="margin: 0 0 8px 0; color: var(--neon-cyan);">${mod.title}</h4>
                    <p style="font-size: 0.85rem; color: var(--neon-text-secondary); margin: 0 0 10px 0; min-height: 40px;">
                        ${mod.description}
                    </p>
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: var(--neon-text-tertiary); margin-bottom: 12px;">
                        <span>v${mod.version}</span>
                        <span style="color: var(--neon-pink);">★ ${mod.rating || 4.5}</span>
                    </div>
                    <button class="btn btn-primary" style="width: 100%;" onclick="installModification('${mod.id}')">
                        📦 Install
                    </button>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        container.innerHTML = html;
    }
}

const downloadUIManager = new DownloadUIManager();

// Initialize when settings section is shown
const settingsSection = document.getElementById('settings');
if (settingsSection) {
    const observer = new MutationObserver(() => {
        if (settingsSection.style.display !== 'none') {
            downloadUIManager.init();
        }
    });
    observer.observe(settingsSection, { attributes: true });
}

/**
 * Clear cache
 */
function clearCache() {
    if (!confirm('Очистити весь кеш браузера? Це видалить тимчасові файли.')) {
        return;
    }

    try {
        // Clear service workers
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                registrations.forEach(r => r.unregister());
            });
        }

        // Clear cache storage
        if ('caches' in window) {
            caches.keys().then(cacheNames => {
                cacheNames.forEach(cacheName => {
                    caches.delete(cacheName);
                });
            });
        }

        UIService.showToast('Кеш очищено успішно!', 'success');
    } catch (error) {
        UIService.showToast('Помилка при очищенні кеша', 'error');
    }
}

/**
 * Delete all data
 */
function deleteAllData() {
    const confirmed = confirm(
        'Ви впевнені? Це видалить ВСІ ваші дані, включаючи:\n' +
        '• Акаунт\n' +
        '• Библіотеку ігор\n' +
        '• Налаштування\n\n' +
        'Цю дію неможливо скасувати!'
    );

    if (!confirmed) return;

    const doubleConfirm = prompt(
        'Введіть "ВИДАЛИТИ" для підтвердження остаточного видалення:'
    );

    if (doubleConfirm !== 'ВИДАЛИТИ') {
        UIService.showToast('Видалення скасовано', 'info');
        return;
    }

    try {
        localStorage.removeItem('kssteam_user');
        localStorage.removeItem('kssteam_users');
        localStorage.removeItem('kssteam_settings');
        localStorage.removeItem('kssteam_download_history');

        UIService.showToast('Усі дані видалені. Перезавантажування...', 'success');

        setTimeout(() => {
            location.reload();
        }, 1500);
    } catch (error) {
        UIService.showToast('Помилка при видаленні даних', 'error');
    }
}

// Auto-initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        downloadUIManager.init();
        downloadUIManager.renderModifications();
    });
} else {
    downloadUIManager.init();
    downloadUIManager.renderModifications();
}

/**
 * Install modification
 */
function installModification(modId) {
    const mod = gamesService.getGameById(modId);
    if (!mod) return;

    const confirmed = confirm(`Install "${mod.title}" v${mod.version}?`);
    if (!confirmed) return;

    try {
        // Get installed mods from localStorage
        let installedMods = JSON.parse(localStorage.getItem('kssteam_installed_mods') || '[]');
        
        // Check if already installed
        if (installedMods.find(m => m.id === modId)) {
            UIService.showToast('Modification already installed', 'info');
            return;
        }

        // Add to installed
        installedMods.push({
            id: modId,
            title: mod.title,
            version: mod.version,
            installedDate: new Date().toISOString(),
            enabled: true
        });

        localStorage.setItem('kssteam_installed_mods', JSON.stringify(installedMods));
        UIService.showToast(`"${mod.title}" installed successfully!`, 'success');

        // Refresh modifications display
        downloadUIManager.renderModifications();
    } catch (error) {
        UIService.showToast('Error installing modification', 'error');
        console.error('Error installing mod:', error);
    }
}

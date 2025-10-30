class RipSteam {
    static isEnabled() {
        const extensions = Extensions.installedExtensions;
        return extensions.some(ext => ext.id === 'steamrip-lib');
    }

    static getRipGames() {
        return this.isEnabled() ? RIP_GAMES : {};
    }

    static getDownloadPath(gameId) {
        return `rip-steam/games/${gameId}.zip`;
    }

    static showDownloadButton(gameId) {
        if (!this.isEnabled()) return '';
        
        return `
            <button onclick="event.stopPropagation();RipSteam.downloadGame('${gameId}')" class="rip-download-btn">
                Завантажити з RIP Steam
            </button>
        `;
    }

    static async downloadGame(gameId) {
        if (!this.isEnabled()) {
            alert('Встановіть доповнення RIP Steam');
            return;
        }

        const game = RIP_GAMES[gameId];
        if (!game) return;

        try {
            // Create download link
            const link = document.createElement('a');
            link.href = game.downloadPath;
            link.download = `${game.title}.zip`;
            
            // Add download info
            const info = document.createElement('div');
            info.className = 'download-info';
            info.innerHTML = `
                <h3>Завантаження ${game.title}</h3>
                <p>Розмір: ${game.size}</p>
                <p>Версія: ${game.version}</p>
            `;
            document.body.appendChild(info);
            
            // Start download
            link.click();
            
            // Cleanup
            setTimeout(() => {
                document.body.removeChild(info);
            }, 3000);
            
            // Add to library
            Library.addGame(gameId);
        } catch (error) {
            console.error('Download error:', error);
            alert('Помилка завантаження');
        }
    }
}

const Library = {
    games: [],
    currentFilter: 'all',
    selectedGame: null,

    init() {
        this.loadGames();
        this.renderGamesList();
        this.setupSearchListener();
    },

    loadGames() {
        // Get user's games from localStorage
        const user = User.getCurrent();
        if (!user || !user.games) {
            this.games = [];
            return;
        }
        
        // Load all available games and filter by user's purchases
        const allGames = Games.getGames();
        this.games = allGames.filter(game => user.games.includes(game.id));
        
        if (this.games.length === 0) {
            this.games = allGames.slice(0, 5); // Demo: show first 5 games
        }
    },

    renderGamesList() {
        const listContainer = document.getElementById('libraryGamesList');
        if (!listContainer) return;

        const filteredGames = this.getFilteredGames();
        
        if (filteredGames.length === 0) {
            listContainer.innerHTML = '<p style="padding: 10px; text-align: center;">Немає ігор</p>';
            return;
        }

        listContainer.innerHTML = filteredGames.map(game => `
            <div class="library-game-item" onclick="Library.selectGame('${game.id}')">
                <img src="${game.image}" alt="${game.title}" class="library-game-thumb">
                <div class="library-game-info">
                    <div class="library-game-title">${game.title}</div>
                    <div class="library-game-status">${game.installed ? 'Встановлено' : 'Невстановлено'}</div>
                </div>
            </div>
        `).join('');
    },

    getFilteredGames() {
        let filtered = this.games;

        if (this.currentFilter === 'installed') {
            filtered = filtered.filter(g => g.installed);
        } else if (this.currentFilter === 'notinstalled') {
            filtered = filtered.filter(g => !g.installed);
        } else if (this.currentFilter === 'recent') {
            filtered = filtered.sort((a, b) => (b.lastPlayed || 0) - (a.lastPlayed || 0));
        }

        // Apply search filter
        const searchInput = document.getElementById('librarySearch');
        if (searchInput && searchInput.value) {
            const query = searchInput.value.toLowerCase();
            filtered = filtered.filter(g => g.title.toLowerCase().includes(query));
        }

        return filtered;
    },

    filterGames(filter) {
        this.currentFilter = filter;
        
        // Update button states
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.renderGamesList();
    },

    selectGame(gameId) {
        this.selectedGame = this.games.find(g => g.id === gameId);
        
        const detailContainer = document.getElementById('libraryGameDetail');
        if (!detailContainer || !this.selectedGame) return;

        detailContainer.innerHTML = `
            <div class="game-detail">
                <img src="${this.selectedGame.image}" alt="${this.selectedGame.title}" class="detail-image">
                <div class="detail-content">
                    <h2>${this.selectedGame.title}</h2>
                    <p class="detail-description">${this.selectedGame.description || 'Немає опису'}</p>
                    <div class="detail-stats">
                        <div class="stat">
                            <span class="stat-label">Жанр:</span>
                            <span class="stat-value">${this.selectedGame.genre || 'Невідомо'}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Розробник:</span>
                            <span class="stat-value">${this.selectedGame.developer || 'Невідомо'}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Статус:</span>
                            <span class="stat-value">${this.selectedGame.installed ? '✓ Встановлено' : '○ Невстановлено'}</span>
                        </div>
                    </div>
                    <div class="detail-actions">
                        ${this.selectedGame.installed 
                            ? `<button class="btn-play" onclick="Library.playGame('${this.selectedGame.id}')">Грати</button>`
                            : `<button class="btn-install" onclick="Library.installGame('${this.selectedGame.id}')">Встановити</button>`
                        }
                    </div>
                </div>
            </div>
        `;
    },

    playGame(gameId) {
        alert(`Запуск гри: ${gameId}`);
        // TODO: Implement game launch
    },

    installGame(gameId) {
        alert(`Встановлення гри: ${gameId}`);
        // TODO: Implement game installation
    },

    setupSearchListener() {
        const searchInput = document.getElementById('librarySearch');
        if (searchInput) {
            searchInput.addEventListener('keyup', () => this.renderGamesList());
        }
    }
};

// Initialize library when library section becomes active
document.addEventListener('DOMContentLoaded', function() {
    // Watch for section changes
    const navLinks = document.querySelectorAll('[data-section]');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (this.dataset.section === 'library') {
                setTimeout(() => Library.init(), 100);
            }
        });
    });
    
    // Initial library setup if needed
    if (typeof Library !== 'undefined') {
        Library.init();
    }
});

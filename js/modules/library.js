/**
 * Library Module
 * Handles user game library
 */

class LibraryService {
    /**
     * Get user library
     */
    static getUserLibrary(userId) {
        const user = userService.getUserProfile(userId);
        if (!user || !user.games) return [];

        return user.games.map(gameId => gamesService.getGameById(gameId)).filter(game => game);
    }

    /**
     * Add game to library
     */
    static addGameToLibrary(userId, gameId) {
        userService.addGameToLibrary(userId, gameId);
        UIService.showToast('Game added to your library', 'success');
    }

    /**
     * Remove game from library
     */
    static removeGameFromLibrary(userId, gameId) {
        const user = userService.getUserProfile(userId);
        if (!user || !user.games) return;

        user.games = user.games.filter(id => id !== gameId);
        userService.updateProfile(userId, { games: user.games });
        UIService.showToast('Game removed from library', 'success');
    }

    /**
     * Display library
     */
    static displayLibrary(userId) {
        const library = this.getUserLibrary(userId);
        
        const allGamesEl = document.getElementById('allGames');
        if (allGamesEl) {
            if (library.length === 0) {
                allGamesEl.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                        <p style="color: var(--neon-text-tertiary); font-size: 1.1rem;">No games in your library yet.</p>
                        <a href="#store" class="btn btn-primary" style="margin-top: 20px;">Browse Store</a>
                    </div>
                `;
            } else {
                allGamesEl.innerHTML = library.map(game => gamesService.renderGameCard(game)).join('');
            }
        }
    }

    /**
     * Mark game as favorite
     */
    static toggleFavorite(userId, gameId) {
        const user = userService.getUserProfile(userId);
        if (!user) return;

        if (!user.favorites) user.favorites = [];

        const index = user.favorites.indexOf(gameId);
        if (index === -1) {
            user.favorites.push(gameId);
            UIService.showToast('Added to favorites', 'success');
        } else {
            user.favorites.splice(index, 1);
            UIService.showToast('Removed from favorites', 'success');
        }

        userService.updateProfile(userId, { favorites: user.favorites });
    }

    /**
     * Get favorite games
     */
    static getFavoriteGames(userId) {
        const user = userService.getUserProfile(userId);
        if (!user || !user.favorites) return [];

        return user.favorites.map(gameId => gamesService.getGameById(gameId)).filter(game => game);
    }

    /**
     * Get installed games
     */
    static getInstalledGames(userId) {
        const user = userService.getUserProfile(userId);
        if (!user || !user.installed) return [];

        return user.installed.map(gameId => gamesService.getGameById(gameId)).filter(game => game);
    }

    /**
     * Mark game as installed
     */
    static markAsInstalled(userId, gameId) {
        const user = userService.getUserProfile(userId);
        if (!user) return;

        if (!user.installed) user.installed = [];
        if (!user.installed.includes(gameId)) {
            user.installed.push(gameId);
            userService.updateProfile(userId, { installed: user.installed });
            UIService.showToast('Game marked as installed', 'success');
        }
    }

    /**
     * Uninstall game
     */
    static uninstallGame(userId, gameId) {
        const user = userService.getUserProfile(userId);
        if (!user || !user.installed) return;

        user.installed = user.installed.filter(id => id !== gameId);
        userService.updateProfile(userId, { installed: user.installed });
        UIService.showToast('Game marked as uninstalled', 'success');
    }
}

// Initialize library when user is logged in and library section is viewed
document.addEventListener('DOMContentLoaded', () => {
    if (app && app.user) {
        // Display library when section loads
        const librarySection = document.getElementById('library');
        if (librarySection) {
            const observer = new MutationObserver(() => {
                if (librarySection.style.display !== 'none') {
                    LibraryService.displayLibrary(app.user.id);
                }
            });
            observer.observe(librarySection, { attributes: true });
        }
    }
});

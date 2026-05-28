/**
 * Games Module
 * Handles games data and display
 */

class GamesService {
    constructor() {
        this.games = [];
        this.filteredGames = [];
    }

    /**
     * Load games from data file
     */
    async loadGames() {
        try {
            const response = await fetch('data/games.json');
            this.games = await response.json();
            this.filteredGames = [...this.games];
            return this.games;
        } catch (error) {
            console.error('Failed to load games:', error);
            // Load demo games if file doesn't exist
            return this.getDemoGames();
        }
    }

    /**
     * Get demo games for testing
     */
    getDemoGames() {
        return [
            {
                id: 1,
                title: 'KS Isaac',
                description: 'Roguelike game in the style of The Binding of Isaac',
                image: 'assets/games/ks-isaac.png',
                price: 9.99,
                rating: 4.5,
                tags: ['roguelike', 'indie', 'challenging'],
                releaseDate: '2024-01-15',
                developer: 'KS Games'
            },
            {
                id: 2,
                title: 'Kykishield',
                description: 'Game launcher and management platform',
                image: 'assets/games/kykishield.png',
                price: 0,
                rating: 4.0,
                tags: ['launcher', 'utility'],
                releaseDate: '2024-01-01',
                developer: 'KS Games'
            },
            {
                id: 3,
                title: 'Solo Up',
                description: 'Skill-based puzzle game',
                image: 'assets/games/solo-up.png',
                price: 4.99,
                rating: 4.2,
                tags: ['puzzle', 'indie'],
                releaseDate: '2024-02-01',
                developer: 'KS Games'
            }
        ];
    }

    /**
     * Get all games
     */
    getAllGames() {
        return this.games;
    }

    /**
     * Get games by type
     */
    getGamesByType(type = 'game') {
        return this.games.filter(game => 
            (game.type || 'game') === type
        );
    }

    /**
     * Get modifications only
     */
    getModifications() {
        return this.getGamesByType('mod');
    }

    /**
     * Get launcher modifications
     */
    getLauncherMods() {
        return this.getModifications().filter(mod => mod.forLauncher);
    }

    /**
     * Get game by ID
     */
    getGameById(id) {
        return this.games.find(game => game.id === id);
    }

    /**
     * Search games
     */
    searchGames(query) {
        return this.games.filter(game =>
            game.title.toLowerCase().includes(query.toLowerCase()) ||
            game.description.toLowerCase().includes(query.toLowerCase()) ||
            (game.tags && game.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
        );
    }

    /**
     * Filter games by tag
     */
    filterByTag(tag) {
        return this.games.filter(game =>
            game.tags && game.tags.includes(tag)
        );
    }

    /**
     * Sort games
     */
    sortGames(games, sortBy = 'rating') {
        const sorted = [...games];
        switch (sortBy) {
            case 'price':
                return sorted.sort((a, b) => a.price - b.price);
            case 'rating':
                return sorted.sort((a, b) => b.rating - a.rating);
            case 'date':
                return sorted.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
            case 'name':
                return sorted.sort((a, b) => a.title.localeCompare(b.title));
            default:
                return sorted;
        }
    }

    /**
     * Get featured games
     */
    getFeaturedGames(limit = 6) {
        return this.games.slice(0, limit);
    }

    /**
     * Get best sellers
     */
    getBestSellers(limit = 6) {
        return this.sortGames(this.games, 'rating').slice(0, limit);
    }

    /**
     * Render game card HTML
     */
    renderGameCard(game) {
        const stars = this.renderStars(game.rating);
        const priceText = game.price === 0 ? 'Free' : `$${game.price.toFixed(2)}`;
        
        return `
            <div class="game-card animate-fadeInUp" data-game-id="${game.id}">
                <img src="${game.image}" alt="${game.title}" class="game-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22150%22%3E%3Crect fill=%22%23384%22 width=%22200%22 height=%22150%22/%3E%3C/svg%3E'">
                <div class="game-info">
                    <h3 class="game-title">${game.title}</h3>
                    <p class="game-description">${game.description.substring(0, 60)}...</p>
                    <div class="game-footer">
                        <span class="game-price">${priceText}</span>
                        <div class="game-rating">${stars}</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render star rating
     */
    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '★'.repeat(fullStars);
        if (hasHalfStar) stars += '☆';
        stars += '☆'.repeat(5 - Math.ceil(rating));
        return stars;
    }
}

// Create global games service
const gamesService = new GamesService();

// Auto-load games when document is ready
document.addEventListener('DOMContentLoaded', () => {
    if (window.gamesService && !window.gamesService.games.length) {
        gamesService.loadGames().then(() => {
            renderFeaturedGames();
        });
    }
});

// Also try on immediate load in case DOM is already ready
if (document.readyState === 'loading') {
    // Document is still loading, wait
} else {
    // Document already loaded, trigger games load
    if (window.gamesService && !window.gamesService.games.length) {
        gamesService.loadGames().then(() => {
            renderFeaturedGames();
        });
    }
}

// Render featured games
function renderFeaturedGames() {
    const container = document.getElementById('featuredGames');
    if (!container) return;

    const featured = gamesService.getFeaturedGames(6);
    if (featured.length === 0) return;

    container.innerHTML = featured.map(game => gamesService.renderGameCard(game)).join('');

    // Add click handlers
    container.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', () => {
            const gameId = parseInt(card.getAttribute('data-game-id'));
            showGameDetails(gameId);
        });
    });
}

// Show game details
function showGameDetails(gameId) {
    const game = gamesService.getGameById(gameId);
    if (!game) return;

    alert(`${game.title}\n\n${game.description}\n\nPrice: $${game.price}\nRating: ${game.rating}/5`);
}

// Make loadGames accessible
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { gamesService, renderFeaturedGames };
}

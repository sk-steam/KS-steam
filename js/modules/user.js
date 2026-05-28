/**
 * User Module
 * Handles user profile and data
 */

class UserService {
    constructor() {
        this.currentUser = null;
    }

    /**
     * Set current user
     */
    setCurrentUser(user) {
        this.currentUser = user;
    }

    /**
     * Get user profile
     */
    getUserProfile(userId) {
        const users = localStorage.getItem('kssteam_users');
        if (!users) return null;

        const usersList = JSON.parse(users);
        return usersList.find(u => u.id === userId);
    }

    /**
     * Update user profile
     */
    updateProfile(userId, updates) {
        const users = JSON.parse(localStorage.getItem('kssteam_users') || '[]');
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updates };
            localStorage.setItem('kssteam_users', JSON.stringify(users));
            return users[userIndex];
        }
        return null;
    }

    /**
     * Add game to user library
     */
    addGameToLibrary(userId, gameId) {
        const user = this.getUserProfile(userId);
        if (!user) return;

        if (!user.games) user.games = [];
        if (!user.games.includes(gameId)) {
            user.games.push(gameId);
            this.updateProfile(userId, { games: user.games });
        }
    }

    /**
     * Add friend
     */
    addFriend(userId, friendId) {
        const user = this.getUserProfile(userId);
        if (!user) return;

        if (!user.friends) user.friends = [];
        if (!user.friends.includes(friendId)) {
            user.friends.push(friendId);
            this.updateProfile(userId, { friends: user.friends });
        }
    }

    /**
     * Get user stats
     */
    getUserStats(userId) {
        const user = this.getUserProfile(userId);
        if (!user) return null;

        return {
            gamesOwned: (user.games || []).length,
            playtime: user.playtime || 0,
            friends: (user.friends || []).length,
            level: user.level || 1,
            joinDate: user.createdAt
        };
    }

    /**
     * Format playtime
     */
    formatPlaytime(hours) {
        if (hours < 1) return '< 1h';
        if (hours < 24) return `${Math.floor(hours)}h`;
        const days = Math.floor(hours / 24);
        return `${days}d`;
    }
}

// Create global user service
const userService = new UserService();

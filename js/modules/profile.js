/**
 * Profile Module
 * Handles user profile display and management
 */

class ProfileService {
    /**
     * Display user profile
     */
    static displayProfile(user) {
        if (!user) return;

        // Update avatar
        const avatar = document.getElementById('profileAvatar');
        if (avatar) avatar.textContent = user.username.charAt(0).toUpperCase();

        // Update name
        const nameEl = document.getElementById('profileName');
        if (nameEl) nameEl.textContent = user.username;

        // Get and display stats
        const stats = userService.getUserStats(user.id);
        if (stats) {
            const gamesEl = document.getElementById('gamesCount');
            const playtimeEl = document.getElementById('playtimeCount');
            const friendsEl = document.getElementById('friendsCount');
            const levelEl = document.getElementById('levelCount');

            if (gamesEl) gamesEl.textContent = stats.gamesOwned;
            if (playtimeEl) playtimeEl.textContent = stats.playtime;
            if (friendsEl) friendsEl.textContent = stats.friends;
            if (levelEl) levelEl.textContent = stats.level;
        }
    }

    /**
     * Edit profile
     */
    static editProfile(userId, updates) {
        const updated = userService.updateProfile(userId, updates);
        if (updated) {
            UIService.showToast('Profile updated successfully', 'success');
            ProfileService.displayProfile(updated);
        }
    }

    /**
     * Change password
     */
    static changePassword(userId, oldPassword, newPassword) {
        const user = userService.getUserProfile(userId);
        if (!user) return;

        // Verify old password (in production, this should be done server-side)
        const hashedOldPassword = authService.hashPassword(oldPassword);
        if (user.password !== hashedOldPassword) {
            UIService.showToast('Current password is incorrect', 'error');
            return false;
        }

        // Update password
        const hashedNewPassword = authService.hashPassword(newPassword);
        userService.updateProfile(userId, { password: hashedNewPassword });
        UIService.showToast('Password changed successfully', 'success');
        return true;
    }

    /**
     * Get profile data
     */
    static getProfileData(userId) {
        const user = userService.getUserProfile(userId);
        const stats = userService.getUserStats(userId);

        return {
            user,
            stats
        };
    }
}

// Initialize profile when user is logged in
document.addEventListener('DOMContentLoaded', () => {
    if (app && app.user) {
        ProfileService.displayProfile(app.user);
    }
});

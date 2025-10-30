class Profile {
    static getDefaultAvatar() {
        return "asset/defolt-ava.jpg";
    }

    static getUserData() {
        const username = localStorage.getItem('currentUser');
        if (!username) return null;

        const log = Auth.getLogFolder();
        return log.users.find(u => u.username === username);
    }

    static updateProfile() {
        const profileSection = document.getElementById('profileSection');
        const user = this.getUserData();

        if (!user) {
            profileSection.innerHTML = `
                <div class="steam-profile-bg">
                    <div class="steam-profile-container">
                        <div class="steam-profile-empty">
                            <img src="${this.getDefaultAvatar()}" alt="Avatar" class="steam-profile-avatar-img">
                            <h2>Увійдіть, щоб переглянути профіль</h2>
                        </div>
                    </div>
                </div>`;
            return;
        }

        const library = Library.getUserLibrary();
        const gamesCount = library.length;

        profileSection.innerHTML = `
            <div class="steam-profile-bg">
                <div class="steam-profile-container">
                    <div class="steam-profile-header">
                        <div class="steam-profile-avatar">
                            <img src="${user.avatar || this.getDefaultAvatar()}" alt="Avatar" class="steam-profile-avatar-img">
                        </div>
                        <div class="steam-profile-info">
                            <h2 class="steam-profile-name">${user.username}</h2>
                            <div class="steam-profile-status online">В мережі</div>
                            <div class="steam-profile-balance">Баланс: 0,00$</div>
                            <div class="steam-profile-stats">
                                <div class="stat">
                                    <span class="stat-value">${gamesCount}</span>
                                    <span class="stat-label">Ігор</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-value">0</span>
                                    <span class="stat-label">Друзів</span>
                                </div>
                            </div>
                            <div class="steam-profile-actions">
                                <button onclick="Profile.openSettings()" class="profile-btn primary">Налаштування</button>
                            </div>
                        </div>
                    </div>
                    <div class="steam-profile-details">
                        <div class="profile-section">
                            <h3>Інформація</h3>
                            <p>Email: ${user.email}</p>
                        </div>
                        <div class="profile-section">
                            <h3>Останні ігри</h3>
                            <div class="recent-games">
                                ${library.length > 0 ? 
                                    library.map(game => `<div class="recent-game">${game}</div>`).join('') :
                                    '<p class="empty-message">Немає ігор у бібліотеці</p>'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
    }

    static openSettings() {
        Settings.openSettings('account');
    }

    static previewAvatar(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert('Файл завеликий. Максимальний розмір: 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const avatarPreview = document.getElementById('avatarPreview');
            if (avatarPreview) {
                avatarPreview.src = e.target.result;
                // Зберігаємо base64 зображення в тимчасове сховище
                localStorage.setItem('tempAvatar', e.target.result);
            }
        };
        reader.readAsDataURL(file);
    }

    static saveSettings() {
        const user = this.getUserData();
        if (!user) return;

        // Отримуємо нові дані
        const newData = {
            ...user,
            username: document.getElementById('settingsUsername').value.trim() || user.username,
            email: document.getElementById('settingsEmail').value.trim() || user.email
        };

        // Додаємо нову аватарку, якщо вона є
        const tempAvatar = localStorage.getItem('tempAvatar');
        if (tempAvatar) {
            newData.avatar = tempAvatar;
            localStorage.removeItem('tempAvatar'); // Очищаємо тимчасове сховище
        }

        // Зберігаємо новий пароль, якщо він був введений
        const newPassword = document.getElementById('settingsPassword').value;
        if (newPassword) {
            newData.password = newPassword;
        }

        // Зберігаємо оновлені дані
        const log = Auth.getLogFolder();
        const userIndex = log.users.findIndex(u => u.username === localStorage.getItem('currentUser'));
        if (userIndex !== -1) {
            log.users[userIndex] = newData;
            Auth.setLogFolder(log);
            localStorage.setItem('currentUser', newData.username);
        }

        Modal.close('profileSettingsModal');
        this.updateProfile();
        UI.updateUserState();
        alert('Зміни збережено!');
    }

    static initProfileHandlers() {
        const form = document.getElementById('profileSettingsForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSettingsSave(e));
        }
    }
}

// Ініціалізація при завантаженні сторінки
document.addEventListener('DOMContentLoaded', () => {
    // Update profile when switching to profile section
    document.querySelector('a[href="#profile"]').addEventListener('click', () => {
        Profile.updateProfile();
    });

    Profile.initProfileHandlers();
});

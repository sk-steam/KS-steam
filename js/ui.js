class UI {
    static updateUserState() {
        const currentUser = localStorage.getItem('currentUser');
        const userActions = document.getElementById('userActions');

        if (currentUser) {
            const userData = Auth.getLogFolder().users.find(u => u.username === currentUser);
            const avatarUrl = userData?.avatar || "asset/defolt-ava.jpg";
            userActions.innerHTML = `
                <a href="#profile" class="user-info" onclick="UI.switchSection('profile')">
                    <img src="${avatarUrl}" class="user-avatar" alt="Avatar">
                    <span class="user-name">${currentUser}</span>
                    <span class="user-balance">0,00$</span>
                </a>
            `;
        } else {
            userActions.innerHTML = `
                <button id="loginBtn" data-lang="login">${Lang.get('login')}</button>
                <button id="registerBtn" data-lang="register">${Lang.get('register')}</button>
            `;
            // Rebind event listeners for login/register buttons
            document.getElementById('loginBtn')?.addEventListener('click', () => Modal.open('loginModal'));
            document.getElementById('registerBtn')?.addEventListener('click', () => Modal.open('registerModal'));
        }
    }

    static switchSection(sectionId) {
        // Приберемо активний клас з усіх секцій
        document.querySelectorAll('.nav-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Активуємо потрібну секцію
        const section = document.getElementById(`${sectionId}Section`);
        if (section) {
            section.classList.add('active');
            
            // Оновлюємо UI відповідної секції
            if (sectionId === 'profile') {
                Profile.updateProfile();
            } else if (sectionId === 'library') {
                Library.updateLibraryUI();
            }
        }

        // Оновлюємо активне посилання в навігації
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            }
        });

        // Оновлюємо URL без перезавантаження сторінки
        window.location.hash = sectionId;
    }

    static handleGameUrl(gameId) {
        const game = GAME_DATA[gameId];
        if (game && game.isHtml) {
            window.open(game.path, '_blank');
        }
    }

    static initNavigation() {
        // Handle navigation clicks
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                UI.switchSection(section);
            });
        });

        // Handle URL hash changes
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1);
            if (GAME_DATA[hash]) {
                this.handleGameUrl(hash);
            } else {
                this.switchSection(hash || 'store');
            }
        });

        // Check initial hash
        const initialHash = window.location.hash.slice(1);
        if (GAME_DATA[initialHash]) {
            this.handleGameUrl(initialHash);
        } else {
            this.switchSection(initialHash || 'store');
        }

        // Initialize store games on page load
        Games.renderStoreGames();
    }

    static initStoreNavigation() {
        document.querySelectorAll('.store-nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.getAttribute('href').split('/')[1];
                UI.switchStoreSection(section);
            });
        });
    }

    static switchStoreSection(section) {
        // Update navigation
        document.querySelectorAll('.store-nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(section)) {
                item.classList.add('active');
            }
        });

        // Update content
        document.querySelectorAll('.store-content-section').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`store${section.charAt(0).toUpperCase() + section.slice(1)}Content`).classList.add('active');
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    UI.initNavigation();
    UI.updateUserState();
    UI.initStoreNavigation();
});

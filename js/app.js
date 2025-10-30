// Game data
const games = [
    {
        id: 'ks-isaac',
        title: 'KS Isaac',
        image: 'assets/games/ks-isaac.png',
        description: 'Roguelike гра в стилі The Binding of Isaac'
    },
    {
        id: 'kykishield',
        title: 'Kykishield Launcher',
        image: 'assets/games/kykishield.png',
        description: 'Лаунчер для запуску ігор'
    },
    // Add other games...
];

// User management
const getLogFolder = () => {
    let log = localStorage.getItem('log');
    if (!log) {
        log = { users: [] };
        localStorage.setItem('log', JSON.stringify(log));
    }
    return JSON.parse(log);
};

const setLogFolder = (data) => {
    localStorage.setItem('log', JSON.stringify(data));
};

// Modal handlers
const openModal = (id) => {
    document.getElementById(id).classList.add('active');
};

const closeModal = (id) => {
    document.getElementById(id).classList.remove('active');
};

// Auth handlers
document.getElementById('loginForm').onsubmit = (e) => {
    e.preventDefault();
    const username = e.target[0].value;
    const password = e.target[1].value;
    
    const log = getLogFolder();
    const user = log.users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', username);
        closeModal('loginModal');
        updateUI();
    } else {
        document.getElementById('loginError').textContent = 'Невірний логін або пароль';
    }
};

document.getElementById('registerForm').onsubmit = (e) => {
    e.preventDefault();
    const username = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const confirmPassword = e.target[3].value;
    
    if (password !== confirmPassword) {
        document.getElementById('registerError').textContent = 'Паролі не співпадають';
        return;
    }
    
    const log = getLogFolder();
    if (log.users.some(u => u.username === username)) {
        document.getElementById('registerError').textContent = 'Користувач вже існує';
        return;
    }
    
    log.users.push({ username, email, password });
    setLogFolder(log);
    closeModal('registerModal');
    alert('Реєстрація успішна!');
};

// Main app functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI
    updateUI();
    bindEventListeners();
});

// Event binding
function bindEventListeners() {
    // Profile settings form
    document.getElementById('profileSettingsForm').onsubmit = async (e) => {
        e.preventDefault();
        const data = {
            username: e.target['settings-username'].value.trim(),
            email: e.target['settings-email'].value.trim(),
            avatar: e.target['settings-avatar'].value.trim()
        };
        
        if (await updateUserProfile(data)) {
            closeModal('profileSettingsModal');
            showProfileTab();
        }
    };

    // Game installation buttons
    document.querySelectorAll('[data-game-install]').forEach(btn => {
        btn.onclick = async (e) => {
            const gameKey = e.target.dataset.gameInstall;
            const button = e.target;
            
            button.disabled = true;
            button.textContent = 'ЗАВАНТАЖЕННЯ...';
            
            if (await GameManager.installGame(gameKey)) {
                button.textContent = 'ЗАПУСТИТИ';
                button.onclick = () => GameManager.launchGame(gameKey);
            } else {
                button.textContent = 'ПОМИЛКА';
                setTimeout(() => {
                    button.textContent = 'ІНСТАЛЮВАТИ';
                    button.disabled = false;
                }, 2000);
            }
        };
    });

    // Navigation
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.onclick = (e) => {
            e.preventDefault();
            navigateTo(e.target.dataset.section);
        };
    });
}

// UI update functions
function updateUI() {
    const user = UserManager.getCurrentUser();
    updateHeader(user);
    updateCurrentSection();
}

window.addEventListener('userStateChanged', updateUI);

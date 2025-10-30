// Library management
class Library {
    static addGame(gameId, silent = false) {
        const user = localStorage.getItem('currentUser');
        if (!user) {
            if (!silent) alert('Увійдіть, щоб додати гру до бібліотеки');
            return false;
        }

        let library = JSON.parse(localStorage.getItem('userLibrary') || '{}');
        if (!library[user]) {
            library[user] = [];
        }

        if (!library[user].includes(gameId)) {
            library[user].push(gameId);
            localStorage.setItem('userLibrary', JSON.stringify(library));
            this.updateLibraryUI();
            if (!silent) alert('Гру додано до бібліотеки!');
            return true;
        }
        return false;
    }

    static getUserLibrary() {
        const user = localStorage.getItem('currentUser');
        if (!user) return [];
        
        const library = JSON.parse(localStorage.getItem('userLibrary') || '{}');
        return library[user] || [];
    }

    static updateLibraryUI() {
        const libraryGames = document.getElementById('libraryGames');
        if (!libraryGames) return;

        const gameIds = this.getUserLibrary();
        const allGames = { ...GAME_DATA, ...RIP_GAMES };

        if (gameIds.length === 0) {
            libraryGames.innerHTML = '<p class="empty-library">Ваша бібліотека порожня</p>';
            return;
        }

        libraryGames.innerHTML = gameIds.map(id => {
            const game = allGames[id];
            if (!game) return '';
            
            return `
                <div class="game-card">
                    <img src="${game.image}" alt="${game.title}">
                    <div class="game-info">
                        <h2>${game.title}</h2>
                        <p>${game.description}</p>
                        <div class="game-buttons">
                            ${game.downloadPath ? 
                                `<button onclick="RipSteam.downloadGame('${id}')">Завантажити</button>` :
                                `<button onclick="Library.launchGame('${id}')">Запустити</button>`
                            }
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    static init() {
        // Add auto-add games to library silently
        const user = localStorage.getItem('currentUser');
        if (user) {
            Object.values(GAME_DATA)
                .filter(game => game.autoAdd)
                .forEach(game => this.addGame(game.id, true));
        }
    }

    static launchGame(gameId) {
        const game = GAME_DATA[gameId];
        if (!game) return;

        if (game.isBundle) {
            this.showBundleDialog(game);
            return;
        }

        if (game.path?.endsWith('.exe')) {
            this.launchProgram(game.path);
            return;
        }

        if (game.isHtml) {
            window.location.hash = gameId;
            window.open(game.path, '_blank');
        } else {
            alert(`Запуск гри: ${game.title}`);
        }
    }

    static isDownloaded(gameId) {
        const downloads = JSON.parse(localStorage.getItem('downloadedPrograms') || '{}');
        const user = localStorage.getItem('currentUser');
        return user && downloads[user]?.includes(gameId);
    }

    static markAsDownloaded(gameId) {
        const user = localStorage.getItem('currentUser');
        if (!user) return;

        let downloads = JSON.parse(localStorage.getItem('downloadedPrograms') || '{}');
        if (!downloads[user]) {
            downloads[user] = [];
        }
        if (!downloads[user].includes(gameId)) {
            downloads[user].push(gameId);
            localStorage.setItem('downloadedPrograms', JSON.stringify(downloads));
        }
    }

    static showBundleDialog(bundle) {
        const modal = document.getElementById('gameModal');
        const content = document.getElementById('gameDetails');
        
        content.innerHTML = `
            <h2>${bundle.title}</h2>
            <p>${bundle.description}</p>
            <div class="bundle-programs">
                ${bundle.programs.map(prog => `
                    <div class="bundle-program">
                        <img src="${prog.image}" alt="${prog.title}">
                        <h3>${prog.title}</h3>
                        <p>${prog.description}</p>
                        <button onclick="Library.${this.isDownloaded(prog.id) ? 'launchProgram' : 'downloadProgram'}('${prog.id}', '${prog.path}')">
                            ${this.isDownloaded(prog.id) ? 'Запустити' : 'Завантажити'}
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
        
        Modal.open('gameModal');
    }

    static async downloadProgram(gameId, path) {
        try {
            const progress = document.createElement('div');
            progress.className = 'download-progress';
            progress.innerHTML = `
                <div class="progress-content">
                    <div class="progress-bar"></div>
                    <div class="progress-text">Завантаження ${path.split('/').pop()}</div>
                    <div class="progress-percent">0%</div>
                </div>`;
            document.body.appendChild(progress);

            // Create download link
            const link = document.createElement('a');
            link.href = path;
            link.download = path.split('/').pop();
            
            // Simulate download progress
            let percent = 0;
            const interval = setInterval(() => {
                percent += 1;
                const progressBar = progress.querySelector('.progress-bar');
                const progressPercent = progress.querySelector('.progress-percent');
                if (progressBar && progressPercent) {
                    progressBar.style.width = `${percent}%`;
                    progressPercent.textContent = `${percent}%`;
                }
                
                if (percent >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        document.body.removeChild(progress);
                        this.markAsDownloaded(gameId);
                        this.showBundleDialog(GAME_DATA['ksa-bundle']);
                        link.click(); // Start actual download
                    }, 500);
                }
            }, 50);

        } catch (error) {
            console.error('Download error:', error);
            alert('Помилка завантаження');
        }
    }

    static launchProgram(path) {
        // В реальному застосунку тут був би код для запуску програми
        alert(`Запуск програми: ${path}`);
    }
}

// Game data object
const GAME_DATA = {
    'KS Isaac': {
        id: 'KS Isaac',
        image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/250900/capsule_616x353.jpg?t=1731977365',
        title: 'KS Isaac',
        description: 'Roguelike-гра про Айзека, що тікає від матері.'
    },
    'Kykishield Launcher': {
        id: 'Kykishield Launcher',
        image: 'https://sdmntprpolandcentral.oaiusercontent.com/files/00000000-21ec-620a-a28b-37135ee5ef04/raw?se=2025-07-03T20%3A48%3A03Z&sp=r&sv=2024-08-04&sr=b&scid=71af0053-3ef7-5d37-9390-38d952822bc8&skoid=76024c37-11e2-4c92-aa07-7e519fbe2d0f&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-07-03T19%3A38%3A48Z&ske=2025-07-04T19%3A38%3A48Z&sks=b&skv=2024-08-04&sig=IW3qLtLFRTf6NDnYKlk%2B6yEoYKtCyOXh%2BnItnDBA8oA%3D',
        title: 'Kykishield Launcher',
        description: 'Kykishield Launcher — зручний, багатофункціональний, оновлюваний лаунчер для Minecraft.'
    },
    'KS_okey_translate': {
        id: 'KS_okey_translate',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSx2CWjDn0iof-V_bt61pC3rqr-uKsJJ8qdbg&s',
        title: 'KS_okey_translate',
        description: 'Переклад мовлення з субтитрами та озвучкою в реальному часі'
    },
    'Solo Up Game': {
        id: 'Solo Up Game',
        image: 'asset/solo_up.png',
        title: 'Solo Up Game',
        description: 'немає'
    },
    'KS-Auto-Click': {
        id: 'KS-Auto-Click',
        image: 'asset/KS-Auto-Click.png',
        title: 'KS-Auto-Click',
        description: 'Простий автокликер для автоматизації повторюваних завдань'
    },
    'rise-of-nations-reforged': {
        id: 'rise-of-nations-reforged',
        title: 'Rise of Nations: Reforged',
        image: 'asset/ronr.png',
        description: 'Оновлена версія класичної стратегії Rise of Nations з покращеною графікою та новим контентом',
        isHtml: true,
        path: 'RONR/index.html',
        autoAdd: true // Automatically add to library
    },
    'ksa-bundle': {
        id: 'ksa-bundle',
        title: 'KSA Tools Bundle',
        image: 'asset/ksa.ico',
        description: 'Пакет програм KSA: включає KSA-TM (продвинутий диспетчер завдань) та Welder (потужний антивірус)',
        isBundle: true,
        programs: [
            {
                id: 'ksa-tm',
                title: 'KSA Task Manager',
                image: 'asset/ksa.ico',
                description: 'Продвинута версія диспетчера завдань з розширеними можливостями',
                path: 'program/KSA/KSA-TM.exe'
            },
            {
                id: 'welder',
                title: 'Welder Antivirus',
                image: 'asset/welding.ico',
                description: 'Потужний антивірус, що знищує 90-95% вірусів та інших загроз',
                path: 'program/KSA/welder.exe'
            }
        ],
        autoAdd: true
    }
};

// Global function for adding to library
function addToLibrary(gameId) {
    Library.addGame(gameId);
}

class Games {
    static async loadGames() {
        try {
            const response = await fetch('data/games.json');
            const data = await response.json();
            return data.games;
        } catch (error) {
            console.error('Error loading games:', error);
            return [];
        }
    }

    static async renderGames() {
        const container = document.getElementById('storeGames');
        const games = await this.loadGames();

        container.innerHTML = games.map(game => `
            <div class="game-card" onclick="openGameDetails('${game.id}')">
                <img src="${game.image}" alt="${game.title}">
                <div class="game-info">
                    <h2>${game.title}</h2>
                    <p>${game.description}</p>
                    <button onclick="event.stopPropagation();addToLibrary('${game.id}')">
                        Додати у бібліотеку
                    </button>
                </div>
            </div>
        `).join('');
    }

    static renderStoreGames() {
        const container = document.getElementById('storeGames');
        if (!container) return;

        container.innerHTML = Object.values(GAME_DATA).map(game => `
            <div class="game-card" onclick="openGameDetails('${game.id}')">
                <img src="${game.image}" alt="${game.title}">
                <div class="game-info">
                    <h2>${game.title}</h2>
                    <p>${game.description}</p>
                    <button onclick="event.stopPropagation();addToLibrary('${game.id}')">
                        Додати у бібліотеку
                    </button>
                </div>
            </div>
        `).join('');
    }

    static renderGameCard(game) {
        return `
            <div class="game-card" onclick="openGameDetails('${game.id}')">
                <img src="${game.image}" alt="${game.title}">
                <div class="game-info">
                    <h2>${game.title}</h2>
                    <p>${game.description}</p>
                    <div class="game-buttons">
                        <button onclick="event.stopPropagation();addToLibrary('${game.id}')">
                            Додати у бібліотеку
                        </button>
                        ${RipSteam.showDownloadButton(game.id)}
                    </div>
                </div>
            </div>
        `;
    }

    static getAllGames() {
        return {
            ...GAME_DATA,
            ...RipSteam.getRipGames()
        };
    }

    static searchGames(query) {
        const gamesContainer = document.getElementById('storeGames');
        if (!gamesContainer) return;

        query = query.toLowerCase().trim();
        const games = Object.values(this.getAllGames());

        const filteredGames = query 
            ? games.filter(game => 
                game.title.toLowerCase().includes(query) || 
                game.description.toLowerCase().includes(query)
            )
            : games;

        if (filteredGames.length === 0) {
            gamesContainer.innerHTML = `
                <div class="no-results">
                    <p>Нічого не знайдено за запитом "${query}"</p>
                </div>`;
            return;
        }

        gamesContainer.innerHTML = filteredGames.map(game => this.renderGameCard(game)).join('');
    }
}

// Initialize games when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Games.renderStoreGames();
    Library.init();
});

function openGameDetails(gameId) {
    const game = GAME_DATA[gameId];
    if (!game) return;
    
    const modalContent = document.getElementById('gameDetails');
    if (modalContent) {
        modalContent.innerHTML = `
            <img src="${game.image}" alt="${game.title}" style="width:100%;margin-bottom:20px;">
            <h2>${game.title}</h2>
            <p>${game.description}</p>
            <button onclick="addToLibrary('${game.id}')" class="modal-action-btn">
                Додати у бібліотеку
            </button>
        `;
        Modal.open('gameModal');
    }
}

// Initialize library when switching to library section
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('a[href="#lib"]').addEventListener('click', () => {
        Library.updateLibraryUI();
    });
});

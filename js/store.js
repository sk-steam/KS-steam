const PROGRAMS = {
    'KS Isaac': {
        id: 'ks-isaac',
        title: 'KS Isaac',
        image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/250900/capsule_616x353.jpg?t=1731977365',
        description: 'Roguelike-гра про Айзека, що тікає від матері.',
        page: 'prg/ks-isaac.html'
    },
    'Kykishield Launcher': {
        id: 'kykishield-launcher',
        title: 'Kykishield Launcher',
        image: 'https://sdmntprpolandcentral.oaiusercontent.com/files/00000000-21ec-620a-a28b-37135ee5ef04/raw?se=2025-07-03T20%3A48%3A03Z&sp=r&sv=2024-08-04&sr=b&scid=71af0053-3ef7-5d37-9390-38d952822bc8&skoid=76024c37-11e2-4c92-aa07-7e519fbe2d0f&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-07-03T19%3A38%3A48Z&ske=2025-07-04T19%3A38%3A48Z&sks=b&skv=2024-08-04&sig=IW3qLtLFRTf6NDnYKlk%2B6yEoYKtCyOXh%2BnItnDBA8oA%3D',
        description: 'Kykishield Launcher — зручний, багатофункціональний, оновлюваний лаунчер для Minecraft.',
        page: 'prg/kykishield-launcher.html'
    },
    // Add other programs...
};

function renderStore() {
    const storeContainer = document.getElementById('storeGames');
    storeContainer.innerHTML = '';

    Object.values(PROGRAMS).forEach(program => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            <img src="${program.image}" alt="${program.title}">
            <div class="game-info">
                <h2>${program.title}</h2>
                <p>${program.description}</p>
                <button onclick="addToLibrary('${program.title}')">Додати у бібліотеку</button>
                <button onclick="location.href='${program.page}'" class="details-btn">Детальніше</button>
            </div>
        `;
        storeContainer.appendChild(card);
    });
}

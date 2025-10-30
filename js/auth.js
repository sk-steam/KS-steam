class Auth {
    static getLogFolder() {
        let log = localStorage.getItem('log');
        if (!log) {
            localStorage.setItem('log', JSON.stringify({users: []}));
            log = localStorage.getItem('log');
        }
        return JSON.parse(log);
    }

    static setLogFolder(data) {
        localStorage.setItem('log', JSON.stringify(data));
    }

    static login(username, password) {
        const log = this.getLogFolder();
        const user = log.users.find(u => u.username === username && u.password === password);
        if (user) {
            localStorage.setItem('currentUser', username);
            Profile.updateProfile(); // Update profile after login
            UI.updateUserState();
            return true;
        }
        return false;
    }

    static register(username, email, password) {
        const log = this.getLogFolder();
        if (log.users.some(u => u.username === username)) {
            return { success: false, error: 'Користувач вже існує' };
        }
        if (log.users.some(u => u.email === email)) {
            return { success: false, error: 'Email вже використовується' };
        }
        log.users.push({ username, email, password });
        this.setLogFolder(log);
        return { success: true };
    }

    static logout() {
        localStorage.removeItem('currentUser');
        UI.updateUserState();
        Profile.updateProfile(); // Update profile after logout
        window.location.hash = 'store'; // Return to store after logout
    }
}

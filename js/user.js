class UserManager {
    static getLogFolder() {
        let log = localStorage.getItem('log');
        if (!log) {
            log = { users: [] };
            localStorage.setItem('log', JSON.stringify(log));
        }
        return JSON.parse(log);
    }

    static setLogFolder(data) {
        localStorage.setItem('log', JSON.stringify(data));
    }

    static getCurrentUser() {
        return localStorage.getItem('currentUser');
    }

    static updateUserProfile(username, data) {
        const log = this.getLogFolder();
        const user = log.users.find(u => u.username === username);
        if (!user) return false;

        Object.assign(user, data);
        this.setLogFolder(log);
        return true;
    }

    static logout() {
        localStorage.removeItem('currentUser');
        window.dispatchEvent(new Event('userStateChanged'));
    }
}

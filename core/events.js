const EventEmitter = require('events');

class SystemEvents extends EventEmitter {
    constructor() {
        super();
        this.events = {
            USER_LOGIN: 'user:login',
            USER_LOGOUT: 'user:logout',
            ERROR: 'system:error',
            CACHE_CLEAR: 'cache:clear'
        };
    }

    emitError(error) {
        this.emit(this.events.ERROR, error);
    }

    onError(callback) {
        this.on(this.events.ERROR, callback);
    }
}

module.exports = new SystemEvents();

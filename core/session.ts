import { randomBytes } from 'crypto';

export class SessionManager {
    private sessions: Map<string, any> = new Map();

    createSession(data: any): string {
        const sessionId = randomBytes(32).toString('hex');
        this.sessions.set(sessionId, {
            data,
            createdAt: new Date(),
            lastAccessed: new Date()
        });
        return sessionId;
    }

    getSession(sessionId: string): any {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.lastAccessed = new Date();
            return session.data;
        }
        return null;
    }

    removeSession(sessionId: string): void {
        this.sessions.delete(sessionId);
    }
}

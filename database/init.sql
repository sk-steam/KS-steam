-- ==============================
-- KS Steam DATABASE INITIAL SETUP
-- ==============================

PRAGMA foreign_keys = ON;

-- ------------------------------
-- USERS
-- ------------------------------
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    email TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    last_login TEXT
);

-- ------------------------------
-- SETTINGS (GLOBAL SYSTEM SETTINGS)
-- ------------------------------
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
);

INSERT OR IGNORE INTO settings (key, value) VALUES
('language', 'en'),
('theme', 'dark'),
('auto_update', '1'),
('analytics_enabled', '1');

-- ------------------------------
-- GAMES (INSTALLED / AVAILABLE)
-- ------------------------------
CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_uid TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    version TEXT,
    install_path TEXT,
    cover_path TEXT,
    added_at TEXT DEFAULT CURRENT_TIMESTAMP,
    last_played TEXT
);

-- ------------------------------
-- PLAY HISTORY
-- ------------------------------
CREATE TABLE IF NOT EXISTS play_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    game_id INTEGER NOT NULL,
    started_at TEXT DEFAULT CURRENT_TIMESTAMP,
    ended_at TEXT,
    duration_seconds INTEGER DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- ------------------------------
-- DLC / ADDONS
-- ------------------------------
CREATE TABLE IF NOT EXISTS game_addons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    addon_uid TEXT NOT NULL,
    title TEXT,
    version TEXT,
    installed INTEGER DEFAULT 0,
    FOREIGN KEY(game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- ------------------------------
-- FRIENDS LIST
-- ------------------------------
CREATE TABLE IF NOT EXISTS friends (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    friend_name TEXT NOT NULL,
    added_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------
-- DOWNLOAD TASKS
-- ------------------------------
CREATE TABLE IF NOT EXISTS downloads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_uid TEXT NOT NULL,
    status TEXT DEFAULT 'pending',  -- pending / downloading / completed / failed
    progress INTEGER DEFAULT 0,
    speed_kbps INTEGER DEFAULT 0,
    last_update TEXT DEFAULT CURRENT_TIMESTAMP
);

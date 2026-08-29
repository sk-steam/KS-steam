# KS Steam API v4.1

Companion backend for KS Steam Web v4 and the future KS Steam Client.

## Includes
- JWT accounts: register/login/me
- Release catalog API
- Release versions + external sources (GitHub, GitLab, Google Drive, direct URLs)
- Screenshot uploads
- User reviews and ratings
- Client synchronization endpoint
- SQLite persistence

## Run
```bash
cd backend
npm install
copy .env.example .env
npm run dev
```
On macOS/Linux replace `copy` with `cp`.

The frontend defaults to `http://localhost:8787/api`. Change it in localStorage key `kssteam-api` for production.
